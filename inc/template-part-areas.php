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
				'area'        => 'unitone/single/template',
				'label'       => __( 'Single Posts', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/page/template',
				'label'       => __( 'Pages', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/404/template',
				'label'       => __( '404', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/home/template',
				'label'       => __( 'Blog Home', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/archive/template',
				'label'       => __( 'All Archives', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/search/template',
				'label'       => __( 'Search Results', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/archive-product/template',
				'label'       => __( 'Product Archives', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/single-product/template',
				'label'       => __( 'Single Products', 'unitone' ),
				'icon'        => 'layout',
				'description' => '',
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/bbpress/template',
				'label'       => __( 'bbPress', 'unitone' ),
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
		)
	);
}
add_filter( 'default_wp_template_part_areas', 'unitone_default_wp_template_part_areas' );
