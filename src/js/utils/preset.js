/**
 * Converts a preset value into a custom value.
 *
 * @param {string} value Value to convert.
 * @return {string | undefined} CSS var string for given preset value.
 */
export function getPresetCssVar( value ) {
	if ( null == value ) {
		return undefined;
	}

	if ( 'string' !== typeof value ) {
		return value;
	}

	const slug = value.match( /^var:preset\|(.+)$/ );
	if ( ! slug ) {
		return value;
	}

	return `var(--wp--preset--${ slug[ 1 ].replace( /\|/g, '--' ) })`;
}
