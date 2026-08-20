import Swiper from 'swiper';

import {
	A11y,
	Autoplay,
	EffectFade,
	FreeMode,
	Navigation,
	Scrollbar,
} from 'swiper/modules';

import { __ } from '@wordpress/i18n';

import { resolveSettings as resolvePaginationSettings } from '../swiper-pagination/config';
import { resolveSettings as resolveScrollbarSettings } from '../swiper-scrollbar/config';

import { buildSwiperOptions } from './config';

const ROOT_SELECTOR = '.unitone-swiper[data-unitone-swiper-settings]';
const initializingRoots = new WeakSet();
const EFFECT_MODULES = {
	fade: EffectFade,
};

const parseObject = ( value ) => {
	if ( ! value ) {
		return {};
	}

	try {
		const parsed = JSON.parse( value );
		return parsed && 'object' === typeof parsed && ! Array.isArray( parsed )
			? parsed
			: {};
	} catch {
		return {};
	}
};

const getOwnedElements = ( root, selector ) =>
	Array.from( root.querySelectorAll( selector ) ).filter(
		( element ) => element.closest( ROOT_SELECTOR ) === root
	);

const getOwnedElement = ( root, selector ) =>
	getOwnedElements( root, selector )[ 0 ] || null;

const isAutoplayEnabled = ( swiper ) =>
	true === swiper.params.autoplay?.enabled;

const getPaginationSettings = ( element ) => {
	return resolvePaginationSettings(
		parseObject( element.getAttribute( 'data-unitone-swiper-pagination' ) )
	);
};

const getPaginationState = ( swiper ) => {
	const slidesLength =
		swiper.virtual && swiper.params.virtual.enabled
			? swiper.virtual.slides.length
			: swiper.slides.length;
	const total = Math.max(
		1,
		swiper.params.loop
			? Math.ceil( slidesLength / swiper.params.slidesPerGroup )
			: swiper.snapGrid.length
	);
	let current = swiper.snapIndex ?? swiper.activeIndex ?? 0;
	if ( swiper.params.loop ) {
		current =
			swiper.params.slidesPerGroup > 1
				? Math.floor( swiper.realIndex / swiper.params.slidesPerGroup )
				: swiper.realIndex;
	}

	return {
		current: Math.min( total - 1, Math.max( 0, current ) ),
		total,
	};
};

const moveToPaginationIndex = ( swiper, index ) => {
	const slideIndex = index * swiper.params.slidesPerGroup;
	if ( swiper.params.loop ) {
		if ( swiper.realIndex !== slideIndex ) {
			swiper.slideToLoop( slideIndex );
		}
		return;
	}

	swiper.slideTo( slideIndex );
};

const renderPagination = ( swiper, pagination ) => {
	const { element, settings } = pagination;
	const { total } = getPaginationState( swiper );
	const ownerDocument = element.ownerDocument;

	element.classList.remove(
		'swiper-pagination-bullets',
		'swiper-pagination-bullets-dynamic',
		'swiper-pagination-clickable',
		'swiper-pagination-fraction',
		'swiper-pagination-progressbar',
		'swiper-pagination-vertical'
	);
	element.classList.add(
		`swiper-pagination-${ settings.type }`,
		'swiper-pagination-horizontal'
	);
	element.replaceChildren();
	pagination.bullets = [];
	pagination.current = null;
	pagination.total = null;
	pagination.fill = null;

	if ( 'bullets' === settings.type ) {
		element.classList.add( 'swiper-pagination-clickable' );
		if ( settings.dynamicBullets ) {
			element.classList.add( 'swiper-pagination-bullets-dynamic' );
		}

		for ( let index = 0; index < total; index++ ) {
			const bullet = ownerDocument.createElement( 'button' );
			bullet.type = 'button';
			bullet.className = 'swiper-pagination-bullet';
			bullet.setAttribute(
				'aria-label',
				__( 'Go to slide {{index}}', 'unitone' ).replace(
					'{{index}}',
					index + 1
				)
			);
			bullet.addEventListener( 'click', () =>
				moveToPaginationIndex( swiper, index )
			);
			element.append( bullet );
			pagination.bullets.push( bullet );
		}
		return;
	}

	if ( 'fraction' === settings.type ) {
		const current = ownerDocument.createElement( 'span' );
		current.className = 'swiper-pagination-current';
		const separator = ownerDocument.createTextNode( ' / ' );
		const totalElement = ownerDocument.createElement( 'span' );
		totalElement.className = 'swiper-pagination-total';
		element.append( current, separator, totalElement );
		pagination.current = current;
		pagination.total = totalElement;
		return;
	}

	const fill = ownerDocument.createElement( 'span' );
	fill.className = 'swiper-pagination-progressbar-fill';
	element.append( fill );
	pagination.fill = fill;
};

