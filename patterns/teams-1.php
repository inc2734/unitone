<?php
/**
 * Title: Team
 * Slug: unitone/teams/1
 * Categories: teams
 * Block Types: unitone/responsive-grid
 */

$images = array(
	get_template_directory_uri() . '/dist/img/person-1.png',
	get_template_directory_uri() . '/dist/img/person-2.png',
	get_template_directory_uri() . '/dist/img/person-3.png',
	get_template_directory_uri() . '/dist/img/person-4.png',
);
?>
<!-- wp:unitone/responsive-grid {"columnMinWidth":"220px"} -->
<div data-unitone-layout="responsive-grid" style="--unitone--column-min-width:220px">
	<?php for ( $i = 0; $i < 4; $i ++ ) : ?>
		<!-- wp:unitone/stack {"unitone":{"gap":"-1"}} -->
		<div data-unitone-layout="stack -gap:-1">
			<!-- wp:unitone/frame {"ratio":"1/1"} -->
			<div data-unitone-layout="frame" style="--unitone--ratio:1/1">
				<!-- wp:image {"id":1,"width":960,"height":960} -->
				<figure class="wp-block-image">
					<img src="<?php echo esc_url( $images[ $i ] ); ?>" alt="" width="960" height="960" class="wp-image-1"/>
				</figure>
				<!-- /wp:image -->
			</div>
			<!-- /wp:unitone/frame -->

			<!-- wp:unitone/stack {"unitone":{"gap":"0"}} -->
			<div data-unitone-layout="stack -gap:0">
				<!-- wp:unitone/center -->
				<div data-unitone-layout="center">
					<!-- wp:heading {"level":3} -->
					<h3>Lorem Ipsum</h3>
					<!-- /wp:heading -->
				</div>
				<!-- /wp:unitone/center -->

				<!-- wp:unitone/center -->
				<div data-unitone-layout="center">
					<!-- wp:paragraph -->
					<p>dolor sit</p>
					<!-- /wp:paragraph -->
				</div>
				<!-- /wp:unitone/center -->
			</div>
			<!-- /wp:unitone/stack -->
		</div>
		<!-- /wp:unitone/stack -->
	<?php endfor; ?>
</div>
<!-- /wp:unitone/responsive-grid -->
