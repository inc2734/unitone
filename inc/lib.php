<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

/**
 * Converts a preset into a custom value.
 *
 * @param string $value Value to convert.
 * @return string CSS var string for given preset value.
 */
function unitone_get_preset_css_var( $value ) {
	if ( null === $value || '' === $value ) {
		return $value;
	}

	preg_match( '/var:preset\|([^\|]+)\|(.+)/', $value, $match );
	if ( ! $match ) {
		return $value;
	}

	return 'var(--wp--preset--' . $match[1] . '--' . $match[2] . ')';
}

/**
 * Get the value of a nested array.
 *
 * @param array $vars Array to search.
 * @param string $format Dot-separated format string.
 * @return mixed Value of the nested array.
 */
function unitone_array_get( array $vars, $format ) {
	foreach ( explode( '.', (string) $format ) as $key ) {
		if ( ! isset( $vars[ $key ] ) ) {
			return null;
		}
		$vars = $vars[ $key ];
	}
	return $vars;
}
