import Swiper, { Navigation, Pagination } from 'swiper';

document.addEventListener( 'DOMContentLoaded', () => {
	const canvases = document.querySelectorAll( '.unitone-slider__canvas' );
	canvases.forEach( ( canvas ) => {
		const slider = canvas.closest( '.unitone-slider' );
		const pagination = slider.querySelector( '.swiper-pagination' );
		const next = slider.querySelector( '.swiper-button-next' );
		const prev = slider.querySelector( '.swiper-button-prev' );

		new Swiper( canvas, {
			modules: [ Navigation, Pagination ],
			followFinger: false,
			grabCursor: true,
			slidesPerView: 'auto',
			watchSlidesProgress: true,
			rewind: true,
			pagination: {
				el: pagination,
				clickable: true,
			},
			navigation: {
				nextEl: next,
				prevEl: prev,
			},
		} );
	} );
} );
