export default function initScrollAnimationFeatures() {
	const parallaxTargets = Array.from(
		document.querySelectorAll( '[data-unitone-parallax]' )
	);

	if ( parallaxTargets.length ) {
		const activeParallaxTargets = new Set();
		const mediaQuery = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		);
		const originalStyles = new WeakMap(
			parallaxTargets.map( ( target ) => [
				target,
				{
					transform: target.style.transform,
					image:
						target.children.length === 1
							? target.children[ 0 ]
							: null,
					objectPosition:
						target.children[ 0 ]?.style.objectPosition || '',
				},
			] )
		);

		const isCoverElement = ( target ) =>
			'cover' ===
			window.getComputedStyle( target ).getPropertyValue( 'object-fit' );

		const updatePosition = ( target ) => {
			const viewPortHeight = Math.max(
				document.documentElement.clientHeight,
				window.innerHeight || 0
			);

			const speed = parseInt(
				target.getAttribute( 'data-unitone-parallax-speed' ) || 0,
				10
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
				return;
			}

			target.style.transform = `translate3d(0, ${ translateY }px, 0)`;
		};

		let scrollRafId = 0;
		let isListening = false;

		const runParallax = () => {
			scrollRafId = 0;
			if ( mediaQuery.matches ) {
				return;
			}

			activeParallaxTargets.forEach( ( target ) => {
				updatePosition( target );
			} );
		};

		const onScroll = () => {
			if ( scrollRafId ) {
				return;
			}

			scrollRafId = window.requestAnimationFrame( runParallax );
		};

		const startListeners = () => {
			if ( isListening ) {
				return;
			}

			isListening = true;
			window.addEventListener( 'scroll', onScroll, { passive: true } );
			window.addEventListener( 'resize', onScroll, { passive: true } );
			document.addEventListener( 'touchmove', onScroll, {
				passive: true,
			} );
		};

		const stopListeners = () => {
			if ( ! isListening ) {
				return;
			}

			isListening = false;
			window.removeEventListener( 'scroll', onScroll );
			window.removeEventListener( 'resize', onScroll );
			document.removeEventListener( 'touchmove', onScroll );
		};

		const updateParallaxState = () => {
			if ( mediaQuery.matches ) {
				stopListeners();
				window.cancelAnimationFrame( scrollRafId );
				scrollRafId = 0;
				parallaxTargets.forEach( ( target ) => {
					const original = originalStyles.get( target );
					// Restore authored positions instead of leaving the last parallax offset.
					target.style.transform = original.transform;
					if ( original.image ) {
						original.image.style.objectPosition =
							original.objectPosition;
					}
					target.setAttribute( 'data-unitone-parallax', 'enable' );
				} );
				return;
			}

			parallaxTargets.forEach( ( target ) =>
				target.setAttribute(
					'data-unitone-parallax',
					activeParallaxTargets.has( target ) ? 'enable' : 'disable'
				)
			);
			if ( activeParallaxTargets.size ) {
				startListeners();
				onScroll();
			} else {
				stopListeners();
			}
		};

		const observer = new IntersectionObserver(
			( entries ) => {
				entries.forEach( ( entry ) => {
					const target = entry.target;

					if ( entry.isIntersecting ) {
						activeParallaxTargets.add( target );
						return;
					}

					activeParallaxTargets.delete( target );
				} );
				updateParallaxState();
			},
			{
				rootMargin: '200px 0px',
			}
		);

		parallaxTargets.forEach( ( target ) => {
			observer.observe( target );
		} );
		updateParallaxState();
		if ( mediaQuery.addEventListener ) {
			mediaQuery.addEventListener( 'change', updateParallaxState );
		} else {
			mediaQuery.addListener( updateParallaxState );
		}
	}

	document
		.querySelectorAll( '[data-unitone-scroll-animation]' )
		.forEach( ( target ) => {
			const rootMargin = target.getAttribute(
				'data-unitone-scroll-animation-root-margin'
			);
			const threshold = target.getAttribute(
				'data-unitone-scroll-animation-threshold'
			);

			const observer = new IntersectionObserver(
				( entries ) => {
					entries.forEach( ( entry ) => {
						if ( ! entry.isIntersecting ) {
							return;
						}

						const currentTarget = entry.target;
						const type = currentTarget.getAttribute(
							'data-unitone-scroll-animation'
						);

						currentTarget.setAttribute(
							'data-unitone-scroll-animation',
							`${ type } -fired`
						);

						observer.unobserve( currentTarget );
					} );
				},
				{
					rootMargin: rootMargin || '0px',
					threshold: threshold
						? threshold
								.split( ',' )
								.map( ( value ) => parseFloat( value.trim() ) )
						: [ 0.25 ],
				}
			);

			observer.observe( target );
		} );
}
