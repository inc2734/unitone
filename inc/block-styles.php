<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

function unitone_register_block_styles() {
	register_block_style(
		'core/post-terms',
		array(
			'name'  => 'badge',
			'label' => __( 'Badge', 'unitone' ),
		)
	);

	register_block_style(
		'core/query',
		array(
			'name'  => 'block-link-underline',
			'label' => __( 'Block link (Underline)', 'unitone' ),
		)
	);

	register_block_style(
		'core/query',
		array(
			'name'  => 'block-link-bordered',
			'label' => __( 'Block link (Bordered)', 'unitone' ),
		)
	);

	register_block_style(
		'core/template-part/header',
		array(
			'name'  => 'block-link-bordered',
			'label' => __( 'Block link (Bordered)', 'unitone' ),
		)
	);
}
add_action( 'init', 'unitone_register_block_styles', 9 );
