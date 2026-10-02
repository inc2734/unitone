const originalMatchMedia = window.matchMedia;
let reduceMotion;
let swiper;

beforeAll( () => {
	const readyState = jest.spyOn( document, 'readyState', 'get' );
	readyState.mockReturnValue( 'loading' );
	require( '../src/blocks/swiper/app' );
	readyState.mockRestore();
} );

beforeEach( () => {
	jest.useFakeTimers();
	reduceMotion = true;
	window.matchMedia = jest.fn( () => ( { matches: reduceMotion } ) );
} );

afterEach( () => {
	swiper?.destroy();
	swiper = undefined;
	document.body.innerHTML = '';
	window.matchMedia = originalMatchMedia;
	jest.useRealTimers();
} );

const render = ( {
	autoplay = true,
	delay = 50,
	controls = true,
	toggleCount = 0,
	pauseOnMouseEnter = false,
	disableOnInteraction = false,
	effect = 'slide',
	loopMode = 'none',
	speed = 30,
} = {} ) => {
	document.body.innerHTML = `
		<div class="unitone-swiper">
			<div class="unitone-swiper-track">
				<div class="unitone-swiper-track__viewport">
					<div class="unitone-swiper-track__wrapper swiper-wrapper">
						<div class="unitone-swiper__slide swiper-slide">First</div>
						<div class="unitone-swiper__slide swiper-slide">Second</div>
						<div class="unitone-swiper__slide swiper-slide">Third</div>
					</div>
				</div>
			</div>
			<button class="unitone-swiper-arrow unitone-swiper-arrow--previous swiper-button-prev">Previous</button>
			<button class="unitone-swiper-arrow unitone-swiper-arrow--next swiper-button-next">Next</button>
			${
				controls
					? `<button class="unitone-swiper-autoplay-control" data-unitone-swiper-autoplay-action="play">Play</button>
						<button class="unitone-swiper-autoplay-control" data-unitone-swiper-autoplay-action="pause">Pause</button>`
					: ''
			}
			${ Array.from(
				{ length: toggleCount },
				() =>
					`<button class="unitone-swiper-autoplay-control" data-unitone-swiper-autoplay-action="toggle" data-unitone-swiper-autoplay-label-play="Start autoplay" data-unitone-swiper-autoplay-label-pause="Pause autoplay"><span class="unitone-swiper-autoplay-control__play"><span aria-hidden="true">▶</span> Play</span><span class="unitone-swiper-autoplay-control__pause"><span aria-hidden="true">Ⅱ</span> Stop</span></button>`
			).join( '' ) }
			<div class="unitone-swiper-autoplay-progress"></div>
		</div>`;
	const root = document.querySelector( '.unitone-swiper' );
	root.setAttribute(
		'data-unitone-swiper-settings',
		JSON.stringify( {
			autoplay,
			autoplayDelay: delay,
			autoplayPauseOnMouseEnter: pauseOnMouseEnter,
			autoplayDisableOnInteraction: disableOnInteraction,
			speed,
			loopMode,
			effect,
		} )
	);
	const viewport = root.querySelector( '.unitone-swiper-track__viewport' );
	Object.defineProperties( viewport, {
		clientWidth: { value: 400 },
		clientHeight: { value: 200 },
	} );
	document.dispatchEvent( new window.Event( 'DOMContentLoaded' ) );
	swiper = viewport.swiper;
	return {
		root,
		viewport,
		toggles: root.querySelectorAll(
			'[data-unitone-swiper-autoplay-action="toggle"]'
		),
		next: root.querySelector( '.unitone-swiper-arrow--next' ),
		previous: root.querySelector( '.unitone-swiper-arrow--previous' ),
		play: root.querySelector(
			'[data-unitone-swiper-autoplay-action="play"]'
		),
		pause: root.querySelector(
			'[data-unitone-swiper-autoplay-action="pause"]'
		),
		progress: root.querySelector( '.unitone-swiper-autoplay-progress' ),
	};
};

