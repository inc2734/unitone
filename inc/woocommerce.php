<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

/**
 * If WooCommerce is not installed, remove templates for WooCommerce.
 */
if ( ! class_exists( 'woocommerce' ) ) {
	add_filter(
		'get_block_templates',
		function( $templates ) {
			$templates_for_woocommere = array(
				'archive-product',
				'order-confirmation',
				'page-cart',
				'page-checkout',
				'single-product',
				'temlate-single-product-one-column-page-header-image',
				'temlate-single-product-right-sidebar-page-header-image',
				'temlate-single-product-left-header-page-header-image',
				'temlate-single-product-left-header',
				'temlate-single-product-left-header-header-footer',
				'temlate-single-product-right-sidebar',
				'temlate-single-product-one-column',
			);

			foreach ( $templates as $index => $template ) {
				if ( in_array( $template->slug, $templates_for_woocommere, true ) ) {
					unset( $templates[ $index ] );
				}
			}

			return $templates;
		}
	);
}

if ( ! class_exists( 'woocommerce' ) ) {
	return;
}

/**
 * WooCommerce setup
 */
add_action(
	'after_setup_theme',
	function() {
		add_theme_support( 'woocommerce' );
		add_theme_support( 'wc-product-gallery-zoom' );
		add_theme_support( 'wc-product-gallery-lightbox' );
		add_theme_support( 'wc-product-gallery-slider' );
	}
);

/**
 * With WooCommerce 7.6, if true is not returned, the Classic template block will not be displayed in the product details.
 *
 * @see https://github.com/woocommerce/woocommerce-blocks/pull/8442
 */
add_filter( 'woocommerce_disable_compatibility_layer', '__return_true' );
