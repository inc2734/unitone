<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

$display_child_pages = function( $parent_id, $current_id ) use ( &$display_child_pages ) {
	$child_query = unitone_get_child_pages_query( $parent_id, $current_id );
	if ( empty( $child_query ) || ! $child_query->have_posts() ) {
		return;
	}
	?>
	<ul data-unitone-layout="stack -gap:-2">
		<?php while ( $child_query->have_posts() ) : ?>
			<?php $child_query->the_post(); ?>
			<li>
				<div data-unitone-layout="stack -gap:-2">
					<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
					<?php $display_child_pages( get_the_ID(), $current_id ); ?>
				</div>
			</li>
		<?php endwhile; ?>
	</ul>
	<?php
};

$data_unitone_layout = array(
	'stack',
	'-divider:stripe',
);
if ( ! empty( $attributes['unitone']['gap'] ) ) {
	$data_unitone_layout[] = '-gap:' . $attributes['unitone']['gap'];
}
?>

<ul data-unitone-layout="<?php echo esc_attr( implode( ' ', $data_unitone_layout ) ); ?>">
	<?php while ( $wp_query->have_posts() ) : ?>
		<?php $wp_query->the_post(); ?>
		<li data-unitone-layout="stack__content">
			<div data-unitone-layout="stack -gap:-2">
				<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
				<?php $display_child_pages( get_the_ID(), $current_id ); ?>
			</div>
		</li>
	<?php endwhile; ?>
	<?php wp_reset_postdata(); ?>
</ul>
