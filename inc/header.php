<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

use Unitone\App\Controller\Manager\Manager;

/**
 * Switch the default header template part according to the setup setting.
 *
 * @param array $parsed_block The block being rendered.
 * @return array
 */
function unitone_switch_header_template_part( $parsed_block ) {
	if ( ( $parsed_block['blockName'] ?? '' ) !== 'core/template-part' ) {
		return $parsed_block;
	}

	$slug = $parsed_block['attrs']['slug'] ?? '';
	if ( 'header' !== $slug ) {
		return $parsed_block;
	}

	$position = Manager::get_setting( 'header-position' );
	if ( ! in_array( $position, array( 'sticky', 'fixed' ), true ) ) {
		return $parsed_block;
	}

	$theme_folders = function_exists( 'get_block_theme_folders' )
		? get_block_theme_folders()
		: array();

	$parts_dir     = $theme_folders['wp_template_part'] ?? 'parts';
	$position_slug = 'header-' . $position;

	if ( locate_template( $parts_dir . '/' . $position_slug . '.html' ) ) {
		$parsed_block['attrs']['slug'] = $position_slug;
	}

	return $parsed_block;
}
add_filter( 'render_block_data', 'unitone_switch_header_template_part' );
