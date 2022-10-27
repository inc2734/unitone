<ul data-unitone-layout="stack -divider:stripe -gap:-1">
	<?php while ( $wp_query->have_posts() ) : ?>
		<?php $wp_query->the_post(); ?>
		<li data-unitone-layout="stack__content">
			<p><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></p>
		</li>
	<?php endwhile; ?>
	<?php wp_reset_postdata(); ?>
</ul>
