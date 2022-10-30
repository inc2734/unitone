<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

use Inc2734\WP_OEmbed_Blog_Card\Bootstrap;

new Bootstrap();

/**
 * Customize cache directory.
 */
add_filter(
	'inc2734_wp_oembed_blog_card_cache_directory',
	function( $directory ) {
		return apply_filters( 'unitone_oembed_blog_card_cache_directory', $directory );
	}
);

/**
 * Customize template for block editor.
 */
add_filter(
	'inc2734_wp_oembed_blog_card_block_editor_template',
	function( $template, $url ) {
		$global_styles = wp_get_global_styles();

		$template .= sprintf(
			'<link rel="stylesheet" href="%1$s?ver=%2$s"><style>.rich.wp-block-embed__wrapper{background-color: %3$s; color: %4$s;}</style>',
			esc_url_raw( get_template_directory_uri() . '/dist/css/app/app.css' ),
			filemtime( get_template_directory() . '/dist/css/app/app.css' ),
			esc_attr( $global_styles['color']['background'] ),
			esc_attr( $global_styles['color']['text'] ),
		);
		return apply_filters( 'unitone_oembed_blog_card_block_editor_template', $template, $url );
	},
	10,
	2
);

/**
 * Customize template for loading.
 */
add_filter(
	'inc2734_wp_oembed_blog_card_loading_template',
	function( $template, $url ) {
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
	function( $template, $url ) {
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
	function( $template, $cache ) {
		return apply_filters( 'unitone_oembed_blog_card_template', $template, $cache );
	},
	10,
	2
);

add_filter(
	'unitone_oembed_blog_card_loading_template',
	function( $html ) {
		return str_replace(
			'class="js-wp-oembed-blog-card"',
			'class="js-wp-oembed-blog-card wp-oembed-blog-card"',
			$html
		);
	}
);

add_filter(
	'unitone_oembed_blog_card_url_template',
	function( $html ) {
		return str_replace(
			'class="wp-oembed-blog-card-url-template"',
			'class="wp-oembed-blog-card-url-template wp-oembed-blog-card"',
			$html
		);
	}
);