const updatePagination = ( swiper, pagination ) => {
	const { element, settings } = pagination;
	const { current, total } = getPaginationState( swiper );
	element.classList.toggle(
		'swiper-pagination-lock',
		swiper.params.watchOverflow && swiper.isLocked
	);

	if ( 'bullets' === settings.type ) {
		pagination.bullets.forEach( ( bullet, index ) => {
			const isActive = current === index;
			const distance = index - current;
			bullet.hidden = settings.dynamicBullets && 2 < Math.abs( distance );
			bullet.classList.remove(
				'swiper-pagination-bullet-active',
				'swiper-pagination-bullet-active-main',
				'swiper-pagination-bullet-active-prev',
				'swiper-pagination-bullet-active-prev-prev',
				'swiper-pagination-bullet-active-next',
				'swiper-pagination-bullet-active-next-next'
			);

			if ( isActive ) {
				bullet.classList.add(
					'swiper-pagination-bullet-active',
					'swiper-pagination-bullet-active-main'
				);
				bullet.setAttribute( 'aria-current', 'true' );
			} else {
				bullet.removeAttribute( 'aria-current' );
				if ( -1 === distance ) {
					bullet.classList.add(
						'swiper-pagination-bullet-active-prev'
					);
				} else if ( -2 === distance ) {
					bullet.classList.add(
						'swiper-pagination-bullet-active-prev-prev'
					);
				} else if ( 1 === distance ) {
					bullet.classList.add(
						'swiper-pagination-bullet-active-next'
					);
				} else if ( 2 === distance ) {
					bullet.classList.add(
						'swiper-pagination-bullet-active-next-next'
					);
				}
			}
		} );

		return;
	}

	if ( 'fraction' === settings.type ) {
		pagination.current.textContent = current + 1;
		pagination.total.textContent = total;
		return;
	}

	const { fill } = pagination;
	if ( fill ) {
		fill.style.transform = `translate3d(0, 0, 0) scaleX(${
			( current + 1 ) / total
		})`;
		fill.style.transitionDuration = `${ swiper.params.speed }ms`;
	}
};

const setupPagination = ( root, swiper ) => {
	const paginationElements = getOwnedElements(
		root,
		'.unitone-swiper-pagination'
	);
	if ( ! paginationElements.length ) {
		return;
	}

	const paginations = paginationElements.map( ( element ) => ( {
		element,
		settings: getPaginationSettings( element ),
		bullets: [],
		current: null,
		total: null,
		fill: null,
	} ) );

	const render = () => {
		paginations.forEach( ( pagination ) => {
			renderPagination( swiper, pagination );
			updatePagination( swiper, pagination );
		} );
	};

	const update = () => {
		paginations.forEach( ( pagination ) =>
			updatePagination( swiper, pagination )
		);
	};

	render();

	const defaultView = root.ownerDocument.defaultView;
	let animationFrame;
	let shouldRender = false;

	const flush = () => {
		animationFrame = undefined;

		if ( swiper.destroyed ) {
			return;
		}

		if ( shouldRender ) {
			shouldRender = false;
			render();
			return;
		}

		update();
	};

	const scheduleUpdate = () => {
		if ( undefined === animationFrame ) {
			animationFrame = defaultView.requestAnimationFrame( flush );
		}
	};

	const scheduleRender = () => {
		shouldRender = true;
		scheduleUpdate();
	};

	[
		'activeIndexChange',
		'realIndexChange',
		'snapIndexChange',
		'lock',
		'unlock',
	].forEach( ( eventName ) => swiper.on( eventName, scheduleUpdate ) );

	[ 'breakpoint', 'slidesLengthChange', 'snapGridLengthChange' ].forEach(
		( eventName ) => swiper.on( eventName, scheduleRender )
	);

	swiper.on( 'destroy', () => {
		if ( undefined !== animationFrame ) {
			defaultView.cancelAnimationFrame( animationFrame );
		}
	} );
};

const getScrollbarOptions = ( element ) => {
	if ( ! element ) {
		return false;
	}

	const settings = resolveScrollbarSettings(
		parseObject( element.getAttribute( 'data-unitone-swiper-scrollbar' ) )
	);

	return {
		el: element,
		hide: settings.hide,
		draggable: true,
		snapOnRelease: false,
		dragSize: 'auto',
	};
};

