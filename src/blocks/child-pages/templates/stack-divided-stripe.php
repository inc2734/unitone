<?php
$data_unitone_layout = array(
	'stack',
	'-divider:stripe',
);
if ( ! empty( $attributes['unitone']['gap'] ) ) {
	$data_unitone_layout[] = '-gap:' . $attributes['unitone']['gap'];
}
?>
<ul
	data-unitone-layout="<?php echo esc_attr( implode( ' ', $data_unitone_layout ) ); ?>"
>
	<?php while ( $wp_query->have_posts() ) : ?>
		<?php $wp_query->the_post(); ?>
		<li data-unitone-layout="stack__content">
			<p><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></p>
		</li>
	<?php endwhile; ?>
	<?php wp_reset_postdata(); ?>
</ul>
