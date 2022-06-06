<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

/**
 * Set custom global typography.
 */
function enqueue_typography_styles() {
	$styles      = WP_Theme_JSON_Resolver::get_merged_data( 'custom' )->get_raw_data()['styles'];
	$typography  = ! empty( $styles['typography'] ) ? $styles['typography'] : array();
	$font_size   = ! empty( $typography['fontSize'] ) ? explode( '|', $typography['fontSize'] )[2] : null;
	$line_height = ! empty( $typography['lineHeight'] ) ? $typography['lineHeight'] : null;

	$settings   = WP_Theme_JSON_Resolver::get_merged_data( 'custom' )->get_raw_data()['settings'];
	$font_sizes = ! empty( $settings['typography']['fontSizes']['theme'] ) ? $settings['typography']['fontSizes']['theme'] : array();

	$base_font_size = 16;
	if ( $font_sizes ) {
		if ( $font_size ) {
			foreach ( $font_sizes as $_font_size ) {
				if ( $font_size === $_font_size['slug'] ) {
					$size      = $_font_size['size'];
					$maybe_int = str_replace( 'rem', '', $size );

					if ( preg_match( '|\d+|', $maybe_int ) ) {
						$base_font_size = $base_font_size * $maybe_int;
					}
				}
			}
		}
	}

	$half_leading = 0.3;
	if ( $line_height ) {
		$half_leading = ( $line_height - 1 ) / 2;
	}

	$stylesheet = sprintf(
		':root, .editor-styles-wrapper.block-editor-writing-flow {--base-font-size: %1$s; --half-leading: %2$s;}',
		$base_font_size,
		$half_leading
	);
	wp_add_inline_style( get_stylesheet(), $stylesheet );
}
add_action( 'wp_enqueue_scripts', 'enqueue_typography_styles' );
add_action( 'enqueue_block_editor_assets', 'enqueue_typography_styles', 11 );
