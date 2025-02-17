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
 * @param array $args An array of request arguments.
 * @return array
 */
function _unitone_get_remote_block_patterns( $url, array $args = array() ) {
	global $wp_version;

	$response = wp_remote_get(
		$url,
		array(
			'user-agent' => 'WordPress/' . $wp_version,
			'timeout'    => 30,
			'headers'    => array_merge(
				$args,
				array(
					'Accept-Encoding' => '',
				)
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
function unitone_get_free_remote_block_patterns() {
	$url = 'https://unitone.2inc.org/wp-json/unitone-license-manager/v1/free-patterns/';

	return _unitone_get_remote_block_patterns(
		$url,
		array(
			'X-Unitone-Locale' => get_locale(),
		)
	);
}

/**
 * Get premium remote block patterns.
 *
 * @return array
 */
function unitone_get_premium_remote_block_patterns() {
	$url = 'https://unitone.2inc.org/wp-json/unitone-license-manager/v1/patterns/';

	return _unitone_get_remote_block_patterns(
		$url,
		array(
			'X-Unitone-License-key' => Manager::get_setting( 'license-key' ),
			'X-Unitone-Locale'      => get_locale(),
		)
	);
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

	$license_key = Manager::get_setting( 'license-key' );
	$status      = Manager::get_license_status( $license_key );

	// Get categofies.
	$block_pattern_categories_transient_name = 'unitone-remote-pattern-categories';
	$block_pattern_categories                = get_transient( $block_pattern_categories_transient_name );
	if ( false === $block_pattern_categories || ! is_array( $block_pattern_categories ) ) {
		$new_block_pattern_categories = unitone_get_remote_block_patten_categories();
		$block_pattern_categories     = is_array( $new_block_pattern_categories )
			? $new_block_pattern_categories
			: array();
		set_transient( $block_pattern_categories_transient_name, $block_pattern_categories, WEEK_IN_SECONDS );
	}

	// Get patterns.
	$premium_block_patterns_transient_name = 'unitone-premium-remote-patterns';
	$premium_block_patterns                = get_transient( $premium_block_patterns_transient_name );
	$free_block_patterns_transient_name    = 'unitone-free-remote-patterns';
	$free_block_patterns                   = get_transient( $free_block_patterns_transient_name );
	$block_patterns                        = array();
	$registry                              = WP_Block_Patterns_Registry::get_instance();

	if ( 'true' === $status ) { // Get premium pattens.
		if ( false === $premium_block_patterns || ! is_array( $premium_block_patterns ) ) {
			$premium_block_patterns = unitone_get_premium_remote_block_patterns();
			if ( ! is_array( $premium_block_patterns ) ) {
				$premium_block_patterns = array();
			}

			set_transient( $premium_block_patterns_transient_name, $premium_block_patterns, WEEK_IN_SECONDS );
		}

		$block_patterns = $premium_block_patterns;
	} elseif ( 'false' === $status ) { // Get free pattens.
		delete_transient( $premium_block_patterns_transient_name );

		if ( false === $free_block_patterns || ! is_array( $free_block_patterns ) ) {
			$free_block_patterns = unitone_get_free_remote_block_patterns();
			if ( ! is_array( $free_block_patterns ) ) {
				$free_block_patterns = array();
			}

			set_transient( $free_block_patterns_transient_name, $free_block_patterns, WEEK_IN_SECONDS );
		}

		$block_patterns = $free_block_patterns;
	} elseif ( ! empty( $premium_block_patterns ) && is_array( $premium_block_patterns ) ) { // Server error.
		$block_patterns = $premium_block_patterns;
	} elseif ( ! empty( $free_block_patterns ) && is_array( $free_block_patterns ) ) { // Server error.
		$block_patterns = $free_block_patterns;
	}

	// Register pattern categories.
	foreach ( $block_pattern_categories as $block_pattern_category ) {
		register_block_pattern_category(
			$block_pattern_category['name'],
			array(
				'label' => '[unitone] ' . $block_pattern_category['label'],
			)
		);
	}

	// Register patterns.
	foreach ( $block_patterns as $pattern ) {
		if ( ! $pattern['title'] || ! $pattern['slug'] || ! $pattern['content'] ) {
			continue;
		}

		$pattern_name = esc_html( $pattern['slug'] );
		// Some patterns might be already registered as core patterns with the `core` prefix.
		$is_registered = $registry->is_registered( $pattern_name );
		if ( ! $is_registered ) {
			register_block_pattern( $pattern_name, (array) $pattern );
		}
	}
}
add_action( 'init', 'unitone_register_remote_block_patterns', 9 );