const setupScrollbarResizeObserver = ( swiper ) => {
	const scrollbar = swiper.scrollbar?.el;
	const ResizeObserver =
		scrollbar?.ownerDocument?.defaultView?.ResizeObserver;

	if ( ! scrollbar || ! ResizeObserver ) {
		return;
	}

	const resizeObserver = new ResizeObserver( () => {
		if ( swiper.destroyed ) {
			return;
		}

		swiper.scrollbar.updateSize();
		swiper.scrollbar.setTranslate();
	} );

	resizeObserver.observe( scrollbar );
	swiper.on( 'destroy', () => resizeObserver.disconnect() );
};

const updateAutoplayControls = ( swiper, controls, isPlaying ) => {
	const isEnabled = isAutoplayEnabled( swiper );

	controls.forEach( ( control ) => {
		const action =
			'play' === control.dataset.unitoneSwiperAutoplayAction
				? 'play'
				: 'pause';

		control.hidden = ! isEnabled;
		control.disabled =
			isEnabled &&
			( ( 'play' === action && isPlaying ) ||
				( 'pause' === action && ! isPlaying ) );
		control.dataset.unitoneSwiperAutoplayState = isPlaying
			? 'playing'
			: 'paused';
	} );
};

const setupAutoplayControls = ( root, swiper ) => {
	const controls = getOwnedElements(
		root,
		'.unitone-swiper-autoplay-control'
	);

	if ( ! controls.length ) {
		return;
	}

	let isPlayRequested =
		Boolean( swiper.autoplay?.running ) && ! swiper.autoplay?.paused;

	controls.forEach( ( control ) => {
		control.addEventListener( 'click', () => {
			if ( ! isAutoplayEnabled( swiper ) ) {
				return;
			}

			if ( 'play' === control.dataset.unitoneSwiperAutoplayAction ) {
				isPlayRequested = true;

				if ( ! swiper.autoplay.running ) {
					swiper.autoplay.start();
				} else if ( swiper.autoplay.paused ) {
					swiper.autoplay.resume();
				}
			} else {
				isPlayRequested = false;

				if ( swiper.autoplay.running && ! swiper.autoplay.paused ) {
					swiper.autoplay.pause();
				}
			}

			updateAutoplayControls( swiper, controls, isPlayRequested );
		} );
	} );

	swiper.on( 'autoplayStart', () => {
		isPlayRequested = true;
		updateAutoplayControls( swiper, controls, true );
	} );

	swiper.on( 'autoplayStop', () => {
		isPlayRequested = false;
		updateAutoplayControls( swiper, controls, false );
	} );

	swiper.on( 'autoplayPause', () => {
		window.requestAnimationFrame( () => {
			if ( swiper.destroyed || swiper.animating ) {
				return;
			}

			updateAutoplayControls( swiper, controls, false );
		} );
	} );

	swiper.on( 'autoplayResume', () => {
		if ( ! isPlayRequested ) {
			swiper.autoplay.pause();
			return;
		}

		updateAutoplayControls( swiper, controls, true );
	} );

	updateAutoplayControls( swiper, controls, isPlayRequested );
};

const updateAutoplayProgressState = ( swiper, progresses, state ) => {
	const isEnabled = isAutoplayEnabled( swiper );

	progresses.forEach( ( progress ) => {
		if ( isEnabled ) {
			progress.dataset.unitoneSwiperAutoplayState = state;
		} else {
			delete progress.dataset.unitoneSwiperAutoplayState;
		}
	} );
};

const setupAutoplayProgresses = ( root, swiper ) => {
	const progresses = getOwnedElements(
		root,
		'.unitone-swiper-autoplay-progress'
	);

	if ( ! progresses.length ) {
		return;
	}

	if ( ! isAutoplayEnabled( swiper ) ) {
		updateAutoplayProgressState( swiper, progresses, 'stopped' );
		return;
	}

	const updateValue = ( percentage ) => {
		const value = Number.isFinite( percentage )
			? Math.min( 1, Math.max( 0, 1 - percentage ) )
			: 1;

		progresses.forEach( ( progress ) =>
			progress.style.setProperty(
				'--unitone--swiper-autoplay-progress',
				String( value )
			)
		);
	};

	swiper.on( 'autoplayTimeLeft', ( _swiper, _timeLeft, percentage ) => {
		updateValue( percentage );
	} );

	swiper.on( 'autoplayStart', () => {
		updateValue( 1 );
		updateAutoplayProgressState( swiper, progresses, 'playing' );
	} );

	swiper.on( 'autoplayStop', () => {
		updateAutoplayProgressState( swiper, progresses, 'stopped' );
	} );

	swiper.on( 'autoplayPause', () => {
		updateAutoplayProgressState( swiper, progresses, 'paused' );
	} );

	swiper.on( 'autoplayResume', () => {
		updateAutoplayProgressState( swiper, progresses, 'playing' );
	} );

	updateValue( 1 );
	updateAutoplayProgressState(
		swiper,
		progresses,
		swiper.autoplay?.running && ! swiper.autoplay?.paused
			? 'playing'
			: 'paused'
	);
};

