import { THUMBNAIL_PREVIEW_SELECTOR } from '../swiper-thumbnails/frontend';

export const ROOT_SELECTOR = '.unitone-swiper[data-unitone-swiper-settings]';

const initializeTree = ( root, initializeSwiper ) => {
	const thumbnailInitializers = [];
	// Initialize nested sliders together so thumbnail snapshots include their final markup.
	[ root, ...root.querySelectorAll( ROOT_SELECTOR ) ].forEach(
		( element ) => {
			// A preceding initialization may remove duplicate tracks and their nested sliders.
			if (
				element.isConnected &&
				! element.closest( THUMBNAIL_PREVIEW_SELECTOR )
			) {
				const initializeThumbnails = initializeSwiper( element );
				if ( initializeThumbnails ) {
					thumbnailInitializers.push( () => {
						initializeThumbnails();
						// Mark nested sliders before a parent's thumbnails clone their markup.
						element.setAttribute( 'data-unitone-swiper-ready', '' );
					} );
				}
			}
		}
	);
	thumbnailInitializers.reverse().forEach( ( initialize ) => initialize() );
};

export const initializeSwipersWhenVisible = ( initializeSwiper ) => {
	const roots = Array.from(
		document.querySelectorAll( ROOT_SELECTOR )
	).filter(
		( root ) =>
			! root.parentElement?.closest( ROOT_SELECTOR ) &&
			! root.closest( THUMBNAIL_PREVIEW_SELECTOR )
	);
	if ( ! roots.length ) {
		return;
	}

	if ( ! window.IntersectionObserver ) {
		roots.forEach( ( root ) => initializeTree( root, initializeSwiper ) );
		return;
	}

	const pending = new Map();

	const initialize = ( root ) => {
		const onFocus = pending.get( root );
		if ( ! onFocus ) {
			return;
		}
		pending.delete( root );
		observer.unobserve( root );
		root.removeEventListener( 'focusin', onFocus );
		if ( ! pending.size ) {
			observer.disconnect();
		}
		initializeTree( root, initializeSwiper );
	};

	const observer = new window.IntersectionObserver(
		( entries ) => {
			entries.forEach( ( entry ) => {
				if ( entry.isIntersecting ) {
					initialize( entry.target );
				}
			} );
		},
		// Start just before scrolling reveals the slider, without initializing the whole page.
		{ rootMargin: '300px 0px' }
	);

	roots.forEach( ( root ) => {
		const onFocus = () => initialize( root );
		pending.set( root, onFocus );
		root.addEventListener( 'focusin', onFocus );
		observer.observe( root );
	} );
};
