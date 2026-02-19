<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

register_block_type(
	__DIR__,
	array(
		'render_callback' => 'render_block_unitone_responsive_switcher',
	)
);

/**
 * Renders the `unitone/responsive-switcher` block on the server.
 *
 * @param array $attributes Block attributes.
 * @param string $content The saved content.
 * @return string
 */
function render_block_unitone_responsive_switcher( $attributes, $content ) {
	$breakpoint = $attributes['breakpoint'] ?? null;
	$client_id  = wp_unique_id( 'unitone-responsive-switcher-' );

	if ( is_null( $breakpoint ) ) {
		return $content;
	}

	if ( false !== strpos( $content, '<style>' ) ) {
		$content = preg_replace( '|<style>(.+?)</style>|s', '', $content );
	}

	$p = new \WP_HTML_Tag_Processor( $content );
	if ( ! $p->next_tag() ) {
		return $content;
	}

	$p->set_attribute( 'data-unitone-client-id', $client_id );

	wp_add_inline_style(
		'unitone-responsive-switcher-style',
		'@media (min-width: ' . esc_attr( $breakpoint ) . ') { [data-unitone-client-id="' . esc_attr( $client_id ) . '"] > .unitone-responsive-switcher-container--desktop { display: block; } [data-unitone-client-id="' . esc_attr( $client_id ) . '"] > .unitone-responsive-switcher-container--mobile { display: none; } }'
	);

	return $p->get_updated_html();
}
