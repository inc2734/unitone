<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

/**
 * Register formats.
 */
function unitone_register_formats() {
	$asset = include get_theme_file_path( 'dist/formats/formats.asset.php' );
	wp_enqueue_script(
		'unitone/formats',
		get_theme_file_uri( 'dist/formats/formats.js' ),
		$asset['dependencies'],
		filemtime( get_theme_file_path( 'dist/formats/formats.js' ) ),
		array(
			'strategy'  => 'defer',
			'in_footer' => false,
		)
	);
	wp_set_script_translations( 'unitone/formats', 'unitone', get_template_directory() . '/languages' );
}
add_action( 'enqueue_block_editor_assets', 'unitone_register_formats' );

/**
 * Enqueue assets.
 */
function unitone_enqueue_formats_assets() {
	wp_enqueue_style(
		'unitone/formats',
		get_theme_file_uri( 'dist/formats/formats.css' ),
		array(),
		filemtime( get_theme_file_path( 'dist/formats/formats.css' ) )
	);
}
add_action( 'enqueue_block_assets', 'unitone_enqueue_formats_assets' );
