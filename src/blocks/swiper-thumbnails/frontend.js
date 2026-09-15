import { __ } from '@wordpress/i18n';

export const THUMBNAIL_PREVIEW_SELECTOR = '.unitone-swiper-thumbnails__preview';

let previewId = 0;

const createPreview = ( slide ) => {
	const clone = slide.cloneNode( true );
	const prefix = `unitone-swiper-thumbnail-${ ++previewId }-`;
	const elements = [ clone, ...clone.querySelectorAll( '*' ) ];
	const ids = new Map();

	elements.forEach( ( element ) => {
		if ( element.id ) {
			ids.set( element.id, prefix + element.id );
		}
	} );

	elements.forEach( ( element ) => {
		// Previews must not execute scripts, hydrate interactive blocks, or submit
		// duplicate form values. The separate button handles all interaction.
		if ( element.matches( 'script' ) ) {
			element.remove();
			return;
		}
		for ( const { name, value } of Array.from( element.attributes ) ) {
			if (
				name.startsWith( 'on' ) ||
				name.startsWith( 'data-wp-' ) ||
				[ 'autoplay', 'autofocus', 'name' ].includes( name )
			) {
				element.removeAttribute( name );
				continue;
			}

			// Preserve SVG references and labels without duplicating document IDs.
			let updated = value.replace(
				/url\(\s*(['"]?)#([^\s)'"\u0000]+)\1\s*\)/g,
				( match, quote, id ) =>
					ids.has( id ) ? `url(#${ ids.get( id ) })` : match
			);
			if (
				[
					'id',
					'for',
					'aria-labelledby',
					'aria-describedby',
					'aria-controls',
					'aria-owns',
					'headers',
				].includes( name )
			) {
				updated = updated
					.split( /\s+/ )
					.map( ( id ) => ids.get( id ) || id )
					.join( ' ' );
			} else if (
				[ 'href', 'xlink:href' ].includes( name ) &&
				value.startsWith( '#' )
			) {
				updated = ids.has( value.slice( 1 ) )
					? `#${ ids.get( value.slice( 1 ) ) }`
					: updated;
			}
			if ( updated !== value ) {
				element.setAttribute( name, updated );
			}
		}
	} );

	clone.classList.remove(
		'swiper-slide-active',
		'swiper-slide-prev',
		'swiper-slide-next'
	);
	return clone;
};

export const setupThumbnails = ( elements, swiper, slides ) => {
	if ( ! elements.length || ! slides.length ) {
		return;
	}

	const defaultView = swiper.el.ownerDocument.defaultView;
	// Build static previews once so resizing does not recreate their contents.
	const groups = elements.map( ( element ) => {
		const ownerDocument = element.ownerDocument;
		const items = slides.map( ( slide, index ) => {
			const item = ownerDocument.createElement( 'div' );
			item.className = 'unitone-swiper-thumbnails__item';
			const preview = ownerDocument.createElement( 'div' );
			preview.className = 'unitone-swiper-thumbnails__preview';
			preview.setAttribute( 'inert', '' );
			preview.setAttribute( 'aria-hidden', 'true' );
			// Preview typography follows its placement; only dimensions are synchronized.
			preview.append( createPreview( slide ) );

			const button = ownerDocument.createElement( 'button' );
			button.className = 'unitone-swiper-thumbnails__button';
			button.type = 'button';
			button.setAttribute(
				'aria-label',
				__( 'Go to slide {{index}}', 'unitone' ).replace(
					'{{index}}',
					index + 1
				)
			);
			button.addEventListener( 'click', () => {
				if ( swiper.destroyed ) {
					return;
				}
				if ( swiper.params.loop ) {
					swiper.slideToLoop( index );
				} else {
					swiper.slideTo( index );
				}
			} );
			item.append( preview, button );
			return { item, preview, button };
		} );
		element.replaceChildren( ...items.map( ( { item } ) => item ) );
		return { element, items };
	} );

	const updateActive = () => {
		groups.forEach( ( { items } ) =>
			items.forEach( ( { button }, index ) => {
				if ( index === swiper.realIndex ) {
					button.setAttribute( 'aria-current', 'true' );
				} else {
					button.removeAttribute( 'aria-current' );
				}
			} )
		);
	};

	let animationFrame;
	const updateLayout = () => {
		animationFrame = undefined;
		if ( swiper.destroyed ) {
			return;
		}

		// unitone's foundation uses border-box, so computed sizes include padding
		// and borders while retaining the fractional widths used by Swiper.
		const dimensions = slides.map( ( slide ) => {
			const style = defaultView.getComputedStyle( slide );
			return {
				width: Number.parseFloat( style.width ),
				height: Number.parseFloat( style.height ),
			};
		} );
		if (
			dimensions.some(
				( { width, height } ) =>
					! Number.isFinite( width ) ||
					width <= 0 ||
					! Number.isFinite( height )
			)
		) {
			return;
		}

		// Use one frame ratio for all slides, including slides of different sizes.
		// Measure the full-size slides before scaling so text never reflows to the
		// thumbnail width and the final row keeps the same size as earlier rows.
		const ratio =
			Math.max(
				...dimensions.map( ( { width, height } ) => height / width )
			) || 3 / 4;
		groups.forEach( ( { element, items } ) => {
			element.style.setProperty(
				'--unitone--thumbnail-aspect-ratio',
				`${ 1 / ratio }`
			);
			items.forEach( ( { item, preview }, index ) => {
				const { width, height } = dimensions[ index ];
				preview.style.setProperty(
					'--unitone--thumbnail-width',
					`${ width }px`
				);
				preview.style.setProperty(
					'--unitone--thumbnail-height',
					`${ height }px`
				);
				const itemStyle = defaultView.getComputedStyle( item );
				preview.style.setProperty(
					'--unitone--thumbnail-scale',
					`${ Math.min(
						1,
						Number.parseFloat( itemStyle.width ) / width,
						Number.parseFloat( itemStyle.height ) / ( height || 1 )
					) }`
				);
			} );
			element.setAttribute( 'data-unitone-swiper-thumbnails-ready', '' );
		} );
	};
	const scheduleLayout = () => {
		if ( undefined === animationFrame ) {
			animationFrame = defaultView.requestAnimationFrame( updateLayout );
		}
	};

	let resizeObserver;
	if ( defaultView.ResizeObserver ) {
		resizeObserver = new defaultView.ResizeObserver( scheduleLayout );
		[ ...elements, ...slides ].forEach( ( element ) =>
			resizeObserver.observe( element )
		);
	}
	swiper.on( 'realIndexChange', updateActive );
	swiper.on( 'resize', scheduleLayout );
	swiper.on( 'breakpoint', scheduleLayout );
	swiper.on( 'update', scheduleLayout );
	swiper.on( 'destroy', () => {
		defaultView.cancelAnimationFrame( animationFrame );
		resizeObserver?.disconnect();
		groups.forEach( ( { element } ) => {
			element.replaceChildren();
			element.removeAttribute( 'data-unitone-swiper-thumbnails-ready' );
		} );
	} );

	updateActive();
	updateLayout();
};
