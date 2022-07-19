<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

use Unitone\App\DynamicBlock;

/**
 * Register blocks.
 */
function unitone_register_blocks() {
	register_block_type( get_template_directory() . '/dist/blocks/both-sides' );
	register_block_type( get_template_directory() . '/dist/blocks/both-sides-content' );
	register_block_type( get_template_directory() . '/dist/blocks/decorator' );
	register_block_type( get_template_directory() . '/dist/blocks/center' );
	register_block_type( get_template_directory() . '/dist/blocks/cluster' );
	register_block_type( get_template_directory() . '/dist/blocks/container' );
	register_block_type( get_template_directory() . '/dist/blocks/cover' );
	register_block_type( get_template_directory() . '/dist/blocks/cover-content' );
	register_block_type( get_template_directory() . '/dist/blocks/frame' );
	register_block_type( get_template_directory() . '/dist/blocks/layer' );
	register_block_type( get_template_directory() . '/dist/blocks/layers' );
	register_block_type( get_template_directory() . '/dist/blocks/responsive-grid' );
	register_block_type( get_template_directory() . '/dist/blocks/gutters' );
	register_block_type( get_template_directory() . '/dist/blocks/site-container-fixed-sidebar' );
	register_block_type( get_template_directory() . '/dist/blocks/site-container-fixed-sidebar-content' );
	register_block_type( get_template_directory() . '/dist/blocks/stack' );
	register_block_type( get_template_directory() . '/dist/blocks/switcher' );
	register_block_type( get_template_directory() . '/dist/blocks/text' );
	register_block_type( get_template_directory() . '/dist/blocks/with-sidebar' );
	register_block_type( get_template_directory() . '/dist/blocks/with-sidebar-content' );

	register_block_type(
		get_template_directory() . '/dist/blocks/breadcrumbs',
		array(
			'render_callback' => function( $attributes, $content ) {
				return DynamicBlock::render( get_template_directory() . '/dist/blocks/breadcrumbs', $attributes, $content );
			},
		)
	);
}
add_action( 'init', 'unitone_register_blocks' );

/**
 * Correct the path in block.json in the theme, since the file will not be read correctly if editorScript is passed.
 */
add_filter(
	'plugins_url',
	function( $url, $path, $plugin ) {
		return preg_match( '|' . get_template_directory() . '/dist/blocks/[^\/]+/block.json' . '|', $plugin )
			? get_template_directory_uri() . str_replace( array( get_template_directory(), 'block.json' ), '', $plugin ) . $path
			: $url;
	},
	10,
	3
);

/**
 * Fix .wp-container-* class being added by itself in the query loop block.
 */
remove_filter( 'render_block', 'wp_render_layout_support_flag' );
add_filter(
	'render_block',
	function( $block_content, $block ) {
		if ( 0 === strpos( $block['blockName'], 'unitone/' ) ) {
			$block_content = preg_replace(
				'|(<[^>]+?data-unitone-layout[^>]+?)wp-container-\d+?([^>]+?>)|ms',
				'$1$2',
				$block_content
			);
			return $block_content;
		}
		return wp_render_layout_support_flag( $block_content, $block );
	},
	10,
	2
);

/**
 * If site-logo block is empty, display unitone logo.
 */
add_filter(
	'render_block',
	function( $block_content, $block ) {
		if ( 'core/site-logo' === $block['blockName'] && ! $block_content ) {
			$metadata                = wp_json_file_decode( ABSPATH . WPINC . '/blocks/site-logo/block.json', array( 'associative' => true ) );
			$set_default_custom_logo = function( $html ) {
				return '<a href="' . get_home_url() . '" rel="home"><img loading="lazy" width="141" height="20" src="' . get_theme_file_uri( 'dist/img/logo.svg' ) . '" class="custom-logo" alt="unitone"></a>';
			};

			$default_attributes = array();
			foreach ( $metadata['attributes'] as $key => $values ) {
				$default                    = isset( $values['default'] ) ? $values['default'] : null;
				$default_attributes[ $key ] = $default;
			}
			add_filter( 'get_custom_logo', $set_default_custom_logo );
			$attributes = array_merge( $default_attributes, $block['attrs'] );
			$html       = render_block_core_site_logo( $attributes );
			$html       = preg_replace( '|class="[^"]+"|ms', 'class="wp-block-site-logo"', $html );
			remove_filter( 'get_custom_logo', $set_default_custom_logo );
			return $html;
		}
		return $block_content;
	},
	10,
	2
);
