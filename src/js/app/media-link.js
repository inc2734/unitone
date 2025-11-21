/**
 * Media link.
 */
document.addEventListener( 'DOMContentLoaded', () => {
	const getMediaTypeFromDataset = ( target ) =>
		target?.dataset?.unitoneMediaType === 'video' ? 'video' : 'image';

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

	const createMediaElement = ( { url, type, alt } ) => {
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

	const scrim = overlay.querySelector( '.scrim' );
	const closeButton = overlay.querySelector( '.close-button' );
	const figures = overlay.querySelectorAll(
		'.lightbox-image-container > figure'
	);

	let returnFocusTo = null;

	const closeOverlay = () => {
		overlay.classList.remove( 'active' );
		overlay.removeAttribute( 'aria-modal' );
		overlay.removeAttribute( 'role' );
		figures.forEach( ( figure ) => resetFigure( figure ) );

		if ( returnFocusTo ) {
			returnFocusTo.focus();
		}

		returnFocusTo = null;
	};

	const openOverlay = ( media ) => {
		if ( ! media?.url ) {
			return;
		}

		figures.forEach( ( figure ) => {
			resetFigure( figure );
			const element = createMediaElement( media );
			figure.appendChild( element );
		} );

		const ownerDocument = overlay.ownerDocument || window.document;
		const activeElement =
			ownerDocument?.activeElement &&
			ownerDocument.activeElement !== ownerDocument.body
				? ownerDocument.activeElement
				: null;

		returnFocusTo = activeElement;

		overlay.classList.add( 'active' );
		overlay.setAttribute( 'aria-modal', 'true' );
		overlay.setAttribute( 'role', 'dialog' );

		if ( closeButton ) {
			overlay.focus();
		}
	};

	const targets = document.querySelectorAll( '.unitone-media-link' );
	targets.forEach( ( target ) => {
		target.addEventListener( 'click', ( event ) => {
			event.preventDefault();

			const url = target.getAttribute( 'href' );
			if ( ! url ) {
				return;
			}

			const alt =
				target.dataset.unitoneMediaAlt ||
				target.textContent?.trim() ||
				'';

			openOverlay( {
				url,
				type: getMediaTypeFromDataset( target ),
				alt,
			} );
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
