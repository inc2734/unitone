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
	$styles      = WP_Theme_JSON_Resolver::get_merged_data()->get_raw_data()['styles'];
	$typography  = ! empty( $styles['typography'] ) ? $styles['typography'] : array();
	$font_size   = ! empty( $typography['fontSize'] ) ? explode( '|', $typography['fontSize'] )[2] : null;
	$line_height = ! empty( $typography['lineHeight'] ) ? $typography['lineHeight'] : null;

	$settings   = WP_Theme_JSON_Resolver::get_merged_data()->get_raw_data()['settings'];
	$font_sizes = ! empty( $settings['typography']['fontSizes']['theme'] ) ? $settings['typography']['fontSizes']['theme'] : array();

	$unitone_font_size = 0;
	$base_font_size    = 16;
	if ( $font_sizes ) {
		if ( $font_size ) {
			foreach ( $font_sizes as $key => $_font_size ) {
				if ( $font_size === $_font_size['slug'] ) {
					$unitone_font_size = $key;
					break;
				}
			}
		}
	}

	$half_leading = 0.3;
	if ( $line_height ) {
		$half_leading = ( $line_height - 1 ) / 2;
	}

	$stylesheet = sprintf(
		'body, .editor-styles-wrapper {--unitone--font-size: %1$s; --unitone--half-leading: %2$s}',
		$unitone_font_size,
		$half_leading
	);
	wp_add_inline_style( get_stylesheet(), $stylesheet );
}
add_action( 'wp_enqueue_scripts', 'enqueue_typography_styles' );
add_action( 'enqueue_block_editor_assets', 'enqueue_typography_styles', 11 );

/**
 * Convert deprecated color names to new color names.
 */
add_filter(
	'wp_theme_json_data_user',
	function( $theme_json ) {
		$data = $theme_json->get_data();
		if ( isset( $data['styles']['color'] ) && is_array( $data['styles']['color'] ) ) {
			foreach ( $data['styles']['color'] as $key => $value ) {
				$data['styles']['color'][ $key ] = str_replace( '/', '-', $value );
			}
		}

		if ( isset( $data['styles']['blocks'] ) && is_array( $data['styles']['blocks'] ) ) {
			foreach ( $data['styles']['blocks'] as $block_name => $block_data ) {
				if (
					isset( $data['styles']['blocks'][ $block_name ]['color'] )
					|| is_array( $data['styles']['blocks'][ $block_name ]['color'] )
				) {
					foreach ( $data['styles']['blocks'][ $block_name ]['color'] as $key => $value ) {
						$data['styles']['blocks'][ $block_name ]['color'][ $key ] = str_replace( '/', '-', $value );
					}
				}
			}
		}

		return $theme_json->update_with( $data );
		return $theme_json;
	},
	9
);
