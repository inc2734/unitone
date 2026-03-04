<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

use Inc2734\WP_GitHub_Theme_Updater\Bootstrap;
use Unitone\App\Controller\Manager\Manager;

new Bootstrap(
	get_template(),
	'inc2734',
	'unitone',
	array(
		'homepage' => 'https://unitone.2inc.org/category/update-info/',
	)
);

/**
 * Force update check.
 */
add_action(
	'admin_init',
	function () {
		if ( is_admin() && current_user_can( 'update_themes' ) ) {
			$force_check = filter_input( INPUT_GET, 'force-check' );

			if ( $force_check ) {
				set_site_transient( 'update_themes', null );
			}
		}
	}
);

/**
 * There is a case that comes back to GitHub's zip url.
 * In that case it returns false because it is illegal.
 *
 * @param string $url
 * @return string|false
 */
add_filter(
	'inc2734_github_theme_updater_zip_url_inc2734/unitone',
	function ( $url ) {
		if ( 0 !== strpos( $url, 'https://unitone.2inc.org/' ) ) {
			return false;
		}
		return $url;
	}
);

/**
 * Customize request URL that for updating.
 * Access https://unitone.2inc.org/wp-json/unitone-license-manager/v1/update/?repository=unitone&version=...
 * and return json after authentication passes.
 *
 * @return string
 */
add_filter(
	'inc2734_github_theme_updater_request_url_inc2734/unitone',
	function ( $url, $user_name, $repository, $version ) {
		$license_key    = Manager::get_setting( 'license-key' );
		$license_status = Manager::get_license_status( $license_key );

		if ( 'true' === $license_status ) {
			return add_query_arg(
				array(
					'repository' => 'unitone',
					'version'    => (string) $version,
				),
				'https://unitone.2inc.org/wp-json/unitone-license-manager/v1/update/'
			);
		}

		return '';
	},
	10,
	4
);

/**
 * Add the request headers for unitone license update API.
 *
 * @param array  $args Request args.
 * @param string $url Request URL.
 * @param string $user_name GitHub user name.
 * @param string $repository GitHub repository name.
 * @return array
 */
add_filter(
	'inc2734_github_theme_updater_requester_args',
	function ( $args, $url, $user_name, $repository ) {
		if (
			'inc2734' !== $user_name
			|| 'unitone' !== $repository
			|| 0 !== strpos( $url, 'https://unitone.2inc.org/wp-json/unitone-license-manager/v1/update/' )
		) {
			return $args;
		}

		$license_key = Manager::get_setting( 'license-key' );
		if ( ! $license_key ) {
			return $args;
		}

		$args['headers'] = array_merge(
			isset( $args['headers'] ) && is_array( $args['headers'] ) ? $args['headers'] : array(),
			array(
				'Accept-Encoding'       => '',
				'X-Unitone-License-Key' => $license_key,
			)
		);

		return $args;
	},
	10,
	4
);
