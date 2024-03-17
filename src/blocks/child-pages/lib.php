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
 * @param int $current_id Post ID.
 * @return WP_Query|false
 */
function unitone_get_child_pages_query( $parent_id, $current_id ) {
	if ( wp_get_post_parent_id( get_the_ID() ) === $current_id ) {
		return;
	}

	if (
		get_the_ID() !== $current_id
		&& ! in_array( (int) $current_id, get_post_ancestors( get_the_id() ), true )
		&& ! in_array( (int) get_the_ID(), get_post_ancestors( $current_id ), true )
	) {
		return;
	}

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
