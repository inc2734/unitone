<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 * @deprecated
 */

namespace Unitone\App\Controller;

use Unitone\App\Controller\Manager\Manager as Base;

class Manager {

	/**
	 * Return setting.
	 *
	 * @param string $key The setting key name.
	 * @return mixed
	 */
	public static function get_option( $key ) {
		return Base::get_setting( $key );
	}

	/**
	 * Get license status.
	 *
	 * @param string $license_key The license key.
	 * @return boolean
	 */
	public static function get_license_status( $license_key ) {
		return Base::get_license_status( $license_key );
	}
}
