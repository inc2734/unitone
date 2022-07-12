<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

if ( ! defined( 'SNOW_MONKEY_EDITOR_PATH' ) ) {
	return;
}

/**
 * Enqueue assets for front.
 */
function unitone_enqueue_assets_for_snow_monkey_editor() {
	wp_enqueue_style(
		'unitone/snow-monkey-editor',
		get_theme_file_uri( 'dist/css/snow-monkey-editor/app.css' ),
		array( 'snow-monkey-editor' ),
		filemtime( get_theme_file_path( 'dist/css/snow-monkey-editor/app.css' ) ),
	);
}
add_action( 'wp_enqueue_scripts', 'unitone_enqueue_assets_for_snow_monkey_editor' );

/**
 * Enqueue assets for block editor.
 */
function unitone_enqueue_block_editor_assets_for_snow_monkey_editor() {
	wp_enqueue_style(
		'unitone/snow-monkey-editor',
		get_theme_file_uri( 'dist/css/snow-monkey-editor/editor.css' ),
		array( 'snow-monkey-editor@editor' ),
		filemtime( get_theme_file_path( 'dist/css/snow-monkey-editor/app.css' ) ),
	);
}
add_action( 'enqueue_block_editor_assets', 'unitone_enqueue_block_editor_assets_for_snow_monkey_editor' );
