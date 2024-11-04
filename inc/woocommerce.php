<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

if ( ! class_exists( 'woocommerce' ) ) {
	return;
}

/**
 * WooCommerce setup
 */
add_action(
	'after_setup_theme',
	function () {
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
