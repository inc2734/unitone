import { act, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';

import Edit from '../src/blocks/swiper-autoplay-control/edit';
import save from '../src/blocks/swiper-autoplay-control/save';
import metadata from '../src/blocks/swiper-autoplay-control/block.json';

jest.mock( '../src/js/editor/hooks/utils', () => ( {
	useToolsPanelDropdownMenuProps: () => ( {} ),
} ) );

jest.mock( '@wordpress/element', () => require( 'react' ), { virtual: true } );

jest.mock(
	'@wordpress/block-editor',
	() => {
		const RichText = ( { value, onChange, placeholder } ) => (
			<span
				contentEditable
				suppressContentEditableWarning
				data-placeholder={ placeholder }
				onInput={ ( event ) =>
					onChange( event.currentTarget.innerHTML )
				}
				dangerouslySetInnerHTML={ { __html: value || '' } }
			/>
		);
		RichText.Content = ( { tagName: Tag, value, ...props } ) => (
			<Tag
				{ ...props }
				dangerouslySetInnerHTML={ { __html: value || '' } }
			/>
		);
		return {
			BlockControls: ( { children } ) => (
				<div data-test-toolbar>{ children }</div>
			),
			InspectorControls: ( { children } ) => (
				<div data-test-sidebar>{ children }</div>
			),
			RichText,
			useBlockProps: Object.assign( ( props ) => props, {
				save: ( props ) => props,
			} ),
		};
	},
	{ virtual: true }
);

jest.mock( '@wordpress/components', () => {
	const { createContext, useContext } = require( 'react' );
	const ToggleContext = createContext();
	const Container = ( { children } ) => <div>{ children }</div>;
	const ToggleOption = ( { value, label } ) => {
		const context = useContext( ToggleContext );
		return (
			<input
				aria-label={ label }
				type="radio"
				value={ value }
				checked={ context.value === value }
				onChange={ () => context.onChange( value ) }
			/>
		);
	};
	return {
		SelectControl: ( { label, value, options, onChange } ) => (
			<select
				aria-label={ label }
				value={ value }
				onChange={ ( event ) => onChange( event.target.value ) }
			>
				{ options.map( ( option ) => (
					<option key={ option.value } value={ option.value }>
						{ option.label }
					</option>
				) ) }
			</select>
		),
		ToolbarButton: ( { children, isPressed, onClick } ) => (
			<button aria-pressed={ isPressed } onClick={ onClick }>
				{ children }
			</button>
		),
		ToolbarGroup: Container,
		__experimentalToolsPanel: Container,
		__experimentalToolsPanelItem: Container,
		__experimentalToggleGroupControl: ( { children, value, onChange } ) => (
			<ToggleContext.Provider value={ { value, onChange } }>
				{ children }
			</ToggleContext.Provider>
		),
		__experimentalToggleGroupControlOption: ToggleOption,
	};
} );

describe( 'autoplay control serialization', () => {
	it.each( [ 'play', 'pause' ] )(
		'preserves existing %s button markup',
		( action ) => {
			const content =
				'<span aria-hidden="true" class="unitone-inline-icon">Icon</span> Custom label';
			expect(
				renderToStaticMarkup(
					save( { attributes: { action, content } } )
				)
			).toBe(
				`<button class="unitone-swiper-autoplay-control unitone-swiper-autoplay-control--${ action }" type="button" data-unitone-swiper-autoplay-action="${ action }"><span>${ content }</span></button>`
			);
		}
	);

	it( 'saves independent toggle contents with unambiguous selectors', () => {
		const attributes = {
			action: 'toggle',
			playContent:
				'<span aria-hidden="true" class="unitone-inline-icon">▶</span> Begin',
			pauseContent: '<strong>Hold</strong>',
		};
		const container = document.createElement( 'div' );
		container.innerHTML = renderToStaticMarkup( save( { attributes } ) );
		[ 'playContent', 'pauseContent' ].forEach( ( name ) => {
			expect(
				container.querySelector( metadata.attributes[ name ].selector )
					.innerHTML
			).toBe( attributes[ name ] );
		} );
		expect( container.querySelectorAll( 'button' ) ).toHaveLength( 1 );
		expect(
			container.querySelector( 'button' ).dataset
				.unitoneSwiperAutoplayState
		).toBeUndefined();
	} );

	it( 'provides text when toggle contents are unset', () => {
		const markup = renderToStaticMarkup(
			save( { attributes: { action: 'toggle' } } )
		);
		expect( markup ).toContain( '__play">Play</span>' );
		expect( markup ).toContain( '__pause">Stop</span>' );
	} );
} );

describe( 'autoplay control editor', () => {
	let container;
	let root;
	let onChange;
	const renderEditor = ( initialAttributes ) => {
		onChange = jest.fn();
		const Editor = () => {
			const [ attributes, setAttributes ] = useState( initialAttributes );
			return (
				<Edit
					attributes={ attributes }
					setAttributes={ ( changes ) => {
						onChange( changes );
						setAttributes( ( previous ) => ( {
							...previous,
							...changes,
						} ) );
					} }
				/>
			);
		};
		act( () => root.render( <Editor /> ) );
	};
	const canvas = () =>
		container.querySelector( '.unitone-swiper-autoplay-control' );
	const toolbar = () =>
		container.querySelectorAll( '[data-test-toolbar] button' );
	const sidebar = ( value ) =>
		container.querySelector(
			`[data-test-sidebar] input[value="${ value }"]`
		);
	const editContent = ( content ) =>
		act( () => {
			const span = canvas().querySelector( 'span' );
			span.innerHTML = content;
			span.dispatchEvent(
				new window.Event( 'input', { bubbles: true } )
			);
		} );

	beforeEach( () => {
		globalThis.IS_REACT_ACT_ENVIRONMENT = true;
		container = document.createElement( 'div' );
		document.body.appendChild( container );
		root = createRoot( container );
	} );
	afterEach( () => {
		act( () => root.unmount() );
		container.remove();
		delete globalThis.IS_REACT_ACT_ENVIRONMENT;
	} );

	it( 'synchronizes toolbar and sidebar previews without saving the selection', () => {
		renderEditor( {
			action: 'toggle',
			playContent: 'Begin',
			pauseContent: 'Hold',
		} );
		expect( canvas().textContent ).toBe( 'Begin' );
		expect( toolbar()[ 0 ].getAttribute( 'aria-pressed' ) ).toBe( 'true' );
		expect( sidebar( 'play' ).checked ).toBe( true );
		act( () => toolbar()[ 1 ].click() );
		expect( canvas().textContent ).toBe( 'Hold' );
		expect( sidebar( 'pause' ).checked ).toBe( true );
		act( () => sidebar( 'play' ).click() );
		expect( canvas().textContent ).toBe( 'Begin' );
		expect( toolbar()[ 0 ].getAttribute( 'aria-pressed' ) ).toBe( 'true' );
		expect( onChange ).not.toHaveBeenCalled();
	} );

	it( 'edits the two contents independently and retains both when switching', () => {
		renderEditor( {
			action: 'toggle',
			playContent: 'Begin',
			pauseContent: 'Hold',
		} );
		editContent( '<em>Go</em>' );
		expect( onChange ).toHaveBeenLastCalledWith( {
			playContent: '<em>Go</em>',
		} );
		act( () => toolbar()[ 1 ].click() );
		editContent( '<strong>Wait</strong>' );
		expect( onChange ).toHaveBeenLastCalledWith( {
			pauseContent: '<strong>Wait</strong>',
		} );
		act( () => toolbar()[ 0 ].click() );
		expect( canvas().innerHTML ).toContain( '<em>Go</em>' );
		act( () => sidebar( 'pause' ).click() );
		expect( canvas().innerHTML ).toContain( '<strong>Wait</strong>' );
	} );

	it.each( [ 'play', 'pause' ] )(
		'keeps fixed %s buttons editable without preview controls',
		( action ) => {
			renderEditor( { action, content: 'Custom label' } );
			expect( toolbar() ).toHaveLength( 0 );
			expect( sidebar( 'play' ) ).toBeNull();
			editContent( 'Changed label' );
			expect( onChange ).toHaveBeenLastCalledWith( {
				content: 'Changed label',
			} );
		}
	);
} );
