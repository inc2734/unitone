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
 * Access https://unitone.2inc.org/wp-json/unitone-license-manager/v1/update/...?repository=unitone
 * and return json after authentication passes.
 *
 * @return string
 */
add_filter(
	'inc2734_github_theme_updater_request_url_inc2734/unitone',
	function () {
		$license_key    = Manager::get_setting( 'license-key' );
		$license_status = Manager::get_license_status( $license_key );

		if ( 'true' === $license_status ) {
			return sprintf(
				'https://unitone.2inc.org/wp-json/unitone-license-manager/v1/update/%1$s?repository=unitone',
				esc_attr( $license_key )
			);
		}

		return '';
	}
);
