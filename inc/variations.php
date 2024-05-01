<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

/**
 * Register variations.
 */
function unitone_register_variations() {
	$asset = include get_theme_file_path( 'dist/variations/variations.asset.php' );
	wp_enqueue_script(
		'unitone/variations',
		get_theme_file_uri( 'dist/variations/variations.js' ),
		$asset['dependencies'],
		filemtime( get_theme_file_path( 'dist/variations/variations.js' ) ),
		array(
			'strategy'  => 'defer',
			'in_footer' => false,
		)
	);
	wp_set_script_translations( 'unitone/variations', 'unitone', get_template_directory() . '/languages' );
}
add_action( 'enqueue_block_editor_assets', 'unitone_register_variations' );

/**
 * Registers block bindings for share buttons.
 *
 * This share buttons are block variations of core/button.
 */
function unitone_register_block_bindings_for_share_buttons() {
	register_block_bindings_source(
		'unitone/share-button',
		array(
			'label'              => __( 'Share Button', 'unitone' ),
			'uses_context'       => array( 'postId' ),
			'get_value_callback' => function ( $source_args, $block_instance ) {
				$current_post_id = $block_instance->context['postId'];

				if ( ! $current_post_id || ! isset( $source_args['key'] ) ) {
					return;
				}

				switch ( $source_args['key'] ) {
					case 'x':
						return 'https://twitter.com/intent/tweet?url=' . rawurlencode( esc_url( get_permalink( $current_post_id ) ) ) . '&text=' . esc_attr( rawurlencode( get_the_title( $current_post_id ) ) );
					case 'facebook':
						return 'https://www.facebook.com/sharer/sharer.php?u=' . rawurlencode( esc_url( get_permalink( $current_post_id ) ) );
					case 'line':
						return 'https://social-plugins.line.me/lineit/share?url=' . rawurlencode( esc_url( get_permalink( $current_post_id ) ) ) . '&text=' . esc_attr( rawurlencode( get_the_title( $current_post_id ) ) );
					case 'hatena':
						return 'http://b.hatena.ne.jp/add?mode=confirm&url=' . rawurlencode( esc_url( get_permalink( $current_post_id ) ) );
				}
			},
		)
	);
}
add_action( 'init', 'unitone_register_block_bindings_for_share_buttons' );
