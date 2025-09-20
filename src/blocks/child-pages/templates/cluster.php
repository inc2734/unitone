<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

$data_unitone_layout = array( 'cluster' );

if ( ! empty( $divider_type ) ) {
	$data_unitone_layout[] = '-divider:' . $divider_type;
}

if ( ! is_null( $attributes['unitone']['gap'] ?? null ) ) {
	$data_unitone_layout[] = '-gap:' . $attributes['unitone']['gap'];
}
?>
<ul
	data-unitone-layout="<?php echo esc_attr( implode( ' ', $data_unitone_layout ) ); ?>"
>
	<?php while ( $the_query->have_posts() ) : ?>
		<?php $the_query->the_post(); ?>
		<li data-unitone-layout="cluster__content">
			<div data-unitone-layout="cluster__content__content">
				<p><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></p>
			</div>
		</li>
	<?php endwhile; ?>
	<?php wp_reset_postdata(); ?>
</ul>
