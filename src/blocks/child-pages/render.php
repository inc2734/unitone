<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

require_once __DIR__ . '/lib.php';

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

$class_name  = ! empty( $attributes['className'] ) ? $attributes['className'] : null;
$block_style = $class_name && preg_match( '|is-style-([^ ]+)|', $class_name, $match ) ? $match[1] : null;
$template    = __DIR__ . $block_style . '.php';
$template    = $block_style ? __DIR__ . '/templates/' . $block_style . '.php' : __DIR__ . '/templates/default.php';
if ( ! file_exists( $template ) ) {
	return;
}

$block_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'unitone-child-pages',
	)
);

$background_color       = $attributes['backgroundColor'] ?? null;
$style_background_color = $attributes['style']['color']['background'] ?? null;
$text_color             = $attributes['textColor'] ?? null;
$style_text_color       = $attributes['style']['color']['text'] ?? null;
?>
<div <?php echo wp_kses_data( $block_wrapper_attributes ); ?>>
	<?php
	ob_start();
	require $template;
	$html = preg_replace( '/[\r\n\t]+/', ' ', ob_get_clean() );
	$html = str_replace( '> </', '></', $html );
	echo apply_filters( 'unitone_child_pages', $html, $the_query, $attributes ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	?>
</div>
