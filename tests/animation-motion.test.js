import initScrollAnimationFeatures from '../src/js/app/scroll-animation';

const originalMatchMedia = window.matchMedia;
const originalObserver = window.IntersectionObserver;
let mediaQuery;
let changeMotion;
let notify;

beforeEach( () => {
	jest.useFakeTimers();
	mediaQuery = {
		matches: true,
		addEventListener: jest.fn( ( _event, callback ) => {
			changeMotion = callback;
		} ),
	};
	window.matchMedia = jest.fn( () => mediaQuery );
	window.IntersectionObserver = jest.fn( ( callback ) => {
		notify = callback;
		return { observe: jest.fn(), unobserve: jest.fn() };
	} );
	document.body.innerHTML = `
		<div data-unitone-parallax="disable" data-unitone-parallax-speed="2" style="transform: rotate(5deg)">
			<img style="object-fit: cover; object-position: 20% 30%">
		</div>`;
} );

afterEach( () => {
	mediaQuery.matches = true;
	changeMotion?.();
	changeMotion = undefined;
	document.body.innerHTML = '';
	window.matchMedia = originalMatchMedia;
	window.IntersectionObserver = originalObserver;
	jest.useRealTimers();
} );

const target = () => document.querySelector( '[data-unitone-parallax]' );

const intersect = ( isIntersecting = true ) => {
	notify( [ { target: target(), isIntersecting } ] );
	jest.advanceTimersByTime( 20 );
};

it( 'keeps reduced-motion parallax visible without moving authored positions', () => {
	initScrollAnimationFeatures();
	expect( target().getAttribute( 'data-unitone-parallax' ) ).toBe( 'enable' );
	intersect();
	window.dispatchEvent( new window.Event( 'scroll' ) );
	jest.advanceTimersByTime( 20 );
	expect( target().style.transform ).toBe( 'rotate(5deg)' );
	expect( target().firstElementChild.style.objectPosition ).toBe( '20% 30%' );
	intersect( false );
	expect( target().getAttribute( 'data-unitone-parallax' ) ).toBe( 'enable' );
} );

it( 'restores a covered image position when reduced motion is enabled during viewing', () => {
	mediaQuery.matches = false;
	initScrollAnimationFeatures();
	intersect();
	expect( target().firstElementChild.style.objectPosition ).not.toBe(
		'20% 30%'
	);
	window.dispatchEvent( new window.Event( 'scroll' ) );
	mediaQuery.matches = true;
	changeMotion();
	jest.advanceTimersByTime( 20 );
	expect( target().firstElementChild.style.objectPosition ).toBe( '20% 30%' );
	expect( target().style.transform ).toBe( 'rotate(5deg)' );
	mediaQuery.matches = false;
	changeMotion();
	jest.advanceTimersByTime( 20 );
	expect( target().firstElementChild.style.objectPosition ).not.toBe(
		'20% 30%'
	);
} );

it( 'restores a translated block and cancels a pending scroll update', () => {
	target().innerHTML = '';
	mediaQuery.matches = false;
	initScrollAnimationFeatures();
	intersect();
	expect( target().style.transform ).toMatch( /^translate3d/ );
	window.dispatchEvent( new window.Event( 'scroll' ) );
	mediaQuery.matches = true;
	changeMotion();
	jest.advanceTimersByTime( 20 );
	expect( target().style.transform ).toBe( 'rotate(5deg)' );
} );

it( 'resumes only visible targets when reduced motion is disabled', () => {
	initScrollAnimationFeatures();
	intersect( false );
	mediaQuery.matches = false;
	changeMotion();
	jest.advanceTimersByTime( 20 );
	expect( target().getAttribute( 'data-unitone-parallax' ) ).toBe(
		'disable'
	);
	expect( target().firstElementChild.style.objectPosition ).toBe( '20% 30%' );
	intersect();
	expect( target().getAttribute( 'data-unitone-parallax' ) ).toBe( 'enable' );
	expect( target().firstElementChild.style.objectPosition ).not.toBe(
		'20% 30%'
	);
} );

it( 'supports the legacy motion preference change listener', () => {
	delete mediaQuery.addEventListener;
	mediaQuery.addListener = jest.fn( ( callback ) => {
		changeMotion = callback;
	} );
	initScrollAnimationFeatures();
	expect( mediaQuery.addListener ).toHaveBeenCalledWith(
		expect.any( Function )
	);
} );