const setupFocusPause = ( root, swiper ) => {
	if ( ! isAutoplayEnabled( swiper ) ) {
		return;
	}

	root.addEventListener( 'focusin', () => {
		if ( swiper.autoplay.running && ! swiper.autoplay.paused ) {
			swiper.autoplay.pause();
		}
	} );
};

const setupAutoSlideWidth = ( root, swiper ) => {
	const update = () => {
		const width = swiper.params.unitoneAutoSlideWidth;
		const value =
			'string' === typeof width && width.trim() ? width : '100%';
		root.setAttribute(
			'data-unitone-swiper-slides-per-view',
			'auto' === swiper.params.slidesPerView ? 'auto' : 'number'
		);
		const hasChanged =
			root.style.getPropertyValue( '--unitone--auto-slide-width' ) !==
			value;

		root.style.setProperty( '--unitone--auto-slide-width', value );

		return hasChanged;
	};

	if ( update() && 'auto' === swiper.params.slidesPerView ) {
		swiper.update();
	}

	swiper.on( 'breakpoint', update );
};

const initializeSwiper = ( root ) => {
	const viewport = getOwnedElement( root, '.unitone-swiper-track__viewport' );
	if (
		! viewport ||
		viewport.classList.contains( 'swiper-initialized' ) ||
		initializingRoots.has( root )
	) {
		return;
	}

	initializingRoots.add( root );

	const settings = parseObject(
		root.getAttribute( 'data-unitone-swiper-settings' )
	);
	const options = buildSwiperOptions( settings );
	const previous = getOwnedElement( root, '.unitone-swiper-arrow--previous' );
	const next = getOwnedElement( root, '.unitone-swiper-arrow--next' );
	const scrollbar = getOwnedElement( root, '.unitone-swiper-scrollbar' );

	options.a11y = {
		enabled: true,
		prevSlideMessage: __( 'Previous slide', 'unitone' ),
		nextSlideMessage: __( 'Next slide', 'unitone' ),
		firstSlideMessage: __( 'This is the first slide', 'unitone' ),
		lastSlideMessage: __( 'This is the last slide', 'unitone' ),
	};

	options.navigation =
		previous || next
			? {
					prevEl: previous,
					nextEl: next,
					addIcons: false,
					hideOnClick: false,
			  }
			: false;

	options.scrollbar = getScrollbarOptions( scrollbar );

	const parentRoot = root.parentElement?.closest( ROOT_SELECTOR );
	if ( parentRoot ) {
		options.nested = true;
	}

	if (
		options.autoplay &&
		window.matchMedia?.( '(prefers-reduced-motion: reduce)' ).matches
	) {
		options.autoplay = false;
	}

	options.modules = [ A11y ];

	const effectModule = EFFECT_MODULES[ options.effect ];
	if ( effectModule ) {
		options.modules.push( effectModule );
	}
	if ( options.autoplay ) {
		options.modules.push( Autoplay );
	}
	if ( options.freeMode ) {
		options.modules.push( FreeMode );
	}
	if ( options.navigation ) {
		options.modules.push( Navigation );
	}
	if ( options.scrollbar ) {
		options.modules.push( Scrollbar );
	}

	const swiper = new Swiper( viewport, options );

	setupAutoSlideWidth( root, swiper );
	setupScrollbarResizeObserver( swiper );
	setupPagination( root, swiper );
	setupAutoplayControls( root, swiper );
	setupAutoplayProgresses( root, swiper );
	setupFocusPause( root, swiper );

	initializingRoots.delete( root );
};

const initializeAll = () => {
	document.querySelectorAll( ROOT_SELECTOR ).forEach( initializeSwiper );
};

if ( 'loading' === document.readyState ) {
	document.addEventListener( 'DOMContentLoaded', initializeAll );
} else {
	initializeAll();
}
