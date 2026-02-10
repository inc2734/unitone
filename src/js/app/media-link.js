document.addEventListener( 'DOMContentLoaded', () => {
	/**
	 * Parse a dimension value into a positive number.
	 *
	 * @param {unknown} value Raw value.
	 * @return {number|null} Positive number or null.
	 */
	const parseDimensionValue = ( value ) => {
		const parsed = Number( value );
		return Number.isFinite( parsed ) && parsed > 0 ? parsed : null;
	};

	/**
	 * Calculate aspect ratio.
	 *
	 * @param {number} width  Width.
	 * @param {number} height Height.
	 * @return {number} Ratio.
	 */
	const getRatio = ( width, height ) =>
		! width || ! height ? 1 : width / height;

	/**
	 * Reset container contents and stop media playback.
	 *
	 * @param {HTMLElement|null} container Container element.
	 */
	const resetContainer = ( container ) => {
		if ( ! container ) {
			return;
		}

		const mediaElements = container.querySelectorAll( 'video, audio' );
		mediaElements.forEach( ( media ) => {
			media.pause();
			media.removeAttribute( 'src' );
			media.load();
		} );

		container.replaceChildren();
	};

	/**
	 * Calculate overlay style variables for the media.
	 *
	 * @param {Object} media Media data.
	 * @return {Object} CSS custom properties map.
	 */
	const calculateStyles = ( media ) => {
		const docEl = document.documentElement;

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

		let imgMaxWidth = Math.max( originalWidth, 1 );
		let imgMaxHeight = Math.max( originalHeight, 1 );
		let imgRatio = getRatio( imgMaxWidth, imgMaxHeight );
		let containerMaxWidth = imgMaxWidth;
		let containerMaxHeight = imgMaxHeight;

		if ( originalRatio.toFixed( 2 ) !== imgRatio.toFixed( 2 ) ) {
			if ( originalRatio > imgRatio ) {
				const reducedHeight = imgMaxWidth / originalRatio;
				if ( imgMaxHeight - reducedHeight > imgMaxWidth ) {
					imgMaxHeight = reducedHeight;
					imgMaxWidth = reducedHeight * originalRatio;
				} else {
					imgMaxHeight = imgMaxWidth / originalRatio;
				}
			} else {
				const reducedWidth = imgMaxHeight * originalRatio;
				if ( imgMaxWidth - reducedWidth > imgMaxHeight ) {
					imgMaxWidth = reducedWidth;
					imgMaxHeight = reducedWidth / originalRatio;
				} else {
					imgMaxWidth = imgMaxHeight * originalRatio;
				}
			}

			imgRatio = getRatio( imgMaxWidth, imgMaxHeight );

			if ( originalRatio > imgRatio ) {
				containerMaxWidth = imgMaxWidth;
				containerMaxHeight = containerMaxWidth / ( originalRatio || 1 );
			} else {
				containerMaxHeight = imgMaxHeight;
				containerMaxWidth = containerMaxHeight * ( originalRatio || 1 );
			}
		}

		const containerWidth = Math.max( originalWidth, containerMaxWidth );
		const containerHeight = Math.max( originalHeight, containerMaxHeight );

		const viewportWidth =
			window.innerWidth || docEl?.clientWidth || containerWidth;
		const viewportHeight =
			window.innerHeight || docEl?.clientHeight || containerHeight;

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
			finalContainerHeight = finalContainerWidth / ( originalRatio || 1 );
		} else {
			finalContainerWidth = finalContainerHeight * ( originalRatio || 1 );
		}

		const containerScale = finalContainerWidth
			? originalWidth / finalContainerWidth
			: 1;
		const normalizedScale = Number.isFinite( containerScale )
			? containerScale
			: 1;

		const scrollbarWidth = Math.max(
			( window.innerWidth || viewportWidth ) -
				( docEl?.clientWidth || viewportWidth ),
			0
		);

		return {
			'--wp--lightbox-initial-top-position': '0px',
			'--wp--lightbox-initial-left-position': '0px',
			'--wp--lightbox-container-width': `${ finalContainerWidth + 1 }px`,
			'--wp--lightbox-container-height': `${
				finalContainerHeight + 1
			}px`,
			'--wp--lightbox-image-width': `${
				imgMaxWidth *
				( containerMaxWidth
					? finalContainerWidth / containerMaxWidth
					: 1 )
			}px`,
			'--wp--lightbox-image-height': `${
				imgMaxHeight *
				( containerMaxHeight
					? finalContainerHeight / containerMaxHeight
					: 1 )
			}px`,
			'--wp--lightbox-scale': `${ normalizedScale }`,
			'--wp--lightbox-scrollbar-width': `${ scrollbarWidth }px`,
		};
	};

	/**
	 * Apply calculated overlay styles.
	 *
	 * @param {HTMLElement} overlay Overlay element.
	 * @param {Object}      media   Media data.
	 */
	const applyOverlayStyles = ( overlay, media ) => {
		const styles = calculateStyles( media );
		[
			'initial-top-position',
			'initial-left-position',
			'container-width',
			'container-height',
			'image-width',
			'image-height',
			'scale',
			'scrollbar-width',
		].forEach( ( prop ) =>
			overlay.style.removeProperty( `--wp--lightbox-${ prop }` )
		);

		Object.entries( styles ).forEach( ( [ prop, value ] ) => {
			if ( value !== null && value !== undefined ) {
				overlay.style.setProperty( prop, value );
			}
		} );
	};

	const templateOverlay = document.querySelector(
		'.unitone-lightbox-overlay'
	);
	if ( ! templateOverlay ) {
		return;
	}

	let activeOverlay = null;
	let returnFocusTo = null;

	/**
	 * Close the active overlay and clean up.
	 */
	const closeOverlay = () => {
		if ( ! activeOverlay ) {
			return;
		}

		const inners = activeOverlay.querySelectorAll(
			'.unitone-lightbox-container__inner'
		);
		inners.forEach( resetContainer );
		activeOverlay.classList.remove( 'active' );
		activeOverlay.remove();
		activeOverlay = null;

		if ( returnFocusTo ) {
			returnFocusTo.focus();
		}

		returnFocusTo = null;
	};

	/**
	 * Open the overlay with the provided media data.
	 *
	 * @param {Object} media Media data.
	 */
	const openOverlay = ( media ) => {
		if ( ! media.url && media.type !== 'target' ) {
			return;
		}

		const active = document.activeElement; // eslint-disable-line @wordpress/no-global-active-element

		returnFocusTo = active && active !== document.body ? active : null;

		const overlay = activeOverlay;
		if ( ! overlay ) {
			return;
		}

		const lightboxMediaContainer = overlay.querySelector(
			'.unitone-lightbox-media-container'
		);
		const lightboxEmbedContainer = overlay.querySelector(
			'.unitone-lightbox-embed-container'
		);
		const lightboxTargetContainer = overlay.querySelector(
			'.unitone-lightbox-target-container'
		);
		const mediaInner = overlay.querySelector(
			'.unitone-lightbox-media-container__inner'
		);
		const embedInner = overlay.querySelector(
			'.unitone-lightbox-embed-container__inner'
		);
		const targetInner = overlay.querySelector(
			'.unitone-lightbox-target-container__inner'
		);

		const isEmbed = media.type === 'embed';
		const isTarget = media.type === 'target';

		if ( lightboxMediaContainer ) {
			lightboxMediaContainer.hidden = isEmbed || isTarget;
		}
		if ( lightboxEmbedContainer ) {
			lightboxEmbedContainer.hidden = ! isEmbed;
		}
		if ( lightboxTargetContainer ) {
			lightboxTargetContainer.hidden = ! isTarget;
		}

		overlay.classList.toggle( 'unitone-lightbox-overlay--embed', isEmbed );
		overlay.classList.toggle(
			'unitone-lightbox-overlay--media',
			! isEmbed && ! isTarget
		);
		overlay.classList.toggle(
			'unitone-lightbox-overlay--target',
			isTarget
		);

		[ mediaInner, embedInner, targetInner ].forEach( resetContainer );

		/**
		 * Apply media contents.
		 */
		const applyMediaContents = () => {
			applyOverlayStyles( overlay, media );
			const isVideo = media.type === 'video';
			const element = document.createElement( isVideo ? 'video' : 'img' );
			element.src = media.url;

			if ( isVideo ) {
				element.controls = true;
				element.playsInline = true;
				element.preload = 'metadata';
				if ( media.alt ) {
					element.setAttribute( 'aria-label', media.alt );
				}
			} else {
				element.decoding = 'async';
				element.loading = 'lazy';
				if ( media.alt ) {
					element.alt = media.alt;
				}
			}

			if ( media.width ) {
				element.setAttribute( 'width', media.width );
			}
			if ( media.height ) {
				element.setAttribute( 'height', media.height );
			}

			if ( mediaInner ) {
				mediaInner.appendChild( element );
			}
		};

		/**
		 * Apply embed contents.
		 */
		const applyEmbedContents = () => {
			const preloadContainer = document.querySelector(
				'.unitone-lightbox-embed-preload'
			);
			if ( ! preloadContainer ) {
				return;
			}

			const node = preloadContainer.querySelector(
				`[data-unitone-embed-url="${ window.CSS.escape( media.url ) }"]`
			);
			if ( ! node ) {
				if ( embedInner ) {
					embedInner.innerHTML = `<div><p>Unable to load embed.</p><a href="${ media.url }" target="_blank" rel="noopener">${ media.url }</a></div>`;
				}
				return;
			}

			const iframe = node.querySelector( 'iframe' );
			const width = iframe?.getAttribute( 'width' );
			const height = iframe?.getAttribute( 'height' );

			if ( width && height ) {
				lightboxEmbedContainer.classList.remove( 'indeterminate-size' );
				applyOverlayStyles( overlay, { ...media, width, height } );
			} else {
				lightboxEmbedContainer.classList.add( 'indeterminate-size' );
			}
			if ( embedInner ) {
				embedInner.appendChild( node.cloneNode( true ) );
			}
		};

		/**
		 * Apply target contents.
		 */
		const applyTargetContents = () => {
			const targetId = media.targetId?.trim();
			const targetElement = targetId
				? document.getElementById( targetId )
				: null;

			if (
				targetElement &&
				! targetElement.closest( '.unitone-lightbox-overlay' )
			) {
				const clone = targetElement.cloneNode( true );
				clone.removeAttribute( 'id' );
				clone
					.querySelectorAll( '[id]' )
					.forEach( ( n ) => n.removeAttribute( 'id' ) );
				if ( targetInner ) {
					targetInner.appendChild( clone );
				}
			} else if ( targetInner ) {
				targetInner.innerHTML =
					'<div><p>Unable to find target element.</p></div>';
			}
		};

		if ( isEmbed ) {
			applyEmbedContents();
		} else if ( isTarget ) {
			applyTargetContents();
		} else {
			applyMediaContents();
		}

		overlay.classList.add( 'active' );
		overlay.setAttribute( 'aria-modal', 'true' );
		overlay.setAttribute( 'role', 'dialog' );
		overlay.focus();
	};

	document.addEventListener( 'focusin', ( event ) => {
		const overlay = activeOverlay;
		if ( ! overlay ) {
			return;
		}

		if ( ! overlay.contains( event.target ) ) {
			const closeButton = overlay.querySelector( '.close-button' );
			closeButton.focus();
		}
	} );

	document.addEventListener( 'click', ( event ) => {
		const link = event.target.closest( '.unitone-media-link' );
		if ( ! link ) {
			return;
		}

		event.preventDefault();
		const ds = link.dataset;

		let mediaType = 'image';
		if ( [ 'video', 'embed', 'target' ].includes( ds.unitoneMediaType ) ) {
			mediaType = ds.unitoneMediaType;
		}

		const overlayClone = templateOverlay.cloneNode( true );
		overlayClone.classList.remove( 'active' );
		overlayClone.setAttribute( 'tabindex', '-1' );
		overlayClone.removeAttribute( 'aria-hidden' );

		link.insertAdjacentElement( 'afterend', overlayClone );
		activeOverlay = overlayClone;

		const scrim = overlayClone.querySelector( '.scrim' );
		const closeButton = overlayClone.querySelector( '.close-button' );
		[ scrim, closeButton ].forEach( ( el ) =>
			el?.addEventListener( 'click', closeOverlay )
		);

		const targetContainers = overlayClone.querySelectorAll(
			'.unitone-lightbox-container'
		);
		if ( 0 < targetContainers.length ) {
			targetContainers.forEach( ( targetContainer ) => {
				targetContainer.addEventListener(
					'click',
					( targetContainerEvent ) => {
						if ( targetContainerEvent.target === targetContainer ) {
							closeOverlay();
						}
					}
				);

				const targetInner = targetContainer.querySelector(
					'.unitone-lightbox-container__inner'
				);
				if ( targetInner ) {
					targetInner.addEventListener(
						'click',
						( targetInnerEvent ) => {
							if ( targetInnerEvent.target === targetInner ) {
								closeOverlay();
							}
						}
					);
				}
			} );
		}

		if ( mediaType === 'target' ) {
			const targetId = ds.unitoneOverlayTarget;
			if ( ! targetId ) {
				closeOverlay();
				return;
			}
			openOverlay( { type: 'target', targetId } );
		} else {
			const url = link.getAttribute( 'href' );
			if ( ! url ) {
				closeOverlay();
				return;
			}
			openOverlay( {
				url,
				type: mediaType,
				alt: ds.unitoneMediaAlt || link.textContent?.trim() || '',
				width: ds.unitoneMediaWidth || '',
				height: ds.unitoneMediaHeight || '',
			} );
		}
	} );

	window.addEventListener( 'keydown', ( event ) => {
		if (
			activeOverlay?.classList.contains( 'active' ) &&
			event.key === 'Escape'
		) {
			event.preventDefault();
			closeOverlay();
		}
	} );
} );
