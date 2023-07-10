<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

/**
 * Registers block pattern categories.
 */
function unitone_register_block_pattern_categories() {
	$block_pattern_categories = array(
		'unitone-headers' => array( 'label' => '[unitone] ' . __( 'Headers', 'unitone' ) ),
		'unitone-footers' => array( 'label' => '[unitone] ' . __( 'Footers', 'unitone' ) ),
		'unitone-query'   => array( 'label' => '[unitone] ' . __( 'Query', 'unitone' ) ),
		'unitone-pages'   => array( 'label' => '[unitone] ' . __( 'Pages', 'unitone' ) ),
	);

	/**
	 * Filters the theme block pattern categories.
	 *
	 * @param array[] $block_pattern_categories {
	 *     An associative array of block pattern categories, keyed by category name.
	 *
	 *     @type array[] $properties {
	 *         An array of block category properties.
	 *
	 *         @type string $label A human-readable label for the pattern category.
	 *     }
	 * }
	 */
	$block_pattern_categories = apply_filters( 'unitone_block_pattern_categories', $block_pattern_categories );

	foreach ( $block_pattern_categories as $name => $properties ) {
		if ( ! WP_Block_Pattern_Categories_Registry::get_instance()->is_registered( $name ) ) {
			register_block_pattern_category( $name, $properties );
		}
	}
}
// 9 or the category order will be unintended when the pattern is added with unitone_register_remote_block_patterns().
add_action( 'init', 'unitone_register_block_pattern_categories', 9 );

/**
 * Registers block patterns.
 */
