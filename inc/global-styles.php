<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

use Unitone\App\Controller\Manager\Manager;
use Unitone\App\Controller\Manager\Model\Settings;

/**
 * Apply CSS Vars from settings.
 */
function unitone_apply_css_vars_from_settings() {
	$font_family      = unitone_get_preset_css_var( Manager::get_setting( 'styles' )['typography']['fontFamily'] );
	$base_font_size   = Manager::get_setting( 'base-font-size' );
	$half_leading     = Manager::get_setting( 'half-leading' );
	$min_half_leading = Manager::get_setting( 'min-half-leading' );
	$content_size     = Manager::get_setting( 'settings' )['layout']['contentSize'];
	$wide_size        = Manager::get_setting( 'settings' )['layout']['wideSize'];
	$accent_color     = unitone_get_preset_css_var( unitone_get_palette_color( 'unitone-accent', array( 'settings' => Manager::get_setting( 'settings' ) ) ) );
	$accent_color     = 'var(--unitone--color--accent)' === $accent_color
		? unitone_get_preset_css_var( unitone_get_palette_color( 'unitone-accent', Settings::get_default_global_styles() ) )
		: $accent_color;
	$background_color = unitone_get_preset_css_var( Manager::get_setting( 'styles' )['color']['background'] );
	$text_color       = unitone_get_preset_css_var( Manager::get_setting( 'styles' )['color']['text'] );
	$h1_size          = Manager::get_setting( 'h1-size' );
	$h2_size          = Manager::get_setting( 'h2-size' );
	$h3_size          = Manager::get_setting( 'h3-size' );
	$h4_size          = Manager::get_setting( 'h4-size' );
	$h5_size          = Manager::get_setting( 'h5-size' );
	$h6_size          = Manager::get_setting( 'h6-size' );

	$stylesheet = sprintf(
		':root {
			--unitone--font-family: %1$s;
			--unitone--base-font-size: %2$s;
			--unitone--half-leading: %3$s;
			--unitone--min-half-leading: %4$s;
			--unitone--measure: %5$s;
			--unitone--container-max-width: %6$s;
			--unitone--color--accent: %7$s;
		}
		:where(.is-layout-constrained:not([data-unitone-layout~="text"])) > h1,
		:where(.is-root-container) > h1,
		[data-unitone-layout~="text"] > h1,
		[data-unitone-layout~="vertical-writing"] > h1 {
			--unitone--font-size: %8$s;
		}
		:where(.is-layout-constrained:not([data-unitone-layout~="text"])) > h2,
		:where(.is-root-container) > h2,
		[data-unitone-layout~="text"] > h2,
		[data-unitone-layout~="vertical-writing"] > h2 {
			--unitone--font-size: %9$s;
		}
		:where(.is-layout-constrained:not([data-unitone-layout~="text"])) > h3,
		:where(.is-root-container) > h3,
		[data-unitone-layout~="text"] > h3,
		[data-unitone-layout~="vertical-writing"] > h3 {
			--unitone--font-size: %10$s;
		}
		:where(.is-layout-constrained:not([data-unitone-layout~="text"])) > h4,
		:where(.is-root-container) > h4,
		[data-unitone-layout~="text"] > h4,
		[data-unitone-layout~="vertical-writing"] > h4 {
			--unitone--font-size: %11$s;
		}
		:where(.is-layout-constrained:not([data-unitone-layout~="text"])) > h5,
		:where(.is-root-container) > h5,
		[data-unitone-layout~="text"] > h5,
		[data-unitone-layout~="vertical-writing"] > h5 {
			--unitone--font-size: %12$s;
		}
		:where(.is-layout-constrained:not([data-unitone-layout~="text"])) > h6,
		:where(.is-root-container) > h6,
		[data-unitone-layout~="text"] > h6,
		[data-unitone-layout~="vertical-writing"] > h6 {
			--unitone--font-size: %13$s;
		}',
		$font_family,
		$base_font_size,
		$half_leading,
		$min_half_leading,
		$content_size,
		$wide_size,
		$accent_color,
		$h1_size,
		$h2_size,
		$h3_size,
		$h4_size,
		$h5_size,
		$h6_size
	);
	wp_add_inline_style( 'unitone', $stylesheet );
	wp_add_inline_style( 'unitone/settings', $stylesheet );

	if ( 'var(--unitone--color--background)' !== $background_color && 'var(--wp--preset--color--unitone-background)' !== $background_color ) {
		$stylesheet = sprintf(
			':root {
				--unitone--color--background: %1$s;
				--unitone--color--text-alt: %1$s;
				--wp--preset--color--unitone-background: %1$s;
				--wp--preset--color--unitone-text-alt: %1$s;
			}',
			$background_color
		);

		wp_add_inline_style( 'unitone', $stylesheet );
		wp_add_inline_style( 'unitone/settings', $stylesheet );
	}

	if ( 'var(--unitone--color--text)' !== $text_color && 'var(--wp--preset--color--unitone-text)' !== $text_color ) {
		$stylesheet = sprintf(
			':root {
				--unitone--color--text: %1$s;
				--unitone--color--background-alt: %1$s;
				--wp--preset--color--unitone-text: %1$s;
				--wp--preset--color--unitone-background-alt: %1$s;
			}',
			$text_color
		);

		wp_add_inline_style( 'unitone', $stylesheet );
		wp_add_inline_style( 'unitone/settings', $stylesheet );
	}
}
add_action( 'wp_enqueue_scripts', 'unitone_apply_css_vars_from_settings' );

