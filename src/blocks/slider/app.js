import Swiper, { Autoplay, Navigation, Pagination } from 'swiper';

document.addEventListener( 'DOMContentLoaded', () => {
	const canvases = document.querySelectorAll( '.unitone-slider__canvas' );
	canvases.forEach( ( canvas ) => {
		const slider = canvas.closest( '.unitone-slider' );
		const pagination = slider.querySelector( '.swiper-pagination' );
		const next = slider.querySelector( '.swiper-button-next' );
		const prev = slider.querySelector( '.swiper-button-prev' );

		const speed =
			parseInt( canvas.getAttribute( 'data-unitone-swiper-speed' ) ) ||
			undefined;
		const autoplayDelay =
			0 <=
				parseInt(
					canvas.getAttribute( 'data-unitone-swiper-autoplay-delay' )
				) || undefined;
		const loop =
			'true' === canvas.getAttribute( 'data-unitone-swiper-loop' )
				? true
				: false;

		const swiperOptions = {
			modules: [ Autoplay, Navigation, Pagination ],
			followFinger: false,
			grabCursor: true,
			slidesPerView: 'auto',
			watchSlidesProgress: true,
			pagination: {
				el: pagination,
				clickable: true,
			},
			navigation: {
				nextEl: next,
				prevEl: prev,
			},
		};

		if ( 'undefined' !== typeof speed ) {
			swiperOptions.speed = speed;
		}
		if ( 'undefined' !== typeof autoplayDelay ) {
			swiperOptions.autoplay = {
				delay: autoplayDelay,
			};
			swiperOptions.allowTouchMove = false;
			swiperOptions.grabCursor = false;
		}
		if ( loop ) {
			swiperOptions.loop = true;
		} else {
			swiperOptions.rewind = true;
		}

		new Swiper( canvas, swiperOptions );
	} );
} );
