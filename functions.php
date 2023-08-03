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
		// add_theme_support( 'wp-block-styles' );

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
 * Remove archive title prefix.
 */
function unitone_remove_archive_title_prefix( $title, $original_title ) {
	return $original_title;
}
add_filter( 'get_the_archive_title', 'unitone_remove_archive_title_prefix', 10, 2 );

/**
 * Restores the Customizer since we still rely on it.
 */
if ( wp_get_custom_css() ) {
	function unitone_restore_customizer( $wp_customize ) {
		// There's no need to return anything.
		// The empty callback will do the trick.
	}
	add_action( 'customize_register', 'unitone_restore_customizer' );
}

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

// Thumbnail settings.
require get_template_directory() . '/inc/thumbnail.php';

// Snow Monkey Editor integration.
require get_template_directory() . '/inc/snow-monkey-editor.php';

// WooCommerce integration.
require get_template_directory() . '/inc/woocommerce.php';

// bbPress integration.
require get_template_directory() . '/inc/bbpress.php';



// @todo フロントで deprecated な parts を表示する
// @todo ただし Site Editor では表示されない
// @see https://github.com/WordPress/wordpress-develop/blob/trunk/src/wp-includes/block-template-utils.php#L319
add_action(
	'init',
	function() {
		if ( WP_Block_Type_Registry::get_instance()->is_registered( 'core/template-part' ) ) {
			// If it is already registered, unregister first.
			unregister_block_type( 'core/template-part' );
		}

		register_block_type_from_metadata(
			ABSPATH . WPINC . '/blocks/template-part',
			array(
				'variations'      => build_template_part_block_variations(),
				'render_callback' => function( $attributes ) {
					$template_part_id = null;
					$content          = null;
					$area             = WP_TEMPLATE_PART_AREA_UNCATEGORIZED;
					$stylesheet       = get_stylesheet();

					if (
						'footer-breadcrumbs' === $attributes['slug']
						|| 0 === strpos( $attributes['slug'], 'contents-' )
						|| 0 === strpos( $attributes['slug'], 'page-header-' )
						|| 0 === strpos( $attributes['slug'], 'template-' )
					) {
						if (
							isset( $attributes['slug'] ) &&
							isset( $attributes['theme'] ) &&
							$stylesheet === $attributes['theme']
						) {
							$template_part_id    = $attributes['theme'] . '//' . $attributes['slug'];
							$template_part_query = new WP_Query(
								array(
									'post_type'           => 'wp_template_part',
									'post_status'         => 'publish',
									'post_name__in'       => array( $attributes['slug'] ),
									'tax_query'           => array(
										array(
											'taxonomy' => 'wp_theme',
											'field'    => 'name',
											'terms'    => $attributes['theme'],
										),
									),
									'posts_per_page'      => 1,
									'no_found_rows'       => true,
									'lazy_load_term_meta' => false, // Do not lazy load term meta, as template parts only have one term.
								)
							);
							$template_part_post  = $template_part_query->have_posts() ? $template_part_query->next_post() : null;
							if ( $template_part_post ) {
								// A published post might already exist if this template part was customized elsewhere
								// or if it's part of a customized template.
								$content    = $template_part_post->post_content;
								$content = shortcode_unautop( $content );
								$content = do_shortcode( $content );
								$content = do_blocks( $content );
								$content = wptexturize( $content );
								$content = convert_smilies( $content );
								$content = wp_filter_content_tags( $content, "template_part_{$area}" );

								// Handle embeds for block template parts.
								global $wp_embed;
								$content = $wp_embed->autoembed( $content );

								if ( empty( $attributes['tagName'] ) ) {
									$area_tag = 'div';
									if ( $area_definition && isset( $area_definition['area_tag'] ) ) {
										$area_tag = $area_definition['area_tag'];
									}
									$html_tag = $area_tag;
								} else {
									$html_tag = esc_attr( $attributes['tagName'] );
								}
								$wrapper_attributes = get_block_wrapper_attributes();

								return "<$html_tag $wrapper_attributes>" . str_replace( ']]>', ']]&gt;', $content ) . "</$html_tag>";
							}
						}

						// slug（= パス）を書き換える
						// これで、カスタマイズは飛ぶけととりあえずファイルの HTML は出力される
						$attributes['slug'] = 'deprecated/' . $attributes['slug'];
					}

					return render_block_core_template_part( $attributes );
				},
			)
		);
	}
);

// @odo Site Editor > Library に deprecated な parts を出さないようにする
add_filter(
	'get_block_templates',
	function( $query_result ) {
		$new_query_result = array();
		foreach ( $query_result as $result ) {
			if ( 0 === strpos( $result->slug, 'deprecated/' ) ) {
				continue;
			}
			$new_query_result[] = $result;
		}
		return $new_query_result;
	}
);
