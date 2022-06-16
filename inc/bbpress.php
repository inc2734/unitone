<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

if ( ! class_exists( 'bbPress' ) ) {
	return;
}

/**
 * Using block templates.
 */
add_filter(
	'bbp_template_include',
	function( $template ) {
		return ABSPATH . WPINC . '/template-canvas.php';
	}
);

/**
 * Using templates/page-bbpress.html.
 *
 * When this callback is disabled,
 * - example.com/forums/users ... Used templates/index.html
 * - example.com/forums/            ... Used templates/archive.html
 * - example.com/topics/            ... Used templates/archive.html
 */
add_filter(
	'pre_get_block_templates',
	function( $query_result ) {
		if ( is_bbpress() ) {
			return array(
				get_block_template( 'unitone//bbpress' ),
			);
		}
		return $query_result;
	}
);

/**
 * Remove author IP address.
 */
add_filter( 'bbp_get_author_ip', '__return_null' );
