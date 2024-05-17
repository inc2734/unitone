<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

use Inc2734\WP_OEmbed_Blog_Card\Bootstrap;
use Unitone\App\Controller\Manager\Manager;

new Bootstrap();

/**
 * Customize cache directory.
 */
add_filter(
	'inc2734_wp_oembed_blog_card_cache_directory',
	function ( $directory ) {
		return apply_filters( 'unitone_oembed_blog_card_cache_directory', $directory );
	}
);

/**
 * Customize template for loading.
 */
add_filter(
	'inc2734_wp_oembed_blog_card_loading_template',
	function ( $template, $url ) {
		return apply_filters( 'unitone_oembed_blog_card_loading_template', $template, $url );
	},
	10,
	2
);

/**
 * Customize url template.
 */
add_filter(
	'inc2734_wp_oembed_blog_card_url_template',
	function ( $template, $url ) {
		return apply_filters( 'unitone_oembed_blog_card_url_template', $template, $url );
	},
	10,
	2
);

/**
 * Customize blog card template.
 */
add_filter(
	'inc2734_wp_oembed_blog_card_blog_card_template',
	function ( $template, $cache ) {
		return apply_filters( 'unitone_oembed_blog_card_template', $template, $cache );
	},
	10,
	2
);

add_filter(
	'inc2734_wp_oembed_blog_card_block_editor_template',
	function ( $template, $url ) {
		return apply_filters( 'unitone_oembed_blog_card_block_editor_template', $template, $url );
	},
	10,
	2
);

add_filter(
	'unitone_oembed_blog_card_loading_template',
	function ( $html ) {
		return str_replace(
			'class="js-wp-oembed-blog-card"',
			'class="js-wp-oembed-blog-card wp-oembed-blog-card"',
			$html
		);
	}
);

add_filter(
	'unitone_oembed_blog_card_url_template',
	function ( $html ) {
		return str_replace(
			'class="wp-oembed-blog-card-url-template"',
			'class="wp-oembed-blog-card-url-template wp-oembed-blog-card"',
			$html
		);
	}
);

add_action(
	'enqueue_block_assets',
	function () {
		wp_enqueue_style(
			'unitone/wp-oembed-blog-card',
			get_theme_file_uri( 'dist/css/wp-oembed-blog-card/style.css' ),
			array( 'wp-oembed-blog-card' ),
			filemtime( get_theme_file_path( 'dist/css/wp-oembed-blog-card/style.css' ) )
		);

		$styles = array(
			'bgcolor-accent',
			'border-accent',
			'dark',
			'media',
			'simple',
		);

		foreach ( $styles as $style ) {
			wp_register_style(
				'unitone/wp-oembed-blog-card/' . $style,
				get_theme_file_uri( 'dist/css/wp-oembed-blog-card/' . $style . '.css' ),
				array( 'unitone/wp-oembed-blog-card' ),
				filemtime( get_theme_file_path( 'dist/css/wp-oembed-blog-card/' . $style . '.css' ) )
			);
		}

		$style = Manager::get_setting( 'wp-oembed-blog-card-style' );
		wp_enqueue_style( 'unitone/wp-oembed-blog-card/' . $style );
	}
);

add_action(
	'unitone_setup_enqueue_assets',
	function () {
		if ( ! wp_style_is( 'enqueued' ) && ! wp_style_is( 'registered' ) ) {
			wp_register_style(
				'wp-oembed-blog-card',
				get_theme_file_uri( 'vendor/inc2734/wp-oembed-blog-card/src/assets/css/app.css' ),
				array(),
				filemtime( get_theme_file_path( 'vendor/inc2734/wp-oembed-blog-card/src/assets/css/app.css' ) )
			);
		}

		wp_enqueue_style(
			'unitone/wp-oembed-blog-card',
			get_theme_file_uri( 'dist/css/wp-oembed-blog-card/style.css' ),
			array( 'wp-oembed-blog-card' ),
			filemtime( get_theme_file_path( 'dist/css/wp-oembed-blog-card/style.css' ) )
		);
	}
);
