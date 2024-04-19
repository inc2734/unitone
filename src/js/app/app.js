import {
	fluidFontSizeResizeObserver,
	dividersResizeObserver,
	stairsResizeObserver,
} from '@inc2734/unitone-css/library';

document.addEventListener( 'DOMContentLoaded', () => {
	const fluidFontSizeElements = document.querySelectorAll(
		'[data-unitone-layout~="-fluid-typography"]'
	);
	fluidFontSizeElements.forEach( ( target ) => {
		fluidFontSizeResizeObserver( target );
	} );

	const dividers = document.querySelectorAll(
		'[data-unitone-layout*="-divider:"]'
	);
	dividers.forEach( ( target ) => {
		dividersResizeObserver( target );
	} );

	const stairs = document.querySelectorAll(
		'[data-unitone-layout*="-stairs:"]'
	);
	stairs.forEach( ( target ) => {
		stairsResizeObserver( target );
	} );
} );

document.addEventListener( 'DOMContentLoaded', () => {
	const headerContainer = document.querySelector(
		'.site-container-left-header'
	);
	const header =
		!! headerContainer && headerContainer.querySelector( '.site-header' );
	if ( ! header ) {
		return;
	}

	const setItemsVars = ( items ) => {
		[].slice.call( items ).forEach( ( item ) => {
			const rect = item.getBoundingClientRect();
			const headerRect = header.getBoundingClientRect();
			item.style.setProperty(
				'--rect-top',
				`${ rect.top - headerRect.top }px`
			);
			item.style.setProperty( '--rect-right', `${ rect.right }px` );
			item.style.setProperty( '--rect-height', `${ rect.height }px` );
			item.style.setProperty( '--rect-width', `${ rect.width }px` );
		} );
	};

	const resetItemsVars = ( items ) => {
		[].slice.call( items ).forEach( ( item ) => {
			item.style.setProperty( '--rect-top', '' );
			item.style.setProperty( '--rect-right', '' );
			item.style.setProperty( '--rect-height', '' );
			item.style.setProperty( '--rect-width', '' );
		} );
	};

	const items = header.querySelectorAll(
		'.wp-block-navigation__container > .wp-block-page-list > .wp-block-pages-list__item, .wp-block-navigation__container > .wp-block-navigation-item'
	);

	header.addEventListener( 'wheel', () => {
		setItemsVars( items );
	} );

	const resizeObserver = new window.ResizeObserver( () => {
		if ( window.matchMedia( '(min-width: 600px)' ).matches ) {
			headerContainer.classList.add( '-submenu-static-position' );
			setItemsVars( items );
		} else {
			headerContainer.classList.remove( '-submenu-static-position' );
			resetItemsVars( items );
		}
	} );
	resizeObserver.observe( header );
} );
