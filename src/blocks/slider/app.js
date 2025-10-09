import Swiper from 'swiper';
import {
	Autoplay,
	EffectFade,
	Navigation,
	Pagination,
	A11y,
} from 'swiper/modules';

document.addEventListener( 'DOMContentLoaded', () => {
	const canvases = document.querySelectorAll( '.unitone-slider__canvas' );
	canvases.forEach( ( canvas ) => {
		const slider = canvas.closest( '.unitone-slider' );
		const pagination = slider.querySelector( '.swiper-pagination' );
		const thumbnails = slider.querySelector( '.unitone-slider-thumbnails' );
		const next = slider.querySelector( '.swiper-button-next' );
		const prev = slider.querySelector( '.swiper-button-prev' );

		const dummy = document.createElement( 'div' );
		slider.appendChild( dummy );
		dummy.style.gap = `var(--unitone--gap)`;
		const spaceBetween = parseFloat( window.getComputedStyle( dummy ).gap );
		slider.removeChild( dummy );

		const centeredSlides =
			canvas.getAttribute( 'data-unitone-swiper-centered-slides' ) ||
			undefined;
		const speed =
			parseInt( canvas.getAttribute( 'data-unitone-swiper-speed' ) ) ||
			undefined;
		const autoplayDelay =
			null != canvas.getAttribute( 'data-unitone-swiper-autoplay-delay' )
				? parseInt(
						canvas.getAttribute(
							'data-unitone-swiper-autoplay-delay'
						)
				  )
				: undefined;
		const autoplayReverseDirection =
			'true' ===
			canvas.getAttribute( 'data-unitone-swiper-autoplay-reverse' );
		const loop =
			'true' === canvas.getAttribute( 'data-unitone-swiper-loop' );
		const paginationType = canvas.getAttribute(
			'data-unitone-swiper-pagination-type'
		);
		const effect =
			canvas.getAttribute( 'data-unitone-swiper-effect' ) || 'slide';

		const swiperOptions = {
			modules: [ Autoplay, EffectFade, Navigation, Pagination, A11y ],
			effect,
			followFinger: false,
			grabCursor: true,
			slidesPerView: 'auto',
			watchSlidesProgress: true,
			spaceBetween,
			pagination: {
				el: pagination,
				clickable: true,
				type: paginationType || 'bullets',
			},
			navigation: {
				nextEl: next,
				prevEl: prev,
			},
		};

		if ( centeredSlides ) {
			swiperOptions.centeredSlides = true;
		}

		if ( 'fade' === effect ) {
			swiperOptions.fadeEffect = {
				crossFade: true,
			};
		}

		if ( null != speed ) {
			swiperOptions.speed = speed;
		}

		if ( null != autoplayDelay ) {
			swiperOptions.autoplay = {
				delay: autoplayDelay,
			};
			swiperOptions.allowTouchMove = false;
			swiperOptions.grabCursor = false;

			if ( autoplayReverseDirection ) {
				swiperOptions.autoplay.reverseDirection =
					autoplayReverseDirection;
			}
		}

		if ( loop ) {
			swiperOptions.loop = true;
		} else {
			swiperOptions.rewind = true;
		}

		if ( thumbnails ) {
			swiperOptions.on = {
				afterInit: ( swiper ) => {
					thumbnails.children[ swiper.realIndex ].setAttribute(
						'data-slide-active',
						'true'
					);
					for ( let i = 0; i < thumbnails.children.length; i++ ) {
						thumbnails.children[ i ].onclick = () => {
							if ( swiper.params.loop ) {
								swiper.slideToLoop( i );
							} else {
								swiper.slideTo( i );
							}
						};
					}
				},
				slideChange: ( swiper ) => {
					thumbnails
						.querySelector( '[data-slide-active=true' )
						?.removeAttribute( 'data-slide-active' );
					thumbnails.children[ swiper.realIndex ].setAttribute(
						'data-slide-active',
						'true'
					);
				},
			};
		}

		new Swiper( canvas, swiperOptions );
	} );
} );
