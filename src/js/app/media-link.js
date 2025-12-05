/**
 * Media link.
 */
document.addEventListener( 'DOMContentLoaded', () => {
	const getMediaTypeFromDataset = ( target ) => {
		const datasetType = target?.dataset?.unitoneMediaType;
		if ( 'video' === datasetType || 'embed' === datasetType ) {
			return datasetType;
		}
		return 'image';
	};

	const resetFigure = ( figure ) => {
		if ( ! figure ) {
			return;
		}

		while ( figure.firstChild ) {
			const child = figure.firstChild;
			if ( child.tagName === 'VIDEO' ) {
				child.pause();
				child.removeAttribute( 'src' );
				child.load();
			}
			figure.removeChild( child );
		}
	};

	const createMediaElement = ( { url, type, alt, width, height } ) => {
		const isVideo = type === 'video';
		const element = document.createElement( isVideo ? 'video' : 'img' );
		element.src = url;

		if ( isVideo ) {
			element.controls = true;
			element.playsInline = true;
			element.preload = 'metadata';
		} else {
			element.decoding = 'async';
			element.loading = 'lazy';
		}

		if ( width ) {
			element.setAttribute( 'width', width );
		}

		if ( height ) {
			element.setAttribute( 'height', height );
		}

		if ( alt ) {
			if ( isVideo ) {
				element.setAttribute( 'aria-label', alt );
			} else {
				element.alt = alt;
			}
		}

		return element;
	};

	const overlay = document.querySelector( '.unitone-lightbox-overlay' );
	if ( ! overlay ) {
		return;
	}

	const preloadContainer = overlay.ownerDocument?.querySelector(
		'.unitone-lightbox-embed-preload'
	);

	const findPreloadedEmbed = ( url ) => {
		if ( ! preloadContainer || ! url ) {
			return null;
		}

		if ( typeof window.CSS?.escape === 'function' ) {
			return preloadContainer.querySelector(
				`.unitone-lightbox-embed-container__embed[data-unitone-embed-url="${ window.CSS.escape(
					url
				) }"]`
			);
		}

		const children = preloadContainer.querySelectorAll(
			'.unitone-lightbox-embed-container__embed[data-unitone-embed-url]'
		);
		for ( const node of children ) {
			if ( node.dataset.unitoneEmbedUrl === url ) {
				return node;
			}
		}

		return null;
	};

	const scrim = overlay.querySelector( '.scrim' );
	const closeButton = overlay.querySelector( '.close-button' );
	const lightboxImageContainer = overlay.querySelector(
		'.lightbox-image-container:not(.unitone-lightbox-embed-container)'
	);
	const lightboxFigure = overlay.querySelector(
		'.lightbox-image-container > figure'
	);
	const lightboxEmbedContainer = overlay.querySelector(
		'.unitone-lightbox-embed-container'
	);
	const embedWrapper = overlay.querySelector(
		'.unitone-lightbox-embed-container__inner'
	);

	const parseDimensionValue = ( value ) => {
		if ( value === undefined || value === null || value === '' ) {
			return null;
		}

		const parsed = Number( value );
		return Number.isFinite( parsed ) && parsed > 0 ? parsed : null;
	};

	const getRatio = ( width, height ) => {
		return ! width || ! height ? 1 : width / height;
	};

	const LIGHTBOX_STYLE_PROPERTIES = [
		'--wp--lightbox-initial-top-position',
		'--wp--lightbox-initial-left-position',
		'--wp--lightbox-container-width',
		'--wp--lightbox-container-height',
		'--wp--lightbox-image-width',
		'--wp--lightbox-image-height',
		'--wp--lightbox-scale',
		'--wp--lightbox-scrollbar-width',
	];

	const resetOverlayStyles = () => {
		LIGHTBOX_STYLE_PROPERTIES.forEach( ( property ) => {
			overlay.style.removeProperty( property );
		} );
	};

	const resetEmbed = () => {
		if ( ! embedWrapper ) {
			return;
		}
		while ( embedWrapper.firstChild ) {
			embedWrapper.removeChild( embedWrapper.firstChild );
		}
	};

	const setOverlayMode = ( type ) => {
		const isEmbed = type === 'embed';

		if ( lightboxImageContainer ) {
			if ( isEmbed ) {
				lightboxImageContainer.setAttribute( 'hidden', '' );
			} else {
				lightboxImageContainer.removeAttribute( 'hidden' );
			}
		}

		if ( lightboxEmbedContainer ) {
			if ( isEmbed ) {
				lightboxEmbedContainer.removeAttribute( 'hidden' );
			} else {
				lightboxEmbedContainer.setAttribute( 'hidden', '' );
			}
		}

		overlay.classList.toggle( 'unitone-lightbox-overlay--embed', isEmbed );
		overlay.classList.toggle(
			'unitone-lightbox-overlay--media',
			! isEmbed
		);
	};

	const calculateOverlayStyleValues = ( media ) => {
		const screenPosX = 0;
		const screenPosY = 0;
		let originalWidth = parseDimensionValue( media.width );
		let originalHeight = parseDimensionValue( media.height );

		if ( ! originalWidth && ! originalHeight ) {
			originalWidth = 1;
			originalHeight = 1;
		} else if ( originalWidth && ! originalHeight ) {
			originalHeight = originalWidth;
		} else if ( ! originalWidth && originalHeight ) {
			originalWidth = originalHeight;
		}

		const originalRatio = getRatio( originalWidth, originalHeight );
		const naturalWidth = originalWidth;
		const naturalHeight = originalHeight;
		const naturalRatio = originalRatio;

		let imgMaxWidth = Math.max( naturalWidth || originalWidth, 1 );
		let imgMaxHeight = Math.max( naturalHeight || originalHeight, 1 );
		let imgRatio = getRatio( imgMaxWidth, imgMaxHeight );
		let containerMaxWidth = imgMaxWidth;
		let containerMaxHeight = imgMaxHeight;
		let containerWidth = imgMaxWidth;
		let containerHeight = imgMaxHeight;

		if ( naturalRatio.toFixed( 2 ) !== imgRatio.toFixed( 2 ) ) {
			if ( naturalRatio > imgRatio ) {
				const reducedHeight = imgMaxWidth / naturalRatio;
				if ( imgMaxHeight - reducedHeight > imgMaxWidth ) {
					imgMaxHeight = reducedHeight;
					imgMaxWidth = reducedHeight * naturalRatio;
				} else {
					imgMaxHeight = imgMaxWidth / naturalRatio;
				}
			} else {
				const reducedWidth = imgMaxHeight * naturalRatio;
				if ( imgMaxWidth - reducedWidth > imgMaxHeight ) {
					imgMaxWidth = reducedWidth;
					imgMaxHeight = reducedWidth / naturalRatio;
				} else {
					imgMaxWidth = imgMaxHeight * naturalRatio;
				}
			}

			containerWidth = imgMaxWidth;
			containerHeight = imgMaxHeight;
			imgRatio = getRatio( imgMaxWidth, imgMaxHeight );

			if ( originalRatio > imgRatio ) {
				containerMaxWidth = imgMaxWidth;
				containerMaxHeight = containerMaxWidth / ( originalRatio || 1 );
			} else {
				containerMaxHeight = imgMaxHeight;
				containerMaxWidth = containerMaxHeight * ( originalRatio || 1 );
			}
		}

		if (
			originalWidth > containerWidth ||
			originalHeight > containerHeight
		) {
			containerWidth = originalWidth;
			containerHeight = originalHeight;
		}

		const ownerDocument = overlay.ownerDocument || window.document;
		const documentElement = ownerDocument?.documentElement;
		const viewportWidth =
			window.innerWidth || documentElement?.clientWidth || containerWidth;
		const viewportHeight =
			window.innerHeight ||
			documentElement?.clientHeight ||
			containerHeight;

		let horizontalPadding = 0;
		if ( viewportWidth > 1920 ) {
			horizontalPadding = 160;
		} else if ( viewportWidth > 480 ) {
			horizontalPadding = 80;
		}
		const verticalPadding = 80;

		const paddedViewportWidth = Math.max(
			viewportWidth - horizontalPadding,
			0
		);
		const paddedViewportHeight = Math.max(
			viewportHeight - verticalPadding,
			0
		);

		const targetMaxWidth = Math.min( paddedViewportWidth, containerWidth );
		const targetMaxHeight = Math.min(
			paddedViewportHeight,
			containerHeight
		);
		const effectiveTargetWidth = targetMaxWidth || containerWidth;
		const effectiveTargetHeight = targetMaxHeight || containerHeight;
		const targetRatio = getRatio(
			effectiveTargetWidth,
			effectiveTargetHeight
		);

		let finalContainerWidth = effectiveTargetWidth;
		let finalContainerHeight = effectiveTargetHeight;
		if ( originalRatio > targetRatio ) {
			finalContainerWidth = effectiveTargetWidth;
			finalContainerHeight = finalContainerWidth / ( originalRatio || 1 );
		} else {
			finalContainerHeight = effectiveTargetHeight;
			finalContainerWidth = finalContainerHeight * ( originalRatio || 1 );
		}

		const containerScale = finalContainerWidth
			? originalWidth / finalContainerWidth
			: 1;
		const normalizedScale = Number.isFinite( containerScale )
			? containerScale
			: 1;
		const widthScale = containerMaxWidth
			? finalContainerWidth / containerMaxWidth
			: 1;
		const heightScale = containerMaxHeight
			? finalContainerHeight / containerMaxHeight
			: 1;
		const lightboxImgWidth = imgMaxWidth * widthScale;
		const lightboxImgHeight = imgMaxHeight * heightScale;
		const scrollbarWidth = Math.max(
			( window.innerWidth || viewportWidth ) -
				( documentElement?.clientWidth || viewportWidth ),
			0
		);

		return {
			'--wp--lightbox-initial-top-position': `${ screenPosY }px`,
			'--wp--lightbox-initial-left-position': `${ screenPosX }px`,
			'--wp--lightbox-container-width': `${ finalContainerWidth + 1 }px`,
			'--wp--lightbox-container-height': `${
				finalContainerHeight + 1
			}px`,
			'--wp--lightbox-image-width': `${ lightboxImgWidth }px`,
			'--wp--lightbox-image-height': `${ lightboxImgHeight }px`,
			'--wp--lightbox-scale': `${ normalizedScale }`,
			'--wp--lightbox-scrollbar-width': `${ scrollbarWidth }px`,
		};
	};

	const applyOverlayStyles = ( media ) => {
		if ( ! overlay?.style ) {
			return;
		}
		resetOverlayStyles();
		const styles = calculateOverlayStyleValues( media );
		Object.entries( styles ).forEach( ( [ property, value ] ) => {
			if ( value === null || value === undefined || value === '' ) {
				return;
			}
			overlay.style.setProperty( property, value );
		} );
	};

	let returnFocusTo = null;

	const closeOverlay = () => {
		overlay.classList.remove( 'active' );
		overlay.removeAttribute( 'aria-modal' );
		overlay.removeAttribute( 'role' );
		resetFigure( lightboxFigure );
		resetOverlayStyles();
		resetEmbed();
		setOverlayMode( 'media' );

		if ( returnFocusTo ) {
			returnFocusTo.focus();
		}

		returnFocusTo = null;
	};

	const openOverlay = async ( media ) => {
		if ( ! media?.url ) {
			return;
		}

		const ownerDocument = overlay.ownerDocument || window.document;
		const activeElement =
			ownerDocument?.activeElement &&
			ownerDocument.activeElement !== ownerDocument.body
				? ownerDocument.activeElement
				: null;

		returnFocusTo = activeElement;

		if ( media.type === 'embed' ) {
			resetOverlayStyles();
			resetFigure( lightboxFigure );
			resetEmbed();
			setOverlayMode( 'embed' );

			overlay.classList.add( 'active' );
			overlay.setAttribute( 'aria-modal', 'true' );
			overlay.setAttribute( 'role', 'dialog' );

			const preloadedNode = findPreloadedEmbed( media.url );
			const iframe = preloadedNode?.querySelector( 'iframe' );
			const newMedia = {
				...media,
				width: iframe?.getAttribute( 'width' ),
				height: iframe?.getAttribute( 'height' ),
			};

			if ( !! newMedia?.width && !! newMedia?.height ) {
				lightboxEmbedContainer.classList.remove( 'indeterminate-size' );
				applyOverlayStyles( newMedia );
			} else {
				lightboxEmbedContainer.classList.add( 'indeterminate-size' );
			}

			if ( embedWrapper ) {
				resetEmbed();

				if ( !! preloadedNode ) {
					const clone = preloadedNode.cloneNode( true );
					embedWrapper.appendChild( clone );
				} else {
					const fallback = document.createElement( 'div' );
					const fallbackText = document.createElement( 'p' );
					fallbackText.textContent = 'Unable to load embed.';
					fallback.appendChild( fallbackText );

					const fallbackLink = document.createElement( 'a' );
					fallbackLink.href = media.url;
					fallbackLink.target = '_blank';
					fallbackLink.rel = 'noopener';
					fallbackLink.textContent = media.url;
					fallback.appendChild( fallbackLink );

					embedWrapper.appendChild( fallback );
				}
			}

			if ( closeButton ) {
				overlay.focus();
			}

			return;
		}

		setOverlayMode( 'media' );
		applyOverlayStyles( media );

		resetFigure( lightboxFigure );
		if ( lightboxFigure ) {
			const element = createMediaElement( media );
			lightboxFigure.appendChild( element );
		}

		overlay.classList.add( 'active' );
		overlay.setAttribute( 'aria-modal', 'true' );
		overlay.setAttribute( 'role', 'dialog' );

		if ( closeButton ) {
			overlay.focus();
		}
	};

	document.addEventListener( 'click', ( event ) => {
		const link = event.target.closest( '.unitone-media-link' );
		if ( ! link ) {
			return;
		}

		event.preventDefault();

		const url = link.getAttribute( 'href' );
		if ( ! url ) {
			return;
		}

		const alt =
			link.dataset.unitoneMediaAlt || link.textContent?.trim() || '';
		const width = link.dataset.unitoneMediaWidth || '';
		const height = link.dataset.unitoneMediaHeight || '';

		void openOverlay( {
			url,
			type: getMediaTypeFromDataset( link ),
			alt,
			width,
			height,
		} );
	} );

	[ scrim, closeButton ].forEach( ( element ) => {
		if ( element ) {
			element.addEventListener( 'click', closeOverlay );
		}
	} );

	window.addEventListener( 'keydown', ( event ) => {
		if ( ! overlay.classList.contains( 'active' ) ) {
			return;
		}

		if ( event.defaultPrevented ) {
			return;
		}

		if ( event.key === 'Escape' ) {
			event.preventDefault();
			closeOverlay();
			return;
		}

		if ( event.key === 'Tab' ) {
			event.preventDefault();

			if ( closeButton ) {
				closeButton.focus();
			}
		}
	} );
} );
