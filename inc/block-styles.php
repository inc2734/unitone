<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

function unitone_register_block_styles() {
	register_block_style(
		'core/post-terms',
		array(
			'name'  => 'badge',
			'label' => __( 'Badge', 'unitone' ),
		)
	);

	register_block_style(
		'core/post-terms',
		array(
			'name'  => 'outline',
			'label' => __( 'Outline', 'unitone' ),
		)
	);

	register_block_style(
		'core/query',
		array(
			'name'  => 'underline',
			'label' => __( 'Underline', 'unitone' ),
		)
	);

	register_block_style(
		'core/query',
		array(
			'name'  => 'bordered',
			'label' => __( 'Bordered', 'unitone' ),
		)
	);

	register_block_style(
		'core/query',
		array(
			'name'  => 'stripe',
			'label' => __( 'Stripe', 'unitone' ),
		)
	);

	register_block_style(
		'core/query',
		array(
			'name'  => 'block-link-underline',
			'label' => __( 'Block link (Underline)', 'unitone' ),
		)
	);

	register_block_style(
		'core/query',
		array(
			'name'  => 'block-link-bordered',
			'label' => __( 'Block link (Bordered)', 'unitone' ),
		)
	);

	register_block_style(
		'core/query',
		array(
			'name'  => 'block-link-stripe',
			'label' => __( 'Block link (Stripe)', 'unitone' ),
		)
	);

	register_block_style(
		'core/template-part/header',
		array(
			'name'  => 'block-link-bordered',
			'label' => __( 'Block link (Bordered)', 'unitone' ),
		)
	);

	register_block_style(
		'core/navigation',
		array(
			'name'  => 'unitone',
			'label' => __( 'unitone', 'unitone' ),
		)
	);

	register_block_style(
		'core/image',
		array(
			'name'  => 'cover',
			'label' => __( 'Cover', 'unitone' ),
		)
	);
}
add_action( 'init', 'unitone_register_block_styles', 9 );

/**
 * Add CSS for .is-style-badge.
 */
// foreach ( array( 'wp_enqueue_scripts', 'enqueue_block_editor_assets' ) as $hook ) {
// 	add_action(
// 		$hook,
// 		function() {
// 			$color_settings = WP_Theme_JSON_Resolver::get_merged_data()->get_raw_data()['settings']['color'];
// 			$duotone        = ! empty( $color_settings['duotone'] ) ? $color_settings['duotone'] : array();
// 			$gradients      = ! empty( $color_settings['gradients'] ) ? $color_settings['gradients'] : array();
// 			$palette        = ! empty( $color_settings['palette'] ) ? $color_settings['palette'] : array();

// 			$categories = array(
// 				'duotone'   => $duotone,
// 				'gradients' => $gradients,
// 				'color'     => $palette,
// 			);

// 			$css = '';
// 			foreach ( $categories as $category_name => $category ) {
// 				foreach ( $category as $type ) {
// 					foreach ( $type as $color ) {
// 						$slug = str_replace( '/', '-', $color['slug'] );
// 						$css .= sprintf(
// 							'.is-style-badge.has-%1$s-background-color a {background-color: var(--wp--preset--%2$s--%1$s)}',
// 							$slug,
// 							$category_name
// 						);
// 					}
// 				}
// 			}
// 			wp_add_inline_style( 'unitone', $css );
// 		}
// 	);
// }
