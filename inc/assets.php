<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

/**
 * Enqueue theme scripts and styles.
 */
function unitone_theme_scripts() {
	$asset = include get_theme_file_path( 'dist/js/app/app.asset.php' );
	wp_enqueue_script(
		'unitone/app',
		get_theme_file_uri( 'dist/js/app/app.js' ),
		$asset['dependencies'],
		filemtime( get_theme_file_path( 'dist/js/app/app.js' ) ),
		array(
			'strategy'  => 'defer',
			'in_footer' => false,
		)
	);

	wp_enqueue_style(
		'unitone',
		get_theme_file_uri( 'dist/css/app/app.css' ),
		array( 'wp-block-library' ),
		filemtime( get_theme_file_path( 'dist/css/app/app.css' ) )
	);
}
add_action( 'wp_enqueue_scripts', 'unitone_theme_scripts', 9 );

/**
 * Enqueue theme scripts and styles for the block editor.
 */
function unitone_enqueue_block_editor_assets() {
	if ( ! is_admin() ) {
		return;
	}

	$asset = include get_theme_file_path( 'dist/js/editor/editor.asset.php' );
	wp_enqueue_script(
		'unitone/editor',
		get_theme_file_uri( 'dist/js/editor/editor.js' ),
		$asset['dependencies'],
		filemtime( get_theme_file_path( 'dist/js/editor/editor.js' ) ),
		array(
			'strategy'  => 'defer',
			'in_footer' => false,
		)
	);
	wp_set_script_translations( 'unitone/editor', 'unitone', get_template_directory() . '/languages' );

	foreach ( WP_Block_Type_Registry::get_instance()->get_all_registered() as $block_type => $block ) {
		if ( 0 === strpos( $block_type, 'unitone/' ) ) {
			$handle = str_replace( '/', '-', $block_type ) . '-editor-script';
			wp_set_script_translations( $handle, 'unitone', get_template_directory() . '/languages' );
		}
	}

	wp_enqueue_style(
		'unitone',
		get_theme_file_uri( 'dist/css/editor/editor.css' ),
		array(),
		filemtime( get_theme_file_path( 'dist/css/editor/editor.css' ) )
	);

	$css = file_get_contents( get_template_directory() . '/dist/css/app/editor-style.css' );

	// For non iframe editor and iframe editor.
	$css = str_replace(
		array(
			':where(body)',
		),
		':where(.editor-styles-wrapper)',
		$css
	);

	// For non iframe editor.
	$css = str_replace(
		array(
			'div:where(.editor-styles-wrapper.block-editor-writing-flow) html',
			'div:where(.editor-styles-wrapper.block-editor-writing-flow) body',
		),
		'div:where(.editor-styles-wrapper.block-editor-writing-flow)',
		$css
	);

	// For iframe editor.
	$css = str_replace(
		array(
			':where(.editor-styles-wrapper.block-editor-iframe__body) html',
			':where(.editor-styles-wrapper.block-editor-iframe__body) body',
		),
		':where(.editor-styles-wrapper.block-editor-iframe__body)',
		$css
	);

	$css = str_replace( '}:where(.editor-styles-wrapper)', '}html :where(.editor-styles-wrapper)', $css );
	wp_add_inline_style(
		'unitone',
		$css
	);

	// For color picker.
	$css = file_get_contents( get_template_directory() . '/dist/css/app/editor-style.css' );
	$css = preg_match_all(
		'|--unitone--color--[^:]+:#[a-f0-9]{3,6};|ims',
		$css,
		$matches
	);
	if ( $matches ) {
		wp_add_inline_style(
			'global-styles-css-custom-properties',
			':root{' . implode( '', $matches[0] ) . '}'
		);
	}

	wp_localize_script(
		'wp-block-editor',
		'unitone',
		array(
			'uploadBaseUrl' => wp_upload_dir()['baseurl'],
			'path'          => get_template_directory(),
			'url'           => get_template_directory_uri(),
		)
	);
}
add_action( 'enqueue_block_assets', 'unitone_enqueue_block_editor_assets', 9 );

/**
 * Enqueue block styles.
 */
function unitone_enqueue_block_styles() {
	$styled_blocks = array(
		'core/archives'            => array(),
		'core/audio'               => array(),
		'core/categories'          => array(),
		'core/code'                => array(),
		'core/columns'             => array(),
		'core/comments'            => array(),
		'core/button'              => array(),
		'core/gallery'             => array(),
		'core/image'               => array(),
		'core/latest-comments'     => array(),
		'core/latest-posts'        => array(),
		'core/list'                => array(),
		'core/navigation'          => array(),
		'core/post-comments-form'  => array(),
		'core/post-featured-image' => array(),
		'core/post-terms'          => array(),
		'core/post-title'          => array(),
		'core/pullquote'           => array(),
		'core/query'               => array(),
		'core/quote'               => array(),
		'core/rss'                 => array(),
		'core/search'              => array(),
		'core/separator'           => array(),
		'core/site-logo'           => array(),
		'core/site-title'          => array(),
		'core/social-links'        => array(),
		'core/table'               => array(),
		'core/video'               => array(),
	);

	foreach ( $styled_blocks as $block_type => $block_type_args ) {
		wp_enqueue_block_style(
			$block_type,
			array_merge(
				array(
					'handle' => 'unitone/' . $block_type,
					'src'    => get_theme_file_uri( 'dist/css/wp-blocks/' . str_replace( 'core/', '', $block_type ) . '/style.css' ),
					'path'   => get_theme_file_path( 'dist/css/wp-blocks/' . str_replace( 'core/', '', $block_type ) . '/style.css' ),
					'ver'    => filemtime( get_theme_file_path( 'dist/css/wp-blocks/' . str_replace( 'core/', '', $block_type ) . '/style.css' ) ),
				),
				$block_type_args
			)
		);
	}
}
add_action( 'after_setup_theme', 'unitone_enqueue_block_styles' );

/**
 * Enqueue block assets.
 */
function unitone_enqueue_block_assets() {
	$link_color = \WP_Theme_JSON_Resolver::get_merged_data( 'theme' )->get_data()['styles']['elements']['link']['color']['text'] ?? '';
	wp_add_inline_style(
		'unitone-mega-menu-style',
		'.unitone-mega-menu__container a:not(.wp-element-button), .editor-styles-wrapper .unitone-mega-menu__container a:not(.wp-element-button) {color: ' . esc_html( $link_color ) . '}'
	);
}
add_action( 'enqueue_block_assets', 'unitone_enqueue_block_assets', 11 );
