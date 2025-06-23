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
		Array.from( submenus ).forEach( ( submenu ) => {
			const rect = submenu.parentElement.getBoundingClientRect();
			submenu.style.setProperty( '--unitone--top', `${ rect.y }px` );
			submenu.style.setProperty(
				'--unitone--left',
				`${ rect.x + rect.width }px`
			);
		} );
	};

	const navigations = document.querySelectorAll(
		'.wp-block-navigation:is(.is-style-unitone, .is-style-unitone-accordion).is-vertical'
	);
	Array.from( navigations ).forEach( ( navigation ) => {
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
		Array.from( targets ).forEach( ( target ) => {
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

	Array.from( targets ).forEach( ( target ) => {
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

	Array.from( targets ).forEach( ( target ) => {
		const observerCallback = ( entries ) => {
			entries.forEach( ( entry ) => {
				if ( ! entry.isIntersecting ) {
					return;
				}

				const _target = entry.target;
				const type = _target.getAttribute(
					'data-unitone-scroll-animation'
				);

				_target.setAttribute(
					'data-unitone-scroll-animation',
					`${ type } -fired`
				);

				observer.unobserve( _target );
			} );
		};

		const rootMargin = target.getAttribute(
			'data-unitone-scroll-animation-root-margin'
		);
		const threshold = target.getAttribute(
			'data-unitone-scroll-animation-threshold'
		);

		const observer = new IntersectionObserver( observerCallback, {
			rootMargin: rootMargin || '0px',
			threshold: !! threshold
				? threshold.split( ',' ).map( ( v ) => parseFloat( v.trim() ) )
				: [ 0.25 ],
		} );

		observer.observe( target );
	} );
} );

/**
 * Block link with Query block.
 */
document.addEventListener( 'DOMContentLoaded', () => {
	const blockPosts = document.querySelectorAll(
		'.wp-block-query[class*="is-style-block-link"] .wp-block-post'
	);

	Array.from( blockPosts ).forEach( ( blockPost ) => {
		let down, up;
		const link = blockPost.querySelector(
			':scope .wp-block-post-title > a'
		);

		if ( !! link ) {
			blockPost.addEventListener( 'pointerdown', ( event ) => {
				event.stopPropagation();
				down = +new Date();
			} );

			blockPost.addEventListener( 'pointerup', ( event ) => {
				event.stopPropagation();

				if ( 0 !== event.button ) {
					return false;
				}

				if (
					[ 'A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA' ].includes(
						event.target?.tagName
					)
				) {
					return false;
				}

				up = +new Date();
				if ( up - down < 200 ) {
					const pressedKeys =
						event.shiftKey || event.ctrlKey || event.metaKey;
					if ( pressedKeys ) {
						const originalTarget = link.getAttribute( 'target' );
						const originalRel = link.getAttribute( 'rel' );
						link.setAttribute( 'target', '_blank' );
						link.setAttribute( 'rel', 'noopener noreferrer' );

						link.click();

						link.setAttribute( 'target', originalTarget || '' );
						link.setAttribute( 'rel', originalRel || '' );
					} else {
						link.click();
					}
				}
			} );
		}
	} );
} );

/**
 * Outer block link with Query block.
 */
document.addEventListener( 'DOMContentLoaded', () => {
	const blockPosts = document.querySelectorAll(
		'.wp-block-query[class*="is-style-block-link"][data-unitone-layout~="-has-outer-block-link"] .wp-block-post'
	);

	Array.from( blockPosts ).forEach( ( blockPost ) => {
		/**
		 * Replace `a` to `span`.
		 */
		const links = blockPost.querySelectorAll( 'a' );
		Array.from( links ).forEach( ( link ) => {
			const span = document.createElement( 'span' );

			for ( let i = 0; i < link.attributes.length; i++ ) {
				const attr = link.attributes[ i ];
				span.setAttribute( attr.name, attr.value );
			}

			while ( link.firstChild ) {
				span.appendChild( link.firstChild );
			}

			link.parentNode.replaceChild( span, link );
		} );

		/**
		 * Wrap it with a link to the article.
		 */
		const link = blockPost.querySelector(
			':scope .wp-block-post-title > span'
		);
		if ( !! link ) {
			const outerLink = document.createElement( 'a' );
			outerLink.setAttribute(
				'data-unitone-layout',
				'-outer-block-link'
			);

			Array.from( link.attributes ).forEach( ( attribute ) => {
				const { nodeName, nodeValue } = attribute;
				if ( [ 'href', 'target', 'rel' ].includes( nodeName ) ) {
					outerLink.setAttribute( nodeName, nodeValue ?? '' );
				}
			} );

			Array.from( blockPost.children ).forEach( ( element ) => {
				outerLink.appendChild( element );
			} );

			blockPost.insertBefore( outerLink, blockPost.children[ 0 ] );
		}
	} );
} );

/**
 * Page scroll checker.
 */
( () => {
	let previousScrollState = null;

	function updateScrollState() {
		const isScrolled = window.scrollY > 0;

		if ( isScrolled === previousScrollState ) {
			return;
		}

		previousScrollState = isScrolled;

		document.body.classList.remove(
			'unitone-page-scrolled:true',
			'unitone-page-scrolled:false'
		);
		document.body.classList.add(
			isScrolled
				? 'unitone-page-scrolled:true'
				: 'unitone-page-scrolled:false'
		);
	}

	updateScrollState();

	window.addEventListener(
		'scroll',
		() => {
			window.requestAnimationFrame( updateScrollState );
		},
		{ passive: true }
	);

	window.addEventListener( 'resize', () => {
		window.requestAnimationFrame( updateScrollState );
	} );
} )();
