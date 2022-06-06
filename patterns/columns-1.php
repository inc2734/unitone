<?php
/**
 * Title: Media text
 * Slug: unitone/columns/1
 * Categories: columns
 * Block Types: unitone/responsive-grid
 */

$images = array(
	get_template_directory_uri() . '/dist/img/stocksnap_lgg8nat9jy.jpg',
	get_template_directory_uri() . '/dist/img/stocksnap_ydxj69toal.jpg',
	get_template_directory_uri() . '/dist/img/swing-ocean-sea2875.jpg',
	get_template_directory_uri() . '/dist/img/smartphone-mobile-laptop36.jpg',
);
?>
<!-- wp:unitone/responsive-grid {"columnMinWidth":"220px"} -->
<div data-layout="responsive-grid" style="--column-min-width:220px">
	<?php for ( $i = 0; $i < 4; $i ++ ) : ?>
		<!-- wp:unitone/stack {"unitone":{"gap":"-1"}} -->
		<div data-layout="stack -gap:-1">
			<!-- wp:unitone/frame {"ratio":"4/3"} -->
			<div data-layout="frame" style="--ratio:4/3">
				<!-- wp:image {"id":1,"width":1920,"height":1280} -->
				<figure class="wp-block-image">
					<img src="<?php echo esc_url( $images[ $i ] ); ?>" alt="" width="1920" height="1280" class="wp-image-1"/>
				</figure>
				<!-- /wp:image -->
			</div>
			<!-- /wp:unitone/frame -->

			<!-- wp:heading {"level":3} -->
			<h3>Lorem ipsum dolor sit amet</h3>
			<!-- /wp:heading -->

			<!-- wp:paragraph -->
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit</p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:unitone/stack -->
	<?php endfor; ?>
</div>
<!-- /wp:unitone/responsive-grid -->
