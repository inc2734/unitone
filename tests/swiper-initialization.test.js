import { initializeSwipersWhenVisible } from '../src/blocks/swiper/initialize';

const originalObserver = window.IntersectionObserver;
let observer;
let notify;

beforeEach( () => {
	observer = {
		observe: jest.fn(),
		unobserve: jest.fn(),
		disconnect: jest.fn(),
	};
	window.IntersectionObserver = jest.fn( ( callback ) => {
		notify = callback;
		return observer;
	} );
	document.body.innerHTML = `
		<div id="first" class="unitone-swiper" data-unitone-swiper-settings="{}">
			<button>Next</button>
		</div>
		<div id="second" class="unitone-swiper" data-unitone-swiper-settings="{}"></div>
	`;
} );

afterEach( () => {
	document.body.innerHTML = '';
	window.IntersectionObserver = originalObserver;
} );

it( 'initializes approaching sliders once and leaves distant sliders pending', () => {
	const initialize = jest.fn();
	const first = document.getElementById( 'first' );
	const second = document.getElementById( 'second' );
	initializeSwipersWhenVisible( initialize );
	expect( initialize ).not.toHaveBeenCalled();
	expect( window.IntersectionObserver ).toHaveBeenCalledWith(
		expect.any( Function ),
		{ rootMargin: '300px 0px' }
	);
	notify( [
		{ target: first, isIntersecting: true },
		{ target: second, isIntersecting: false },
	] );
	notify( [ { target: first, isIntersecting: true } ] );
	expect( initialize.mock.calls ).toEqual( [ [ first ] ] );
	expect( observer.unobserve ).toHaveBeenCalledWith( first );
	expect( observer.disconnect ).not.toHaveBeenCalled();
	notify( [ { target: second, isIntersecting: true } ] );
	expect( initialize ).toHaveBeenCalledTimes( 2 );
	expect( observer.disconnect ).toHaveBeenCalledTimes( 1 );
} );

it( 'initializes before a focused control is used, without repeating on intersection', () => {
	const initialize = jest.fn();
	const first = document.getElementById( 'first' );
	initializeSwipersWhenVisible( initialize );
	first.querySelector( 'button' ).focus();
	expect( initialize ).toHaveBeenCalledWith( first );
	notify( [ { target: first, isIntersecting: true } ] );
	first.dispatchEvent( new window.FocusEvent( 'focusin' ) );
	expect( initialize ).toHaveBeenCalledTimes( 1 );
} );

it( 'initializes nested sliders before capturing thumbnails and skips preview copies', () => {
	const first = document.getElementById( 'first' );
	first.innerHTML = `
		<div id="nested" class="unitone-swiper" data-unitone-swiper-settings="{}"></div>
		<div class="unitone-swiper-thumbnails__preview">
			<div id="preview" class="unitone-swiper" data-unitone-swiper-settings="{}"></div>
		</div>
	`;
	const events = [];
	let nestedReadyWhenCaptured;
	const initialize = ( root ) => {
		expect( root.hasAttribute( 'data-unitone-swiper-ready' ) ).toBe(
			false
		);
		events.push( `initialize:${ root.id }` );
		return () => {
			expect( root.hasAttribute( 'data-unitone-swiper-ready' ) ).toBe(
				false
			);
			if ( root === first ) {
				nestedReadyWhenCaptured = document
					.getElementById( 'nested' )
					.hasAttribute( 'data-unitone-swiper-ready' );
			}
			events.push( `thumbnail:${ root.id }` );
		};
	};
	initializeSwipersWhenVisible( initialize );
	expect( observer.observe ).toHaveBeenCalledTimes( 2 );
	notify( [ { target: first, isIntersecting: true } ] );
	expect( events ).toEqual( [
		'initialize:first',
		'initialize:nested',
		'thumbnail:nested',
		'thumbnail:first',
	] );
	expect( nestedReadyWhenCaptured ).toBe( true );
	expect( first.hasAttribute( 'data-unitone-swiper-ready' ) ).toBe( true );
	expect(
		document
			.getElementById( 'second' )
			.hasAttribute( 'data-unitone-swiper-ready' )
	).toBe( false );
	expect(
		document
			.getElementById( 'preview' )
			.hasAttribute( 'data-unitone-swiper-ready' )
	).toBe( false );
} );

it( 'does not mark a slider ready if thumbnail initialization fails', () => {
	const first = document.getElementById( 'first' );
	initializeSwipersWhenVisible( () => () => {
		throw new Error( 'Thumbnail initialization failed' );
	} );
	expect( () =>
		notify( [ { target: first, isIntersecting: true } ] )
	).toThrow( 'Thumbnail initialization failed' );
	expect( first.hasAttribute( 'data-unitone-swiper-ready' ) ).toBe( false );
} );

it( 'skips nested sliders removed during duplicate-track cleanup', () => {
	const first = document.getElementById( 'first' );
	first.innerHTML =
		'<div id="removed" class="unitone-swiper" data-unitone-swiper-settings="{}"></div>';
	const initialize = jest.fn( ( root ) => {
		if ( root === first ) {
			root.replaceChildren();
		}
	} );
	initializeSwipersWhenVisible( initialize );
	notify( [ { target: first, isIntersecting: true } ] );
	expect( initialize.mock.calls ).toEqual( [ [ first ] ] );
} );

it( 'does not initialize a root removed before its intersection callback', () => {
	const initialize = jest.fn();
	const first = document.getElementById( 'first' );
	initializeSwipersWhenVisible( initialize );
	first.remove();
	notify( [ { target: first, isIntersecting: true } ] );
	expect( initialize ).not.toHaveBeenCalled();
	expect( observer.unobserve ).toHaveBeenCalledWith( first );
} );

it( 'initializes all sliders immediately when IntersectionObserver is unavailable', () => {
	window.IntersectionObserver = undefined;
	const initialize = jest.fn();
	initializeSwipersWhenVisible( initialize );
	expect( initialize.mock.calls.map( ( [ root ] ) => root.id ) ).toEqual( [
		'first',
		'second',
	] );
} );

it( 'does not create an observer when the page has no sliders', () => {
	document.body.innerHTML = '';
	initializeSwipersWhenVisible( jest.fn() );
	expect( window.IntersectionObserver ).not.toHaveBeenCalled();
} );
