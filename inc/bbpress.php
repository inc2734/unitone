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
 * Remove author IP address.
 */
add_filter( 'bbp_get_author_ip', '__return_null' );
