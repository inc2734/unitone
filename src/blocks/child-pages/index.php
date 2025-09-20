<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

require_once __DIR__ . '/lib.php';

register_block_type(
	__DIR__,
	array(
		'render_callback' => 'render_block_unitone_child_pages',
	)
);

/**
 * Renders the `unitone/child-pages` block on the server.
 *
 * @param array $attributes Block attributes.
 *
 * @return string
 */
function render_block_unitone_child_pages( $attributes ) {
	$parent_id      = false;
	$current_id     = get_the_ID();
	$show_top_level = ! empty( $attributes['showTopLevel'] ) ? $attributes['showTopLevel'] : false;
	if ( $show_top_level ) {
		$ancestors = get_post_ancestors( $current_id );
		array_unshift( $ancestors, $current_id );
		$parent_id = end( $ancestors );
	} else {
		$parent_id = ! empty( $attributes['parent']['id'] ) ? $attributes['parent']['id'] : $current_id;
	}
	if ( ! $parent_id ) {
		return;
	}

	$the_query = unitone_get_child_pages_query( $parent_id );
	if ( empty( $the_query ) || ! $the_query->have_posts() ) {
		return;
	}

	$layout       = $attributes['layout'];
	$divider_type = $attributes['unitone']['dividerType'] ?? $attributes['__unstableUnitoneSupports']['dividerType']['default'] ?? null;

	// @deprecated
	if ( 'default' === $layout && ! empty( $attributes['className'] ) ) {
		if ( preg_match( '|is-style-(.+?)-divided-(.+)$|', $attributes['className'], $match ) ) {
			$layout       = $match[1];
			$divider_type = $match[2];
		} elseif ( preg_match( '|is-style-(.+)$|', $attributes['className'], $match ) ) {
			$layout = $match[1];
		}
	}

	$template = __DIR__ . '/templates/' . $layout . '.php';
	if ( ! file_exists( $template ) ) {
		$template = __DIR__ . '/templates/default.php';
	}

	$block_wrapper_attributes = get_block_wrapper_attributes(
		array(
			'class' => implode(
				' ',
				array(
					'unitone-child-pages',
					'unitone-child-pages--layout:' . $layout,
				)
			),
			'id'    => ! empty( $attributes['anchor'] ) ? $attributes['anchor'] : false,
		)
	);

	$background_color       = $attributes['backgroundColor'] ?? null;
	$style_background_color = $attributes['style']['color']['background'] ?? null;

	$text_color       = $attributes['textColor'] ?? null;
	$style_text_color = $attributes['style']['color']['text'] ?? null;

	$border_color              = $attributes['borderColor'] ?? false;
	$style_border_color        = $attributes['style']['border']['color'] ?? false;
	$style_border_top_color    = unitone_get_preset_css_var( $attributes['style']['border']['top']['color'] ?? false );
	$style_border_right_color  = unitone_get_preset_css_var( $attributes['style']['border']['right']['color'] ?? false );
	$style_border_bottom_color = unitone_get_preset_css_var( $attributes['style']['border']['bottom']['color'] ?? false );
	$style_border_left_color   = unitone_get_preset_css_var( $attributes['style']['border']['left']['color'] ?? false );

	$style_border_style        = $attributes['style']['border']['style'] ?? false;
	$style_border_top_style    = $attributes['style']['border']['top']['style'] ?? false;
	$style_border_right_style  = $attributes['style']['border']['right']['style'] ?? false;
	$style_border_bottom_style = $attributes['style']['border']['bottom']['style'] ?? false;
	$style_border_left_style   = $attributes['style']['border']['left']['style'] ?? false;

	$style_border_width        = $attributes['style']['border']['width'] ?? false;
	$style_border_top_width    = $attributes['style']['border']['top']['width'] ?? false;
	$style_border_right_width  = $attributes['style']['border']['right']['width'] ?? false;
	$style_border_bottom_width = $attributes['style']['border']['bottom']['width'] ?? false;
	$style_border_left_width   = $attributes['style']['border']['left']['width'] ?? false;

	$style_border_radius              = isset( $attributes['style']['border']['radius'] ) && ! is_array( $attributes['style']['border']['radius'] )
		? $attributes['style']['border']['radius']
		: false;
	$style_border_top_left_radius     = $attributes['style']['border']['radius']['topLeft'] ?? false;
	$style_border_top_right_radius    = $attributes['style']['border']['radius']['topRight'] ?? false;
	$style_border_bottom_left_radius  = $attributes['style']['border']['radius']['bottomLeft'] ?? false;
	$style_border_bottom_right_radius = $attributes['style']['border']['radius']['bottomRight'] ?? false;

	ob_start();
	require $template;
	$html    = preg_replace( '/[\r\n\t]+/', ' ', ob_get_clean() );
	$html    = str_replace( '> </', '></', $html );
	$content = apply_filters( 'unitone_child_pages', $html, $the_query, $attributes );

	return sprintf(
		'<div %1$s>%2$s</div>',
		$block_wrapper_attributes,
		$content
	);
}
