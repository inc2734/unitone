<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

/**
 * Uses composer autoloader
 */
require_once( get_template_directory() . '/vendor/autoload.php' );

if ( ! function_exists( 'unitone_theme_setup' ) ) {
	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * Note that this function is hooked into the after_setup_theme hook, which runs
	 * before the init hook. The init hook is too late for some features, such as indicating
	 * support for post thumbnails.
	 */
	function unitone_theme_setup() {
		// Originally, mofile was {locale}.mo, but since unitone-{locale}.mo is generated
		// so that it can be read by block editors, it should be adjusted.
		add_filter(
			'load_textdomain_mofile',
			function( $mofile, $domain ) {
				return 'unitone' === $domain
					? get_template_directory() . '/languages/' . basename( $mofile )
					: $mofile;
			},
			10,
			2
		);

		// Make theme available for translation.
		load_theme_textdomain( 'unitone', get_template_directory() . '/languages' );

		// Register Navigation menus.
		// This is not required but necessary because a Notice error will occur in the customizer if it is not present.
		register_nav_menus(
			array(
				'primary' => esc_html__( 'Primary', 'unitone' ),
			)
		);

		// Add support for block styles.
		add_theme_support( 'wp-block-styles' );

		// Remove core block patterns.
		remove_theme_support( 'core-block-patterns' );

		// Add support for the WooCommerce.
		add_theme_support( 'woocommerce' );
	}
}
add_action( 'after_setup_theme', 'unitone_theme_setup' );

/**
 * Restores the Customizer since we still rely on it.
 */
function unitone_restore_customizer( $wp_customize ) {
	// There's no need to return anything.
	// The empty callback will do the trick.
}
add_action( 'customize_register', 'unitone_restore_customizer' );

// Updater.
require get_template_directory() . '/inc/updater.php';

// Add manager.
require get_template_directory() . '/inc/manager.php';

// Enqueue assets.
require get_template_directory() . '/inc/assets.php';

// Add block categories.
require get_template_directory() . '/inc/block-categories.php';

// Add blocks.
require get_template_directory() . '/inc/blocks.php';

// Add block patterns.
require get_template_directory() . '/inc/block-patterns.php';

// Add remote block patterns.
require get_template_directory() . '/inc/remote-block-patterns.php';

// Add block styles.
require get_template_directory() . '/inc/block-styles.php';

// Add template part areas.
require get_template_directory() . '/inc/template-part-areas.php';

// Add global styles.
require get_template_directory() . '/inc/global-styles.php';

// Customize oEmbed.
require get_template_directory() . '/inc/oembed.php';

// WooCommerce integration.
require get_template_directory() . '/inc/woocommerce.php';

// bbPress integration.
require get_template_directory() . '/inc/bbpress.php';
