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
	$inner_blocks  = $block->parsed_block['innerBlocks'] ?? array();
	$tab_padding   = $attributes['tabPadding'] ?? null;
	$tab_ids       = array();
	$panel_ids     = array();
	$wrapper_style = array();

	$border_width = $attributes['style']['border']['width'] ?? null;
	if ( ! is_null( $border_width ) ) {
		$wrapper_style[] = '--unitone--border-width:' . $border_width;
	}

	$border_style = $attributes['style']['border']['style'] ?? null;
	if ( ! is_null( $border_style ) ) {
		$wrapper_style[] = '--unitone--border-style:' . $border_style;
	}

	$border_color = $attributes['borderColor'] ?? null;
	if ( ! is_null( $border_color ) ) {
		$wrapper_style[] = '--unitone--border-color:var(--wp--preset--color--' . $border_color . ')';
	} elseif ( ! empty( $attributes['style']['border']['color'] ) ) {
		$wrapper_style[] = '--unitone--border-color:' . $attributes['style']['border']['color'];
	}

	foreach ( $inner_blocks as $tab_panel ) {
		$anchor      = $tab_panel['attrs']['anchor'] ?? null;
		$panel_id    = $anchor ? $anchor : wp_unique_id( 'unitone-tab-panel-' );
		$panel_ids[] = $panel_id;
		$tab_ids[]   = 'unitone-tab-for-' . $panel_id;
	}

	$panel_index = 0;
	$p           = new \WP_HTML_Tag_Processor( $content );
	while ( $p->next_tag(
		array(
			'tag_name'   => 'DIV',
			'class_name' => 'unitone-tab-panel',
		)
	) ) {
		$panel_id = $panel_ids[ $panel_index ] ?? null;
		$tab_id   = $tab_ids[ $panel_index ] ?? null;
		if ( $panel_id ) {
			$p->set_attribute( 'id', $panel_id );
			$p->set_attribute( 'data-wp-context', wp_json_encode( array( 'clientId' => $panel_id ) ) );
			if ( $tab_id ) {
				$p->set_attribute( 'aria-labelledby', $tab_id );
			}
		}
		++$panel_index;
	}
	$content = $p->get_updated_html();

	$unitone_layout = array();

	$padding_top = $tab_padding['top'] ?? null;
	if ( ! is_null( $padding_top ) ) {
		$unitone_layout[] = '-padding-top:' . $padding_top;
	}

	$padding_right = $tab_padding['right'] ?? null;
	if ( ! is_null( $padding_right ) ) {
		$unitone_layout[] = '-padding-right:' . $padding_right;
	}

	$padding_bottom = $tab_padding['bottom'] ?? null;
	if ( ! is_null( $padding_bottom ) ) {
		$unitone_layout[] = '-padding-bottom:' . $padding_bottom;
	}

	$padding_left = $tab_padding['left'] ?? null;
	if ( ! is_null( $padding_left ) ) {
		$unitone_layout[] = '-padding-left:' . $padding_left;
	}

	if ( is_null( $padding_top ) && is_null( $padding_right ) && is_null( $padding_bottom ) && is_null( $padding_left ) ) {
		$unitone_layout[] = '-padding:' . $tab_padding;
	}

	$block_wrapper_attributes = get_block_wrapper_attributes(
		array(
			'class' => 'unitone-tabs',
			'id'    => ! empty( $attributes['anchor'] ) ? $attributes['anchor'] : false,
			'style' => $wrapper_style ? implode( ';', $wrapper_style ) . ';' : false,
		)
	);

	$interactivity_context = wp_interactivity_data_wp_context(
		array(
			'current' => $panel_ids[0] ?? false,
		)
	);

	$tab_bar_classes = array( 'unitone-tab-bar' );
	if ( $attributes['tabBarJustification'] ) {
		$tab_bar_classes[] = 'unitone-tab-bar--justification:' . $attributes['tabBarJustification'];
	}

	$html  = sprintf(
		'<div %1$s data-wp-interactive="unitone/tabs" data-wp-init="callbacks.syncFromHash" data-wp-on-window--hashchange="callbacks.syncFromHash" data-wp-on-document--click="actions.handleDocumentClick" %2$s>',
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

		$client_id = $panel_ids[ $i ] ?? null;
		$tab_id    = $tab_ids[ $i ] ?? null;
		if ( ! $client_id || ! $tab_id ) {
			continue;
		}

		$html .= '<button role="tab" class="unitone-tab"';
		$html .= ' id="' . esc_attr( $tab_id ) . '"';
		$html .= ' aria-controls="' . esc_attr( $client_id ) . '"';
		$html .= ' data-wp-context=\'{ "clientId": "' . esc_attr( $client_id ) . '" }\'';
		$html .= ' data-wp-bind--aria-selected="state.selected"';
		$html .= ' data-wp-on--click="actions.handleTabClick"';

		if ( $unitone_layout ) {
			$html .= ' data-unitone-layout="' . esc_attr( implode( ' ', $unitone_layout ) ) . '"';
		}

		if ( $style ) {
			$html .= ' style="' . esc_attr( implode( ';', $style ) ) . '"';
		}

		$html .= '>';
		$html .= sprintf( '<div class="unitone-tab__label">%1$s</div>', wp_kses_post( $tab_panel['attrs']['tabLabel'] ?? '' ) );
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
