<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

/**
 * Remove non-revisioned unitone meta from REST revision responses.
 *
 * @param WP_REST_Response $response The revision response.
 * @param WP_Post          $revision The revision post.
 * @param WP_REST_Request  $request  The request used to generate the response.
 * @return WP_REST_Response
 */
function unitone_filter_revision_meta( $response, $revision, $request ) {
	if ( 'GET' !== $request->get_method() || ! preg_match( '#/revisions(?:/[0-9]+)?$#D', $request->get_route() ) ) {
		return $response;
	}

	$data = $response->get_data();
	if ( ! isset( $data['meta'] ) || ! is_array( $data['meta'] ) ) {
		return $response;
	}

	$post = get_post( $revision->post_parent );
	if ( ! $post ) {
		return $response;
	}

	$keys = array_diff(
		array( 'unitone-ogp-image-id', 'unitone-override-settings' ),
		wp_post_revision_meta_keys( $post->post_type )
	);
	foreach ( $keys as $key ) {
		unset( $data['meta'][ $key ] );
	}

	$response->set_data( $data );
	return $response;
}

// Before Core filters revision meta, the editor can save defaults over the current values during a restore.
if ( ! class_exists( 'WP_REST_Revision_Meta_Fields' ) ) {
	add_filter( 'rest_prepare_revision', 'unitone_filter_revision_meta', 10, 3 );
}
