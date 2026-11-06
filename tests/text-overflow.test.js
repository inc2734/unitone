import { hasBlockSupport } from '@wordpress/blocks';

import {
	resetTextOverflow,
	TextOverflowEdit,
} from '../src/js/editor/hooks/typography/text-overflow';
import { withTypographyBlockProps } from '../src/js/editor/hooks/typography/typography';

jest.mock( '@wordpress/blocks', () => ( { hasBlockSupport: jest.fn() } ), {
	virtual: true,
} );
jest.mock( '@wordpress/block-editor', () => ( {} ), { virtual: true } );
jest.mock( '@wordpress/editor', () => ( {} ), { virtual: true } );
jest.mock( '@wordpress/edit-post', () => ( {} ), { virtual: true } );
jest.mock( '@wordpress/components', () => ( {
	ToggleControl: 'input',
	SelectControl: 'select',
	SVG: 'svg',
	Path: 'path',
	Line: 'line',
} ) );
jest.mock( '@wordpress/icons', () => ( {} ) );

beforeEach( () => {
	hasBlockSupport.mockReset();
	hasBlockSupport.mockImplementation( ( name, support ) => {
		return (
			name !== 'core/image' &&
			[ 'unitone.textWrap', 'unitone.textOverflow' ].includes( support )
		);
	} );
} );

it.each( [ 'core/paragraph', 'core/heading', 'core/list-item' ] )(
	'applies truncation while selected and allows toggling it off to edit %s',
	( name ) => {
		const settings = {
			name,
			isSelected: true,
			attributes: {
				content: 'Original text',
				unitone: { textWrap: 'balance', halfLeading: 0.5 },
			},
			wrapperProps: { 'data-unitone-layout': '-auto-phrase' },
		};
		const setAttributes = jest.fn( ( attributes ) => {
			settings.attributes = { ...settings.attributes, ...attributes };
		} );
		const getLayout = () =>
			withTypographyBlockProps( settings ).wrapperProps[
				'data-unitone-layout'
			];
		const truncatedLayout =
			'-auto-phrase -text-overflow:ellipsis -text-wrap:balance';

		expect( getLayout() ).toBe( '-auto-phrase -text-wrap:balance' );
		TextOverflowEdit( { ...settings, setAttributes } ).props.onChange(
			true
		);
		expect( getLayout() ).toBe( truncatedLayout );
		const savedAttributes = settings.attributes;
		for ( const isSelected of [ false, true, false ] ) {
			settings.isSelected = isSelected;
			expect( getLayout() ).toBe( truncatedLayout );
		}
		expect( settings.attributes.unitone.textWrap ).toBe( 'balance' );
		expect( settings.attributes.unitone.textOverflow ).toBe( 'ellipsis' );
		expect( settings.attributes ).toBe( savedAttributes );
		expect( setAttributes ).toHaveBeenCalledTimes( 1 );

		settings.isSelected = true;
		TextOverflowEdit( { ...settings, setAttributes } ).props.onChange(
			false
		);
		expect( getLayout() ).toBe( '-auto-phrase -text-wrap:balance' );
		expect( settings.attributes.unitone ).toEqual( {
			textWrap: 'balance',
			halfLeading: 0.5,
		} );
		setAttributes( { content: 'Edited text' } );
		TextOverflowEdit( { ...settings, setAttributes } ).props.onChange(
			true
		);
		expect( getLayout() ).toBe( truncatedLayout );
		expect( settings.attributes.content ).toBe( 'Edited text' );
	}
);

it( 'ignores a saved truncation value on unsupported blocks', () => {
	const settings = {
		name: 'core/image',
		attributes: { unitone: { textOverflow: 'ellipsis' } },
	};
	expect( withTypographyBlockProps( settings ) ).toBe( settings );
} );

it( 'resets truncation without dropping wrapping or unrelated attributes', () => {
	const setAttributes = jest.fn();
	resetTextOverflow( {
		attributes: {
			unitone: { textOverflow: 'ellipsis', textWrap: 'pretty', gap: '2' },
		},
		setAttributes,
	} );
	expect( setAttributes ).toHaveBeenCalledWith( {
		unitone: { textWrap: 'pretty', gap: '2' },
	} );
} );
