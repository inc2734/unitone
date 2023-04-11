<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

include_once( __DIR__ . '/lib.php' );

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

$wp_query = unitone_get_child_pages_query( $parent_id, $current_id );
if ( empty( $wp_query ) || ! $wp_query->have_posts() ) {
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
?>
<div <?php echo $block_wrapper_attributes; ?>>
	<?php
	ob_start();
	include( $template );
	$html = preg_replace( '/[\r\n\t]+/', ' ', ob_get_clean() );
	$html = str_replace( '> </', '></', $html );
	echo apply_filters( 'unitone_child_pages', $html, $wp_query, $attributes );
	?>
</div>
