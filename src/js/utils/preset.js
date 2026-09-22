/**
 * Match WordPress's _wp_to_kebab_case(), including non-ASCII slugs.
 *
 * @param {string} slug Saved preset identifier.
 * @return {string} CSS identifier, without changing the saved slug.
 */
export function getPresetSlug( slug ) {
	if ( 'string' !== typeof slug ) {
		return slug;
	}

	// Keep the word boundaries aligned with wp-includes/functions.php.
	const lowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff';
	const upperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde';
	const lower = `[${ lowerRange }]`;
	const upper = `[${ upperRange }]`;
	const breaks =
		'\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\v\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u202f\\u205f\\u3000';
	const misc = `[^${ breaks }\\d${ lowerRange }${ upperRange }]`;
	const miscLower = `(?:${ lower }|${ misc })`;
	const miscUpper = `(?:${ upper }|${ misc })`;
	const words = new RegExp(
		[
			`${ upper }?${ lower }+(?=[${ breaks }]|${ upper }|$)`,
			`${ miscUpper }+(?=[${ breaks }]|${ upper }${ miscLower }|$)`,
			`${ upper }?${ miscLower }+`,
			`${ upper }+`,
			'\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
			'\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
			'\\d+',
		].join( '|' ),
		'gu'
	);

	return ( slug.replace( /'/g, '' ).match( words ) ?? [] )
		.join( '-' )
		.replace( /[A-Z]/g, ( letter ) => letter.toLowerCase() );
}

/**
 * Create a CSS reference without changing the palette's saved identifier.
 *
 * @param {string} type Preset type.
 * @param {string} slug Saved preset identifier.
 * @return {string} CSS variable reference.
 */
export function getPresetCssVarFromSlug( type, slug ) {
	return `var(--wp--preset--${ getPresetSlug( type ) }--${ getPresetSlug(
		slug
	) })`;
}

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

	const slug = value.match( /^var:preset\|([^|]+)\|([^|]+)$/ );
	if ( ! slug ) {
		return value;
	}

	return getPresetCssVarFromSlug( slug[ 1 ], slug[ 2 ] );
}
