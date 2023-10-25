<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

use Unitone\App\Controller\Manager\Manager;

/**
 * Set custom global typography.
 */
function enqueue_typography_styles() {
	$base_font_size = Manager::get_option( 'base-font-size' );
	$half_leading   = Manager::get_option( 'half-leading' );
	$content_size   = Manager::get_option( 'content-size' );
	$wide_size      = Manager::get_option( 'wide-size' );
	$h2_size        = Manager::get_option( 'h2-size' );
	$h3_size        = Manager::get_option( 'h3-size' );
	$h4_size        = Manager::get_option( 'h4-size' );
	$h5_size        = Manager::get_option( 'h5-size' );
	$h6_size        = Manager::get_option( 'h6-size' );

	$stylesheet = sprintf(
		':root {
			--unitone--base-font-size: %1$s;
			--unitone--half-leading: %2$s;
			--unitone--measure: %3$s;
			--unitone--container-max-width: %4$s;
		}
		[data-unitone-layout~="text"] > h2,
		[data-unitone-layout~="vertical-writing"] > h2 {
			--unitone--font-size: %5$s;
		}
		[data-unitone-layout~="text"] > h3,
		[data-unitone-layout~="vertical-writing"] > h3 {
			--unitone--font-size: %6$s;
		}
		[data-unitone-layout~="text"] > h4,
		[data-unitone-layout~="vertical-writing"] > h4 {
			--unitone--font-size: %7$s;
		}
		[data-unitone-layout~="text"] > h5,
		[data-unitone-layout~="vertical-writing"] > h5 {
			--unitone--font-size: %8$s;
		}
		[data-unitone-layout~="text"] > h6,
		[data-unitone-layout~="vertical-writing"] > h6 {
			--unitone--font-size: %9$s;
		}',
		$base_font_size,
		$half_leading,
		$content_size,
		$wide_size,
		$h2_size,
		$h3_size,
		$h4_size,
		$h5_size,
		$h6_size
	);
	wp_add_inline_style( get_stylesheet(), $stylesheet );
}
add_action( 'wp_enqueue_scripts', 'enqueue_typography_styles' );
add_action( 'enqueue_block_editor_assets', 'enqueue_typography_styles', 11 );

/**
 * Set colors.
 *
 * @param WP_Theme_JSON_Data $theme_json Class to access and update the underlying data.
 * @return WP_Theme_JSON_Data
 */
function unitone_wp_theme_json_data_theme( $theme_json ) {
	$accent_color     = Manager::get_option( 'accent-color' );
	$background_color = Manager::get_option( 'background-color' );
	$text_color       = Manager::get_option( 'text-color' );
	$link_color       = Manager::get_option( 'link-color' ) ? Manager::get_option( 'link-color' ) : 'var(--wp--preset--color--unitone-accent)';

	$theme_palette = $theme_json->get_data()['settings']['color']['palette']['theme'];
	foreach ( $theme_palette as $index => $color ) {
		if ( 'unitone-accent' === $color['slug'] ) {
			$theme_palette[ $index ]['color'] = Manager::get_option( 'accent-color' );
		} elseif ( 'unitone-background' === $color['slug'] ) {
			$theme_palette[ $index ]['color'] = Manager::get_option( 'background-color' );
		} elseif ( 'unitone-text' === $color['slug'] ) {
			$theme_palette[ $index ]['color'] = Manager::get_option( 'text-color' );
		}
	}

	$new_data = array(
		'version'  => 2,
		'settings' => array(
			'color' => array(
				'palette' => array(
					'theme' => $theme_palette,
				),
			),
		),
		'styles'   => array(
			'elements' => array(
				'button' => array(
					'color' => array(
						'background' => $link_color,
					),
				),
				'link'   => array(
					'color' => array(
						'text' => $link_color,
					),
				),
			),
		),
	);

	return $theme_json->update_with( $new_data );
}
add_filter( 'wp_theme_json_data_theme', 'unitone_wp_theme_json_data_theme' );

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
