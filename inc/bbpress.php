<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

if ( ! class_exists( 'bbPress' ) ) {
	return;
}

/**
 * Add templates.
 */
add_action(
	'init',
	function () {
		$block_templates = array(
			array(
				'slug'    => 'unitone//bbpress',
				'title'   => __( 'for bbPress', 'unitone' ),
				'content' => file_get_contents( get_theme_file_path( 'templates.ext/bbpress/bbpress.html' ) ),
			),
		);

		foreach ( $block_templates as $block_template ) {
			$slug = $block_template['slug'];
			unset( $block_template['slug'] );

			register_block_template(
				$slug,
				$block_template
			);
		}
	}
);

/**
 * Add patterns.
 */
add_action(
	'init',
	function () {
		$patterns = array(
			array(
				'title'    => __( 'Main Area (One Column) for bbPress', 'unitone' ),
				'slug'     => 'unitone/template/bbpress/main/one-column',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/bbpress/private/bbpress/main/one-column.php' ),
			),
			array(
				'title'    => __( 'Main Area (One Column / Page Header (Image)) for bbPress', 'unitone' ),
				'slug'     => 'unitone/template/bbpress/main/one-column-page-header-image',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/bbpress/private/bbpress/main/one-column-page-header-image.php' ),
			),
			array(
				'title'    => __( 'Main Area (Right Sidebar / Page Header (Image)) for bbPress', 'unitone' ),
				'slug'     => 'unitone/template/bbpress/main/right-sidebar-page-header-image',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/bbpress/private/bbpress/main/right-sidebar-page-header-image.php' ),
			),
			array(
				'title'    => __( 'Main Area (Right Sidebar) for bbPress', 'unitone' ),
				'slug'     => 'unitone/template/bbpress/main/right-sidebar',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/bbpress/private/bbpress/main/right-sidebar.php' ),
			),
			array(
				'title'    => __( 'Page Header (Image) for bbPress', 'unitone' ),
				'slug'     => 'unitone/template/bbpress/page-header/image',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/bbpress/private/bbpress/page-header/image.php' ),
			),
			array(
				'title'    => __( 'Page Header for bbPress', 'unitone' ),
				'slug'     => 'unitone/template/bbpress/page-header/default',
				'inserter' => false,
				'path'     => get_theme_file_path( 'patterns.ext/bbpress/private/bbpress/page-header/default.php' ),
			),

			array(
				'title'         => __( 'bbPress: Left Header / Page Header (Image)', 'unitone' ),
				'slug'          => 'unitone/template/bbpress/left-header-page-header-image',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'bbpress' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/bbpress/template-bbpress-left-header-page-header-image.php' ),
			),
			array(
				'title'         => __( 'bbPress: Left Header', 'unitone' ),
				'slug'          => 'unitone/template/bbpress/left-header',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'bbpress' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/bbpress/template-bbpress-left-header.php' ),
			),
			array(
				'title'         => __( 'bbPress: One Column / Page Header (Image)', 'unitone' ),
				'slug'          => 'unitone/template/bbpress/one-column-page-header-image',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'bbpress' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/bbpress/template-bbpress-one-column-page-header-image.php' ),
			),
			array(
				'title'         => __( 'bbPress: One Column', 'unitone' ),
				'slug'          => 'unitone/template/bbpress/one-column',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'bbpress' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/bbpress/template-bbpress-one-column.php' ),
			),
			array(
				'title'         => __( 'bbPress: Right Sidebar / Page Header (Image)', 'unitone' ),
				'slug'          => 'unitone/template/bbpress/right-sidebar-page-header-image',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'bbpress' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/bbpress/template-bbpress-right-sidebar-page-header-image.php' ),
			),
			array(
				'title'         => __( 'bbPress: Right Sidebar', 'unitone' ),
				'slug'          => 'unitone/template/bbpress/right-sidebar',
				'categories'    => array( 'unitone-templates' ),
				'templateTypes' => array( 'bbpress' ),
				'inserter'      => false,
				'path'          => get_theme_file_path( 'patterns.ext/bbpress/template-bbpress-right-sidebar.php' ),
			),
		);

		foreach ( $patterns as $pattern ) {
			ob_start();
			include $pattern['path'];
			$pattern['content'] = ob_get_clean();
			unset( $pattern['path'] );
			register_block_pattern( $pattern['slug'], $pattern );
		}
	},
	9
);

/**
 * Using block templates.
 */
add_filter(
	'bbp_template_include',
	function () {
		if (
			bbp_is_forum_archive() ||
			bbp_is_topic_archive() ||
			bbp_is_search() ||
			bbp_is_single_user_edit() ||
			bbp_is_single_user()
		) {
			add_filter(
				'the_content',
				function () {
					global $post;

					return $post->post_content;
				}
			);
		}

		return ABSPATH . WPINC . '/template-canvas.php';
	}
);

/**
 * Using templates/page-bbpress.html.
 *
 * When this callback is disabled,
 * - example.com/forums/users ... Used templates/index.html
 * - example.com/forums/            ... Used templates/archive.html
 * - example.com/topics/            ... Used templates/archive.html
 */
add_filter(
	'pre_get_block_templates',
	function ( $query_result ) {
		if ( is_bbpress() ) {
			return array(
				get_block_template( 'unitone//bbpress' ),
			);
		}
		return $query_result;
	}
);

/**
 * Remove author IP address.
 */
add_filter( 'bbp_get_author_ip', '__return_null' );
