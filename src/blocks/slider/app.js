import Swiper, { Navigation, Pagination } from 'swiper';

document.addEventListener( 'DOMContentLoaded', () => {
	new Swiper( '.unitone-slider__canvas', {
		modules: [ Navigation, Pagination ],
		followFinger: false,
		// freeMode: true,
		grabCursor: true,
		slidesPerView: 'auto',
		watchSlidesProgress: true,
		rewind: true,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
	} );
} );
