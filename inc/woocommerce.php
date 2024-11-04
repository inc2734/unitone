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

/**
 * Add templates.
 *
 * @see https://github.com/woocommerce/woocommerce/tree/trunk/plugins/woocommerce/templates/templates/blockified
 * @see https://github.com/woocommerce/woocommerce/tree/trunk/plugins/woocommerce/src/Blocks/Templates
 */
add_action(
	'init',
	function () {
		$block_templates = array(
			array(
				'slug'    => 'unitone//archive-product',
				'title'   => __( 'Product Catalog', 'unitone' ),
				'content' => file_get_contents( get_theme_file_path( 'templates.ext/woocommerce/archive-product.html' ) ),
			),
			array(
				'slug'    => 'unitone//order-confirmation',
				'title'   => __( 'Order Confirmation', 'unitone' ),
				'content' => file_get_contents( get_theme_file_path( 'templates.ext/woocommerce/order-confirmation.html' ) ),
			),
			array(
				'slug'    => 'unitone//page-cart',
				'title'   => __( 'Page: Cart', 'unitone' ),
				'content' => file_get_contents( get_theme_file_path( 'templates.ext/woocommerce/page-cart.html' ) ),
			),
			array(
				'slug'    => 'unitone//page-checkout',
				'title'   => __( 'Page: Checkout', 'unitone' ),
				'content' => file_get_contents( get_theme_file_path( 'templates.ext/woocommerce/page-checkout.html' ) ),
			),
			array(
				'slug'    => 'unitone//single-product',
				'title'   => __( 'Single Product', 'unitone' ),
				'content' => file_get_contents( get_theme_file_path( 'templates.ext/woocommerce/single-product.html' ) ),
			),
			array(
				'slug'       => 'unitone//template-single-product-one-column',
				'title'      => __( 'Single Products: One Column', 'unitone' ),
				'content'    => file_get_contents( get_theme_file_path( 'templates.ext/woocommerce/template-single-product-one-column.html' ) ),
				'post_types' => array( 'product' ),
			),
			array(
				'slug'       => 'unitone//template-single-product-one-column-page-header-image',
				'title'      => __( 'Single Products: One Column / Page Header (Image)', 'unitone' ),
				'content'    => file_get_contents( get_theme_file_path( 'templates.ext/woocommerce/template-single-product-one-column-page-header-image.html' ) ),
				'post_types' => array( 'product' ),
			),
			array(
				'slug'       => 'unitone//template-single-product-right-sidebar',
				'title'      => __( 'Single Products: Right Sidebar', 'unitone' ),
				'content'    => file_get_contents( get_theme_file_path( 'templates.ext/woocommerce/template-single-product-right-sidebar.html' ) ),
				'post_types' => array( 'product' ),
			),
			array(
				'slug'       => 'unitone//template-single-product-right-sidebar-page-header-image',
				'title'      => __( 'Single Products: Right Sidebar / Page Header (Image)', 'unitone' ),
				'content'    => file_get_contents( get_theme_file_path( 'templates.ext/woocommerce/template-single-product-right-sidebar-page-header-image.html' ) ),
				'post_types' => array( 'product' ),
			),
			array(
				'slug'       => 'unitone//template-single-product-left-header',
				'title'      => __( 'Single Products: Left Header', 'unitone' ),
				'content'    => file_get_contents( get_theme_file_path( 'templates.ext/woocommerce/template-single-product-left-header.html' ) ),
				'post_types' => array( 'product' ),
			),
			array(
				'slug'       => 'unitone//template-single-product-left-header-page-header-image',
				'title'      => __( 'Single Products: Left Header / Page Header (Image)', 'unitone' ),
				'content'    => file_get_contents( get_theme_file_path( 'templates.ext/woocommerce/template-single-product-left-header-page-header-image.html' ) ),
				'post_types' => array( 'product' ),
			),
		);

		foreach ( $block_templates as $block_template ) {
			$slug = $block_template['slug'];
			unset( $block_template['slug'] );

			register_block_template(
				$slug,
				$block_template
			);
		}

		add_filter(
			'wp_theme_json_data_theme',
			function ( $theme_json ) use ( $block_templates ) {
				$custom_templates = array_map(
					function ( $block_template ) {
						if ( empty( $block_template['post_types'] ) ) {
							return false;
						}

						return array(
							'name'      => str_replace( 'unitone//', '', $block_template['slug'] ),
							'title'     => $block_template['title'],
							'postTypes' => $block_template['post_types'],
						);
					},
					$block_templates
				);

				$custom_templates = array_filter(
					$custom_templates,
					function ( $custom_template ) {
						return is_array( $custom_template );
					}
				);

				$raw_data = $theme_json->get_data();

				$new_data = array(
					'version'         => $raw_data['version'],
					'customTemplates' => array_merge(
						$raw_data['customTemplates'],
						$custom_templates
					),
				);

				return $theme_json->update_with( $new_data );
			}
		);
	}
);

