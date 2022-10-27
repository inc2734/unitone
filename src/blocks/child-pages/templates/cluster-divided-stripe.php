<ul data-unitone-layout="cluster -divider:stripe">
	<?php while ( $wp_query->have_posts() ) : ?>
		<?php $wp_query->the_post(); ?>
		<li data-unitone-layout="cluster__content">
			<div data-unitone-layout="cluster__content__content">
				<p><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></p>
			</div>
		</li>
	<?php endwhile; ?>
	<?php wp_reset_postdata(); ?>
</ul>
