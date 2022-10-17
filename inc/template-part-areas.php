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
				'area'        => 'unitone/template/single',
				'label'       => __( 'Single post', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/page-header/single',
				'label'       => __( 'Single post page header', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'header',
			),
			array(
				'area'        => 'unitone/contents/single',
				'label'       => __( 'Single post contents', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'main',
			),
			array(
				'area'        => 'unitone/template/page',
				'label'       => __( 'Page', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/page-header/page',
				'label'       => __( 'Page page header', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'header',
			),
			array(
				'area'        => 'unitone/contents/page',
				'label'       => __( 'Page contents', 'unitone' ),
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
				'label'       => __( '404 contents', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'main',
			),
			array(
				'area'        => 'unitone/page-header/404',
				'label'       => __( '404 page header', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'header',
			),
			array(
				'area'        => 'unitone/template/home',
				'label'       => __( 'Home', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/page-header/home',
				'label'       => __( 'Home page header', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'header',
			),
			array(
				'area'        => 'unitone/contents/home',
				'label'       => __( 'Home contents', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'main',
			),
			array(
				'area'        => 'unitone/template/archive',
				'label'       => __( 'Archive', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/contents/archive',
				'label'       => __( 'Archive contents', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'main',
			),
			array(
				'area'        => 'unitone/page-header/archive',
				'label'       => __( 'Archive page header', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'header',
			),
			array(
				'area'        => 'unitone/template/search',
				'label'       => __( 'Search', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/page-header/search',
				'label'       => __( 'Search page header', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'header',
			),
			array(
				'area'        => 'unitone/contents/search',
				'label'       => __( 'Search contents', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'main',
			),
			array(
				'area'        => 'unitone/template/archive-product',
				'label'       => __( 'WooCommerce product archive', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/contents/archive-product',
				'label'       => __( 'WooCommerce product archive contents', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'main',
			),
			array(
				'area'        => 'unitone/page-header/archive-product',
				'label'       => __( 'WooCommerce product archive page header', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'header',
			),
			array(
				'area'        => 'unitone/template/product',
				'label'       => __( 'WooCommerce single product', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/page-header/product',
				'label'       => __( 'WooCommerce single product page header', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'header',
			),
			array(
				'area'        => 'unitone/contents/product',
				'label'       => __( 'WooCommerce single product contents', 'unitone' ),
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
				'label'       => __( 'bbPress page header', 'unitone' ),
				'icon'        => 'header',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/contents/bbpress',
				'label'       => __( 'bbPress contents', 'unitone' ),
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
add_filter( 'default_wp_template_part_areas', 'unitone_default_wp_template_part_areas' );
