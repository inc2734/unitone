<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

/**
 * Return WP_Query for child pages.
 *
 * @param int $parent_id Parent post ID.
 * @return WP_Query|false
 */
function unitone_get_child_pages_query( $parent_id ) {
	$post_type = get_post_type( $parent_id );
	if ( ! $post_type ) {
		return false;
	}

	$post_type_object = get_post_type_object( $post_type );
	if ( ! $post_type_object->hierarchical ) {
		return false;
	}

	$args = array(
		'post_parent'    => $parent_id,
		'post_type'      => $post_type,
		'posts_per_page' => 100,
		'post_status'    => 'publish',
		'orderby'        => 'menu_order',
		'order'          => 'ASC',
	);
	$args = apply_filters( 'unitone_child_pages_args', $args );

	return new WP_Query( $args );
}