function unitone_register_block_patterns() {
	$patterns = array(
		array(
			'title'    => '404',
			'slug'     => 'unitone/404/template/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/404/template/default.php' ),
		),
		array(
			'title'    => __( '404: Left Header / Page Header (Image)', 'unitone' ),
			'slug'     => 'unitone/404/template/left-header-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/404/template/left-header-page-header-image.php' ),
		),
		array(
			'title'    => __( '404: Left Header', 'unitone' ),
			'slug'     => 'unitone/404/template/left-header',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/404/template/left-header.php' ),
		),
		array(
			'title'    => __( '404: Page Header (Image)', 'unitone' ),
			'slug'     => 'unitone/404/template/page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/404/template/page-header-image.php' ),
		),
		array(
			'title'    => __( '404: Right Sidebar / Page Header (Image)', 'unitone' ),
			'slug'     => 'unitone/404/template/right-sidebar-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/404/template/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( '404: Right Sidebar', 'unitone' ),
			'slug'     => 'unitone/404/template/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/404/template/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Main Area (Page Header (Image)) for 404', 'unitone' ),
			'slug'     => 'unitone/404/main/page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/404/main/page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar / Page Header (Image)) for 404', 'unitone' ),
			'slug'     => 'unitone/404/main/right-sidebar-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/404/main/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar) for 404', 'unitone' ),
			'slug'     => 'unitone/404/main/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/404/main/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Main Area for 404', 'unitone' ),
			'slug'     => 'unitone/404/main/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/404/main/default.php' ),
		),
		array(
			'title'    => __( 'Page Header (Image) for 404', 'unitone' ),
			'slug'     => 'unitone/404/page-header/image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/404/page-header/image.php' ),
		),
		array(
			'title'    => __( 'Page Header (Wide) for 404', 'unitone' ),
			'slug'     => 'unitone/404/page-header/wide',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/404/page-header/wide.php' ),
		),
		array(
			'title'    => __( 'Page Header for 404', 'unitone' ),
			'slug'     => 'unitone/404/page-header/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/404/page-header/default.php' ),
		),
		array(
			'title'    => __( 'All Archives', 'unitone' ),
			'slug'     => 'unitone/archive/template/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/archive/template/default.php' ),
		),
		array(
			'title'    => __( 'All Archives: Left Header / Page Header (Image)', 'unitone' ),
			'slug'     => 'unitone/archive/template/left-header-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/archive/template/left-header-page-header-image.php' ),
		),
		array(
			'title'    => __( 'All Archives: Left Header', 'unitone' ),
			'slug'     => 'unitone/archive/template/left-header',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/archive/template/left-header.php' ),
		),
		array(
			'title'    => __( 'All Archives: Page Header (Image)', 'unitone' ),
			'slug'     => 'unitone/archive/template/page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/archive/template/page-header-image.php' ),
		),
		array(
			'title'    => __( 'All Archives: Right Sidebar / Page Header (Image)', 'unitone' ),
			'slug'     => 'unitone/archive/template/right-sidebar-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/archive/template/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'All Archives: Right Sidebar', 'unitone' ),
			'slug'     => 'unitone/archive/template/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/archive/template/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Main Area for All Archives', 'unitone' ),
			'slug'     => 'unitone/archive/main/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/archive/main/default.php' ),
		),
		array(
			'title'    => __( 'Main Area (Page Header (Image)) for All Archives', 'unitone' ),
			'slug'     => 'unitone/archive/main/page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/archive/main/page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar / Page Header (Image)) for All Archives', 'unitone' ),
			'slug'     => 'unitone/archive/main/right-sidebar-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/archive/main/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar) for All Archives', 'unitone' ),
			'slug'     => 'unitone/archive/main/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/archive/main/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Page Header (Image) for All Archives', 'unitone' ),
			'slug'     => 'unitone/archive/page-header/image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/archive/page-header/image.php' ),
		),
		array(
			'title'    => __( 'Page Header for All Archives', 'unitone' ),
			'slug'     => 'unitone/archive/page-header/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/archive/page-header/default.php' ),
		),
		array(
			'title'    => __( 'Product Archives', 'unitone' ),
			'slug'     => 'unitone/archive-product/template/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/archive-product/template/default.php' ),
		),
		array(
			'title'    => __( 'Product Archives: Left Header / Page Header (Image)', 'unitone' ),
			'slug'     => 'unitone/archive-product/template/left-header-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/archive-product/template/left-header-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Product Archives: Left Header', 'unitone' ),
			'slug'     => 'unitone/archive-product/template/left-header',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/archive-product/template/left-header.php' ),
		),
		array(
			'title'    => __( 'Product Archives: Page Header (Image)', 'unitone' ),
			'slug'     => 'unitone/archive-product/template/page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/archive-product/template/page-header-image.php' ),
		),
		array(
			'title'    => __( 'Product Archives: Right Sidebar / Page Header (Image)', 'unitone' ),
			'slug'     => 'unitone/archive-product/template/right-sidebar-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/archive-product/template/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Product Archives: Right Sidebar', 'unitone' ),
			'slug'     => 'unitone/archive-product/template/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/archive-product/template/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Main Area for Product Archives', 'unitone' ),
			'slug'     => 'unitone/archive-product/main/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/archive-product/main/default.php' ),
		),
		array(
			'title'    => __( 'Main Area (Page Header (Image)) for Product Archives', 'unitone' ),
			'slug'     => 'unitone/archive-product/main/page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/archive-product/main/page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar / Page Header (Image)) for Product Archives', 'unitone' ),
			'slug'     => 'unitone/archive-product/main/right-sidebar-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/archive-product/main/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar) for Product Archives', 'unitone' ),
			'slug'     => 'unitone/archive-product/main/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/archive-product/main/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Page Header (Image) for Product Archives', 'unitone' ),
			'slug'     => 'unitone/archive-product/page-header/image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/archive-product/page-header/image.php' ),
		),
		array(
			'title'    => __( 'Page Header for Product Archives', 'unitone' ),
			'slug'     => 'unitone/archive-product/page-header/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/archive-product/page-header/default.php' ),
		),
		array(
			'title'    => __( 'bbPress', 'unitone' ),
			'slug'     => 'unitone/bbpress/template/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/bbpress/template/default.php' ),
		),
		array(
			'title'    => __( 'bbPress: Left Header / Page Header (Image)', 'unitone' ),
			'slug'     => 'unitone/bbpress/template/left-header-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/bbpress/template/left-header-page-header-image.php' ),
		),
		array(
			'title'    => __( 'bbPress: Left Header', 'unitone' ),
			'slug'     => 'unitone/bbpress/template/left-header',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/bbpress/template/left-header.php' ),
		),
		array(
			'title'    => __( 'bbPress: Page Header (Image)', 'unitone' ),
			'slug'     => 'unitone/bbpress/template/page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/bbpress/template/page-header-image.php' ),
		),
		array(
			'title'    => __( 'bbPress: Right Sidebar / Page Header (Image)', 'unitone' ),
			'slug'     => 'unitone/bbpress/template/right-sidebar-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/bbpress/template/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'bbPress: Right Sidebar', 'unitone' ),
			'slug'     => 'unitone/bbpress/template/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/bbpress/template/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Main Area for bbPress', 'unitone' ),
			'slug'     => 'unitone/bbpress/main/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/bbpress/main/default.php' ),
		),
		array(
			'title'    => __( 'Main Area (Page Header (Image)) for bbPress', 'unitone' ),
			'slug'     => 'unitone/bbpress/main/page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/bbpress/main/page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar / Page Header (Image)) for bbPress', 'unitone' ),
			'slug'     => 'unitone/bbpress/main/right-sidebar-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/bbpress/main/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar) for bbPress', 'unitone' ),
			'slug'     => 'unitone/bbpress/main/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/bbpress/main/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Page Header (Image) for bbPress', 'unitone' ),
			'slug'     => 'unitone/bbpress/page-header/image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/bbpress/page-header/image.php' ),
		),
		array(
			'title'    => __( 'Page Header for bbPress', 'unitone' ),
			'slug'     => 'unitone/bbpress/page-header/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/bbpress/page-header/default.php' ),
		),
		array(
			'title'    => __( 'Blog Home', 'unitone' ),
			'slug'     => 'unitone/home/template/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/home/template/default.php' ),
		),
		array(
			'title'    => __( 'Blog Home: Left Header / Page Header (Image)', 'unitone' ),
			'slug'     => 'unitone/home/template/left-header-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/home/template/left-header-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Blog Home: Left Header', 'unitone' ),
			'slug'     => 'unitone/home/template/left-header',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/home/template/left-header.php' ),
		),
		array(
			'title'    => __( 'Blog Home: Page Header (Image)', 'unitone' ),
			'slug'     => 'unitone/home/template/page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/home/template/page-header-image.php' ),
		),
		array(
			'title'    => __( 'Blog Home: Right Sidebar / Page Header (Image)', 'unitone' ),
			'slug'     => 'unitone/home/template/right-sidebar-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/home/template/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Blog Home: Right Sidebar', 'unitone' ),
			'slug'     => 'unitone/home/template/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/home/template/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Main Area for Blog Home', 'unitone' ),
			'slug'     => 'unitone/home/main/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/home/main/default.php' ),
		),
		array(
			'title'    => __( 'Main Area (Page Header (Image)) for Blog Home', 'unitone' ),
			'slug'     => 'unitone/home/main/page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/home/main/page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar / Page Header (Image)) for Blog Home', 'unitone' ),
			'slug'     => 'unitone/home/main/right-sidebar-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/home/main/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar) for Blog Home', 'unitone' ),
			'slug'     => 'unitone/home/main/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/home/main/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Page Header (Image) for Blog Home', 'unitone' ),
			'slug'     => 'unitone/home/page-header/image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/home/page-header/image.php' ),
		),
		array(
			'title'    => __( 'Page Header for Blog Home', 'unitone' ),
			'slug'     => 'unitone/home/page-header/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/home/page-header/default.php' ),
		),
		array(
			'title'    => __( 'Pages', 'unitone' ),
			'slug'     => 'unitone/page/template/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/page/template/default.php' ),
		),
		array(
			'title'    => __( 'Pages: Blank', 'unitone' ),
			'slug'     => 'unitone/page/template/blank',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/page/template/blank.php' ),
		),
		array(
			'title'    => __( 'Pages: Only Header and Footer', 'unitone' ),
			'slug'     => 'unitone/page/template/header-footer',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/page/template/header-footer.php' ),
		),
		array(
			'title'    => __( 'Pages: Left Header /Page Header (Featured Image)', 'unitone' ),
			'slug'     => 'unitone/page/template/left-header-page-header-featured',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/page/template/left-header-page-header-featured.php' ),
		),
		array(
			'title'    => __( 'Pages: Left Header /Page Header (Image)', 'unitone' ),
			'slug'     => 'unitone/page/template/left-header-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/page/template/left-header-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Pages: Left Header', 'unitone' ),
			'slug'     => 'unitone/page/template/left-header',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/page/template/left-header.php' ),
		),
		array(
			'title'    => __( 'Pages: Page Header (Featured Image)', 'unitone' ),
			'slug'     => 'unitone/page/template/page-header-featured',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/page/template/page-header-featured.php' ),
		),
		array(
			'title'    => __( 'Pages: Page Header (Image)', 'unitone' ),
			'slug'     => 'unitone/page/template/page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/page/template/page-header-image.php' ),
		),
		array(
			'title'    => __( 'Pages: Page Header (Slim)', 'unitone' ),
			'slug'     => 'unitone/page/template/page-header-slim',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/page/template/page-header-slim.php' ),
		),
		array(
			'title'    => __( 'Pages: Right Sidebar / Page Header (Featured Image)', 'unitone' ),
			'slug'     => 'unitone/page/template/right-sidebar-page-header-featured',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/page/template/right-sidebar-page-header-featured.php' ),
		),
		array(
			'title'    => __( 'Pages: Right Sidebar / Page Header (Image)', 'unitone' ),
			'slug'     => 'unitone/page/template/right-sidebar/page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/page/template/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Pages: Right Sidebar', 'unitone' ),
			'slug'     => 'unitone/page/template/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/page/template/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Main Area for Pages', 'unitone' ),
			'slug'     => 'unitone/page/main/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/page/main/default.php' ),
		),
		array(
			'title'    => __( 'Main Area (Blank) for Pages', 'unitone' ),
			'slug'     => 'unitone/page/main/blank',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/page/main/blank.php' ),
		),
		array(
			'title'    => __( 'Main Area (Page Header (Featured Image)) for Pages', 'unitone' ),
			'slug'     => 'unitone/page/main/page-header-featured',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/page/main/page-header-featured.php' ),
		),
		array(
			'title'    => __( 'Main Area (Page Header (Image)) for Pages', 'unitone' ),
			'slug'     => 'unitone/page/main/page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/page/main/page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Page Header (Slim)) for Pages', 'unitone' ),
			'slug'     => 'unitone/page/main/page-header-slim',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/page/main/page-header-slim.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar / Page Header (Featured Image)) for Pages', 'unitone' ),
			'slug'     => 'unitone/page/main/right-sidebar/page-header-featured',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/page/main/right-sidebar-page-header-featured.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar / Page Header (Image)) for Pages', 'unitone' ),
			'slug'     => 'unitone/page/main/right-sidebar/page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/page/main/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar) for Pages', 'unitone' ),
			'slug'     => 'unitone/page/main/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/page/main/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Page Header for Pages', 'unitone' ),
			'slug'     => 'unitone/page/page-header/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/page/page-header/default.php' ),
		),
		array(
			'title'    => __( 'Page Header (Featured Image) for Pages', 'unitone' ),
			'slug'     => 'unitone/page/page-header/featured',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/page/page-header/featured.php' ),
		),
		array(
			'title'    => __( 'Page Header (Image) for Pages', 'unitone' ),
			'slug'     => 'unitone/page/page-header/image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/page/page-header/image.php' ),
		),
		array(
			'title'    => __( 'Page Header (Slim) for Pages', 'unitone' ),
			'slug'     => 'unitone/page/page-header/slim',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/page/page-header/slim.php' ),
		),
		array(
			'title'    => __( 'Search Results', 'unitone' ),
			'slug'     => 'unitone/search/template/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/search/template/default.php' ),
		),
		array(
			'title'    => __( 'Search Results: Left Header / Page Header (Image)', 'unitone' ),
			'slug'     => 'unitone/search/template/left-header-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/search/template/left-header-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Search Results: Left Header', 'unitone' ),
			'slug'     => 'unitone/search/template/left-header',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/search/template/left-header.php' ),
		),
		array(
			'title'    => __( 'Search Results: Page Header (Image)', 'unitone' ),
			'slug'     => 'unitone/search/template/page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/search/template/page-header-image.php' ),
		),
		array(
			'title'    => __( 'Search Results: Right Sidebar / Page Header (Image)', 'unitone' ),
			'slug'     => 'unitone/search/template/right-sidebar-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/search/template/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Search Results: Right Sidebar', 'unitone' ),
			'slug'     => 'unitone/search/template/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/search/template/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Main Area for Search Results', 'unitone' ),
			'slug'     => 'unitone/search/main/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/search/main/default.php' ),
		),
		array(
			'title'    => __( 'Main Area (Page Header (Image)) for Search Results', 'unitone' ),
			'slug'     => 'unitone/search/main/page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/search/main/page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar / Page Header (Image)) for Search Results', 'unitone' ),
			'slug'     => 'unitone/search/main/right-sidebar-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/search/main/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar) for Search Results', 'unitone' ),
			'slug'     => 'unitone/search/main/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/search/main/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Page Header for Search Results', 'unitone' ),
			'slug'     => 'unitone/search/page-header/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/search/page-header/default.php' ),
		),
		array(
			'title'    => __( 'Page Header (Image) for Search Results', 'unitone' ),
			'slug'     => 'unitone/search/page-header/image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/search/page-header/image.php' ),
		),
		array(
			'title'    => __( 'Single Posts', 'unitone' ),
			'slug'     => 'unitone/single/template/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single/template/default.php' ),
		),
		array(
			'title'    => __( 'Single Posts: Only Header and Footer', 'unitone' ),
			'slug'     => 'unitone/single/template/header-footer',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single/template/header-footer.php' ),
		),
		array(
			'title'    => __( 'Single Posts: Left Header / Page Header (Featured Image)', 'unitone' ),
			'slug'     => 'unitone/single/template/left-header-page-header-featured',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single/template/left-header-page-header-featured.php' ),
		),
		array(
			'title'    => __( 'Single Posts: Left Header / Page Header (Image)', 'unitone' ),
			'slug'     => 'unitone/single/template/left-header-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single/template/left-header-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Single Posts: Left Header', 'unitone' ),
			'slug'     => 'unitone/single/template/left-header',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single/template/left-header.php' ),
		),
		array(
			'title'    => __( 'Single Posts: Page Header (Featured Image)', 'unitone' ),
			'slug'     => 'unitone/single/template/page-header-featured',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single/template/page-header-featured.php' ),
		),
		array(
			'title'    => __( 'Single Posts: Page Header (Image)', 'unitone' ),
			'slug'     => 'unitone/single/template/page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single/template/page-header-image.php' ),
		),
		array(
			'title'    => __( 'Single Posts: Right Sidebar / Page Header (Featured Image)', 'unitone' ),
			'slug'     => 'unitone/single/template/right-sidebar-page-header-featured',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single/template/right-sidebar-page-header-featured.php' ),
		),
		array(
			'title'    => __( 'Single Posts: Right Sidebar / Page Header (Image)', 'unitone' ),
			'slug'     => 'unitone/single/template/right-sidebar-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single/template/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Single Posts: Right Sidebar', 'unitone' ),
			'slug'     => 'unitone/single/template/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single/template/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Main Area for Single Posts', 'unitone' ),
			'slug'     => 'unitone/single/main/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single/main/default.php' ),
		),
		array(
			'title'    => __( 'Main Area (Blank) for Single Posts', 'unitone' ),
			'slug'     => 'unitone/single/main/blank',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single/main/blank.php' ),
		),
		array(
			'title'    => __( 'Main Area (Page Header (Featured Image)) for Single Posts', 'unitone' ),
			'slug'     => 'unitone/single/main/page-header-featured',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single/main/page-header-featured.php' ),
		),
		array(
			'title'    => __( 'Main Area (Page Header (Image)) for Single Posts', 'unitone' ),
			'slug'     => 'unitone/single/main/page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single/main/page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar / Page Header (Featured Image)) for Single Posts', 'unitone' ),
			'slug'     => 'unitone/single/main/right-sidebar-page-header-featured',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single/main/right-sidebar-page-header-featured.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar / Page Header (Image)) for Single Posts', 'unitone' ),
			'slug'     => 'unitone/single/main/right-sidebar-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single/main/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar) for Single Posts', 'unitone' ),
			'slug'     => 'unitone/single/main/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single/main/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Page Header for Single Posts', 'unitone' ),
			'slug'     => 'unitone/single/page-header/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single/page-header/default.php' ),
		),
		array(
			'title'    => __( 'Page Header (Featured Image) for Single Posts', 'unitone' ),
			'slug'     => 'unitone/single/page-header/featured',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single/page-header/featured.php' ),
		),
		array(
			'title'    => __( 'Page Header (Image) for Single Posts', 'unitone' ),
			'slug'     => 'unitone/single/page-header/image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single/page-header/image.php' ),
		),
		array(
			'title'    => __( 'Page Header (Wide) for Single Posts', 'unitone' ),
			'slug'     => 'unitone/single/page-header/wide',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single/page-header/wide.php' ),
		),
		array(
			'title'    => __( 'Single Products', 'unitone' ),
			'slug'     => 'unitone/single-product/template/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single-product/template/default.php' ),
		),
		array(
			'title'    => __( 'Single Products: Left Header / Page Header (Image)', 'unitone' ),
			'slug'     => 'unitone/single-product/template/left-header-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single-product/template/left-header-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Single Products: Left Header', 'unitone' ),
			'slug'     => 'unitone/single-product/template/left-header',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single-product/template/left-header.php' ),
		),
		array(
			'title'    => __( 'Single Products: Page Header (Image)', 'unitone' ),
			'slug'     => 'unitone/single-product/template/page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single-product/template/page-header-image.php' ),
		),
		array(
			'title'    => __( 'Single Products: Right Sidebar / Page Header (Image)', 'unitone' ),
			'slug'     => 'unitone/single-product/template/right-sidebar-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single-product/template/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Single Products: Right Sidebar', 'unitone' ),
			'slug'     => 'unitone/single-product/template/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single-product/template/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Main Area for Single Products', 'unitone' ),
			'slug'     => 'unitone/single-product/main/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single-product/main/default.php' ),
		),
		array(
			'title'    => __( 'Main Area (Page Header (Image)) for Single Products', 'unitone' ),
			'slug'     => 'unitone/single-product/main/page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single-product/main/page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar / Page Header (Image)) for Single Products', 'unitone' ),
			'slug'     => 'unitone/single-product/main/right-sidebar-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single-product/main/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar) for Single Products', 'unitone' ),
			'slug'     => 'unitone/single-product/main/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single-product/main/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Page Header for Single Products', 'unitone' ),
			'slug'     => 'unitone/single-product/page-header/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single-product/page-header/default.php' ),
		),
		array(
			'title'    => __( 'Page Header (Image) for Single Products', 'unitone' ),
			'slug'     => 'unitone/single-product/page-header/image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/single-product/page-header/image.php' ),
		),
	);

	foreach ( $patterns as $pattern ) {
		ob_start();
		include( $pattern['path'] );
		$pattern['content'] = ob_get_clean();
		unset( $pattern['path'] );
		register_block_pattern( $pattern['slug'], $pattern );
	}
}
add_action( 'init', 'unitone_register_block_patterns', 9 );
