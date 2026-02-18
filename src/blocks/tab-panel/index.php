<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

register_block_type(
	__DIR__,
	array(
		'render_callback' => 'render_block_unitone_tab_panel',
	)
);

/**
 * Renders the `unitone/tab-panel` block on the server.
 *
 * @param array $attributes Block attributes.
 * @param string $content The saved content.
 * @param WP_Block $block The block object.
 * @return string
 */
function render_block_unitone_tab_panel( $attributes, $content, $block ) {
	$tab_panel_padding = $block->context['unitone/tabPanelPadding'] ?? null;

	$wrapper_attributes = array(
		'class' => 'unitone-tab-panel',
		'id'    => ! empty( $attributes['anchor'] ) ? $attributes['anchor'] : $attributes['clientId'],
	);

	$unitone_layout = array();

	$padding_top = $tab_panel_padding['top'] ?? null;
	if ( ! is_null( $padding_top ) ) {
		$unitone_layout[] = '-padding-top:' . $padding_top;
	}

	$padding_right = $tab_panel_padding['right'] ?? null;
	if ( ! is_null( $padding_right ) ) {
		$unitone_layout[] = '-padding-right:' . $padding_right;
	}

	$padding_bottom = $tab_panel_padding['bottom'] ?? null;
	if ( ! is_null( $padding_bottom ) ) {
		$unitone_layout[] = '-padding-bottom:' . $padding_bottom;
	}

	$padding_left = $tab_panel_padding['left'] ?? null;
	if ( ! is_null( $padding_left ) ) {
		$unitone_layout[] = '-padding-left:' . $padding_left;
	}

	if ( is_null( $padding_top ) && is_null( $padding_right ) && is_null( $padding_bottom ) && is_null( $padding_left ) ) {
		$unitone_layout[] = '-padding:' . $tab_panel_padding;
	}

	if ( $unitone_layout ) {
		$wrapper_attributes['data-unitone-layout'] = implode( ' ', $unitone_layout );
	}

	$block_wrapper_attributes = get_block_wrapper_attributes( $wrapper_attributes );

	return sprintf(
		'<div
				role="tabpanel"
				%1$s
				data-wp-interactive="unitone/tabs"
				data-wp-context=\'{ "clientId": "%2$s" }\'
				data-wp-bind--aria-hidden="!state.selected"
			>
			%3$s
		</div>',
		$block_wrapper_attributes,
		esc_attr( $attributes['clientId'] ),
		$content
	);
}
