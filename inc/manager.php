<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

new Unitone\App\Controller\Manager\Manager();

// Remove settings left behind by the retired AI integration.
add_action(
	'admin_init',
	function () {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		foreach ( array( 'unitone_openai_api_key', 'unitone_openai_model' ) as $option ) {
			if ( null !== get_option( $option, null ) ) {
				delete_option( $option );
			}
		}
	}
);
