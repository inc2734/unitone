export default function initLoopAnimation() {
	function getTokenList( target, attribute ) {
		return ( target.getAttribute( attribute ) || '' )
			.split( /\s+/ )
			.filter( Boolean );
	}

	function hasToken( target, attribute, token ) {
		return getTokenList( target, attribute ).includes( token );
	}

	function addToken( target, attribute, token ) {
		const tokens = getTokenList( target, attribute );
		if ( ! tokens.includes( token ) ) {
			tokens.push( token );
			target.setAttribute( attribute, tokens.join( ' ' ) );
		}
	}

	function removeToken( target, attribute, token ) {
		const tokens = getTokenList( target, attribute ).filter(
			( value ) => value !== token
		);
		target.setAttribute( attribute, tokens.join( ' ' ) );
	}

	function toMilliseconds( value, fallback = 0 ) {
		const normalizedValue = String( value || '' ).trim();
		const number = parseFloat( normalizedValue );
		const numericValue = Number.isNaN( number ) ? fallback : number;

		if ( normalizedValue.endsWith( 'ms' ) ) {
			return numericValue;
		}

		if ( normalizedValue.endsWith( 's' ) ) {
			return numericValue * 1000;
		}

		return numericValue * 1000;
	}

	const loopAnimationTargets = Array.from(
		document.querySelectorAll( '[data-unitone-loop-animation]' )
	);

	if ( ! loopAnimationTargets.length ) {
		return;
	}

	const states = new WeakMap();
	const visibleTargets = new Set();
	const mediaQuery = window.matchMedia( '(prefers-reduced-motion: reduce)' );

	const hasInterval = ( target ) =>
		hasToken( target, 'data-unitone-loop-animation', '-has-interval' );

	const stopLoopAnimation = ( target ) => {
		const state = states.get( target );

		if ( state?.timer ) {
			window.clearTimeout( state.timer );
		}

		if ( state?.onAnimationEnd ) {
			target.removeEventListener( 'animationend', state.onAnimationEnd );
		}

		states.delete( target );
		removeToken( target, 'data-unitone-loop-animation', '-active' );
	};

	const restartLoopAnimation = ( target ) => {
		removeToken( target, 'data-unitone-loop-animation', '-active' );
		// Force style recalculation so re-adding -active restarts CSS animation.
		target.getBoundingClientRect();
		addToken( target, 'data-unitone-loop-animation', '-active' );
	};

	const startLoopAnimation = ( target ) => {
		stopLoopAnimation( target );

		if ( mediaQuery.matches || ! visibleTargets.has( target ) ) {
			return;
		}

		const run = () => {
			if ( mediaQuery.matches || ! visibleTargets.has( target ) ) {
				stopLoopAnimation( target );
				return;
			}

			restartLoopAnimation( target );
		};

		const onAnimationEnd = ( event ) => {
			if ( event.target !== target ) {
				return;
			}

			const computedStyle = window.getComputedStyle( target );
			const animationName = computedStyle
				.getPropertyValue( '--unitone--loop-animation-name' )
				.trim();

			if ( animationName && event.animationName !== animationName ) {
				return;
			}

			const interval = toMilliseconds(
				computedStyle.getPropertyValue(
					'--unitone--loop-animation-interval'
				),
				0
			);

			removeToken( target, 'data-unitone-loop-animation', '-active' );

			const timer = window.setTimeout( () => {
				const state = states.get( target );

				if ( state ) {
					state.timer = 0;
				}

				run();
			}, interval );

			states.set( target, {
				...( states.get( target ) || {} ),
				timer,
				onAnimationEnd,
			} );
		};

		states.set( target, {
			timer: 0,
			onAnimationEnd,
		} );

		target.addEventListener( 'animationend', onAnimationEnd );

		run();
	};

	const activateTarget = ( target ) => {
		visibleTargets.add( target );

		if ( mediaQuery.matches ) {
			return;
		}

		addToken( target, 'data-unitone-loop-animation', '-in-view' );

		if ( hasInterval( target ) ) {
			startLoopAnimation( target );
		}
	};

	const deactivateTarget = ( target ) => {
		visibleTargets.delete( target );
		stopLoopAnimation( target );
		removeToken( target, 'data-unitone-loop-animation', '-in-view' );
	};

	const observer = new IntersectionObserver( ( entries ) => {
		entries.forEach( ( entry ) => {
			if ( entry.isIntersecting ) {
				activateTarget( entry.target );
				return;
			}

			deactivateTarget( entry.target );
		} );
	} );

	loopAnimationTargets.forEach( ( target ) => {
		observer.observe( target );
	} );

	const handleMotionPreferenceChange = () => {
		loopAnimationTargets.forEach( ( target ) => {
			stopLoopAnimation( target );
			removeToken( target, 'data-unitone-loop-animation', '-in-view' );
		} );

		if ( mediaQuery.matches ) {
			return;
		}

		visibleTargets.forEach( activateTarget );
	};

	if ( mediaQuery.addEventListener ) {
		mediaQuery.addEventListener( 'change', handleMotionPreferenceChange );
	} else {
		mediaQuery.addListener( handleMotionPreferenceChange );
	}
}
