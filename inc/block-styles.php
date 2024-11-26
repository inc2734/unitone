<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

/**
 * Register block styles.
 */
function unitone_register_block_styles() {
	register_block_style(
		'core/button',
		array(
			'name'  => 'text',
			'label' => __( 'Text', 'unitone' ),
		)
	);

	register_block_style(
		'core/post-terms',
		array(
			'name'  => 'badge',
			'label' => __( 'Badge', 'unitone' ),
		)
	);

	register_block_style(
		'core/post-terms',
		array(
			'name'  => 'outline',
			'label' => __( 'Outline', 'unitone' ),
		)
	);

	register_block_style(
		'core/query',
		array(
			'name'  => 'underline',
			'label' => __( 'Underline', 'unitone' ),
		)
	);

	register_block_style(
		'core/query',
		array(
			'name'  => 'bordered',
			'label' => __( 'Bordered', 'unitone' ),
		)
	);

	register_block_style(
		'core/query',
		array(
			'name'  => 'stripe',
			'label' => __( 'Stripe', 'unitone' ),
		)
	);

	register_block_style(
		'core/query',
		array(
			'name'  => 'block-link',
			'label' => __( 'Block link', 'unitone' ),
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
		'core/query',
		array(
			'name'  => 'block-link-stripe',
			'label' => __( 'Block link (Stripe)', 'unitone' ),
		)
	);

	register_block_style(
		'core/template-part/header',
		array(
			'name'  => 'block-link-bordered',
			'label' => __( 'Block link (Bordered)', 'unitone' ),
		)
	);

	register_block_style(
		'core/navigation',
		array(
			'name'  => 'unitone',
			'label' => __( 'unitone', 'unitone' ),
		)
	);

	register_block_style(
		'core/navigation',
		array(
			'name'  => 'unitone-accordion',
			'label' => __( 'unitone (Accordion)', 'unitone' ),
		)
	);

	register_block_style(
		'core/image',
		array(
			'name'  => 'cover',
			'label' => __( 'Cover', 'unitone' ),
		)
	);

	register_block_style(
		'core/table',
		array(
			'name'  => 'underline',
			'label' => __( 'Underline', 'unitone' ),
		)
	);

	register_block_style(
		'core/table',
		array(
			'name'  => 'vertical-fill',
			'label' => __( 'Vertical fill', 'unitone' ),
		)
	);

	register_block_style(
		'core/table',
		array(
			'name'  => 'vertical-line',
			'label' => __( 'Vertical line', 'unitone' ),
		)
	);

	register_block_style(
		'core/table',
		array(
			'name'  => 'bordered',
			'label' => __( 'Bordered', 'unitone' ),
		)
	);
}
add_action( 'init', 'unitone_register_block_styles', 9 );
