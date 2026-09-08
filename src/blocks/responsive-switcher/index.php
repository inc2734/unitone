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

	$selectors = unitone_get_responsive_query_selectors( '[data-unitone-client-id="' . esc_attr( $client_id ) . '"]' );
	$css       = '';
	foreach ( $selectors as $query => $selector ) {
		$css .= sprintf(
			'@%1$s (width >= %2$s) { %3$s { --unitone--responsive-switcher-desktop-display: block; --unitone--responsive-switcher-mobile-display: none; } }',
			$query,
			esc_attr( $breakpoint ),
			$selector
		);
	}

	wp_add_inline_style( 'unitone-responsive-switcher-style', $css );

	return $p->get_updated_html();
}
