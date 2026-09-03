import { getCSSValueFromRawStyle } from '@wordpress/style-engine';

/**
 * Returns the current background gradient as a CSS value.
 *
 * The legacy color support stores preset gradients in the top-level
 * `gradient` attribute and custom gradients in `style.color.gradient`.
 * Background gradient support stores both in `style.background.gradient`.
 *
 * @param {Object} attributes Block attributes.
 * @return {string|undefined} Resolved gradient value.
 */
export function getBackgroundGradientCSSValue( attributes ) {
	if ( null != attributes?.style?.background?.gradient ) {
		return getCSSValueFromRawStyle( attributes.style.background.gradient );
	}

	if ( attributes?.gradient ) {
		return `var(--wp--preset--gradient--${ attributes.gradient })`;
	}

	return getCSSValueFromRawStyle( attributes?.style?.color?.gradient );
}
