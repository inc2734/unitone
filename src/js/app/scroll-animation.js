export default function initEffects() {
	const parallaxTargets = Array.from(
		document.querySelectorAll( '[data-unitone-parallax]' )
	);

	if ( parallaxTargets.length ) {
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

		const enabled = ( target ) =>
			'enable' === target.getAttribute( 'data-unitone-parallax' );

		let onscreenTargets = 0;
		let scrollRafId = 0;
		let isListening = false;

		const runParallax = () => {
			scrollRafId = 0;

			parallaxTargets.forEach( ( target ) => {
				if ( enabled( target ) ) {
					updatePosition( target );
				}
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
			document.removeEventListener( 'touchmove', onScroll );
		};

		const observer = new IntersectionObserver(
			( entries ) => {
				entries.forEach( ( entry ) => {
					const target = entry.target;

					if ( entry.isIntersecting ) {
						onscreenTargets += 1;
						target.setAttribute(
							'data-unitone-parallax',
							'enable'
						);
						return;
					}

					if ( enabled( target ) ) {
						onscreenTargets -= 1;
					}

					target.setAttribute( 'data-unitone-parallax', 'disable' );
					target.style.transform = '';
				} );

				if ( 0 < onscreenTargets ) {
					startListeners();
					onScroll();
					return;
				}

				stopListeners();
			},
			{
				rootMargin: '200px 0px',
			}
		);

		parallaxTargets.forEach( ( target ) => {
			observer.observe( target );
			updatePosition( target );
			updatePosition( target );
		} );
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
