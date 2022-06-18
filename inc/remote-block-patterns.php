<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

/**
 * Get remote block patterns.
 *
 * @return array
 */
function unitone_get_remote_block_pattens() {
	global $wp_version;

	$transient_name = 'unitone-remote-patterns';
	$transient      = get_transient( $transient_name );
	if ( false !== $transient ) {
		return $transient;
	}

	$license_key = \Unitone\App\Controller\Manager::get_option( 'license-key' );
	$response    = wp_remote_get(
		sprintf(
			'https://unitone.2inc.org/wp-json/unitone-license-manager/v1/patterns/%1$s',
			esc_attr( $license_key )
		),
		array(
			'user-agent' => 'WordPress/' . $wp_version,
			'timeout'    => 30,
			'headers'    => array(
				'Accept-Encoding' => '',
			),
		)
	);

	if ( ! $response || is_wp_error( $response ) ) {
		return array();
	}

	$response_code = wp_remote_retrieve_response_code( $response );
	if ( 200 !== $response_code ) {
		return array();
	}

	$patterns = json_decode( wp_remote_retrieve_body( $response ), true );
	set_transient( $transient_name, $patterns, 60 * 10 );

	return $patterns;
}

/**
 * Register remote block patterns.
 * This requires a valid license key.
 */
function unitone_register_remote_block_patterns() {
	$remote_block_patterns = unitone_get_remote_block_pattens();
	$registry              = WP_Block_Patterns_Registry::get_instance();

	foreach ( $remote_block_patterns as $pattern ) {
		if ( ! $pattern['title'] || ! $pattern['slug'] || ! $pattern['content'] ) {
			continue;
		}

		$pattern_name = sanitize_title( $pattern['slug'] );
		// Some patterns might be already registered as core patterns with the `core` prefix.
		$is_registered = $registry->is_registered( $pattern_name ) || $registry->is_registered( $pattern_name );
		if ( ! $is_registered ) {
			register_block_pattern( $pattern_name, (array) $pattern );
		}
	}
}
add_action( 'init', 'unitone_register_remote_block_patterns' );
