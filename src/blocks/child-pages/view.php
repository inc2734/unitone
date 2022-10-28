<?php
$parent_id      = false;
$show_top_level = ! empty( $attributes['showTopLevel'] ) ? $attributes['showTopLevel'] : false;
if ( $show_top_level ) {
	$ancestors = get_post_ancestors( get_the_ID() );
	array_unshift( $ancestors, get_the_ID() );
	$parent_id = end( $ancestors );
} else {
	$parent_id = ! empty( $attributes['parent']['id'] ) ? $attributes['parent']['id'] : get_the_ID();
}
if ( ! $parent_id ) {
	return;
}

$post_type = get_post_type( $parent_id );
if ( ! $post_type ) {
	return;
}

$post_type_object = get_post_type_object( $post_type );
if ( ! $post_type_object->hierarchical ) {
	return;
}

$args = array(
	'post_parent'    => $parent_id,
	'post_type'      => $post_type,
	'posts_per_page' => 100,
	'post_status'    => 'publish',
	'orderby'        => 'menu_order',
	'order'          => 'ASC',
);
$args = apply_filters( 'unitone_child_pages_args', $args );

$wp_query = new WP_Query( $args );
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
?>
<div <?php echo get_block_wrapper_attributes( array( 'class' => 'unitone-child-pages' ) ); ?>>
	<?php
	ob_start();
	include( $template );
	$html = preg_replace( '/[\r\n\t]+/', ' ', ob_get_clean() );
	$html = str_replace( '> </', '></', $html );
	echo apply_filters( 'unitone_child_pages', $html, $wp_query, $attributes );
	?>
</div>
