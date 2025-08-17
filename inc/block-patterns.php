<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

/**
 * Registers block pattern categories.
 */
function unitone_register_block_pattern_categories() {
	$block_pattern_categories = array(
		'unitone-headers'       => array( 'label' => '[unitone] ' . __( 'Headers', 'unitone' ) ),
		'unitone-footers'       => array( 'label' => '[unitone] ' . __( 'Footers', 'unitone' ) ),
		'unitone-query'         => array( 'label' => '[unitone] ' . __( 'Query', 'unitone' ) ),
		'unitone-overlay-menus' => array( 'label' => '[unitone] ' . __( 'Overlay Menus', 'unitone' ) ),
		'unitone-pages'         => array( 'label' => '[unitone] ' . __( 'Pages', 'unitone' ) ),
		'unitone-templates'     => array( 'label' => '[unitone] ' . __( 'Templates', 'unitone' ) ),
		'unitone-others'        => array( 'label' => '[unitone] ' . __( 'Others', 'unitone' ) ),
	);

	/**
	 * Filters the theme block pattern categories.
	 *
	 * @param array[] $block_pattern_categories {
	 *     An associative array of block pattern categories, keyed by category name.
	 *
	 *     @type array[] $properties {
	 *         An array of block category properties.
	 *
	 *         @type string $label A human-readable label for the pattern category.
	 *     }
	 * }
	 */
	$block_pattern_categories = apply_filters( 'unitone_block_pattern_categories', $block_pattern_categories );

	foreach ( $block_pattern_categories as $name => $properties ) {
		if ( ! WP_Block_Pattern_Categories_Registry::get_instance()->is_registered( $name ) ) {
			register_block_pattern_category( $name, $properties );
		}
	}
}
// 9 or the category order will be unintended when the pattern is added with unitone_register_remote_block_patterns().
add_action( 'init', 'unitone_register_block_pattern_categories', 9 );
