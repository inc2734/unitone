<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

/**
 * Add normalized fallbacks to preset references in serialized unitone styles.
 *
 * Keep save() and deprecated output unchanged so existing blocks still validate.
 * Prefer an existing legacy variable when custom CSS already supplies its value.
 *
 * @param string $value A CSS declaration value.
 * @return string CSS value with compatible preset references.
 */
function unitone_get_compatible_preset_references( $value ) {
	return preg_replace_callback(
		'/var\(\s*(--wp--preset--([a-z-]+?)--([^(),;]+?))\s*\)/u',
		static function ( $matches ) {
			$normalized = unitone_get_preset_css_var_from_slug( $matches[2], $matches[3] );
			if ( 'var(' . $matches[1] . ')' === $normalized ) {
				return $matches[0];
			}

			// Unescaped slashes and other delimiters are not valid CSS identifiers.
			if ( ! preg_match( '/^[a-zA-Z0-9_\x{0080}-\x{10ffff}-]+$/u', $matches[3] ) ) {
				return $normalized;
			}

			return 'var(' . $matches[1] . ', ' . $normalized . ')';
		},
		$value
	);
}

/**
 * Repair saved references at render time without modifying post content.
 *
 * @param string $block_content Rendered block HTML.
 * @return string Rendered HTML with compatible unitone preset references.
 */
function unitone_render_compatible_preset_references( $block_content ) {
	if ( false === strpos( $block_content, '--wp--preset--' ) ) {
		return $block_content;
	}

	$p = new WP_HTML_Tag_Processor( $block_content );
	while ( $p->next_tag() ) {
		$style = $p->get_attribute( 'style' );
		if ( ! is_string( $style ) || false === strpos( $style, '--wp--preset--' ) ) {
			continue;
		}

		// Limit repairs to unitone's own declarations, including the legacy slider.
		$normalized_style = preg_replace_callback(
			'/((?:^|;)\s*--(?:unitone--|swiper-)[a-zA-Z0-9_-]+\s*:\s*)([^;]*)/u',
			static function ( $matches ) {
				return $matches[1] . unitone_get_compatible_preset_references( $matches[2] );
			},
			$style
		);

		if ( $style !== $normalized_style ) {
			$p->set_attribute( 'style', $normalized_style );
		}
	}

	return $p->get_updated_html();
}
add_filter( 'render_block', 'unitone_render_compatible_preset_references', 20 );
