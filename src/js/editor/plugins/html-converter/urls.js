const PROTOCOLS = {
	image: [ 'http:', 'https:' ],
	link: [ 'http:', 'https:', 'mailto:', 'tel:' ],
	preview: [ 'http:', 'https:' ],
};

export function isSafeURL( value, context ) {
	if ( typeof value !== 'string' || ! value.trim() ) {
		return false;
	}

	try {
		const url = new URL( value, document.baseURI );
		if ( PROTOCOLS[ context ]?.includes( url.protocol ) ) {
			return true;
		}

		if ( context === 'image' ) {
			if ( url.protocol === 'blob:' ) {
				return url.origin === new URL( document.baseURI ).origin;
			}

			// Raster data URLs are image-only; HTML and SVG must not become links.
			return /^data:image\/(?:png|jpe?g|gif|webp|avif);base64,[a-z0-9+/=\s]+$/i.test(
				value
			);
		}
	} catch {
		return false;
	}

	return false;
}

export const getPreviewURL = ( value ) =>
	isSafeURL( value, 'preview' ) ? value : undefined;
