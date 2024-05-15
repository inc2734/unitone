<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

$current_id = get_the_ID();

$data_unitone_layout      = array( 'stack', '-divider:stripe' );
$item_data_unitone_layout = array( 'stack' );

if ( ! empty( $attributes['unitone']['gap'] ) ) {
	$data_unitone_layout[]      = '-gap:' . $attributes['unitone']['gap'];
	$item_data_unitone_layout[] = '-gap:' . $attributes['unitone']['gap'];
}

$display_child_pages = function ( $parent_id ) use (
	&$display_child_pages,
	$current_id,
	$data_unitone_layout,
	$item_data_unitone_layout
) {
	if (
		$parent_id !== $current_id
		&& ! in_array( (int) $parent_id, get_post_ancestors( $current_id ), true )
	) {
		return;
	}

	$child_query = unitone_get_child_pages_query( $parent_id );
	if ( empty( $child_query ) || ! $child_query->have_posts() ) {
		return;
	}
	?>
	<ul data-unitone-layout="<?php echo esc_attr( implode( ' ', $data_unitone_layout ) ); ?>" style="margin-bottom: calc(var(--unitone--gap) * -1)">
		<?php while ( $child_query->have_posts() ) : ?>
			<?php $child_query->the_post(); ?>
			<li data-unitone-layout="<?php echo esc_attr( implode( ' ', $item_data_unitone_layout ) ); ?>">
				<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
				<?php $display_child_pages( get_the_ID() ); ?>
			</li>
		<?php endwhile; ?>
	</ul>
	<?php
};
?>

<ul data-unitone-layout="<?php echo esc_attr( implode( ' ', $data_unitone_layout ) ); ?>">
	<?php while ( $the_query->have_posts() ) : ?>
		<?php $the_query->the_post(); ?>
		<li data-unitone-layout="<?php echo esc_attr( implode( ' ', $item_data_unitone_layout ) ); ?>">
			<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
			<?php $display_child_pages( get_the_ID() ); ?>
		</li>
	<?php endwhile; ?>
	<?php wp_reset_postdata(); ?>
</ul>
