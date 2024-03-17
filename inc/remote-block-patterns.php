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

	foreach ( $patterns as $key => $pattern ) {
		$patterns[ $key ]['content'] = str_replace(
			'https://unitone.2inc.org/wp-content/themes/unitone',
			get_template_directory_uri(),
			$pattern['content'],
		);

		$patterns[ $key ]['content'] = preg_replace_callback(
			'@' . preg_quote( untrailingslashit( get_template_directory_uri() ) ) . '[^"\']+?\.(?:jpg|jpeg|png|gif|svg)@ims',
			function ( $matches ) {
				$file_url  = $matches[0];
				$file_path = str_replace( get_template_directory_uri(), get_template_directory(), $file_url );
				if ( ! file_exists( $file_path ) ) {
					return get_theme_file_uri( 'dist/img/dummy.jpg' );
				}
				return $file_url;
			},
			$patterns[ $key ]['content']
		);

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
	if ( $request_uri && false !== strpos( $request_uri, 'wp-json/unitone-license-manager' ) ) {
		return;
	}

	$transient = get_transient( 'unitone-remote-pattern-categories' );
	if ( false !== $transient ) {
		$remote_block_pattern_categories = $transient;
	} else {
		$remote_block_pattern_categories = unitone_get_remote_block_patten_categories();
		set_transient( 'unitone-remote-pattern-categories', $remote_block_pattern_categories, DAY_IN_SECONDS );
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

		if ( 'true' === $status ) {
			$remote_block_patterns = unitone_get_premium_remote_block_pattens();
		} else {
			$remote_block_patterns = unitone_get_free_remote_block_pattens();
		}

		set_transient( 'unitone-remote-patterns', $remote_block_patterns, DAY_IN_SECONDS );
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