/**
 * Add patterns.
 */
add_action(
	'init',
	function () {
		$patterns = array(
			array(
				'title'    => __( 'Main Area (One Column) for Product Catalog', 'unitone' ),
				'slug'     => 'unitone/template/archive-product/main/one-column',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/woocommerce/private/template/archive-product/main/one-column.php' ),
			),
			array(
				'title'    => __( 'Main Area (One Column / Page Header (Image)) for Product Catalog', 'unitone' ),
				'slug'     => 'unitone/template/archive-product/main/one-column-page-header-image',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/woocommerce/private/template/archive-product/main/one-column-page-header-image.php' ),
			),
			array(
				'title'    => __( 'Main Area (Right Sidebar / Page Header (Image)) for Product Catalog', 'unitone' ),
				'slug'     => 'unitone/template/archive-product/main/right-sidebar-page-header-image',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/woocommerce/private/template/archive-product/main/right-sidebar-page-header-image.php' ),
			),
			array(
				'title'    => __( 'Main Area (Right Sidebar) for Product Catalog', 'unitone' ),
				'slug'     => 'unitone/template/archive-product/main/right-sidebar',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/woocommerce/private/template/archive-product/main/right-sidebar.php' ),
			),
			array(
				'title'    => __( 'Page Header (Image) for Product Catalog', 'unitone' ),
				'slug'     => 'unitone/template/archive-product/page-header/image',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/woocommerce/private/template/archive-product/page-header/image.php' ),
			),
			array(
				'title'    => __( 'Page Header for Product Catalog', 'unitone' ),
				'slug'     => 'unitone/template/archive-product/page-header/default',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/woocommerce/private/template/archive-product/page-header/default.php' ),
			),

			array(
				'title'    => __( 'Contents for Cart', 'unitone' ),
				'slug'     => 'unitone/template/cart/cart',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/woocommerce/private/template/cart/cart.php' ),
			),
			array(
				'title'    => __( 'Main Area (One Column) for Cart', 'unitone' ),
				'slug'     => 'unitone/template/cart/main/one-column',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/woocommerce/private/template/cart/main/one-column.php' ),
			),
			array(
				'title'    => __( 'Main Area (One Column / Page Header (Image)) for Cart', 'unitone' ),
				'slug'     => 'unitone/template/cart/main/one-column-page-header-image',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/woocommerce/private/template/cart/main/one-column-page-header-image.php' ),
			),
			array(
				'title'    => __( 'Page Header (Image) for Cart', 'unitone' ),
				'slug'     => 'unitone/template/cart/page-header/image',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/woocommerce/private/template/cart/page-header/image.php' ),
			),
			array(
				'title'    => __( 'Page Header for Cart', 'unitone' ),
				'slug'     => 'unitone/template/cart/page-header/default',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/woocommerce/private/template/cart/page-header/default.php' ),
			),

			array(
				'title'    => __( 'Contents for Checkout', 'unitone' ),
				'slug'     => 'unitone/template/checkout/checkout',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/woocommerce/private/template/checkout/checkout.php' ),
			),
			array(
				'title'    => __( 'Main Area (One Column) for Checkout', 'unitone' ),
				'slug'     => 'unitone/template/checkout/main/one-column',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/woocommerce/private/template/checkout/main/one-column.php' ),
			),
			array(
				'title'    => __( 'Main Area (One Column / Page Header (Image)) for Checkout', 'unitone' ),
				'slug'     => 'unitone/template/checkout/main/one-column-page-header-image',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/woocommerce/private/template/checkout/main/one-column-page-header-image.php' ),
			),
			array(
				'title'    => __( 'Page Header (Image) for Checkout', 'unitone' ),
				'slug'     => 'unitone/template/checkout/page-header/image',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/woocommerce/private/template/checkout/page-header/image.php' ),
			),
			array(
				'title'    => __( 'Page Header for Checkout', 'unitone' ),
				'slug'     => 'unitone/template/checkout/page-header/default',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/woocommerce/private/template/checkout/page-header/default.php' ),
			),

			array(
				'title'    => __( 'Contents for Order Confirmation', 'unitone' ),
				'slug'     => 'unitone/template/order-confirmation/order-confirmation',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/woocommerce/private/template/order-confirmation/order-confirmation.php' ),
			),
			array(
				'title'    => __( 'Main Area (One Column) for Order Confirmation', 'unitone' ),
				'slug'     => 'unitone/template/order-confirmation/main/one-column',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/woocommerce/private/template/order-confirmation/main/one-column.php' ),
			),
			array(
				'title'    => __( 'Main Area (One Column / Page Header (Image)) for Order Confirmation', 'unitone' ),
				'slug'     => 'unitone/template/order-confirmation/main/one-column-page-header-image',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/woocommerce/private/template/order-confirmation/main/one-column-page-header-image.php' ),
			),
			array(
				'title'    => __( 'Page Header (Image) for Order Confirmation', 'unitone' ),
				'slug'     => 'unitone/template/order-confirmation/page-header/image',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/woocommerce/private/template/order-confirmation/page-header/image.php' ),
			),
			array(
				'title'    => __( 'Page Header for Order Confirmation', 'unitone' ),
				'slug'     => 'unitone/template/order-confirmation/page-header/default',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/woocommerce/private/template/order-confirmation/page-header/default.php' ),
			),

			array(
				'title'    => __( 'Main Area (One Column) for Single Products', 'unitone' ),
				'slug'     => 'unitone/template/single-product/main/one-column',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/woocommerce/private/template/single-product/main/one-column.php' ),
			),
			array(
				'title'    => __( 'Main Area (One Column / Page Header (Image)) for Single Products', 'unitone' ),
				'slug'     => 'unitone/template/single-product/main/one-column-page-header-image',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/woocommerce/private/template/single-product/main/one-column-page-header-image.php' ),
			),
			array(
				'title'    => __( 'Main Area (Right Sidebar / Page Header (Image)) for Single Products', 'unitone' ),
				'slug'     => 'unitone/template/single-product/main/right-sidebar-page-header-image',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/woocommerce/private/template/single-product/main/right-sidebar-page-header-image.php' ),
			),
			array(
				'title'    => __( 'Main Area (Right Sidebar) for Single Products', 'unitone' ),
				'slug'     => 'unitone/template/single-product/main/right-sidebar',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/woocommerce/private/template/single-product/main/right-sidebar.php' ),
			),
			array(
				'title'    => __( 'Page Header (Image) for Single Products', 'unitone' ),
				'slug'     => 'unitone/template/single-product/page-header/image',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/woocommerce/private/template/single-product/page-header/image.php' ),
			),

			array(
				'title'         => __( 'Product Catalog: Left Header / Page Header (Image)', 'unitone' ),
				'slug'          => 'unitone/template/archive-product/left-header-page-header-image',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'archive-product' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/woocommerce/template-archive-product-left-header-page-header-image.php' ),
			),
			array(
				'title'         => __( 'Product Catalog: Left Header', 'unitone' ),
				'slug'          => 'unitone/template/archive-product/left-header',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'archive-product' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/woocommerce/template-archive-product-left-header.php' ),
			),
			array(
				'title'         => __( 'Product Catalog: One Column / Page Header (Image)', 'unitone' ),
				'slug'          => 'unitone/template/archive-product/one-column-page-header-image',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'archive-product' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/woocommerce/template-archive-product-one-column-page-header-image.php' ),
			),
			array(
				'title'         => __( 'Product Catalog: One Column', 'unitone' ),
				'slug'          => 'unitone/template/archive-product/one-column',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'archive-product' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/woocommerce/template-archive-product-one-column.php' ),
			),
			array(
				'title'         => __( 'Product Catalog: Right Sidebar / Page Header (Image)', 'unitone' ),
				'slug'          => 'unitone/template/archive-product/right-sidebar-page-header-image',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'archive-product' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/woocommerce/template-archive-product-right-sidebar-page-header-image.php' ),
			),
			array(
				'title'         => __( 'Product Catalog: Right Sidebar', 'unitone' ),
				'slug'          => 'unitone/template/archive-product/right-sidebar',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'archive-product' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/woocommerce/template-archive-product-right-sidebar.php' ),
			),
			array(
				'title'         => __( 'Cart: Left Header / Page Header (Image)', 'unitone' ),
				'slug'          => 'unitone/template/cart/left-header-page-header-image',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'page-cart' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/woocommerce/template-cart-left-header-page-header-image.php' ),
			),
			array(
				'title'         => __( 'Cart: Left Header', 'unitone' ),
				'slug'          => 'unitone/template/cart/left-header',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'page-cart' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/woocommerce/template-cart-left-header.php' ),
			),
			array(
				'title'         => __( 'Cart: One Column / Page Header (Image)', 'unitone' ),
				'slug'          => 'unitone/template/cart/one-column-page-header-image',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'page-cart' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/woocommerce/template-cart-one-column-page-header-image.php' ),
			),
			array(
				'title'         => __( 'Cart: One Column', 'unitone' ),
				'slug'          => 'unitone/template/cart/one-column',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'page-cart' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/woocommerce/template-cart-one-column.php' ),
			),
			array(
				'title'         => __( 'Checkout: Left Header / Page Header (Image)', 'unitone' ),
				'slug'          => 'unitone/template/checkout/left-header-page-header-image',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'page-checkout' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/woocommerce/template-checkout-left-header-page-header-image.php' ),
			),
			array(
				'title'         => __( 'Checkout: Left Header', 'unitone' ),
				'slug'          => 'unitone/template/checkout/left-header',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'page-checkout' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/woocommerce/template-checkout-left-header.php' ),
			),
			array(
				'title'         => __( 'Checkout: One Column / Page Header (Image)', 'unitone' ),
				'slug'          => 'unitone/template/checkout/one-column-page-header-image',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'page-checkout' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/woocommerce/template-checkout-one-column-page-header-image.php' ),
			),
			array(
				'title'         => __( 'Checkout: One Column', 'unitone' ),
				'slug'          => 'unitone/template/checkout/one-column',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'page-checkout' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/woocommerce/template-checkout-one-column.php' ),
			),
			array(
				'title'         => __( 'Order Confirmation: Left Header / Page Header (Image)', 'unitone' ),
				'slug'          => 'unitone/template/order-confirmation/left-header-page-header-image',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'order-confirmation' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/woocommerce/template-order-confirmation-left-header-page-header-image.php' ),
			),
			array(
				'title'         => __( 'Order Confirmation: Left Header', 'unitone' ),
				'slug'          => 'unitone/template/order-confirmation/left-header',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'order-confirmation' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/woocommerce/template-order-confirmation-left-header.php' ),
			),
			array(
				'title'         => __( 'Order Confirmation: One Column / Page Header (Image)', 'unitone' ),
				'slug'          => 'unitone/template/order-confirmation/one-column-page-header-image',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'order-confirmation' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/woocommerce/template-order-confirmation-one-column-page-header-image.php' ),
			),
			array(
				'title'         => __( 'Order Confirmation: One Column', 'unitone' ),
				'slug'          => 'unitone/template/order-confirmation/one-column',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'order-confirmation' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/woocommerce/template-order-confirmation-one-column.php' ),
			),
			array(
				'title'         => __( 'Single Products: Left Header / Page Header (Image)', 'unitone' ),
				'slug'          => 'unitone/template/single-product/left-header-page-header-image',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'single-product' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/woocommerce/template-single-product-left-header-page-header-image.php' ),
			),
			array(
				'title'         => __( 'Single Products: Left Header', 'unitone' ),
				'slug'          => 'unitone/template/single-product/left-header',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'single-product' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/woocommerce/template-single-product-left-header.php' ),
			),
			array(
				'title'         => __( 'Single Products: One Column / Page Header (Image)', 'unitone' ),
				'slug'          => 'unitone/template/single-product/one-column-page-header-image',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'single-product' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/woocommerce/template-single-product-one-column-page-header-image.php' ),
			),
			array(
				'title'         => __( 'Single Products: One Column', 'unitone' ),
				'slug'          => 'unitone/template/single-product/one-column',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'single-product' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/woocommerce/template-single-product-one-column.php' ),
			),
			array(
				'title'         => __( 'Single Products: Right Sidebar / Page Header (Image)', 'unitone' ),
				'slug'          => 'unitone/template/single-product/right-sidebar-page-header-image',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'single-product' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/woocommerce/template-single-product-right-sidebar-page-header-image.php' ),
			),
			array(
				'title'         => __( 'Single Products: Right Sidebar', 'unitone' ),
				'slug'          => 'unitone/template/single-product/right-sidebar',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'single-product' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/woocommerce/template-single-product-right-sidebar.php' ),
			),
			array(
				'title'         => __( 'Single Posts: Right Sidebar / Page Header (Featured Image)', 'unitone' ),
				'slug'          => 'unitone/template/single/right-sidebar-page-header-featured',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'single-product' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/woocommerce/template-single-right-sidebar-page-header-featured.php' ),
			),
			array(
				'title'         => __( 'Single Posts: Right Sidebar / Page Header (Image)', 'unitone' ),
				'slug'          => 'unitone/template/single/right-sidebar-page-header-image',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'single-product' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/woocommerce/template-single-right-sidebar-page-header-image.php' ),
			),
			array(
				'title'         => __( 'Single Posts: Right Sidebar', 'unitone' ),
				'slug'          => 'unitone/template/single/right-sidebar',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'single-product' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/woocommerce/template-single-right-sidebar.php' ),
			),
		);

		foreach ( $patterns as $pattern ) {
			ob_start();
			include $pattern['path'];
			$pattern['content'] = ob_get_clean();
			unset( $pattern['path'] );
			register_block_pattern( $pattern['slug'], $pattern );
		}
	},
	9
);