it.each( [ 50, 0 ] )(
	'keeps reduced-motion autoplay stopped initially with delay %i',
	( delay ) => {
		const { play, pause, progress } = render( { delay } );
		expect( swiper.autoplay.running ).toBe( false );
		expect( swiper.params.autoplay.delay ).toBe( delay );
		expect( swiper.originalParams.autoplay.delay ).toBe( delay );
		expect( play.hidden ).toBe( false );
		expect( play.disabled ).toBe( false );
		expect( pause.disabled ).toBe( true );
		expect( progress.dataset.unitoneSwiperAutoplayState ).toBe( 'paused' );
		jest.advanceTimersByTime( 200 );
		expect( swiper.activeIndex ).toBe( 0 );
	}
);

it( 'plays multiple slides after explicit activation and can pause and resume', () => {
	const { play, pause, progress } = render();
	expect( swiper.params.speed ).toBe( 0 );
	play.focus();
	play.click();
	expect( swiper.params.speed ).toBe( 30 );
	expect( swiper.originalParams.speed ).toBe( 30 );
	expect( swiper.autoplay.running ).toBe( true );
	expect( play.disabled ).toBe( true );
	expect( pause.disabled ).toBe( false );
	expect( progress.dataset.unitoneSwiperAutoplayState ).toBe( 'playing' );
	jest.advanceTimersByTime( 60 );
	expect( swiper.activeIndex ).toBe( 1 );
	swiper.wrapperEl.dispatchEvent( new window.Event( 'transitionend' ) );
	jest.advanceTimersByTime( 60 );
	expect( swiper.activeIndex ).toBe( 2 );
	swiper.wrapperEl.dispatchEvent( new window.Event( 'transitionend' ) );
	pause.focus();
	pause.click();
	jest.advanceTimersByTime( 200 );
	expect( swiper.autoplay.paused ).toBe( true );
	expect( swiper.activeIndex ).toBe( 2 );
	expect( play.disabled ).toBe( false );
	play.focus();
	play.click();
	expect( swiper.autoplay.paused ).toBe( false );
} );

it( 'does not create controls or restart on visibility changes before explicit play', () => {
	render( { controls: false } );
	document.dispatchEvent( new window.Event( 'visibilitychange' ) );
	jest.advanceTimersByTime( 200 );
	expect(
		document.querySelector( '.unitone-swiper-autoplay-control' )
	).toBeNull();
	expect( swiper.autoplay.running ).toBe( false );
	expect( swiper.activeIndex ).toBe( 0 );
} );

it( 'keeps autoplay disabled in the block settings', () => {
	const { play, pause, toggles } = render( {
		autoplay: false,
		toggleCount: 1,
	} );
	[ play, pause, ...toggles ].forEach( ( control ) => {
		expect( control.hidden ).toBe( true );
		control.click();
	} );
	expect( swiper.autoplay ).toBeUndefined();
} );

const expectToggleAction = ( toggle, action ) => {
	expect( toggle.disabled ).toBe( false );
	expect( toggle.hidden ).toBe( false );
	expect( toggle.getAttribute( 'aria-label' ) ).toBe(
		'play' === action ? 'Start autoplay' : 'Pause autoplay'
	);
	expect( toggle.hasAttribute( 'aria-pressed' ) ).toBe( false );
	[ 'play', 'pause' ].forEach( ( contentAction ) => {
		expect(
			toggle.querySelector(
				`.unitone-swiper-autoplay-control__${ contentAction }`
			).hidden
		).toBe( contentAction !== action );
	} );
};

it.each( [ 50, 0 ] )(
	'starts the toggle as play with reduced motion and delay %i',
	( delay ) => {
		const {
			toggles: [ toggle ],
		} = render( { delay, controls: false, toggleCount: 1 } );
		expectToggleAction( toggle, 'play' );
		jest.advanceTimersByTime( 200 );
		expect( swiper.activeIndex ).toBe( 0 );
		toggle.focus();
		toggle.click();
		expectToggleAction( toggle, 'pause' );
		expect( swiper.autoplay.running ).toBe( true );
		expect( swiper.params.speed ).toBe( 30 );
		expect( document.activeElement ).toBe( toggle );
		// Delay zero queues an uncancellable frame; allow its transition to begin.
		if ( 0 === delay ) {
			jest.advanceTimersByTime( 20 );
		}
		toggle.click();
		expectToggleAction( toggle, 'play' );
		const pausedIndex = swiper.activeIndex;
		swiper.wrapperEl.dispatchEvent( new window.Event( 'transitionend' ) );
		jest.advanceTimersByTime( 200 );
		// Swiper may finish one queued zero-delay move, but must not keep rotating.
		expect( swiper.activeIndex ).toBeLessThanOrEqual(
			pausedIndex + ( 0 === delay ? 1 : 0 )
		);
		expect( swiper.autoplay.paused ).toBe( true );
		const settledIndex = swiper.activeIndex;
		jest.advanceTimersByTime( 200 );
		expect( swiper.activeIndex ).toBe( settledIndex );
		toggle.click();
		expectToggleAction( toggle, 'pause' );
		expect( document.activeElement ).toBe( toggle );
	}
);

