import { renderToStaticMarkup } from 'react-dom/server';
import { getBlockSupport } from '@wordpress/blocks';
import { Icon } from '@wordpress/components';

import { GapControl, PaddingControl } from '../src/js/editor/hooks/components';
import {
	allSides,
	verticalSides,
	horizontalSides,
	topSides,
	bottomSides,
} from '../src/js/editor/hooks/icons';
import {
	getSpacingUIDirection,
	withSpacingUIDirection,
} from '../src/js/editor/hooks/dimensions/spacing-ui-direction';

jest.mock( '@wordpress/blocks', () => ( { getBlockSupport: jest.fn() } ), {
	virtual: true,
} );
jest.mock( '@wordpress/block-editor', () => ( { useSettings: () => [ [] ] } ), {
	virtual: true,
} );
jest.mock( '@wordpress/compose', () => ( {
	createHigherOrderComponent: ( factory ) => factory,
} ) );
jest.mock( '@wordpress/icons', () => ( {} ) );
jest.mock( '@wordpress/components', () => {
	const Container = ( { children } ) => <div>{ children }</div>;
	return {
		SVG: 'svg',
		Path: 'path',
		Line: 'line',
		BaseControl: Object.assign( Container, { VisualLabel: Container } ),
		Button: Container,
		Flex: Container,
		FlexBlock: Container,
		FlexItem: Container,
		Tooltip: Container,
		Icon: ( { icon } ) => icon,
		SelectControl: ( { value, options } ) => (
			<select value={ value } onChange={ () => {} }>
				{ options.map( ( option, index ) => (
					<option key={ index } value={ option.value }>
						{ option.label }
					</option>
				) ) }
			</select>
		),
	};
} );
jest.mock( '../src/js/editor/hooks/utils', () => ( {
	normalizeForSelectControl: ( value ) => value ?? '',
	useDeviceType: () => 'desktop',
} ) );

beforeEach( () => getBlockSupport.mockReset() );

describe( 'spacing direction without split controls', () => {
	it.each( [ GapControl, PaddingControl ] )(
		'displays an all-sides icon by default (%p)',
		( Control ) => {
			const markup = renderToStaticMarkup( <Control value="1" /> );
			expect( markup ).toContain(
				renderToStaticMarkup( <Icon icon={ allSides } size={ 16 } /> )
			);
		}
	);

	it.each( [
		[ PaddingControl, 'vertical', verticalSides ],
		[ GapControl, 'horizontal', horizontalSides ],
	] )(
		'uses the supplied direction (%p, %s)',
		( Control, direction, icon ) => {
			const markup = renderToStaticMarkup(
				<Control value="1" uiDirection={ direction } />
			);
			expect( markup ).toContain(
				renderToStaticMarkup( <Icon icon={ icon } size={ 16 } /> )
			);
		}
	);

	it( 'keeps individual padding sides when values are mixed', () => {
		const markup = renderToStaticMarkup(
			<PaddingControl
				split
				isMixed
				uiDirection="all"
				sideControls={ [
					{ key: 'top', value: '1' },
					{ key: 'bottom', value: '2' },
				] }
			/>
		);
		for ( const icon of [ topSides, bottomSides ] ) {
			expect( markup ).toContain(
				renderToStaticMarkup( <Icon icon={ icon } size={ 16 } /> )
			);
		}
	} );
} );

it( 'prioritizes transient direction over metadata and defaults to all', () => {
	expect(
		getSpacingUIDirection( 'unitone/gutters', undefined, 'padding' )
	).toBe( 'all' );
	getBlockSupport.mockReturnValue( 'vertical' );
	expect(
		getSpacingUIDirection( 'unitone/gutters', undefined, 'padding' )
	).toBe( 'vertical' );
	expect(
		getSpacingUIDirection(
			'unitone/gutters',
			{ padding: { uiDirection: 'horizontal' } },
			'padding'
		)
	).toBe( 'horizontal' );
} );

it( 'updates transient directions while preserving attributes and labels', () => {
	const attributes = {
		column: false,
		unitone: { gap: '2' },
		__unstableUnitoneSupports: { gap: { label: 'Custom gap' } },
	};
	const original = JSON.stringify( attributes );
	const received = [];
	const Control = withSpacingUIDirection(
		'unitone/text',
		( { attributes: current } ) => ( {
			gap: current.column ? 'all' : 'vertical',
		} )
	)( ( props ) => {
		received.push( props.attributes );
		return null;
	} );
	for ( const column of [ false, true, false ] ) {
		renderToStaticMarkup(
			<Control
				name="unitone/text"
				isSelected
				attributes={ { ...attributes, column } }
			/>
		);
	}
	expect(
		received.map(
			( current ) => current.__unstableUnitoneSupports.gap.uiDirection
		)
	).toEqual( [ 'vertical', 'all', 'vertical' ] );
	for ( const current of received ) {
		expect( current.unitone ).toBe( attributes.unitone );
		expect( current.__unstableUnitoneSupports.gap.label ).toBe(
			'Custom gap'
		);
	}
	expect( JSON.stringify( attributes ) ).toBe( original );
} );
