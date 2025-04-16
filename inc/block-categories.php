<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

/**
 * Register block categories.
 *
 * @param array $categories Array of categories for block types.
 */
function unitone_block_categories_all( $categories ) {
	$slugs = array_column( $categories, 'slug' );

	$new_categories = array();

	if ( ! in_array( 'unitone/layout', $slugs, true ) ) {
		$new_categories[] = array(
			'slug'  => 'unitone/layout',
			'title' => '['
								. __( 'unitone', 'unitone' )
								. ']'
								. ' '
								. __( 'Layout', 'unitone' ),
		);
	}

	if ( ! in_array( 'unitone/component', $slugs, true ) ) {
		$new_categories[] = array(
			'slug'  => 'unitone/component',
			'title' => '['
								. __( 'unitone', 'unitone' )
								. ']'
								. ' '
								. __( 'Components', 'unitone' ),
		);
	}

	if ( ! in_array( 'unitone/section', $slugs, true ) ) {
		$new_categories[] = array(
			'slug'  => 'unitone/section',
			'title' => '['
								. __( 'unitone', 'unitone' )
								. ']'
								. ' '
								. __( 'Sections', 'unitone' ),
		);
	}

	if ( ! in_array( 'unitone/widget', $slugs, true ) ) {
		$new_categories[] = array(
			'slug'  => 'unitone/widget',
			'title' => '['
								. __( 'unitone', 'unitone' )
								. ']'
								. ' '
								. __( 'Widgets', 'unitone' ),
		);
	}

	if ( $new_categories ) {
		$prioritize_unitone_over_core = apply_filters( 'unitone_block_categories_prioritize_unitone_over_core', true );
		if ( $prioritize_unitone_over_core ) {
			$categories = array_merge( $new_categories, $categories );
		} else {
			$categories = array_merge( $categories, $new_categories );
		}
	}

	return $categories;
}
add_filter( 'block_categories_all', 'unitone_block_categories_all' );
