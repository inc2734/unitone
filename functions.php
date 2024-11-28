<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

/**
 * Uses composer autoloader
 */
require_once get_template_directory() . '/vendor/autoload.php';

if ( ! function_exists( 'unitone_theme_setup' ) ) {
	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * Note that this function is hooked into the after_setup_theme hook, which runs
	 * before the init hook. The init hook is too late for some features, such as indicating
	 * support for post thumbnails.
	 */
	function unitone_theme_setup() {
		// Make theme available for translation.
		load_theme_textdomain( 'unitone', get_template_directory() . '/languages' );

		// Remove core block patterns.
		remove_theme_support( 'core-block-patterns' );

		// Add support for the WooCommerce.
		add_theme_support( 'woocommerce' );

		// Add excerpt for pages.
		add_post_type_support( 'page', 'excerpt' );
	}
}
add_action( 'after_setup_theme', 'unitone_theme_setup' );

/**
 * Add viewport meta tag.
 *
 * @param string $template The path of the template to include.
 * @return string
 */
function unitone_block_template_viewport_meta_tag( $template ) {
	remove_action( 'wp_head', '_block_template_viewport_meta_tag', 0 );

	add_action(
		'wp_head',
		function () {
			echo '<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, viewport-fit=cover" />' . "\n";
		},
		0
	);

	return $template;
}
add_filter( 'template_include', 'unitone_block_template_viewport_meta_tag' );

/**
 * Restores the Customizer since we still rely on it.
 */
if ( wp_get_custom_css() ) {
	/**
	 * There's no need to return anything.
	 * The empty callback will do the trick.
	 */
	function unitone_restore_customizer() {
	}
	add_action( 'customize_register', 'unitone_restore_customizer' );
}

// function library.
require get_template_directory() . '/inc/lib.php';

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

// Add block supports.
require get_template_directory() . '/inc/block-supports.php';

// Add formats.
require get_template_directory() . '/inc/formats.php';

// Add variations.
require get_template_directory() . '/inc/variations.php';

// Add template part areas.
require get_template_directory() . '/inc/template-part-areas.php';

// Add global styles.
require get_template_directory() . '/inc/global-styles.php';

// Customize oEmbed.
require get_template_directory() . '/inc/oembed.php';

// Thumbnail settings.
require get_template_directory() . '/inc/thumbnail.php';

// Templates integration.
require get_template_directory() . '/inc/templates.php';

// WooCommerce integration.
require get_template_directory() . '/inc/woocommerce.php';

// bbPress integration.
require get_template_directory() . '/inc/bbpress.php';
