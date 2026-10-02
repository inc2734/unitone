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
			<div class="unitone-swiper-autoplay-progress"></div>
		</div>`;
	const root = document.querySelector( '.unitone-swiper' );
	root.setAttribute(
		'data-unitone-swiper-settings',
		JSON.stringify( {
			autoplay,
			autoplayDelay: delay,
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
		viewport,
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
	const { play } = render( { autoplay: false } );
	expect( play.hidden ).toBe( true );
	play.click();
	expect( swiper.autoplay ).toBeUndefined();
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
