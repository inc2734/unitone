import initNavigationPointer from '../src/js/app/navigation-pointer';

beforeAll( () => initNavigationPointer() );
afterEach( () => {
	document.body.innerHTML = '';
} );

const renderToggle = ( {
	style = 'is-style-unitone-accordion',
	open = true,
} = {} ) => {
	document.body.innerHTML = `
		<nav class="wp-block-navigation ${ style }">
			<div class="wp-block-navigation__responsive-container ${
				open ? 'is-menu-open' : ''
			}">
				<button class="wp-block-navigation-submenu__toggle" data-wp-on--click="actions.toggleMenuOnClick"><svg><path /></svg></button>
			</div>
		</nav>`;
	return document.querySelector( 'button' );
};

const press = ( target, button = 0 ) => {
	const mouse = new window.MouseEvent( 'mousedown', {
		bubbles: true,
		cancelable: true,
		button,
	} );
	target.dispatchEvent( mouse );
	return mouse.defaultPrevented;
};

describe( 'submenu focus inside an open accordion overlay', () => {
	it( 'defers focus until core handles the click', () => {
		const toggle = renderToggle();
		const coreClick = jest.fn();
		toggle.addEventListener( 'click', coreClick );
		expect( press( toggle.querySelector( 'path' ) ) ).toBe( true );
		toggle.click();
		expect( coreClick ).toHaveBeenCalledTimes( 1 );
	} );

	it( 'also handles a touch-generated compatibility mousedown', () => {
		// Touch browsers dispatch mousedown after pointerup, without another pointerdown.
		const toggle = renderToggle();
		const pointerDown = new window.Event( 'pointerdown', {
			bubbles: true,
		} );
		Object.defineProperty( pointerDown, 'pointerType', { value: 'touch' } );
		toggle.dispatchEvent( pointerDown );
		toggle.dispatchEvent(
			new window.Event( 'pointerup', { bubbles: true } )
		);
		expect( press( toggle ) ).toBe( true );
	} );

	it( 'leaves secondary mouse buttons unchanged', () => {
		expect( press( renderToggle(), 1 ) ).toBe( false );
	} );

	it.each( [ { open: false }, { style: 'is-style-default' } ] )(
		'leaves other navigation contexts unchanged: %j',
		( options ) => {
			expect( press( renderToggle( options ) ) ).toBe( false );
		}
	);

	it( 'uses the nearest navigation style', () => {
		const toggle = renderToggle();
		const nested = document.createElement( 'div' );
		nested.className = 'wp-block-navigation is-style-default';
		toggle.before( nested );
		nested.append( toggle );
		expect( press( toggle ) ).toBe( false );
	} );
} );
