<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

register_block_type(
	__DIR__,
	array(
		'render_callback' => 'render_block_unitone_swiper_autoplay_control',
	)
);

/**
 * Renders the `unitone/swiper-autoplay-control` block on the server.
 *
 * @param array  $attributes Block attributes.
 * @param string $content The saved content.
 * @return string
 */
function render_block_unitone_swiper_autoplay_control( $attributes, $content ) {
	if ( ! $content ) {
		return $content;
	}

	$action = 'play' === ( $attributes['action'] ?? 'pause' ) ? 'play' : 'pause';
	$label  = 'play' === $action
		? __( 'Play', 'unitone' )
		: __( 'Pause', 'unitone' );

	$p = new \WP_HTML_Tag_Processor( $content );
	if ( ! $p->next_tag(
		array(
			'tag_name'   => 'BUTTON',
			'class_name' => 'unitone-swiper-autoplay-control',
		)
	) ) {
		return $content;
	}

	$p->set_attribute( 'aria-label', $label );

	return $p->get_updated_html();
}
