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
	$asset = include( get_theme_file_path( 'dist/js/app/app.asset.php' ) );
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
		array( 'wp-oembed-blog-card' ),
		filemtime( get_theme_file_path( 'dist/css/app/app.css' ) )
	);
}
add_action( 'wp_enqueue_scripts', 'unitone_theme_scripts', 9 );

/**
 * Enqueue theme scripts and styles for the block editor.
 */
function unitone_enqueue_block_editor_assets() {
	$asset = include( get_theme_file_path( 'dist/js/editor/editor.asset.php' ) );
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

	// For non iframe editor
	$css = str_replace(
		array(
			'.editor-styles-wrapper:where(.block-editor-writing-flow) html',
			'.editor-styles-wrapper:where(.block-editor-writing-flow) body',
		),
		'.editor-styles-wrapper:where(.block-editor-writing-flow)',
		$css
	);

	// For iframe editor
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

	// Set min size of the pattern explorer thumbnail.
	$css = '.block-editor-block-preview__content-iframe {min-height: 100vh}';
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
			'path' => get_template_directory(),
			'url'  => get_template_directory_uri(),
		)
	);
}
add_action( 'enqueue_block_editor_assets', 'unitone_enqueue_block_editor_assets', 9 );

/**
 * Enqueue theme scripts and styles for the dashboard.
 */
function unitone_enqueue_admin_assets() {
	wp_enqueue_style(
		'unitone',
		get_theme_file_uri( 'dist/css/editor/editor.css' ),
		array(),
		filemtime( get_theme_file_path( 'dist/css/editor/editor.css' ) )
	);
}
add_action( 'wp_footer', 'unitone_enqueue_admin_assets', 9 );