it( 'synchronizes multiple toggles with fixed play and pause controls', () => {
	reduceMotion = false;
	const { play, pause, toggles } = render( { toggleCount: 2 } );
	toggles.forEach( ( toggle ) => expectToggleAction( toggle, 'pause' ) );
	toggles[ 0 ].click();
	toggles.forEach( ( toggle ) => expectToggleAction( toggle, 'play' ) );
	expect( play.disabled ).toBe( false );
	expect( pause.disabled ).toBe( true );
	play.click();
	toggles.forEach( ( toggle ) => expectToggleAction( toggle, 'pause' ) );
	pause.click();
	toggles.forEach( ( toggle ) => expectToggleAction( toggle, 'play' ) );
	toggles[ 1 ].click();
	toggles.forEach( ( toggle ) => expectToggleAction( toggle, 'pause' ) );
} );

it.each( [ 'mouse', 'touch' ] )(
	'preserves the pause action across %s pointer focus',
	( pointerType ) => {
		reduceMotion = false;
		const {
			toggles: [ toggle ],
		} = render( { controls: false, toggleCount: 1 } );
		expectToggleAction( toggle, 'pause' );
		const pointerDown = new window.MouseEvent( 'pointerdown', {
			bubbles: true,
			button: 0,
		} );
		Object.defineProperty( pointerDown, 'pointerType', {
			value: pointerType,
		} );
		toggle.dispatchEvent( pointerDown );
		toggle.focus();
		jest.advanceTimersByTime( 20 );
		toggle.dispatchEvent(
			new window.MouseEvent( 'click', { bubbles: true, detail: 1 } )
		);
		expectToggleAction( toggle, 'play' );
		expect( swiper.autoplay.paused ).toBe( true );
		jest.advanceTimersByTime( 200 );
		expect( swiper.activeIndex ).toBe( 0 );
	}
);

it( 'keeps keyboard focus pauses stopped until an explicit play request', () => {
	reduceMotion = false;
	const {
		toggles: [ toggle ],
	} = render( { controls: false, toggleCount: 1 } );
	toggle.focus();
	expectToggleAction( toggle, 'play' );
	document.dispatchEvent( new window.Event( 'visibilitychange' ) );
	jest.advanceTimersByTime( 200 );
	expect( swiper.activeIndex ).toBe( 0 );
	expectToggleAction( toggle, 'play' );
	toggle.click();
	// A queued pause update must not overwrite the explicit play request.
	jest.advanceTimersByTime( 20 );
	expectToggleAction( toggle, 'pause' );
} );

it( 'keeps pause displayed during internal slide transitions', () => {
	reduceMotion = false;
	const {
		toggles: [ toggle ],
	} = render( { controls: false, toggleCount: 1 } );
	jest.advanceTimersByTime( 80 );
	expect( swiper.animating ).toBe( true );
	expect( swiper.autoplay.paused ).toBe( true );
	expectToggleAction( toggle, 'pause' );
	swiper.wrapperEl.dispatchEvent( new window.Event( 'transitionend' ) );
	expectToggleAction( toggle, 'pause' );
} );

const dispatchMousePointer = ( target, type ) => {
	const event = new window.Event( type );
	Object.defineProperty( event, 'pointerType', { value: 'mouse' } );
	target.dispatchEvent( event );
};

