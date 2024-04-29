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

/**
 * For vertical navigation
 */
document.addEventListener( 'DOMContentLoaded', () => {
	const setSubmenusPosition = ( submenus ) => {
		[].slice.call( submenus ).forEach( ( submenu ) => {
			const rect = submenu.parentElement.getBoundingClientRect();
			submenu.style.setProperty( '--unitone--top', `${ rect.y }px` );
			submenu.style.setProperty(
				'--unitone--left',
				`${ rect.x + rect.width }px`
			);
		} );
	};

	const navigations = document.querySelectorAll(
		'.wp-block-navigation.is-style-unitone.is-vertical'
	);
	[].slice.call( navigations ).forEach( ( navigation ) => {
		const submenus = navigation.querySelectorAll(
			[
				'.wp-block-navigation__container > .wp-block-page-list > .wp-block-pages-list__item > .wp-block-navigation__submenu-container',
				'.wp-block-navigation__container > .wp-block-navigation-item > .wp-block-navigation__submenu-container',
			].join( ',' )
		);

		navigation.addEventListener( 'wheel', () => {
			setSubmenusPosition( submenus );
		} );

		const resizeObserver = new window.ResizeObserver( () => {
			setSubmenusPosition( submenus );
		} );
		resizeObserver.observe( document.body );
	} );
} );
