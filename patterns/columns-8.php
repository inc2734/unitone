<?php
/**
 * Title: Media text (2 columns / Center text)
 * Slug: unitone/columns/8
 * Categories: columns
 * Block Types: unitone/responsive-grid
 */

$images = array(
	get_template_directory_uri() . '/dist/img/stocksnap_lgg8nat9jy.jpg',
	get_template_directory_uri() . '/dist/img/stocksnap_ydxj69toal.jpg',
);
?>
<!-- wp:unitone/responsive-grid {"columnMinWidth":"410px"} -->
<div data-unitone-layout="responsive-grid" style="--unitone--column-min-width:410px">
	<?php for ( $i = 0; $i < 2; $i ++ ) : ?>
	<!-- wp:unitone/stack -->
	<div data-unitone-layout="stack">
		<!-- wp:unitone/frame {"ratio":"16/9","lock":{"move":true,"remove":true}} -->
		<div data-unitone-layout="frame" style="--unitone--ratio:16/9">
			<!-- wp:image {"id":1,"width":1920,"height":1280} -->
			<figure class="wp-block-image">
				<img src="<?php echo esc_url( $images[ $i ] ); ?>" alt="" width="1920" height="1280" class="wp-image-1"/>
			</figure>
			<!-- /wp:image -->
		</div>
		<!-- /wp:unitone/frame -->

		<!-- wp:unitone/container {"lock":{"move":true,"remove":true},"unitone":{"maxWidth":"var(--unitone--cg5)"}} -->
		<div data-unitone-layout="container" style="--unitone--max-width:var(--unitone--cg5)">
			<!-- wp:unitone/stack {"lock":{"move":true,"remove":true}} -->
			<div data-unitone-layout="stack">
				<!-- wp:unitone/center -->
				<div data-unitone-layout="center">
					<!-- wp:heading {"level":3,"fontSize":"unitone-l"} -->
					<h3 class="has-unitone-l-font-size">Lorem ipsum</h3>
					<!-- /wp:heading -->
				</div>
				<!-- /wp:unitone/center -->

				<!-- wp:paragraph -->
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam</p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:unitone/stack -->
		</div>
		<!-- /wp:unitone/container -->
	</div>
	<!-- /wp:unitone/stack -->
	<?php endfor; ?>
</div>
<!-- /wp:unitone/responsive-grid -->