it( 'reflects hover pauses and keeps an explicit pause stopped on pointer leave', () => {
	reduceMotion = false;
	const {
		viewport,
		toggles: [ toggle ],
	} = render( { controls: false, toggleCount: 1, pauseOnMouseEnter: true } );
	dispatchMousePointer( viewport, 'pointerenter' );
	jest.advanceTimersByTime( 20 );
	expectToggleAction( toggle, 'play' );
	dispatchMousePointer( viewport, 'pointerleave' );
	expectToggleAction( toggle, 'pause' );
	toggle.click();
	dispatchMousePointer( viewport, 'pointerleave' );
	document.dispatchEvent( new window.Event( 'visibilitychange' ) );
	jest.advanceTimersByTime( 200 );
	expect( swiper.activeIndex ).toBe( 0 );
	expectToggleAction( toggle, 'play' );
} );

it( 'reflects autoplay stopping after slide interaction', () => {
	reduceMotion = false;
	const {
		next,
		toggles: [ toggle ],
	} = render( { toggleCount: 1, disableOnInteraction: true } );
	next.click();
	expect( swiper.autoplay.running ).toBe( false );
	expectToggleAction( toggle, 'play' );
	swiper.wrapperEl.dispatchEvent( new window.Event( 'transitionend' ) );
	toggle.click();
	expect( swiper.autoplay.running ).toBe( true );
	expectToggleAction( toggle, 'pause' );
} );

it( 'reflects a hover pause that continues after an internal slide transition', () => {
	reduceMotion = false;
	const {
		viewport,
		toggles: [ toggle ],
	} = render( { controls: false, toggleCount: 1, pauseOnMouseEnter: true } );
	jest.advanceTimersByTime( 80 );
	expectToggleAction( toggle, 'pause' );
	dispatchMousePointer( viewport, 'pointerenter' );
	swiper.wrapperEl.dispatchEvent( new window.Event( 'transitionend' ) );
	jest.advanceTimersByTime( 20 );
	expect( swiper.autoplay.paused ).toBe( true );
	expectToggleAction( toggle, 'play' );
	dispatchMousePointer( viewport, 'pointerleave' );
	expectToggleAction( toggle, 'pause' );
} );

it( 'keeps a paused progress indicator stopped when automatic resume is rejected', () => {
	reduceMotion = false;
	const {
		progress,
		toggles: [ toggle ],
	} = render( { controls: false, toggleCount: 1 } );
	toggle.click();
	document.dispatchEvent( new window.Event( 'visibilitychange' ) );
	expect( swiper.autoplay.paused ).toBe( true );
	expect( progress.dataset.unitoneSwiperAutoplayState ).toBe( 'paused' );
	expectToggleAction( toggle, 'play' );
} );

it( 'starts autoplay normally without reduced motion', () => {
	reduceMotion = false;
	render();
	expect( swiper.autoplay.running ).toBe( true );
	jest.advanceTimersByTime( 60 );
	expect( swiper.activeIndex ).toBe( 1 );
} );

it.each( [
	[ 'slide', false ],
	[ 'slide', true ],
	[ 'fade', false ],
	[ 'fade', true ],
] )(
	'finishes repeated loop navigation with reduced motion: effect=%s autoplay=%s',
	( effect, autoplay ) => {
		const { next, previous } = render( {
			effect,
			autoplay,
			loopMode: 'loop',
		} );
		expect( swiper.params.speed ).toBe( 0 );
		const transitionEnd = jest.fn();
		swiper.on( 'transitionEnd', transitionEnd );
		[ next, next, previous ].forEach( ( button, index ) => {
			button.click();
			expect( swiper.realIndex ).toBe( [ 1, 2, 1 ][ index ] );
			expect( swiper.animating ).toBe( false );
		} );
		expect( transitionEnd ).toHaveBeenCalledTimes( 3 );
		expect( Boolean( swiper.autoplay?.running ) ).toBe( false );
	}
);

it( 'keeps the configured navigation speed without reduced motion', () => {
	reduceMotion = false;
	const { next } = render( { autoplay: false, loopMode: 'loop' } );
	expect( swiper.params.speed ).toBe( 30 );
	next.click();
	expect( swiper.animating ).toBe( true );
	swiper.wrapperEl.dispatchEvent( new window.Event( 'transitionend' ) );
	expect( swiper.animating ).toBe( false );
} );
