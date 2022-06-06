<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

/**
 * Registers block patterns and categories.
 *
 * @return void
 */
function unitone_register_block_patterns() {
	$block_pattern_categories = array(
		'section' => array( 'label' => __( 'Section', 'unitone' ) ),
		'hero'    => array( 'label' => __( 'Hero', 'unitone' ) ),
		'columns' => array( 'label' => __( 'Columns', 'unitone' ) ),
		'banners' => array( 'label' => __( 'Banners', 'unitone' ) ),
		'cta'     => array( 'label' => __( 'Call to action', 'unitone' ) ),
		'faq'     => array( 'label' => __( 'FAQ', 'unitone' ) ),
		'teams'   => array( 'label' => __( 'Teams', 'unitone' ) ),
		'query'   => array( 'label' => __( 'Query', 'unitone' ) ),
		'pages'   => array( 'label' => __( 'Pages', 'unitone' ) ),
		'header'  => array( 'label' => __( 'Headers', 'unitone' ) ),
		'footer'  => array( 'label' => __( 'Footers', 'unitone' ) ),
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
add_action( 'init', 'unitone_register_block_patterns', 9 );
