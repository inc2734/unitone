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
		'unitone-headers'   => array( 'label' => '[unitone] ' . __( 'Headers', 'unitone' ) ),
		'unitone-footers'   => array( 'label' => '[unitone] ' . __( 'Footers', 'unitone' ) ),
		'unitone-query'     => array( 'label' => '[unitone] ' . __( 'Query', 'unitone' ) ),
		'unitone-pages'     => array( 'label' => '[unitone] ' . __( 'Pages', 'unitone' ) ),
		'unitone-templates' => array( 'label' => '[unitone] ' . __( 'Templates', 'unitone' ) ),
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
			'title'    => __( 'Main Area (One Column / Page Header (Image)) for 404', 'unitone' ),
			'slug'     => 'unitone/404/main/one-column-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/404/main/one-column-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar / Page Header (Image)) for 404', 'unitone' ),
			'slug'     => 'unitone/404/main/right-sidebar-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/404/main/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar) for 404', 'unitone' ),
			'slug'     => 'unitone/404/main/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/404/main/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Main Area for 404 (One Column)', 'unitone' ),
			'slug'     => 'unitone/404/main/one-column',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/404/main/one-column.php' ),
		),
		array(
			'title'    => __( 'Page Header (Image) for 404', 'unitone' ),
			'slug'     => 'unitone/404/page-header/image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/404/page-header/image.php' ),
		),
		array(
			'title'    => __( 'Page Header (Wide) for 404', 'unitone' ),
			'slug'     => 'unitone/404/page-header/wide',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/404/page-header/wide.php' ),
		),
		array(
			'title'    => __( 'Page Header for 404', 'unitone' ),
			'slug'     => 'unitone/404/page-header/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/404/page-header/default.php' ),
		),
		array(
			'title'    => __( 'Main Area for All Archives (One Column)', 'unitone' ),
			'slug'     => 'unitone/archive/main/one-column',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/archive/main/one-column.php' ),
		),
		array(
			'title'    => __( 'Main Area (One Column / Page Header (Image)) for All Archives', 'unitone' ),
			'slug'     => 'unitone/archive/main/one-column-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/archive/main/one-column-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar / Page Header (Image)) for All Archives', 'unitone' ),
			'slug'     => 'unitone/archive/main/right-sidebar-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/archive/main/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar) for All Archives', 'unitone' ),
			'slug'     => 'unitone/archive/main/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/archive/main/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Page Header (Image) for All Archives', 'unitone' ),
			'slug'     => 'unitone/archive/page-header/image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/archive/page-header/image.php' ),
		),
		array(
			'title'    => __( 'Page Header for All Archives', 'unitone' ),
			'slug'     => 'unitone/archive/page-header/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/archive/page-header/default.php' ),
		),
		array(
			'title'    => __( 'Main Area (One Column) for Product Archives', 'unitone' ),
			'slug'     => 'unitone/archive-product/main/one-column',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/archive-product/main/one-column.php' ),
		),
		array(
			'title'    => __( 'Main Area (One Column / Page Header (Image)) for Product Archives', 'unitone' ),
			'slug'     => 'unitone/archive-product/main/one-column-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/archive-product/main/one-column-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar / Page Header (Image)) for Product Archives', 'unitone' ),
			'slug'     => 'unitone/archive-product/main/right-sidebar-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/archive-product/main/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar) for Product Archives', 'unitone' ),
			'slug'     => 'unitone/archive-product/main/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/archive-product/main/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Page Header (Image) for Product Archives', 'unitone' ),
			'slug'     => 'unitone/archive-product/page-header/image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/archive-product/page-header/image.php' ),
		),
		array(
			'title'    => __( 'Page Header for Product Archives', 'unitone' ),
			'slug'     => 'unitone/archive-product/page-header/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/archive-product/page-header/default.php' ),
		),
		array(
			'title'    => __( 'Main Area (One Column) for bbPress', 'unitone' ),
			'slug'     => 'unitone/bbpress/main/one-column',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/bbpress/main/one-column.php' ),
		),
		array(
			'title'    => __( 'Main Area (One Column / Page Header (Image)) for bbPress', 'unitone' ),
			'slug'     => 'unitone/bbpress/main/one-column-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/bbpress/main/one-column-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar / Page Header (Image)) for bbPress', 'unitone' ),
			'slug'     => 'unitone/bbpress/main/right-sidebar-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/bbpress/main/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar) for bbPress', 'unitone' ),
			'slug'     => 'unitone/bbpress/main/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/bbpress/main/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Page Header (Image) for bbPress', 'unitone' ),
			'slug'     => 'unitone/bbpress/page-header/image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/bbpress/page-header/image.php' ),
		),
		array(
			'title'    => __( 'Page Header for bbPress', 'unitone' ),
			'slug'     => 'unitone/bbpress/page-header/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/bbpress/page-header/default.php' ),
		),
		array(
			'title'    => __( 'Main Area (One Column) for Blog Home', 'unitone' ),
			'slug'     => 'unitone/home/main/one-column',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/home/main/one-column.php' ),
		),
		array(
			'title'    => __( 'Main Area (One Column / Page Header (Image)) for Blog Home', 'unitone' ),
			'slug'     => 'unitone/home/main/one-column-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/home/main/one-column-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar / Page Header (Image)) for Blog Home', 'unitone' ),
			'slug'     => 'unitone/home/main/right-sidebar-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/home/main/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar) for Blog Home', 'unitone' ),
			'slug'     => 'unitone/home/main/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/home/main/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Page Header (Image) for Blog Home', 'unitone' ),
			'slug'     => 'unitone/home/page-header/image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/home/page-header/image.php' ),
		),
		array(
			'title'    => __( 'Page Header for Blog Home', 'unitone' ),
			'slug'     => 'unitone/home/page-header/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/home/page-header/default.php' ),
		),
		array(
			'title'    => __( 'Main Area for Pages', 'unitone' ),
			'slug'     => 'unitone/page/main/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/page/main/default.php' ),
		),
		array(
			'title'    => __( 'Main Area (Blank) for Pages', 'unitone' ),
			'slug'     => 'unitone/page/main/blank',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/page/main/blank.php' ),
		),
		array(
			'title'    => __( 'Main Area (Page Header (Featured Image)) for Pages', 'unitone' ),
			'slug'     => 'unitone/page/main/page-header-featured',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/page/main/page-header-featured.php' ),
		),
		array(
			'title'    => __( 'Main Area (Page Header (Image)) for Pages', 'unitone' ),
			'slug'     => 'unitone/page/main/page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/page/main/page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Page Header (Slim)) for Pages', 'unitone' ),
			'slug'     => 'unitone/page/main/page-header-slim',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/page/main/page-header-slim.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar / Page Header (Featured Image)) for Pages', 'unitone' ),
			'slug'     => 'unitone/page/main/right-sidebar/page-header-featured',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/page/main/right-sidebar-page-header-featured.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar / Page Header (Image)) for Pages', 'unitone' ),
			'slug'     => 'unitone/page/main/right-sidebar/page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/page/main/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar) for Pages', 'unitone' ),
			'slug'     => 'unitone/page/main/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/page/main/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Page Header for Pages', 'unitone' ),
			'slug'     => 'unitone/page/page-header/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/page/page-header/default.php' ),
		),
		array(
			'title'    => __( 'Page Header (Featured Image) for Pages', 'unitone' ),
			'slug'     => 'unitone/page/page-header/featured',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/page/page-header/featured.php' ),
		),
		array(
			'title'    => __( 'Page Header (Image) for Pages', 'unitone' ),
			'slug'     => 'unitone/page/page-header/image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/page/page-header/image.php' ),
		),
		array(
			'title'    => __( 'Page Header (Slim) for Pages', 'unitone' ),
			'slug'     => 'unitone/page/page-header/slim',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/page/page-header/slim.php' ),
		),
		array(
			'title'    => __( 'Main Area for Search Results', 'unitone' ),
			'slug'     => 'unitone/search/main/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/search/main/default.php' ),
		),
		array(
			'title'    => __( 'Main Area (Page Header (Image)) for Search Results', 'unitone' ),
			'slug'     => 'unitone/search/main/page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/search/main/page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar / Page Header (Image)) for Search Results', 'unitone' ),
			'slug'     => 'unitone/search/main/right-sidebar-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/search/main/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar) for Search Results', 'unitone' ),
			'slug'     => 'unitone/search/main/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/search/main/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Page Header for Search Results', 'unitone' ),
			'slug'     => 'unitone/search/page-header/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/search/page-header/default.php' ),
		),
		array(
			'title'    => __( 'Page Header (Image) for Search Results', 'unitone' ),
			'slug'     => 'unitone/search/page-header/image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/search/page-header/image.php' ),
		),
		array(
			'title'    => __( 'Main Area for Single Posts', 'unitone' ),
			'slug'     => 'unitone/single/main/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/single/main/default.php' ),
		),
		array(
			'title'    => __( 'Main Area (Blank) for Single Posts', 'unitone' ),
			'slug'     => 'unitone/single/main/blank',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/single/main/blank.php' ),
		),
		array(
			'title'    => __( 'Main Area (Page Header (Featured Image)) for Single Posts', 'unitone' ),
			'slug'     => 'unitone/single/main/page-header-featured',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/single/main/page-header-featured.php' ),
		),
		array(
			'title'    => __( 'Main Area (Page Header (Image)) for Single Posts', 'unitone' ),
			'slug'     => 'unitone/single/main/page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/single/main/page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar / Page Header (Featured Image)) for Single Posts', 'unitone' ),
			'slug'     => 'unitone/single/main/right-sidebar-page-header-featured',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/single/main/right-sidebar-page-header-featured.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar / Page Header (Image)) for Single Posts', 'unitone' ),
			'slug'     => 'unitone/single/main/right-sidebar-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/single/main/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar) for Single Posts', 'unitone' ),
			'slug'     => 'unitone/single/main/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/single/main/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Page Header for Single Posts', 'unitone' ),
			'slug'     => 'unitone/single/page-header/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/single/page-header/default.php' ),
		),
		array(
			'title'    => __( 'Page Header (Featured Image) for Single Posts', 'unitone' ),
			'slug'     => 'unitone/single/page-header/featured',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/single/page-header/featured.php' ),
		),
		array(
			'title'    => __( 'Page Header (Image) for Single Posts', 'unitone' ),
			'slug'     => 'unitone/single/page-header/image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/single/page-header/image.php' ),
		),
		array(
			'title'    => __( 'Page Header (Wide) for Single Posts', 'unitone' ),
			'slug'     => 'unitone/single/page-header/wide',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/single/page-header/wide.php' ),
		),
		array(
			'title'    => __( 'Main Area for Single Products', 'unitone' ),
			'slug'     => 'unitone/single-product/main/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/single-product/main/default.php' ),
		),
		array(
			'title'    => __( 'Main Area (Page Header (Image)) for Single Products', 'unitone' ),
			'slug'     => 'unitone/single-product/main/page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/single-product/main/page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar / Page Header (Image)) for Single Products', 'unitone' ),
			'slug'     => 'unitone/single-product/main/right-sidebar-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/single-product/main/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar) for Single Products', 'unitone' ),
			'slug'     => 'unitone/single-product/main/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/single-product/main/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Page Header for Single Products', 'unitone' ),
			'slug'     => 'unitone/single-product/page-header/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/single-product/page-header/default.php' ),
		),
		array(
			'title'    => __( 'Page Header (Image) for Single Products', 'unitone' ),
			'slug'     => 'unitone/single-product/page-header/image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/single-product/page-header/image.php' ),
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
