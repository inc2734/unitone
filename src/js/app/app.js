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

/**
 * Parallax.
 */
document.addEventListener( 'DOMContentLoaded', () => {
	const targets = document.querySelectorAll( '[data-unitone-parallax]' );

	const isCoverElement = ( target ) =>
		'cover' ===
		window.getComputedStyle( target ).getPropertyValue( 'object-fit' );

	const updatePosition = ( target ) => {
		const viewPortHeight = Math.max(
			document.documentElement.clientHeight,
			window.innerHeight || 0
		);

		const speed = parseInt(
			target.getAttribute( 'data-unitone-parallax-speed' ) || 0
		);

		const rect = target.getBoundingClientRect();
		const speedFactor = 0.125 * ( speed * 0.5 );
		const targetMidpoint = rect.top + rect.height / 2;
		const distanceFromCenter = targetMidpoint - viewPortHeight / 2;
		const translateY = distanceFromCenter * speedFactor;

		const isCoveredImageBlock =
			1 === target.children.length &&
			isCoverElement( target.children[ 0 ] );

		if ( isCoveredImageBlock ) {
			target.children[ 0 ].style.objectPosition = `50% calc(50% + ${ translateY }px)`;
		} else {
			target.style.transform = `translate3d(0, ${ translateY }px, 0)`;
		}
	};

	const enabled = ( target ) =>
		'enable' === target.getAttribute( 'data-unitone-parallax' );

	const onScroll = () => {
		[].slice.call( targets ).forEach( ( target ) => {
			if ( enabled( target ) ) {
				updatePosition( target );
			}
		} );
	};

	let onscreenTargets = 0;

	const observerCallback = ( entries ) => {
		entries.forEach( ( entry ) => {
			const target = entry.target;

			if ( entry.isIntersecting ) {
				onscreenTargets += 1;
				target.setAttribute( 'data-unitone-parallax', 'enable' );
			} else {
				if ( enabled( target ) ) {
					onscreenTargets -= 1;
				}
				target.setAttribute( 'data-unitone-parallax', 'disable' );
				target.style.transform = '';
			}
		} );

		if ( 0 < onscreenTargets ) {
			window.addEventListener( 'scroll', onScroll );
			document.addEventListener( 'touchmove', onScroll );
		} else {
			window.removeEventListener( 'scroll', onScroll );
			document.removeEventListener( 'touchmove', onScroll );
		}
	};

	const observer = new IntersectionObserver( observerCallback, {
		rootMargin: '200px 0px',
	} );

	[].slice.call( targets ).forEach( ( target ) => {
		observer.observe( target );
		updatePosition( target );

		// @todo Shifting by consecutive scrolling means shifting based on the shifted position,
		// so the first time it must be executed twice to start at the intended position.
		updatePosition( target );
	} );
} );

/**
 * Scroll animation.
 */
document.addEventListener( 'DOMContentLoaded', () => {
	const targets = document.querySelectorAll(
		'[data-unitone-scroll-animation]'
	);

	const observerCallback = ( entries ) => {
		entries.forEach( ( entry ) => {
			if ( ! entry.isIntersecting ) {
				return;
			}

			const target = entry.target;
			const type = target.getAttribute( 'data-unitone-scroll-animation' );

			target.setAttribute(
				'data-unitone-scroll-animation',
				`${ type } -fired`
			);

			observer.unobserve( target );
		} );
	};

	const observer = new IntersectionObserver( observerCallback, {
		rootMargin: '-25% 0px',
	} );

	[].slice.call( targets ).forEach( ( target ) => {
		observer.observe( target );
	} );
} );
