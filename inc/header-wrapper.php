<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

use Unitone\App\Controller\Manager\Manager;

/**
 * Switch the header wrapper template part according to the setup setting.
 *
 * @param array $parsed_block The block being rendered.
 * @return array
 */
function unitone_switch_header_wrapper_template_part( $parsed_block ) {
	if ( ( $parsed_block['blockName'] ?? '' ) !== 'core/template-part' ) {
		return $parsed_block;
	}

	// $header_wrapper_slugs = array(
	// 'header-wrapper',
	// 'header-wrapper-normal',
	// 'header-wrapper-sticky',
	// 'header-wrapper-fixed',
	// );
	$slug = $parsed_block['attrs']['slug'] ?? '';

	// if ( ! in_array( $slug, $header_wrapper_slugs, true ) ) {
	// return $parsed_block;
	// }

	// if ( 0 !== strpos( $slug, 'header-wrapper-', true ) ) {
	// return $parsed_block;
	// }

	// $parsed_block['attrs']['tagName'] = 'div';

	// $class_name = $parsed_block['attrs']['className'] ?? '';
	// $classes    = preg_split( '/\s+/', $class_name, -1, PREG_SPLIT_NO_EMPTY );
	// if ( ! in_array( 'site-header-wrapper', $classes, true ) ) {
	// $classes[] = 'site-header-wrapper';
	// }
	// $parsed_block['attrs']['className'] = implode( ' ', $classes );

	if ( 'header-wrapper' !== $slug ) {
		return $parsed_block;
	}

	$position = Manager::get_setting( 'header-position' );
	if ( 'normal' === $position ) {
		return $parsed_block;
	}

	$theme_folders = function_exists( 'get_block_theme_folders' )
		? get_block_theme_folders()
		: array();

	$parts_dir     = $theme_folders['wp_template_part'] ?? 'parts';
	$position_slug = 'header-wrapper-' . $position;

	if ( locate_template( $parts_dir . '/' . $position_slug . '.html' ) ) {
		$parsed_block['attrs']['slug'] = $position_slug;
	}

	return $parsed_block;
}
add_filter( 'render_block_data', 'unitone_switch_header_wrapper_template_part' );
