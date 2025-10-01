<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

/**
 * Register meta.
 */
add_action(
	'init',
	function () {
		register_meta(
			'post',
			'unitone-override-settings',
			array(
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							'accent-color'     => array(
								'type' => 'string',
							),
							'background-color' => array(
								'type' => 'string',
							),
							'text-color'       => array(
								'type' => 'string',
							),
							'base-font-size'   => array(
								'type' => 'integer',
							),
							'font-family'      => array(
								'type' => 'string',
							),
							'half-leading'     => array(
								'type' => 'float',
							),
							'content-size'     => array(
								'type' => 'string',
							),
							'wide-size'        => array(
								'type' => 'string',
							),
						),
					),
				),
				'type'          => 'object',
				'single'        => true,
				'auth_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}
);

add_action(
	'wp_enqueue_scripts',
	function () {
		if ( ! is_singular() ) {
			return;
		}

		$meta                 = get_post_meta( get_the_ID(), 'unitone-override-settings', true );
		$new_accent_color     = $meta['accent-color'] ?? null;
		$new_background_color = $meta['background-color'] ?? null;
		$new_text_color       = $meta['text-color'] ?? null;
		$new_base_font_size   = $meta['base-font-size'] ?? null;
		$new_font_family      = $meta['font-family'] ?? null;
		$new_half_leading     = $meta['half-leading'] ?? null;
		$new_content_size     = $meta['content-size'] ?? null;
		$new_wide_size        = $meta['wide-size'] ?? null;

		$override_styles = array_diff(
			array(
				'--unitone--color--accent'          => $new_accent_color,
				'--unitone--color--background'      => $new_background_color,
				'--unitone--color--text'            => $new_text_color,
				'--unitone--base-font-size'         => $new_base_font_size,
				'--unitone--font-family'            => unitone_get_preset_css_var( $new_font_family ),
				'--unitone--half-leading'           => $new_half_leading,
				'--wp--style--global--content-size' => $new_content_size,
				'--wp--style--global--wide-size'    => $new_wide_size,
			),
			array( null )
		);

		if ( $override_styles ) {
			$css = array();
			foreach ( $override_styles as $property => $value ) {
				$css[] = $property . ':' . $value;
			}

			wp_add_inline_style(
				'unitone',
				':root {' . implode( ';', $css ) . '}'
			);
		}

		$override_styles = array_diff(
			array(
				'background-color' => $new_background_color,
				'color'            => $new_text_color,
				'font-family'      => unitone_get_preset_css_var( $new_font_family ),
			),
			array( null )
		);

		if ( $override_styles ) {
			$css = array();
			foreach ( $override_styles as $property => $value ) {
				$css[] = $property . ':' . $value;
			}

			wp_add_inline_style(
				'unitone',
				'body {' . implode( ';', $css ) . '}'
			);
		}
	}
);

/**
 * A patch that makes the max width of the block directly below the article a custom property.
 *
 * @param array $editor_settings Default editor settings.
 * @return array
 */
function unitone_blocks_max_width_patch_for_editor( $editor_settings ) {
	if ( ! isset( $editor_settings['styles'] ) || ! is_array( $editor_settings['styles'] ) ) {
		$editor_settings['styles'] = array();
	}

	$css  = ':is(div.editor-visual-editor__post-title-wrapper, div.block-editor-block-list__layout.is-root-container:where(:not(.wp-site-blocks))) > :where(:not(.alignleft):not(.alignright):not(.alignfull)) {';
	$css .= 'max-width: var(--wp--style--global--content-size)';
	$css .= '}';
	$css .= ':is(div.editor-visual-editor__post-title-wrapper, div.block-editor-block-list__layout.is-root-container:where(:not(.wp-site-blocks))) > .alignwide {';
	$css .= 'max-width: var(--wp--style--global--wide-size)';
	$css .= '}';

	$editor_settings['styles'][] = array(
		'css'            => $css,
		'__unstableType' => 'theme',
		'isGlobalStyles' => false,
	);

	return $editor_settings;
}
add_filter( 'block_editor_settings_all', 'unitone_blocks_max_width_patch_for_editor' );
