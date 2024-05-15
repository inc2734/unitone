<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

$display_child_pages = function ( $parent_id ) use ( &$display_child_pages ) {
	$child_query = unitone_get_child_pages_query( $parent_id );
	if ( empty( $child_query ) || ! $child_query->have_posts() ) {
		return;
	}
	?>
	<ul>
		<?php while ( $child_query->have_posts() ) : ?>
			<?php $child_query->the_post(); ?>
			<li>
				<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
				<?php $display_child_pages( get_the_ID() ); ?>
			</li>
		<?php endwhile; ?>
	</ul>
	<?php
};
?>

<ul>
	<?php while ( $the_query->have_posts() ) : ?>
		<?php $the_query->the_post(); ?>
		<li>
			<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
			<?php $display_child_pages( get_the_ID() ); ?>
		</li>
	<?php endwhile; ?>
</ul>
