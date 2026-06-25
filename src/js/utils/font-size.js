import { getPresetCssVar } from './preset';

const UNITONE_FONT_SIZE_SCALES = {
	'unitone-2-xs': -3,
	'unitone-xs': -2,
	'unitone-s': -1,
	'unitone-m': 0,
	'unitone-l': 1,
	'unitone-xl': 2,
	'unitone-2-xl': 3,
	'unitone-3-xl': 4,
	'unitone-4-xl': 5,
	'unitone-5-xl': 6,
	'unitone-6-xl': 7,
};

export const getFontSizeCssVarSlug = ( slug ) =>
	slug?.replace( /-([0-9]+)([a-z]+)/, '-$1-$2' );

export const getUnitoneFontSizeScale = ( fontSize ) => {
	const slug = 'string' === typeof fontSize ? fontSize : fontSize?.slug;

	return UNITONE_FONT_SIZE_SCALES[ getFontSizeCssVarSlug( slug ) ];
};

export const getFontSizePresetSlug = ( fontSize ) => {
	const slug = 'string' === typeof fontSize ? fontSize : fontSize?.slug;

	return slug;
};

export const getFontSizePresetValue = ( fontSize ) => {
	const slug = getFontSizePresetSlug( fontSize );

	return slug ? `var:preset|font-size|${ slug }` : undefined;
};

export const getFontSizePresetSlugFromValue = ( value ) => {
	const cssVar = getPresetCssVar( value );
	if ( ! cssVar?.match ) {
		return undefined;
	}

	return cssVar.match( /^var\(--wp--preset--font-size--(.+)\)$/ )?.[ 1 ];
};

export const getFontSizeByUnitoneScale = ( fontSizes, scale ) =>
	fontSizes?.find(
		( fontSize ) =>
			String( scale ) === String( getUnitoneFontSizeScale( fontSize ) )
	);
