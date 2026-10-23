<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

use Unitone\App\Controller\Manager\Manager;

/**
 * Get remote block styles.
 *
 * @param string $url A URL of the remote styles API.
 * @param array $args An array of request arguments.
 * @param bool|null $success Receives whether the request returned valid library data.
 * @return array
 */
function _unitone_get_remote_block_styles( $url, array $args = array(), &$success = null ) {
	global $wp_version;

	$success = false;

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

	$styles = json_decode( wp_remote_retrieve_body( $response ), true );
	if ( ! is_array( $styles ) ) {
		return array();
	}

	$has_styles = ! empty( $styles );
	foreach ( $styles as $key => $style ) {
		if ( ! _unitone_is_valid_remote_block_style( $style ) ) {
			unset( $styles[ $key ] );
			continue;
		}
		$styles[ $key ]['viewportWidth'] = 1440;
	}

	$success = ! $has_styles || ! empty( $styles );

	return $styles;
}

/**
 * Validate both fresh responses and previously cached styles before registration.
 *
 * @param mixed $style Style data.
 * @return bool
 */
function _unitone_is_valid_remote_block_style( $style ) {
	if ( ! is_array( $style ) ) {
		return false;
	}

	foreach ( array( 'name', 'label' ) as $key ) {
		if ( empty( $style[ $key ] ) || ! is_string( $style[ $key ] ) ) {
			return false;
		}
	}

	if ( ! is_string( $style['inline_style'] ?? null ) || empty( $style['blockTypes'] ) || ! is_array( $style['blockTypes'] ) ) {
		return false;
	}

	foreach ( $style['blockTypes'] as $block_type ) {
		if ( ! is_string( $block_type ) || '' === $block_type ) {
			return false;
		}
	}

	return true;
}

/**
 * Get premium remote block styles.
 *
 * @param bool|null $success Receives whether the request returned valid library data.
 * @return array
 */
function unitone_get_premium_remote_block_styles( &$success = null ) {
	$url = 'https://unitone.2inc.org/wp-json/unitone-license-manager/v1/styles/';

	return _unitone_get_remote_block_styles(
		$url,
		array(
			'X-Unitone-License-Key' => Manager::get_setting( 'license-key' ),
			'X-Unitone-Locale'      => get_locale(),
		),
		$success
	);
}

/**
 * Enqueue remote block styles assets for front.
 *
 * [
 *     'core/paragraph' => [
 *         'default' => 'color:red;',
 *         'outline' => 'border:1px solid #000;',
 *     ],
 *     'core/image' => [
 *         'rounded' => 'border-radius:50%;',
 *     ],
 * ]
 *
 * @param array $map Map of block type.
 */
function _unitone_enqueue_remote_block_styles_for_front( $map ) {
	static $hits = array();

	add_filter(
		'render_block_data',
		function ( $parsed_block ) use ( &$map, &$hits ) {
			if ( ! $parsed_block['blockName'] ) {
				return $parsed_block;
			}

			$block_type = $parsed_block['blockName'];
			$class_name = (string) ( $parsed_block['attrs']['className'] ?? '' );
			if ( ! $class_name || empty( $map[ $block_type ] ) ) {
				return $parsed_block;
			}

			foreach ( $map[ $block_type ] as $name => $css ) {
				if ( false !== strpos( $class_name, 'is-style-' . $name ) ) {
					$hits[ $name ] = $block_type;
				}
			}

			return $parsed_block;
		}
	);

	add_action(
		'wp_enqueue_scripts',
		function () use ( &$map, &$hits ) {
			global $wp_styles;

			if ( ! $hits ) {
				return;
			}

			foreach ( $hits as $name => $block_type ) {
				$deps_handle = generate_block_asset_handle( $block_type, 'style' );
				$handle      = $name . '-' . $block_type;

				wp_register_style( $handle, false, array( $deps_handle ) ); // phpcs:ignore
				wp_add_inline_style( $handle, $map[ $block_type ][ $name ] );
				wp_enqueue_style( $handle );
			}
		}
	);
}

/**
 * Register remote block styles.
 * This requires a valid license key.
 */
function unitone_register_remote_block_styles() {
	$request_uri = filter_input( INPUT_SERVER, 'REQUEST_URI' );
	if ( ! $request_uri ) {
		$request_uri = esc_html( wp_unslash( $_SERVER['REQUEST_URI'] ?? '' ) ); // @phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
	}
	if ( $request_uri && false !== strpos( $request_uri, 'wp-json/unitone-license-manager' ) ) {
		return;
	}

	$license_key = Manager::get_setting( 'license-key' );
	if ( ! $license_key ) {
		return;
	}

	$status = Manager::get_license_status( $license_key );
	if ( 'false' === $status ) {
		return;
	}

	$transient_name = 'unitone-remote-styles';
	$block_styles   = get_transient( $transient_name );

	if ( 'true' === $status ) {
		if ( false === $block_styles || ! is_array( $block_styles ) ) {
			$new_block_styles = unitone_get_premium_remote_block_styles( $success );
			if ( ! is_array( $new_block_styles ) ) {
				$new_block_styles = array();
			}

			set_transient(
				$transient_name,
				$new_block_styles,
				$success
					? WEEK_IN_SECONDS
					: MINUTE_IN_SECONDS
			);

			$block_styles = $new_block_styles;
		}
	}

	// A validation outage must preserve styles already in use: https://github.com/inc2734/unitone/issues/491.
	if ( ! is_array( $block_styles ) ) {
		return;
	}

	$get_block_types_from_remote_block_styles_block_type = static function ( $block_types ) {
		return array_map(
			function ( $block_type ) {
				return str_replace( array( 'core-', 'unitone-' ), array( 'core/', 'unitone/' ), $block_type );
			},
			$block_types
		);
	};

	$on_demand = apply_filters(
		'unitone_should_load_block_styles_assets_on_demand',
		wp_should_load_block_assets_on_demand()
	);

	if ( ! $on_demand || is_admin() ) {
		foreach ( $block_styles as $style ) {
			if ( ! _unitone_is_valid_remote_block_style( $style ) ) {
				continue;
			}

			$block_types = $get_block_types_from_remote_block_styles_block_type( $style['blockTypes'] );

			register_block_style( $block_types, (array) $style );
		}
		return;
	}

	$map = array();
	foreach ( $block_styles as $style ) {
		if ( ! _unitone_is_valid_remote_block_style( $style ) || ! $style['inline_style'] ) {
			continue;
		}

		$name        = sanitize_key( $style['name'] );
		$block_types = $get_block_types_from_remote_block_styles_block_type( $style['blockTypes'] );

		foreach ( $block_types as $block_type ) {
			$map[ $block_type ][ $name ] = $style['inline_style'];
		}
	}

	_unitone_enqueue_remote_block_styles_for_front( $map );
}
add_action( 'init', 'unitone_register_remote_block_styles', 9 );
