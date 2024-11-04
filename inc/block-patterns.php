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
		'unitone-others'    => array( 'label' => '[unitone] ' . __( 'Others', 'unitone' ) ),
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
			'slug'     => 'unitone/template/404/main/one-column-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/404/main/one-column-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar / Page Header (Image)) for 404', 'unitone' ),
			'slug'     => 'unitone/template/404/main/right-sidebar-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/404/main/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar) for 404', 'unitone' ),
			'slug'     => 'unitone/template/404/main/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/404/main/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Main Area for 404 (One Column)', 'unitone' ),
			'slug'     => 'unitone/template/404/main/one-column',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/404/main/one-column.php' ),
		),
		array(
			'title'    => __( 'Page Header (Image) for 404', 'unitone' ),
			'slug'     => 'unitone/template/404/page-header/image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/404/page-header/image.php' ),
		),
		array(
			'title'    => __( 'Page Header (Wide) for 404', 'unitone' ),
			'slug'     => 'unitone/template/404/page-header/wide',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/404/page-header/wide.php' ),
		),
		array(
			'title'    => __( 'Page Header for 404', 'unitone' ),
			'slug'     => 'unitone/template/404/page-header/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/404/page-header/default.php' ),
		),
		array(
			'title'    => __( 'Main Area for All Archives (One Column)', 'unitone' ),
			'slug'     => 'unitone/template/archive/main/one-column',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/archive/main/one-column.php' ),
		),
		array(
			'title'    => __( 'Main Area (One Column / Page Header (Image)) for All Archives', 'unitone' ),
			'slug'     => 'unitone/template/archive/main/one-column-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/archive/main/one-column-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar / Page Header (Image)) for All Archives', 'unitone' ),
			'slug'     => 'unitone/template/archive/main/right-sidebar-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/archive/main/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar) for All Archives', 'unitone' ),
			'slug'     => 'unitone/template/archive/main/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/archive/main/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Page Header (Image) for All Archives', 'unitone' ),
			'slug'     => 'unitone/template/archive/page-header/image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/archive/page-header/image.php' ),
		),
		array(
			'title'    => __( 'Page Header for All Archives', 'unitone' ),
			'slug'     => 'unitone/template/archive/page-header/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/archive/page-header/default.php' ),
		),
		array(
			'title'    => __( 'Main Area (Blank) for Front Page', 'unitone' ),
			'slug'     => 'unitone/template/front-page/main/blank',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/front-page/main/blank.php' ),
		),
		array(
			'title'    => __( 'Main Area (One Column) for Blog Home', 'unitone' ),
			'slug'     => 'unitone/template/home/main/one-column',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/home/main/one-column.php' ),
		),
		array(
			'title'    => __( 'Main Area (One Column / Page Header (Image)) for Blog Home', 'unitone' ),
			'slug'     => 'unitone/template/home/main/one-column-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/home/main/one-column-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar / Page Header (Image)) for Blog Home', 'unitone' ),
			'slug'     => 'unitone/template/home/main/right-sidebar-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/home/main/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar) for Blog Home', 'unitone' ),
			'slug'     => 'unitone/template/home/main/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/home/main/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Page Header (Image) for Blog Home', 'unitone' ),
			'slug'     => 'unitone/template/home/page-header/image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/home/page-header/image.php' ),
		),
		array(
			'title'    => __( 'Page Header for Blog Home', 'unitone' ),
			'slug'     => 'unitone/template/home/page-header/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/home/page-header/default.php' ),
		),
		array(
			'title'    => __( 'Main Area (One Column) for Pages', 'unitone' ),
			'slug'     => 'unitone/template/page/main/one-column',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/page/main/one-column.php' ),
		),
		array(
			'title'    => __( 'Main Area (Blank) for Pages', 'unitone' ),
			'slug'     => 'unitone/template/page/main/blank',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/page/main/blank.php' ),
		),
		array(
			'title'    => __( 'Main Area (One Column / Page Header (Featured Image)) for Pages', 'unitone' ),
			'slug'     => 'unitone/template/page/main/one-column-page-header-featured',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/page/main/one-column-page-header-featured.php' ),
		),
		array(
			'title'    => __( 'Main Area (One Column / Page Header (Image)) for Pages', 'unitone' ),
			'slug'     => 'unitone/template/page/main/one-column-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/page/main/one-column-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (One Column / Page Header (Slim)) for Pages', 'unitone' ),
			'slug'     => 'unitone/template/page/main/one-column-page-header-slim',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/page/main/one-column-page-header-slim.php' ),
		),
		array(
			'title'    => __( 'Main Area (One Column / Page Header (Wide)) for Pages', 'unitone' ),
			'slug'     => 'unitone/template/page/main/one-column-page-header-wide',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/page/main/one-column-page-header-wide.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar / Page Header (Featured Image)) for Pages', 'unitone' ),
			'slug'     => 'unitone/template/page/main/right-sidebar/page-header-featured',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/page/main/right-sidebar-page-header-featured.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar / Page Header (Image)) for Pages', 'unitone' ),
			'slug'     => 'unitone/template/page/main/right-sidebar/page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/page/main/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar) for Pages', 'unitone' ),
			'slug'     => 'unitone/template/page/main/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/page/main/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Page Header for Pages', 'unitone' ),
			'slug'     => 'unitone/template/page/page-header/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/page/page-header/default.php' ),
		),
		array(
			'title'    => __( 'Page Header (Featured Image) for Pages', 'unitone' ),
			'slug'     => 'unitone/template/page/page-header/featured',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/page/page-header/featured.php' ),
		),
		array(
			'title'    => __( 'Page Header (Image) for Pages', 'unitone' ),
			'slug'     => 'unitone/template/page/page-header/image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/page/page-header/image.php' ),
		),
		array(
			'title'    => __( 'Page Header (Slim) for Pages', 'unitone' ),
			'slug'     => 'unitone/template/page/page-header/slim',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/page/page-header/slim.php' ),
		),
		array(
			'title'    => __( 'Page Header (Wide) for Pages', 'unitone' ),
			'slug'     => 'unitone/template/page/page-header/wide',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/page/page-header/wide.php' ),
		),
		array(
			'title'    => __( 'Main Area (One Column) for Search Results', 'unitone' ),
			'slug'     => 'unitone/template/search/main/one-column',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/search/main/one-column.php' ),
		),
		array(
			'title'    => __( 'Main Area (One Column / Page Header (Image)) for Search Results', 'unitone' ),
			'slug'     => 'unitone/template/search/main/one-column-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/search/main/one-column-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar / Page Header (Image)) for Search Results', 'unitone' ),
			'slug'     => 'unitone/template/search/main/right-sidebar-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/search/main/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar) for Search Results', 'unitone' ),
			'slug'     => 'unitone/template/search/main/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/search/main/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Page Header for Search Results', 'unitone' ),
			'slug'     => 'unitone/template/search/page-header/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/search/page-header/default.php' ),
		),
		array(
			'title'    => __( 'Page Header (Image) for Search Results', 'unitone' ),
			'slug'     => 'unitone/template/search/page-header/image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/search/page-header/image.php' ),
		),
		array(
			'title'    => __( 'Main Area (One Column) for Single Posts', 'unitone' ),
			'slug'     => 'unitone/template/single/main/one-column',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/single/main/one-column.php' ),
		),
		array(
			'title'    => __( 'Main Area (Blank) for Single Posts', 'unitone' ),
			'slug'     => 'unitone/template/single/main/blank',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/single/main/blank.php' ),
		),
		array(
			'title'    => __( 'Main Area (One Column / Page Header (Featured Image)) for Single Posts', 'unitone' ),
			'slug'     => 'unitone/template/single/main/one-column-page-header-featured',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/single/main/one-column-page-header-featured.php' ),
		),
		array(
			'title'    => __( 'Main Area (Page Header (Image)) for Single Posts', 'unitone' ),
			'slug'     => 'unitone/template/single/main/one-column-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/single/main/one-column-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Page Header (Slim)) for Single Posts', 'unitone' ),
			'slug'     => 'unitone/template/single/main/one-column-page-header-slim',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/single/main/one-column-page-header-slim.php' ),
		),
		array(
			'title'    => __( 'Main Area (Page Header (Wide)) for Single Posts', 'unitone' ),
			'slug'     => 'unitone/template/single/main/one-column-page-header-wide',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/single/main/one-column-page-header-wide.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar / Page Header (Featured Image)) for Single Posts', 'unitone' ),
			'slug'     => 'unitone/template/single/main/right-sidebar-page-header-featured',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/single/main/right-sidebar-page-header-featured.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar / Page Header (Image)) for Single Posts', 'unitone' ),
			'slug'     => 'unitone/template/single/main/right-sidebar-page-header-image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/single/main/right-sidebar-page-header-image.php' ),
		),
		array(
			'title'    => __( 'Main Area (Right Sidebar) for Single Posts', 'unitone' ),
			'slug'     => 'unitone/template/single/main/right-sidebar',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/single/main/right-sidebar.php' ),
		),
		array(
			'title'    => __( 'Page Header for Single Posts', 'unitone' ),
			'slug'     => 'unitone/template/single/page-header/default',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/single/page-header/default.php' ),
		),
		array(
			'title'    => __( 'Page Header (Featured Image) for Single Posts', 'unitone' ),
			'slug'     => 'unitone/template/single/page-header/featured',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/single/page-header/featured.php' ),
		),
		array(
			'title'    => __( 'Page Header (Image) for Single Posts', 'unitone' ),
			'slug'     => 'unitone/template/single/page-header/image',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/single/page-header/image.php' ),
		),
		array(
			'title'    => __( 'Page Header (Slim) for Single Posts', 'unitone' ),
			'slug'     => 'unitone/template/single/page-header/slim',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/single/page-header/slim.php' ),
		),
		array(
			'title'    => __( 'Page Header (Wide) for Single Posts', 'unitone' ),
			'slug'     => 'unitone/template/single/page-header/wide',
			'inserter' => false,
			'path'     => get_theme_file_path( 'patterns/private/template/single/page-header/wide.php' ),
		),
	);

	foreach ( $patterns as $pattern ) {
		ob_start();
		include $pattern['path'];
		$pattern['content'] = ob_get_clean();
		unset( $pattern['path'] );
		register_block_pattern( $pattern['slug'], $pattern );
	}
}
add_action( 'init', 'unitone_register_block_patterns', 9 );
