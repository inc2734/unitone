import { getCSSRules, getCSSValueFromRawStyle } from '@wordpress/style-engine';

/**
 * Returns the current background gradient as a raw style value.
 *
 * @param {Object} attributes Block attributes.
 * @return {string|undefined} Raw gradient value.
 */
function getBackgroundGradientRawValue( attributes ) {
	if ( null != attributes?.style?.background?.gradient ) {
		return attributes.style.background.gradient;
	}

	if ( attributes?.gradient ) {
		return `var:preset|gradient|${ attributes.gradient }`;
	}

	return attributes?.style?.color?.gradient;
}

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
	return getCSSValueFromRawStyle(
		getBackgroundGradientRawValue( attributes )
	);
}

/**
 * Returns CSS custom properties used to move background styles from a block's
 * wrapper to its inner content element.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Background CSS custom properties.
 */
export function getBackgroundCSSVariables( attributes ) {
	const background = {
		...attributes?.style?.background,
		gradient: getBackgroundGradientRawValue( attributes ),
	};
	const rules = getCSSRules( { background } );
	const getRuleValue = ( key ) =>
		rules.find( ( rule ) => rule.key === key )?.value;

	return {
		'--unitone--background-image': getRuleValue( 'backgroundImage' ),
		'--unitone--background-position': getRuleValue( 'backgroundPosition' ),
		'--unitone--background-repeat': getRuleValue( 'backgroundRepeat' ),
		'--unitone--background-size': getRuleValue( 'backgroundSize' ),
		'--unitone--background-attachment': getRuleValue(
			'backgroundAttachment'
		),
	};
}
