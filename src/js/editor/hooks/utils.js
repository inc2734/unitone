import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { store as editPostStore } from '@wordpress/edit-post';

/**
 * Removed falsy values from nested object.
 *
 * @see https://github.com/WordPress/gutenberg/blob/857356c1602a42f342a61976ba67eb41284050ca/packages/block-editor/src/hooks/utils.js
 *
 * @param {*} object
 * @return {*} Object cleaned from falsy values
 */
export const cleanEmptyObject = ( object ) => {
	if (
		object === null ||
		typeof object !== 'object' ||
		Array.isArray( object )
	) {
		return object;
	}

	const cleanedNestedObjects = Object.entries( object )
		.map( ( [ key, value ] ) => [ key, cleanEmptyObject( value ) ] )
		.filter(
			( [ , value ] ) =>
				value !== undefined && value !== null && value !== ''
		);
	return ! cleanedNestedObjects.length
		? undefined
		: Object.fromEntries( cleanedNestedObjects );
};

/**
 * Check if the value is number.
 *
 * @param {*} value The value to check.
 * @return {boolean} Return true if the value is number.
 */
export function isNumber( value ) {
	return ! isNaN( value );
}

/**
 * Check if the value is string.
 *
 * @param {*} value The value to check.
 * @return {boolean} Return true if the value is string.
 */
export function isString( value ) {
	return typeof value === 'string' || value instanceof String;
}

/**
 * Converts a global style into a custom value.
 *
 * @param {string} value Value to convert.
 *
 * @return {string | undefined} CSS var string for given global style value.
 */
export function getGlobalStyleCssVar( value ) {
	if ( null == value ) {
		return undefined;
	}

	const slug = value.match( /var:style\|global\|(.+)/ );
	if ( ! slug ) {
		return value;
	}

	return `var(--wp--style--global--${ slug[ 1 ] })`;
}

/**
 * Converts a custom value to global style value if one can be found.
 *
 * Returns value as-is if no match is found.
 *
 * @param {string} value Value to convert
 *
 * @return {string} The global style value if it can be found.
 */
export function getGlobalStyleValueFromCustomValue( value ) {
	if ( null == value ) {
		return undefined;
	}

	const slug = value.match( /^var\(--wp--style--global--(.+)\)$/ );
	if ( ! slug ) {
		return value;
	}

	return `var:style|global|${ slug[ 1 ] }`;
}

/**
 * Checks is given value is a global style.
 *
 * @param {string} value Value to check
 *
 * @return {boolean} Return true if value is string in format var:style|global|.
 */
export function isValueGlobalStyle( value ) {
	if ( ! value?.includes ) {
		return false;
	}

	return value.includes( 'var:style|global|' );
}

/**
 * Return the device type.
 *
 * @return {string} The divice type.
 */
export function useDeviceType() {
	return useSelect( ( select ) => {
		const { getDeviceType } = select( editorStore );
		if ( null != getDeviceType ) {
			return getDeviceType()?.toLowerCase();
		}

		const { __experimentalGetPreviewDeviceType } = select( editPostStore );
		return __experimentalGetPreviewDeviceType()?.toLowerCase();
	}, [] );
}
