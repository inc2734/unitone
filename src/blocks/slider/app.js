import Swiper, { Navigation, Pagination } from 'swiper';

document.addEventListener( 'DOMContentLoaded', () => {
	const sliders = document.querySelectorAll( '.unitone-slider__canvas' );
	sliders.forEach( ( slider ) => {
		const pagination =
			slider.parentNode.querySelector( '.swiper-pagination' );
		const next = slider.parentNode.querySelector( '.swiper-button-next' );
		const prev = slider.parentNode.querySelector( '.swiper-button-prev' );

		new Swiper( slider, {
			modules: [ Navigation, Pagination ],
			followFinger: false,
			// freeMode: true,
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
