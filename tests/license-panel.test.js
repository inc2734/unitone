import { act } from 'react';
import { createRoot } from 'react-dom/client';
import apiFetch from '@wordpress/api-fetch';

import License from '../App/Controller/Manager/src/js/panels/license';

jest.mock( '@wordpress/api-fetch', () => jest.fn(), { virtual: true } );
jest.mock( '@wordpress/element', () => jest.requireActual( 'react' ), {
	virtual: true,
} );
jest.mock(
	'@wordpress/url',
	() => ( {
		addQueryArgs: ( path, args ) =>
			`${ path }?${ new URLSearchParams( args ) }`,
	} ),
	{ virtual: true }
);
jest.mock( '@wordpress/icons', () => ( {
	Icon: ( { icon } ) => <span data-license-icon={ icon } />,
	check: 'valid',
	close: 'invalid',
} ) );
jest.mock( '@wordpress/components', () => ( {
	Notice: ( { children } ) => <div role="alert">{ children }</div>,
	Button: ( { children, onClick, disabled } ) => (
		<button onClick={ onClick } disabled={ disabled }>
			{ children }
		</button>
	),
	Spinner: () => <span data-spinner="true" />,
	TextControl: ( { value, onChange } ) => (
		<input
			aria-label="License key"
			value={ value }
			onChange={ () => {} }
			onInput={ ( event ) => onChange( event.target.value ) }
		/>
	),
} ) );
jest.mock( '../App/Controller/Manager/src/js/utils/utils', () => ( {
	withMinDelay: ( promise ) => promise,
} ) );

describe( 'license verification and recovery', () => {
	let container;
	let root;
	let status;
	let statusError;
	let saveError;
	let cacheError;
	const button = ( label ) =>
		[ ...container.querySelectorAll( 'button' ) ].find( ( element ) =>
			element.textContent.includes( label )
		);
	const expectIdle = () => {
		expect( button( 'Save Settings' ).disabled ).toBe( false );
		expect( button( 'Reset All Settings' ).disabled ).toBe( false );
		expect( container.querySelector( '.unitone-loading-icon' ) ).toBeNull();
		expect( container.querySelector( '[data-spinner]' ) ).toBeNull();
	};
	const render = () => act( async () => root.render( <License /> ) );
	const click = ( label ) => act( async () => button( label ).click() );

	beforeEach( () => {
		globalThis.IS_REACT_ACT_ENVIRONMENT = true;
		container = document.createElement( 'div' );
		document.body.appendChild( container );
		root = createRoot( container );
		status = 'false';
		statusError = saveError = cacheError = null;
		apiFetch.mockReset();
		apiFetch.mockImplementation( ( { path, method } ) => {
			if ( path.startsWith( '/unitone/v1/license-status' ) ) {
				return statusError
					? Promise.reject( statusError )
					: Promise.resolve( status );
			}
			if ( 'POST' === method && saveError ) {
				return Promise.reject( saveError );
			}
			if ( 'DELETE' === method && cacheError ) {
				return Promise.reject( cacheError );
			}
			return Promise.resolve( { has_license_key: true } );
		} );
	} );
	afterEach( () => {
		act( () => root.unmount() );
		container.remove();
		delete globalThis.IS_REACT_ACT_ENVIRONMENT;
	} );

	it( 'distinguishes unavailable verification from an invalid license', async () => {
		statusError = { message: 'Verification unavailable' };
		await render();
		expect( container.querySelector( '[role="alert"]' ).textContent ).toBe(
			'Verification unavailable'
		);
		expect( container.querySelector( '[data-license-icon]' ) ).toBeNull();
		expectIdle();
	} );

	it( 'rejects an unexpected status instead of presenting an invalid license', async () => {
		status = '503';
		await render();
		expect( container.querySelector( '[role="alert"]' ) ).not.toBeNull();
		expect( container.querySelector( '[data-license-icon]' ) ).toBeNull();
		expectIdle();
	} );

	it( 'retries without editing the key and clears library caches after recovery', async () => {
		statusError = { message: 'Verification unavailable' };
		await render();
		statusError = null;
		status = 'true';
		await click( 'Save Settings' );
		expect( apiFetch ).toHaveBeenCalledWith( {
			path: '/unitone/v1/license-status?force=1',
		} );
		expect( apiFetch ).toHaveBeenCalledWith( {
			path: '/unitone/v1/remote-block-patterns',
			method: 'DELETE',
		} );
		expect( container.querySelector( '[role="alert"]' ) ).toBeNull();
		expect(
			container
				.querySelector( '[data-license-icon]' )
				.getAttribute( 'data-license-icon' )
		).toBe( 'valid' );
		expectIdle();
	} );

	it( 'preserves library caches when forced verification still fails', async () => {
		await render();
		apiFetch.mockClear();
		statusError = { message: 'Still unavailable' };
		await click( 'Save Settings' );
		expect(
			apiFetch.mock.calls.some( ( [ args ] ) => 'DELETE' === args.method )
		).toBe( false );
		expectIdle();
	} );

	it( 'ends the saving state and allows retry after a settings failure', async () => {
		await render();
		await act( async () => {
			const input = container.querySelector( 'input' );
			input.value = 'new-key';
			input.dispatchEvent( new Event( 'input', { bubbles: true } ) );
		} );
		saveError = { message: 'Could not save settings' };
		await click( 'Save Settings' );
		expect( container.querySelector( '[role="alert"]' ).textContent ).toBe(
			'Could not save settings'
		);
		expect( container.querySelector( 'input' ).value ).toBe( 'new-key' );
		expectIdle();
	} );

	it( 'ends both loading states if cache deletion fails during reset', async () => {
		await render();
		cacheError = { message: 'Could not clear caches' };
		await click( 'Reset All Settings' );
		expect( container.querySelector( '[role="alert"]' ).textContent ).toBe(
			'Could not clear caches'
		);
		expectIdle();
	} );
} );
