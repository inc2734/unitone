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

/**
 * Converts a limited CSS-like selector to XPath.
 *
 * Supported syntax:
 * - `:scope`
 * - tag names
 * - `.class`
 * - `[attr]`
 * - `[attr="value"]`
 * - `[attr~="value"]`
 * - descendant combinator
 * - child combinator `>`
 * - comma separated selector groups
 *
 * @param string $selector CSS-like selector.
 * @return string
 */
function unitone_css_selector_to_xpath( $selector ) {
	$selectors = _unitone_split_css_selector_groups( $selector );
	$xpaths    = array();

	foreach ( $selectors as $selector_group ) {
		$selector_group = trim( $selector_group );
		if ( '' === $selector_group ) {
			continue;
		}

		$steps = _unitone_tokenize_css_selector_steps( $selector_group );
		if ( ! $steps ) {
			continue;
		}

		$xpaths[] = _unitone_convert_css_selector_steps_to_xpath( $steps );
	}

	return implode( ' | ', array_filter( $xpaths ) );
}

/**
 * Splits comma separated selector groups.
 *
 * @param string $selector Selector string.
 * @return array
 */
function _unitone_split_css_selector_groups( $selector ) {
	$groups         = array();
	$current        = '';
	$bracket_depth  = 0;
	$quote          = null;
	$selector_chars = str_split( $selector );

	foreach ( $selector_chars as $char ) {
		if ( $quote ) {
			$current .= $char;
			if ( $char === $quote ) {
				$quote = null;
			}
			continue;
		}

		if ( '"' === $char || "'" === $char ) {
			$quote    = $char;
			$current .= $char;
			continue;
		}

		if ( '[' === $char ) {
			++$bracket_depth;
			$current .= $char;
			continue;
		}

		if ( ']' === $char ) {
			--$bracket_depth;
			$current .= $char;
			continue;
		}

		if ( ',' === $char && 0 === $bracket_depth ) {
			$groups[] = $current;
			$current  = '';
			continue;
		}

		$current .= $char;
	}

	if ( '' !== $current ) {
		$groups[] = $current;
	}

	return $groups;
}

/**
 * Tokenizes selector steps and combinators.
 *
 * @param string $selector Selector string.
 * @return array
 */
function _unitone_tokenize_css_selector_steps( $selector ) {
	$tokens        = array();
	$current       = '';
	$bracket_depth = 0;
	$quote         = null;
	$length        = strlen( $selector );
	$pending_space = false;

	for ( $index = 0; $index < $length; $index++ ) {
		$char = $selector[ $index ];

		if ( $quote ) {
			$current .= $char;
			if ( $char === $quote ) {
				$quote = null;
			}
			continue;
		}

		if ( '"' === $char || "'" === $char ) {
			$quote    = $char;
			$current .= $char;
			continue;
		}

		if ( '[' === $char ) {
			++$bracket_depth;
			$current .= $char;
			continue;
		}

		if ( ']' === $char ) {
			--$bracket_depth;
			$current .= $char;
			continue;
		}

		if ( 0 === $bracket_depth && ctype_space( $char ) ) {
			if ( '' !== trim( $current ) ) {
				$tokens[]      = array(
					'combinator' => $pending_space ? ' ' : null,
					'selector'   => trim( $current ),
				);
				$current       = '';
				$pending_space = true;
			}
			continue;
		}

		if ( 0 === $bracket_depth && '>' === $char ) {
			if ( '' !== trim( $current ) ) {
				$tokens[] = array(
					'combinator' => $pending_space ? ' ' : null,
					'selector'   => trim( $current ),
				);
				$current  = '';
			}
			$pending_space = false;
			$tokens[]      = array(
				'combinator' => '>',
				'selector'   => null,
			);
			continue;
		}

		$current .= $char;
	}

	if ( '' !== trim( $current ) ) {
		$tokens[] = array(
			'combinator' => $pending_space ? ' ' : null,
			'selector'   => trim( $current ),
		);
	}

	return $tokens;
}

