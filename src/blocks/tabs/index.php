<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

register_block_type(
	__DIR__,
	array(
		'render_callback' => 'render_block_unitone_tabs',
	)
);

/**
 * Renders the `unitone/tabs` block on the server.
 *
 * @param array $attributes Block attributes.
 * @param string $content The saved content.
 * @param WP_Block $block The block object.
 * @return string
 */
function render_block_unitone_tabs( $attributes, $content, $block ) {
	$inner_blocks = $block->parsed_block['innerBlocks'] ?? array();

	$block_wrapper_attributes = get_block_wrapper_attributes(
		array(
			'class' => 'unitone-tabs',
			'id'    => ! empty( $attributes['anchor'] ) ? $attributes['anchor'] : false,
		)
	);

	$interactivity_context = wp_interactivity_data_wp_context(
		array(
			'current' => $inner_blocks[0]['attrs']['clientId'] ?? false,
		)
	);

	$tab_bar_classes = array( 'unitone-tab-bar' );
	if ( $attributes['tabBarJustification'] ) {
		$tab_bar_classes[] = 'unitone-tab-bar--justification:' . $attributes['tabBarJustification'];
	}

	$html  = sprintf(
		'<div %1$s data-wp-interactive="unitone/tabs" %2$s>',
		$block_wrapper_attributes,
		$interactivity_context
	);
	$html .= '<div class="unitone-tabs__tab-bar" role="tablist">';
	$html .= '<div class="' . esc_attr( implode( ' ', $tab_bar_classes ) ) . '" role="tablist">';

	foreach ( $inner_blocks as $i => $tab_panel ) {
		$style = array();
		if ( ! empty( $tab_panel['attrs']['backgroundColor'] ) ) {
			$style[] = '--unitone--active-background-color: var(--wp--preset--color--' . $tab_panel['attrs']['backgroundColor'] . ')';
		} elseif ( ! empty( $tab_panel['attrs']['style']['color']['background'] ) ) {
			$style[] = '--unitone--active-background-color: ' . $tab_panel['attrs']['style']['color']['background'];
		}
		if ( ! empty( $tab_panel['attrs']['textColor'] ) ) {
			$style[] = '--unitone--active-color: var(--wp--preset--color--' . $tab_panel['attrs']['textColor'] . ')';
		} elseif ( ! empty( $tab_panel['attrs']['style']['color']['text'] ) ) {
			$style[] = '--unitone--active-color: ' . $tab_panel['attrs']['style']['color']['text'];
		}

		$anchor    = $tab_panel['attrs']['anchor'] ?? null;
		$client_id = $tab_panel['attrs']['clientId'] ?? null;

		$html .= '<button role="tab" class="unitone-tab"';
		$html .= ' aria-controls="' . esc_attr( $anchor ? $anchor : $client_id ) . '"';
		$html .= ' data-wp-context=\'{ "clientId": "' . esc_attr( $client_id ) . '" }\'';
		$html .= ' data-wp-bind--aria-selected="state.selected"';
		$html .= ' data-wp-on--click="actions.handleTabClick"';

		if ( $style ) {
			$html .= ' style="' . esc_attr( implode( ';', $style ) ) . '"';
		}

		$html .= '>';
		$html .= sprintf( '<div class="unitone-tab__label">%1$s</div>', wp_kses_post( $tab_panel['attrs']['tabLabel'] ) );
		$html .= '</button>';
	}

	$html .= '</div>';
	$html .= '</div>';
	$html .= '<div class="unitone-tabs__tab-view">';
	$html .= sprintf( '<div class="unitone-tab-view">%1$s</div>', $content );
	$html .= '</div>';
	$html .= '</div>';

	return $html;
}
