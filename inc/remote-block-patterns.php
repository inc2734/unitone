<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

use Unitone\App\Controller\Manager\Manager;

/**
 * Get remote block pattern categories.
 *
 * @return array
 */
function unitone_get_remote_block_patten_categories() {
	global $wp_version;

	$url = 'https://unitone.2inc.org/wp-json/unitone-license-manager/v1/pattern-categories/';

	$response = wp_remote_get(
		$url,
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

	$pattern_categories = json_decode( wp_remote_retrieve_body( $response ), true );
	if ( ! is_array( $pattern_categories ) ) {
		return array();
	}

	$new_pattern_categories = array();
	foreach ( $pattern_categories as $pattern_category ) {
		$new_pattern_categories[] = array(
			'name'  => $pattern_category['slug'],
			'label' => $pattern_category['name'],
		);
	}

	return $new_pattern_categories;
}

/**
 * Get remote block patterns.
 *
 * @param string $url A URL of the remote patterns API.
 * @return array
 */
function _unitone_get_remote_block_patterns( $url ) {
	global $wp_version;

	$response = wp_remote_get(
		$url,
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
	if ( ! is_array( $patterns ) ) {
		return array();
	}

	foreach ( $patterns as $key => $pattern ) {
		$patterns[ $key ]['viewportWidth'] = 1440;
	}

	return $patterns;
}

/**
 * Get free remote block patterns.
 *
 * @return array
 */
function unitone_get_free_remote_block_pattens() {
	$url = 'https://unitone.2inc.org/wp-json/unitone-license-manager/v1/free-patterns/';

	return _unitone_get_remote_block_patterns( $url );
}

/**
 * Get premium remote block patterns.
 *
 * @return array
 */
function unitone_get_premium_remote_block_pattens() {
	$license_key = Manager::get_setting( 'license-key' );

	$url = sprintf(
		'https://unitone.2inc.org/wp-json/unitone-license-manager/v1/patterns/%1$s',
		esc_attr( $license_key )
	);

	return _unitone_get_remote_block_patterns( $url );
}

/**
 * Register remote block patterns.
 * This requires a valid license key.
 */
function unitone_register_remote_block_patterns() {
	$request_uri = filter_input( INPUT_SERVER, 'REQUEST_URI' );
	if ( ! $request_uri ) {
		$request_uri = esc_html( wp_unslash( $_SERVER['REQUEST_URI'] ?? '' ) ); // @phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
	}
	if ( $request_uri && false !== strpos( $request_uri, 'wp-json/unitone-license-manager' ) ) {
		return;
	}

	$transient = get_transient( 'unitone-remote-pattern-categories' );
	if ( false !== $transient ) {
		$remote_block_pattern_categories = $transient;
	} else {
		$remote_block_pattern_categories = unitone_get_remote_block_patten_categories();

		if ( $remote_block_pattern_categories && is_array( $remote_block_pattern_categories ) ) {
			set_transient( 'unitone-remote-pattern-categories', $remote_block_pattern_categories, DAY_IN_SECONDS );
		}
	}

	if ( ! is_array( $remote_block_pattern_categories ) ) {
		$remote_block_pattern_categories = array();
	}

	foreach ( $remote_block_pattern_categories as $remote_block_pattern_category ) {
		register_block_pattern_category(
			$remote_block_pattern_category['name'],
			array(
				'label' => '[unitone] ' . $remote_block_pattern_category['label'],
			)
		);
	}

	$transient = get_transient( 'unitone-remote-patterns' );
	if ( false !== $transient ) {
		$remote_block_patterns = $transient;
	} else {
		$license_key = Manager::get_setting( 'license-key' );
		$status      = Manager::get_license_status( $license_key );

		$remote_block_patterns = 'true' === $status
			? unitone_get_premium_remote_block_pattens()
			: unitone_get_free_remote_block_pattens();

		if ( $remote_block_patterns && is_array( $remote_block_patterns ) ) {
			set_transient( 'unitone-remote-patterns', $remote_block_patterns, DAY_IN_SECONDS );
		}
	}

	if ( ! is_array( $remote_block_patterns ) ) {
		$remote_block_patterns = array();
	}

	$registry = WP_Block_Patterns_Registry::get_instance();

	foreach ( $remote_block_patterns as $pattern ) {
		if ( ! $pattern['title'] || ! $pattern['slug'] || ! $pattern['content'] ) {
			continue;
		}

		$pattern_name = esc_html( $pattern['slug'] );
		// Some patterns might be already registered as core patterns with the `core` prefix.
		$is_registered = $registry->is_registered( $pattern_name ) || $registry->is_registered( $pattern_name );
		if ( ! $is_registered ) {
			register_block_pattern( $pattern_name, (array) $pattern );
		}
	}
}
add_action( 'init', 'unitone_register_remote_block_patterns', 9 );
