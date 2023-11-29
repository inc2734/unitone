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
	$font_family    = Manager::get_setting( 'font-family' );
	$base_font_size = Manager::get_setting( 'base-font-size' );
	$half_leading   = Manager::get_setting( 'half-leading' );
	$content_size   = Manager::get_setting( 'content-size' );
	$wide_size      = Manager::get_setting( 'wide-size' );
	$h2_size        = Manager::get_setting( 'h2-size' );
	$h3_size        = Manager::get_setting( 'h3-size' );
	$h4_size        = Manager::get_setting( 'h4-size' );
	$h5_size        = Manager::get_setting( 'h5-size' );
	$h6_size        = Manager::get_setting( 'h6-size' );

	$global_settings = wp_get_global_settings();

	$font_family_index = array_search(
		$font_family,
		array_column( $global_settings['typography']['fontFamilies']['theme'], 'slug' ),
		true
	);
	$font_family       = false !== $font_family_index
		? $global_settings['typography']['fontFamilies']['theme'][ $font_family_index ]['fontFamily']
		: 'sans-serif';

	$stylesheet = sprintf(
		':root {
			--unitone--font-family: %1$s;
			--unitone--base-font-size: %2$s;
			--unitone--half-leading: %3$s;
			--unitone--measure: %4$s;
			--unitone--container-max-width: %5$s;
		}
		[data-unitone-layout~="text"] > h2,
		[data-unitone-layout~="vertical-writing"] > h2 {
			--unitone--font-size: %6$s;
		}
		[data-unitone-layout~="text"] > h3,
		[data-unitone-layout~="vertical-writing"] > h3 {
			--unitone--font-size: %7$s;
		}
		[data-unitone-layout~="text"] > h4,
		[data-unitone-layout~="vertical-writing"] > h4 {
			--unitone--font-size: %8$s;
		}
		[data-unitone-layout~="text"] > h5,
		[data-unitone-layout~="vertical-writing"] > h5 {
			--unitone--font-size: %9$s;
		}
		[data-unitone-layout~="text"] > h6,
		[data-unitone-layout~="vertical-writing"] > h6 {
			--unitone--font-size: %10$s;
		}',
		$font_family,
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
	$accent_color     = Manager::get_setting( 'accent-color' );
	$background_color = Manager::get_setting( 'background-color' );
	$text_color       = Manager::get_setting( 'text-color' );
	$link_color       = Manager::get_setting( 'link-color' ) ? Manager::get_setting( 'link-color' ) : 'var(--wp--preset--color--unitone-accent)';

	$theme_palette = $theme_json->get_data()['settings']['color']['palette']['theme'];
	foreach ( $theme_palette as $index => $color ) {
		if ( 'unitone-accent' === $color['slug'] ) {
			$theme_palette[ $index ]['color'] = Manager::get_setting( 'accent-color' );
		} elseif ( 'unitone-background' === $color['slug'] ) {
			$theme_palette[ $index ]['color'] = Manager::get_setting( 'background-color' );
		} elseif ( 'unitone-text' === $color['slug'] ) {
			$theme_palette[ $index ]['color'] = Manager::get_setting( 'text-color' );
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
 * Set color palette.
 *
 * Originally, this should be set in theme.json,
 * but since then the same color palette must be set for global style variations, it is set here.
 *
 * @param WP_Theme_JSON_Data $theme_json Class to access and update the underlying data.
 * @return WP_Theme_JSON_Data
 */
function unitone_set_color_palette( $theme_json ) {
	$data = $theme_json->get_data();
	if ( empty( $data['settings'] ) ) {
		return $theme_json;
	}

	$theme_palette = $data['settings']['color']['palette']['theme'];
	$theme_palette = array_merge(
		$theme_palette,
		array(
			array(
				'slug'  => 'unitone-twilight-light',
				'color' => 'var(--unitone--color--twilight-light)',
				'name'  => _x( 'Twilight (Light)', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-twilight',
				'color' => 'var(--unitone--color--twilight)',
				'name'  => _x( 'Twilight', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-twilight-heavy',
				'color' => 'var(--unitone--color--twilight-heavy)',
				'name'  => _x( 'Twilight (Heavy)', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dimmed-light',
				'color' => 'var(--unitone--color--dimmed-light)',
				'name'  => _x( 'Dimmed (Light)', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dimmed',
				'color' => 'var(--unitone--color--dimmed)',
				'name'  => _x( 'Dimmed', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dimmed-heavy',
				'color' => 'var(--unitone--color--dimmed-heavy)',
				'name'  => _x( 'Dimmed (Heavy)', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-pale-red',
				'color' => 'var(--unitone--color--pale-red)',
				'name'  => _x( 'Pale Red', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-bright-red',
				'color' => 'var(--unitone--color--bright-red)',
				'name'  => _x( 'Bright Red', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-light-red',
				'color' => 'var(--unitone--color--light-red)',
				'name'  => _x( 'Light Red', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-red',
				'color' => 'var(--unitone--color--red)',
				'name'  => _x( 'Red', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dark-red',
				'color' => 'var(--unitone--color--dark-red)',
				'name'  => _x( 'Dark Red', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-heavy-red',
				'color' => 'var(--unitone--color--heavy-red)',
				'name'  => _x( 'Heavy Red', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-pale-orange',
				'color' => 'var(--unitone--color--pale-orange)',
				'name'  => _x( 'Pale Orange', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-bright-orange',
				'color' => 'var(--unitone--color--bright-orange)',
				'name'  => _x( 'Bright Orange', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-light-orange',
				'color' => 'var(--unitone--color--light-orange)',
				'name'  => _x( 'Light Orange', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-orange',
				'color' => 'var(--unitone--color--orange)',
				'name'  => _x( 'Orange', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dark-orange',
				'color' => 'var(--unitone--color--dark-orange)',
				'name'  => _x( 'Dark Orange', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-heavy-orange',
				'color' => 'var(--unitone--color--heavy-orange)',
				'name'  => _x( 'Heavy Orange', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-pale-yellow',
				'color' => 'var(--unitone--color--pale-yellow)',
				'name'  => _x( 'Pale Yellow', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-bright-yellow',
				'color' => 'var(--unitone--color--bright-yellow)',
				'name'  => _x( 'Bright Yellow', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-light-yellow',
				'color' => 'var(--unitone--color--light-yellow)',
				'name'  => _x( 'Light Yellow', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-yellow',
				'color' => 'var(--unitone--color--yellow)',
				'name'  => _x( 'Yellow', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dark-yellow',
				'color' => 'var(--unitone--color--dark-yellow)',
				'name'  => _x( 'Dark Yellow', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-heavy-yellow',
				'color' => 'var(--unitone--color--heavy-yellow)',
				'name'  => _x( 'Heavy Yellow', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-pale-lime',
				'color' => 'var(--unitone--color--pale-lime)',
				'name'  => _x( 'Pale Lime', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-bright-lime',
				'color' => 'var(--unitone--color--bright-lime)',
				'name'  => _x( 'Bright Lime', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-light-lime',
				'color' => 'var(--unitone--color--light-lime)',
				'name'  => _x( 'Light Lime', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-lime',
				'color' => 'var(--unitone--color--lime)',
				'name'  => _x( 'Lime', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dark-lime',
				'color' => 'var(--unitone--color--dark-lime)',
				'name'  => _x( 'Dark Lime', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-heavy-lime',
				'color' => 'var(--unitone--color--heavy-lime)',
				'name'  => _x( 'Heavy Lime', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-pale-green',
				'color' => 'var(--unitone--color--pale-green)',
				'name'  => _x( 'Pale Green', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-bright-green',
				'color' => 'var(--unitone--color--bright-green)',
				'name'  => __( 'Bright Green', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-light-green',
				'color' => 'var(--unitone--color--light-green)',
				'name'  => _x( 'Light Green', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-green',
				'color' => 'var(--unitone--color--green)',
				'name'  => _x( 'Green', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dark-green',
				'color' => 'var(--unitone--color--dark-green)',
				'name'  => _x( 'Dark Green', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-heavy-green',
				'color' => 'var(--unitone--color--heavy-green)',
				'name'  => _x( 'Heavy Green', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-pale-teal',
				'color' => 'var(--unitone--color--pale-teal)',
				'name'  => _x( 'Pale Teal', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-bright-teal',
				'color' => 'var(--unitone--color--bright-teal)',
				'name'  => _x( 'Bright Teal', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-light-teal',
				'color' => 'var(--unitone--color--light-teal)',
				'name'  => _x( 'Light Teal', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-teal',
				'color' => 'var(--unitone--color--teal)',
				'name'  => _x( 'Teal', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dark-teal',
				'color' => 'var(--unitone--color--dark-teal)',
				'name'  => _x( 'Dark Teal', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-heavy-teal',
				'color' => 'var(--unitone--color--heavy-teal)',
				'name'  => _x( 'Heavy Teal', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-pale-cyan',
				'color' => 'var(--unitone--color--pale-cyan)',
				'name'  => _x( 'Pale Cyan', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-bright-cyan',
				'color' => 'var(--unitone--color--bright-cyan)',
				'name'  => _x( 'Bright Cyan', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-light-cyan',
				'color' => 'var(--unitone--color--light-cyan)',
				'name'  => _x( 'Light Cyan', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-cyan',
				'color' => 'var(--unitone--color--cyan)',
				'name'  => _x( 'Cyan', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dark-cyan',
				'color' => 'var(--unitone--color--dark-cyan)',
				'name'  => _x( 'Dark Cyan', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-heavy-cyan',
				'color' => 'var(--unitone--color--heavy-cyan)',
				'name'  => _x( 'Heavy Cyan', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-pale-blue',
				'color' => 'var(--unitone--color--pale-blue)',
				'name'  => _x( 'Pale Blue', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-bright-blue',
				'color' => 'var(--unitone--color--bright-blue)',
				'name'  => _x( 'Bright Blue', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-light-blue',
				'color' => 'var(--unitone--color--light-blue)',
				'name'  => _x( 'Light Blue', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-blue',
				'color' => 'var(--unitone--color--blue)',
				'name'  => _x( 'Blue', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dark-blue',
				'color' => 'var(--unitone--color--dark-blue)',
				'name'  => _x( 'Dark Blue', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-heavy-blue',
				'color' => 'var(--unitone--color--heavy-blue)',
				'name'  => _x( 'Heavy Blue', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-pale-indigo',
				'color' => 'var(--unitone--color--pale-indigo)',
				'name'  => _x( 'Pale Indigo', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-bright-indigo',
				'color' => 'var(--unitone--color--bright-indigo)',
				'name'  => _x( 'Bright Indigo', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-light-indigo',
				'color' => 'var(--unitone--color--light-indigo)',
				'name'  => _x( 'Light Indigo', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-indigo',
				'color' => 'var(--unitone--color--indigo)',
				'name'  => _x( 'Indigo', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dark-indigo',
				'color' => 'var(--unitone--color--dark-indigo)',
				'name'  => _x( 'Dark Indigo', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-heavy-indigo',
				'color' => 'var(--unitone--color--heavy-indigo)',
				'name'  => _x( 'Heavy Indigo', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-pale-violet',
				'color' => 'var(--unitone--color--pale-violet)',
				'name'  => _x( 'Pale Violet', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-bright-violet',
				'color' => 'var(--unitone--color--bright-violet)',
				'name'  => _x( 'Bright Violet', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-light-violet',
				'color' => 'var(--unitone--color--light-violet)',
				'name'  => _x( 'Light Violet', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-violet',
				'color' => 'var(--unitone--color--violet)',
				'name'  => _x( 'Violet', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dark-violet',
				'color' => 'var(--unitone--color--dark-violet)',
				'name'  => _x( 'Dark Violet', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-heavy-violet',
				'color' => 'var(--unitone--color--heavy-violet)',
				'name'  => _x( 'Heavy Violet', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-pale-purple',
				'color' => 'var(--unitone--color--pale-purple)',
				'name'  => _x( 'Pale Purple', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-bright-purple',
				'color' => 'var(--unitone--color--bright-purple)',
				'name'  => _x( 'Bright Purple', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-light-purple',
				'color' => 'var(--unitone--color--light-purple)',
				'name'  => _x( 'Light Purple', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-purple',
				'color' => 'var(--unitone--color--purple)',
				'name'  => _x( 'Purple', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dark-purple',
				'color' => 'var(--unitone--color--dark-purple)',
				'name'  => _x( 'Dark Purple', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-heavy-purple',
				'color' => 'var(--unitone--color--heavy-purple)',
				'name'  => _x( 'Heavy Purple', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-pale-pink',
				'color' => 'var(--unitone--color--pale-pink)',
				'name'  => _x( 'Pale Pink', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-bright-pink',
				'color' => 'var(--unitone--color--bright-pink)',
				'name'  => _x( 'Bright Pink', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-light-pink',
				'color' => 'var(--unitone--color--light-pink)',
				'name'  => _x( 'Light Pink', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-pink',
				'color' => 'var(--unitone--color--pink)',
				'name'  => _x( 'Pink', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dark-pink',
				'color' => 'var(--unitone--color--dark-pink)',
				'name'  => _x( 'Dark Pink', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-heavy-pink',
				'color' => 'var(--unitone--color--heavy-pink)',
				'name'  => _x( 'Heavy Pink', 'Color name', 'unitone' ),
			),
		)
	);

	$new_data = array(
		'version'  => 2,
		'settings' => array(
			'color' => array(
				'palette' => array(
					'theme' => $theme_palette,
				),
			),
		),
	);

	return $theme_json->update_with( $new_data );
}
add_filter( 'wp_theme_json_data_theme', 'unitone_set_color_palette' );
add_filter( 'wp_theme_json_data_user', 'unitone_set_color_palette' );

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