/**
 * Apply CSS Vars from settings for editor.
 */
function unitone_apply_css_vars_from_settings_for_editor() {
	if ( ! is_admin() ) {
		return;
	}

	unitone_apply_css_vars_from_settings();
}
add_action( 'enqueue_block_assets', 'unitone_apply_css_vars_from_settings_for_editor' );

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

	$palette         = $data['settings']['color']['palette'] ?? array();
	$default_palette = $palette['default'] ?? array();
	$default_palette = array_merge(
		array(
			array(
				'slug'  => 'unitone-twilight-pale',
				'color' => '#ffffff1a',
				'name'  => _x( 'Twilight (Pale)', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-twilight-mild',
				'color' => '#ffffff33',
				'name'  => _x( 'Twilight (Mild)', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-twilight-light',
				'color' => '#ffffff4d',
				'name'  => _x( 'Twilight (Light)', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-twilight',
				'color' => '#ffffff80',
				'name'  => _x( 'Twilight', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-twilight-strong',
				'color' => '#ffffff99',
				'name'  => _x( 'Twilight (Strong)', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-twilight-heavy',
				'color' => '#ffffffb3',
				'name'  => _x( 'Twilight (Heavy)', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dimmed-pale',
				'color' => '#0000001a',
				'name'  => _x( 'Dimmed (Pale)', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dimmed-mild',
				'color' => '#00000033',
				'name'  => _x( 'Dimmed (Mild)', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dimmed-light',
				'color' => '#0000004d',
				'name'  => _x( 'Dimmed (Light)', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dimmed',
				'color' => '#00000080',
				'name'  => _x( 'Dimmed', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dimmed-strong',
				'color' => '#00000099',
				'name'  => _x( 'Dimmed (Strong)', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dimmed-heavy',
				'color' => '#000000b3',
				'name'  => _x( 'Dimmed (Heavy)', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-pale-red',
				'color' => '#fef2f2',
				'name'  => _x( 'Pale Red', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-bright-red',
				'color' => '#fee2e2',
				'name'  => _x( 'Bright Red', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-light-red',
				'color' => '#fecaca',
				'name'  => _x( 'Light Red', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-red',
				'color' => '#f87171',
				'name'  => _x( 'Red', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dark-red',
				'color' => '#b91c1c',
				'name'  => _x( 'Dark Red', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-heavy-red',
				'color' => '#450a0a',
				'name'  => _x( 'Heavy Red', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-pale-orange',
				'color' => '#fff7ed',
				'name'  => _x( 'Pale Orange', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-bright-orange',
				'color' => '#ffedd5',
				'name'  => _x( 'Bright Orange', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-light-orange',
				'color' => '#fed7aa',
				'name'  => _x( 'Light Orange', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-orange',
				'color' => '#fb923c',
				'name'  => _x( 'Orange', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dark-orange',
				'color' => '#c2410c',
				'name'  => _x( 'Dark Orange', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-heavy-orange',
				'color' => '#431407',
				'name'  => _x( 'Heavy Orange', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-pale-yellow',
				'color' => '#fefce8',
				'name'  => _x( 'Pale Yellow', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-bright-yellow',
				'color' => '#fef9c3',
				'name'  => _x( 'Bright Yellow', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-light-yellow',
				'color' => '#fef08a',
				'name'  => _x( 'Light Yellow', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-yellow',
				'color' => '#facc15',
				'name'  => _x( 'Yellow', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dark-yellow',
				'color' => '#a16207',
				'name'  => _x( 'Dark Yellow', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-heavy-yellow',
				'color' => '#422006',
				'name'  => _x( 'Heavy Yellow', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-pale-lime',
				'color' => '#f7fee7',
				'name'  => _x( 'Pale Lime', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-bright-lime',
				'color' => '#ecfccb',
				'name'  => _x( 'Bright Lime', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-light-lime',
				'color' => '#d9f99d',
				'name'  => _x( 'Light Lime', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-lime',
				'color' => '#a3e635',
				'name'  => _x( 'Lime', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dark-lime',
				'color' => '#4d7c0f',
				'name'  => _x( 'Dark Lime', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-heavy-lime',
				'color' => '#1a2e05',
				'name'  => _x( 'Heavy Lime', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-pale-green',
				'color' => '#f0fdf4',
				'name'  => _x( 'Pale Green', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-bright-green',
				'color' => '#dcfce7',
				'name'  => __( 'Bright Green', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-light-green',
				'color' => '#bbf7d0',
				'name'  => _x( 'Light Green', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-green',
				'color' => '#4ade80',
				'name'  => _x( 'Green', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dark-green',
				'color' => '#15803d',
				'name'  => _x( 'Dark Green', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-heavy-green',
				'color' => '#052e16',
				'name'  => _x( 'Heavy Green', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-pale-teal',
				'color' => '#f0fdfa',
				'name'  => _x( 'Pale Teal', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-bright-teal',
				'color' => '#ccfbf1',
				'name'  => _x( 'Bright Teal', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-light-teal',
				'color' => '#99f6e4',
				'name'  => _x( 'Light Teal', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-teal',
				'color' => '#2dd4bf',
				'name'  => _x( 'Teal', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dark-teal',
				'color' => '#0f766e',
				'name'  => _x( 'Dark Teal', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-heavy-teal',
				'color' => '#042f2e',
				'name'  => _x( 'Heavy Teal', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-pale-cyan',
				'color' => '#ecfeff',
				'name'  => _x( 'Pale Cyan', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-bright-cyan',
				'color' => '#cffafe',
				'name'  => _x( 'Bright Cyan', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-light-cyan',
				'color' => '#a5f3fc',
				'name'  => _x( 'Light Cyan', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-cyan',
				'color' => '#22d3ee',
				'name'  => _x( 'Cyan', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dark-cyan',
				'color' => '#0e7490',
				'name'  => _x( 'Dark Cyan', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-heavy-cyan',
				'color' => '#083344',
				'name'  => _x( 'Heavy Cyan', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-pale-blue',
				'color' => '#eff6ff',
				'name'  => _x( 'Pale Blue', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-bright-blue',
				'color' => '#dbeafe',
				'name'  => _x( 'Bright Blue', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-light-blue',
				'color' => '#bfdbfe',
				'name'  => _x( 'Light Blue', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-blue',
				'color' => '#60a5fa',
				'name'  => _x( 'Blue', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dark-blue',
				'color' => '#1d4ed8',
				'name'  => _x( 'Dark Blue', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-heavy-blue',
				'color' => '#172554',
				'name'  => _x( 'Heavy Blue', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-pale-indigo',
				'color' => '#eef2ff',
				'name'  => _x( 'Pale Indigo', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-bright-indigo',
				'color' => '#e0e7ff',
				'name'  => _x( 'Bright Indigo', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-light-indigo',
				'color' => '#c7d2fe',
				'name'  => _x( 'Light Indigo', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-indigo',
				'color' => '#818cf8',
				'name'  => _x( 'Indigo', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dark-indigo',
				'color' => '#4338ca',
				'name'  => _x( 'Dark Indigo', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-heavy-indigo',
				'color' => '#1e1b4b',
				'name'  => _x( 'Heavy Indigo', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-pale-violet',
				'color' => '#f5f3ff',
				'name'  => _x( 'Pale Violet', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-bright-violet',
				'color' => '#ede9fe',
				'name'  => _x( 'Bright Violet', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-light-violet',
				'color' => '#ddd6fe',
				'name'  => _x( 'Light Violet', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-violet',
				'color' => '#a78bfa',
				'name'  => _x( 'Violet', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dark-violet',
				'color' => '#6d28d9',
				'name'  => _x( 'Dark Violet', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-heavy-violet',
				'color' => '#2e1065',
				'name'  => _x( 'Heavy Violet', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-pale-purple',
				'color' => '#faf5ff',
				'name'  => _x( 'Pale Purple', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-bright-purple',
				'color' => '#f3e8ff',
				'name'  => _x( 'Bright Purple', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-light-purple',
				'color' => '#e9d5ff',
				'name'  => _x( 'Light Purple', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-purple',
				'color' => '#c084fc',
				'name'  => _x( 'Purple', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dark-purple',
				'color' => '#7e22ce',
				'name'  => _x( 'Dark Purple', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-heavy-purple',
				'color' => '#3b0764',
				'name'  => _x( 'Heavy Purple', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-pale-pink',
				'color' => '#fdf2f8',
				'name'  => _x( 'Pale Pink', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-bright-pink',
				'color' => '#fce7f3',
				'name'  => _x( 'Bright Pink', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-light-pink',
				'color' => '#fbcfe8',
				'name'  => _x( 'Light Pink', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-pink',
				'color' => '#f472b6',
				'name'  => _x( 'Pink', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-dark-pink',
				'color' => '#be185d',
				'name'  => _x( 'Dark Pink', 'Color name', 'unitone' ),
			),
			array(
				'slug'  => 'unitone-heavy-pink',
				'color' => '#500724',
				'name'  => _x( 'Heavy Pink', 'Color name', 'unitone' ),
			),
		),
		$default_palette
	);

	$palette['default'] = $default_palette;

	$new_data = array(
		'version'  => 3,
		'settings' => array(
			'color' => array(
				'palette' => $palette,
			),
		),
	);

	return $theme_json->update_with( $new_data );
}
add_filter( 'wp_theme_json_data_default', 'unitone_set_color_palette' );

/**
 * Fix Noto Sans JP and Noto Serif JP baseline shift.
 * This is a fallback since it's also written in theme.json.
 *
 * @param WP_Theme_JSON_Data $theme_json Class to access and update the underlying data.
 * @return WP_Theme_JSON_Data
 */
function unitone_fix_noto_sans_baseline( $theme_json ) {
	$data = $theme_json->get_data();

	if ( empty( $data['settings']['typography']['fontFamilies']['theme'] ) ) {
		return $theme_json;
	}

	$targets = array( 'noto-sans-jp', 'noto-serif-jp' );

	foreach ( $data['settings']['typography']['fontFamilies']['theme'] as &$family ) {
		if ( empty( $family['slug'] ) || ! in_array( $family['slug'], $targets, true ) ) {
			continue;
		}

		foreach ( $family['fontFace'] as &$face ) {
			if ( empty( $face['ascentOverride'] ) ) {
				$face['ascentOverride'] = '100%';
			}
		}
	}

	return new \WP_Theme_JSON_Data( $data, 'theme' );
}
add_filter( 'wp_theme_json_data_theme', 'unitone_fix_noto_sans_baseline' );

/**
 * Convert deprecated color names to new color names.
 */
add_filter(
	'wp_theme_json_data_user',
	function ( $theme_json ) {
		$data = $theme_json->get_data();
		if ( isset( $data['styles']['color'] ) && is_array( $data['styles']['color'] ) ) {
			foreach ( $data['styles']['color'] as $key => $value ) {
				if ( $value ) {
					$data['styles']['color'][ $key ] = str_replace( '/', '-', $value );
				}
			}
		}

		if ( isset( $data['styles']['blocks'] ) && is_array( $data['styles']['blocks'] ) ) {
			foreach ( $data['styles']['blocks'] as $block_name => $block_data ) {
				if (
					isset( $data['styles']['blocks'][ $block_name ]['color'] )
					&& is_array( $data['styles']['blocks'][ $block_name ]['color'] )
				) {
					foreach ( $data['styles']['blocks'][ $block_name ]['color'] as $key => $value ) {
						$data['styles']['blocks'][ $block_name ]['color'][ $key ] = str_replace( '/', '-', $value );
					}
				}
			}
		}

		return $theme_json->update_with( $data );
	},
	9
);

/**
 * background, text, background-alt, text-alt は強制的に CSS vars に変換する。
 * CSS vars になっていないと、セットアップ画面で設定した色がカラーパレットに反映されない。
 *
 * @param WP_Theme_JSON_Data $theme_json Class to access and update the underlying data.
 * @return WP_Theme_JSON_Data
 */
function unitone_apply_css_vars_to_utility_colors( $theme_json ) {
	$data = $theme_json->get_data();

	if ( empty( $data['settings']['color']['palette']['theme'] ) ) {
		return $theme_json;
	}

	$data['settings']['color']['palette']['theme'] = array_map(
		function ( $color_object ) {
			if ( 'unitone-background' === $color_object['slug'] ) {
				$color_object['color'] = 'var(--unitone--color--background)';
			} elseif ( 'unitone-text' === $color_object['slug'] ) {
				$color_object['color'] = 'var(--unitone--color--text)';
			} elseif ( 'unitone-background-alt' === $color_object['slug'] ) {
				$color_object['color'] = 'var(--unitone--color--background-alt)';
			} elseif ( 'unitone-text-alt' === $color_object['slug'] ) {
				$color_object['color'] = 'var(--unitone--color--text-alt)';
			}
			return $color_object;
		},
		$data['settings']['color']['palette']['theme']
	);

	return $theme_json->update_with( $data );
}
add_filter( 'wp_theme_json_data_theme', 'unitone_apply_css_vars_to_utility_colors', 10000 );
add_filter( 'wp_theme_json_data_user', 'unitone_apply_css_vars_to_utility_colors', 10000 );

/**
 * Migrate the old settings in settings to the new settings.
 */
add_action(
	'after_setup_theme',
	function () {
		$deprecated_font_family = Manager::get_setting( 'font-family' );

		$deprecated_content_size = Manager::get_setting( 'content-size' );
		$deprecated_wide_size    = Manager::get_setting( 'wide-size' );

		$deprecated_accent_color     = unitone_get_preset_css_var( Manager::get_setting( 'accent-color' ) );
		$deprecated_background_color = unitone_get_preset_css_var( Manager::get_setting( 'background-color' ) );
		$deprecated_text_color       = unitone_get_preset_css_var( Manager::get_setting( 'text-color' ) );

		if (
			! $deprecated_font_family &&
			! $deprecated_content_size &&
			! $deprecated_wide_size &&
			! $deprecated_accent_color &&
			! $deprecated_background_color &&
			! $deprecated_text_color
		) {
			return;
		}

		$merged_raw_data = \WP_Theme_JSON_Resolver::get_merged_data( 'user' )->get_raw_data();

		if ( $deprecated_font_family ) {
			$current_font_family = $merged_raw_data['styles']['typography']['fontFamily'] ?? false;

			if ( $deprecated_font_family !== $current_font_family ) {
				Settings::update_global_styles(
					array(
						'settings' => array(
							'layout' => array(
								'contentSize' => $deprecated_font_family,
							),
						),
					)
				);

				Settings::update_settings(
					array(
						'font-family' => null,
					)
				);
			}
		}

		if ( $deprecated_content_size ) {
			$current_content_size = $merged_raw_data['settings']['layout']['contentSize'] ?? false;

			if ( $deprecated_content_size !== $current_content_size ) {
				Settings::update_global_styles(
					array(
						'settings' => array(
							'layout' => array(
								'contentSize' => $deprecated_content_size,
							),
						),
					)
				);

				Settings::update_settings(
					array(
						'content-size' => null,
					)
				);
			}
		}

		if ( $deprecated_wide_size ) {
			$current_wide_size = $merged_raw_data['settings']['layout']['wideSize'] ?? false;

			if ( $deprecated_wide_size !== $current_wide_size ) {
				Settings::update_global_styles(
					array(
						'settings' => array(
							'layout' => array(
								'wideSize' => $deprecated_wide_size,
							),
						),
					)
				);

				Settings::update_settings(
					array(
						'wide-size' => null,
					)
				);
			}
		}

		if ( $deprecated_accent_color ) {
			$current_accent_color = unitone_get_palette_color( 'unitone-accent', $merged_raw_data );

			if ( $deprecated_accent_color !== $current_accent_color ) {
				Settings::update_global_styles(
					array(
						'settings' => array(
							'color' => array(
								'palette' => array(
									'theme' => array(
										array(
											'slug'  => 'unitone-accent',
											'color' => $deprecated_accent_color,
										),
									),
								),
							),
						),
					)
				);

				Settings::update_settings(
					array(
						'accent-color' => null,
					)
				);
			}
		}

		if ( $deprecated_background_color ) {
			$current_background_color = $merged_raw_data['styles']['color']['background'] ?? false;

			if ( $deprecated_background_color !== $current_background_color ) {
				Settings::update_global_styles(
					array(
						'styles' => array(
							'color' => array(
								'background' => $deprecated_background_color,
							),
						),
					)
				);

				Settings::update_settings(
					array(
						'background-color' => null,
					)
				);
			}
		}

		if ( $deprecated_text_color ) {
			$current_text_color = $merged_raw_data['styles']['color']['text'] ?? false;

			if ( $deprecated_text_color !== $current_text_color ) {
				Settings::update_global_styles(
					array(
						'styles' => array(
							'color' => array(
								'text' => $deprecated_text_color,
							),
						),
					)
				);

				Settings::update_settings(
					array(
						'text-color' => null,
					)
				);
			}
		}
	}
);
