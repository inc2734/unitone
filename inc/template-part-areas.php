<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

/**
 * Filters the list of allowed template part area values.
 *
 * @param array $default_area_definitions An array of supported area objects.
 * @return array
 */
function unitone_default_wp_template_part_areas( $default_area_definitions ) {
	return array_merge(
		$default_area_definitions,
		array(
			array(
				'area'        => 'unitone/single',
				'label'       => __( 'Single Posts', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/page',
				'label'       => __( 'Pages', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/404',
				'label'       => __( '404', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/front-page',
				'label'       => __( 'Front Page', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/home',
				'label'       => __( 'Blog Home', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/archive',
				'label'       => __( 'All Archives', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/search',
				'label'       => __( 'Search Results', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/archive-product',
				'label'       => __( 'Product Catalog', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/single-product',
				'label'       => __( 'Single Products', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/bbpress',
				'label'       => __( 'bbPress', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/cart',
				'label'       => __( 'Cart', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/checkout',
				'label'       => __( 'Checkout', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/order-confirmation',
				'label'       => __( 'Order Confirmation', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/comments',
				'label'       => __( 'Comments', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/loop',
				'label'       => __( 'Loop', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
		)
	);
}
add_filter( 'default_wp_template_part_areas', 'unitone_default_wp_template_part_areas' );

/**
 * Filters the list of allowed template part area values.
 *
 * @deprecated
 * @param array $default_area_definitions An array of supported area objects.
 * @return array
 */
function unitone_deprecated_default_wp_template_part_areas( $default_area_definitions ) {
	return array_merge(
		$default_area_definitions,
		array(
			array(
				'area'        => 'unitone/template/single',
				'label'       => __( 'Single Posts', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/page-header/single',
				'label'       => __( 'Page Header for Single Posts', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'header',
			),
			array(
				'area'        => 'unitone/contents/single',
				'label'       => __( 'Main Area for Single Posts', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'main',
			),
			array(
				'area'        => 'unitone/template/page',
				'label'       => __( 'Pages', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/page-header/page',
				'label'       => __( 'Page Header for Pages', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'header',
			),
			array(
				'area'        => 'unitone/contents/page',
				'label'       => __( 'Main Area for Pages', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'main',
			),
			array(
				'area'        => 'unitone/template/404',
				'label'       => __( '404', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/contents/404',
				'label'       => __( 'Main Area for 404', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'main',
			),
			array(
				'area'        => 'unitone/page-header/404',
				'label'       => __( 'Page Header for 404', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'header',
			),
			array(
				'area'        => 'unitone/template/home',
				'label'       => __( 'Blog Home', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/page-header/home',
				'label'       => __( 'Page Header for Blog Home', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'header',
			),
			array(
				'area'        => 'unitone/contents/home',
				'label'       => __( 'Main Area for Blog Home', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'main',
			),
			array(
				'area'        => 'unitone/template/archive',
				'label'       => __( 'All Archives', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/contents/archive',
				'label'       => __( 'Main Area for All Archives', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'main',
			),
			array(
				'area'        => 'unitone/page-header/archive',
				'label'       => __( 'Page Header for All Archives', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'header',
			),
			array(
				'area'        => 'unitone/template/search',
				'label'       => __( 'Search Results', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/page-header/search',
				'label'       => __( 'Page Header for Search Results', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'header',
			),
			array(
				'area'        => 'unitone/contents/search',
				'label'       => __( 'Main Area of Search Results', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'main',
			),
			array(
				'area'        => 'unitone/template/archive-product',
				'label'       => __( 'Product Catalog', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/contents/archive-product',
				'label'       => __( 'Main Area for Product Catalog', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'main',
			),
			array(
				'area'        => 'unitone/page-header/archive-product',
				'label'       => __( 'Page Header for Product Catalog', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'header',
			),
			array(
				'area'        => 'unitone/template/product',
				'label'       => __( 'Single Products', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/page-header/product',
				'label'       => __( 'Page Header for Single Products', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'header',
			),
			array(
				'area'        => 'unitone/contents/product',
				'label'       => __( 'Main Area for Single Products', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'main',
			),
			array(
				'area'        => 'unitone/template/bbpress',
				'label'       => __( 'bbPress', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/page-header/bbpress',
				'label'       => __( 'Page Header for bbPress', 'unitone' ),
				'icon'        => 'header',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/contents/bbpress',
				'label'       => __( 'Main Area for bbPress', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'main',
			),
			array(
				'area'        => 'unitone/comments',
				'label'       => __( 'Comments', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/footer-breadcrumbs',
				'label'       => __( 'Footer breadcrumbs', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
		)
	);
}
add_filter( 'default_wp_template_part_areas', 'unitone_deprecated_default_wp_template_part_areas' );
