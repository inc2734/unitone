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
				'area'        => 'unitone/overlay-menu',
				'label'       => __( 'Overlay Menus', 'unitone' ),
				'icon'        => 'navigation',
				'description' => __( 'The overlay menu templates can be used as an overlay menu for the navigation block.', 'unitone' ),
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/loading-animation',
				'label'       => __( 'Loading Animations', 'unitone' ),
				'icon'        => 'layout',
				'description' => __( 'The loading animation template part will cover the page until the page is fully loaded.', 'unitone' ),
				'area_tag'    => 'div',
			),
			array(
				'area'        => 'unitone/loop',
				'label'       => __( 'Loop', 'unitone' ),
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
