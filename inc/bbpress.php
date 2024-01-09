<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

/**
 * If bbPress is not installed, remove templates for bbPress.
 */
if ( ! class_exists( 'bbpress' ) ) {
	add_filter(
		'get_block_templates',
		function( $templates ) {
			$templates_for_woocommere = array(
				'bbpress',
				'woocommerce/bbpress',
			);

			foreach ( $templates as $index => $template ) {
				if ( in_array( $template->slug, $templates_for_woocommere, true ) ) {
					unset( $templates[ $index ] );
				}
			}

			return $templates;
		}
	);
}

if ( ! class_exists( 'bbPress' ) ) {
	return;
}

/**
 * Using block templates.
 */
add_filter(
	'bbp_template_include',
	function( $template ) {

		if (
			bbp_is_forum_archive() ||
			bbp_is_topic_archive() ||
			bbp_is_search() ||
			bbp_is_single_user_edit() ||
			bbp_is_single_user()
		) {
			add_filter(
				'the_content',
				function() {
					global $post;

					return $post->post_content;
				}
			);
		}

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