/**
 * Converts selector steps to XPath.
 *
 * @param array $steps Selector steps.
 * @return string
 */
function _unitone_convert_css_selector_steps_to_xpath( array $steps ) {
	$first_selector   = $steps[0]['selector'] ?? '';
	$is_relative      = is_string( $first_selector ) && 0 === strpos( ltrim( $first_selector ), ':scope' );
	$xpath            = $is_relative ? '.' : '';
	$next_combinator  = null;
	$is_first_segment = true;

	foreach ( $steps as $step ) {
		if ( null === $step['selector'] ) {
			$next_combinator = $step['combinator'];
			continue;
		}

		$selector               = $step['selector'];
		$is_scope_only_selector = ':scope' === trim( $selector );
		if ( $is_first_segment ) {
			$combinator = null;
		} elseif ( null !== $next_combinator ) {
			$combinator = $next_combinator;
		} elseif ( null !== $step['combinator'] ) {
			$combinator = $step['combinator'];
		} else {
			$combinator = ' ';
		}
		$segment = _unitone_convert_css_simple_selector_to_xpath( $selector );

		if ( $is_first_segment ) {
			if ( $is_scope_only_selector ) {
				$next_combinator  = null;
				$is_first_segment = false;
				continue;
			}

			if ( 0 === strpos( $selector, ':scope' ) ) {
				$xpath .= '/' . $segment;
			} else {
				$xpath .= '//' . $segment;
			}
		} elseif ( '>' === $combinator ) {
			$xpath .= '/' . $segment;
		} else {
			$xpath .= '//' . $segment;
		}

		$next_combinator  = null;
		$is_first_segment = false;
	}

	return $xpath;
}

/**
 * Converts a simple selector to XPath segment.
 *
 * @param string $selector Simple selector.
 * @return string
 */
function _unitone_convert_css_simple_selector_to_xpath( $selector ) {
	$selector = trim( preg_replace( '/:scope\b/', '', $selector ) );
	if ( '' === $selector ) {
		return '*';
	}

	$tag = '*';
	if ( preg_match( '/^[a-zA-Z][a-zA-Z0-9_-]*/', $selector, $tag_match ) ) {
		$tag      = $tag_match[0];
		$selector = substr( $selector, strlen( $tag ) );
	}

	$conditions = array();

	if ( preg_match_all( '/\.([a-zA-Z0-9_-]+)/', $selector, $class_matches ) ) {
		foreach ( $class_matches[1] as $class_name ) {
			$conditions[] = sprintf(
				'contains(concat(" ", normalize-space(@class), " "), " %s ")',
				$class_name
			);
		}
	}

	if ( preg_match_all( '/\[([^\]]+)\]/', $selector, $attribute_matches ) ) {
		foreach ( $attribute_matches[1] as $raw_attribute ) {
			$conditions[] = _unitone_convert_css_attribute_selector_to_xpath_condition( $raw_attribute );
		}
	}

	$conditions = array_filter( $conditions );
	if ( ! $conditions ) {
		return $tag;
	}

	return $tag . '[' . implode( ' and ', $conditions ) . ']';
}

/**
 * Converts a CSS attribute selector body to XPath condition.
 *
 * @param string $attribute Attribute selector body.
 * @return string
 */
function _unitone_convert_css_attribute_selector_to_xpath_condition( $attribute ) {
	$attribute = trim( $attribute );

	if ( preg_match( '/^([^\s~=\]]+)~=(["\'])(.*?)\2$/', $attribute, $matches ) ) {
		return sprintf(
			'contains(concat(" ", normalize-space(@%1$s), " "), " %2$s ")',
			$matches[1],
			$matches[3]
		);
	}

	if ( preg_match( '/^([^\s=\]]+)=(["\'])(.*?)\2$/', $attribute, $matches ) ) {
		return sprintf(
			'@%1$s="%2$s"',
			$matches[1],
			$matches[3]
		);
	}

	if ( preg_match( '/^([^\s\]]+)$/', $attribute, $matches ) ) {
		return sprintf( '@%s', $matches[1] );
	}

	return '';
}
