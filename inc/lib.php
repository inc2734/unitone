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
 * Checks is given value is a preset.
 *
 * @param string $value Value to check.
 * @return boolean Return true if value is string in format var:preset|.
 */
function unitone_is_preset_value( $value ) {
	if ( null === $value || '' === $value || is_array( $value ) ) {
		return false;
	}

	return 0 === strpos( $value, 'var:preset|' );
}

/**
 * Converts a global style into a custom value.
 *
 * @param string $value Value to convert.
 * @return string CSS var string for given global style value.
 */
function unitone_get_global_style_css_var( $value ) {
	if ( null === $value || '' === $value ) {
		return $value;
	}

	preg_match( '/var:style\|global\|(.+)/', $value, $match );
	if ( ! $match ) {
		return $value;
	}

	return 'var(--wp--style--global--' . $match[1] . ')';
}

/**
 * Checks is given value is a global style.
 *
 * @param string $value Value to check.
 * @return boolean Return true if value is string in format var:style|global|.
 */
function unitone_is_global_style_value( $value ) {
	if ( null === $value || '' === $value || is_array( $value ) ) {
		return false;
	}

	return 0 === strpos( $value, 'var:style|global|' );
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

/**
 * Return true when supported.
 *
 * @param string $support The supported attribute name. Dot-accessible.
 * @param WP_Block_Type $metadata WP_Block_Type object.
 * @return boolean
 */
function unitone_has_block_support( $support, $metadata ) {
	if ( is_array( $metadata ) ) {
		$metadata = (object) $metadata;
	}

	return null !== unitone_array_get( $metadata->supports ?? array(), $support );
}

/**
 * Return supported value.
 *
 * @param string $support The supported attribute name. Dot-accessible.
 * @param WP_Block_Type $metadata WP_Block_Type object.
 * @return mixed
 */
function unitone_get_block_support( $support, $metadata ) {
	return unitone_array_get( $metadata->supports ?? array(), $support );
}

/**
 * Recursively replaces values in an array with values from multiple arrays,
 * restricted to the keys present in the first (base) array.
 *
 * - The whitelist of keys is determined by the first array.
 * - Only keys that exist in the first array are considered.
 *   - Keys not in the first array are ignored, even if present in later arrays.
 * - If both values are arrays:
 *   - If the base value is an indexed array (list), the later list fully replaces it.
 *   - If the base value is an associative array, merge recursively under the same filtering rule.
 * - Otherwise, the later non-array value overrides earlier values.
 * - Keys missing in later arrays are kept (not removed).
 *
 * @param array ...$arrays The arrays to be processed. The first array is the base (whitelist).
 * @return array The base array with values overridden by later arrays, limited to the base keys.
 */
function unitone_array_override_replace_recursive( array ...$arrays ) {
	$result = array_shift( $arrays ) ?? array();

	foreach ( $arrays as $array ) {
		foreach ( $array as $key => $value ) {
			if ( array_key_exists( $key, $result ) ) {
				if ( is_array( $result[ $key ] ) && is_array( $value ) ) {
					if ( array_keys( $result[ $key ] ) === range( 0, count( $result[ $key ] ) - 1 ) ) {
						$result[ $key ] = $value;
					} else {
						$result[ $key ] = unitone_array_override_replace_recursive( $result[ $key ], $value );
					}
				} else {
					$result[ $key ] = $value;
				}
			} else {
				$result[ $key ] = $value;
			}
		}
	}

	return $result;
}

/**
 * Recursively replaces values in an array with values from multiple arrays.
 *
 * - If multiple arrays contain the same key:
 *   - If the values are associative arrays, they are merged recursively.
 *   - If the values are indexed arrays (lists), the last array's list fully replaces earlier lists.
 *   - Otherwise, the last non-array value overrides earlier values.
 * - Keys that exist only in earlier arrays are **removed**.
 *
 * @param array ...$arrays The arrays to be processed.
 * @return array The modified array where later arrays fully replace earlier ones.
 */
function unitone_array_filter_override_replace_recursive( array ...$arrays ) {
	$result = array_shift( $arrays ) ?? array();

	foreach ( $arrays as $array ) {
		foreach ( $result as $key => $current ) {
			if ( array_key_exists( $key, $array ) ) {
				$value = $array[ $key ];

				if ( is_array( $current ) && is_array( $value ) ) {
					if ( array_keys( $current ) === range( 0, count( $current ) - 1 ) ) {
						$result[ $key ] = $value;
					} else {
						$result[ $key ] = unitone_array_filter_override_replace_recursive( $current, $value );
					}
				} else {
					$result[ $key ] = $value;
				}
			}
		}
	}

	return $result;
}

/**
 * Retrieve a color value from the theme color palette.
 *
 * @param string $slug          Palette slug to look up.
 * @param array  $global_styles Optional global styles array to search within.
 * @return string|false
 */
function unitone_get_palette_color( $slug, array $global_styles = array() ) {
	if ( ! $slug || ! $global_styles ) {
		return false;
	}

	$palette = $global_styles['settings']['color']['palette'];
	$keys    = array_keys( $palette );
	$is_flat = array_keys( $keys ) === $keys;

	if ( $is_flat ) {
		foreach ( $palette as $color_object ) {
			if ( $slug === $color_object['slug'] ) {
				return $color_object;
			}
		}
	} else {
		foreach ( $palette as $group ) {
			foreach ( $group as $color_object ) {
				if ( $slug === $color_object['slug'] ) {
					return $color_object['color'];
				}
			}
		}
	}

	return false;
}
