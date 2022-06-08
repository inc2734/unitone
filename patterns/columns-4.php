<?php
/**
 * Title: Panels
 * Slug: unitone/columns/4
 * Categories: columns
 * Block Types: unitone/responsive-grid
 */
?>
<!-- wp:unitone/responsive-grid {"columnMinWidth":"220px"} -->
<div data-unitone-layout="responsive-grid" style="--unitone--column-min-width:220px">
	<?php for ( $i = 0; $i < 8; $i++ ) : ?>
	<!-- wp:unitone/decorator {"backgroundColor":"white","textColor":"black","shadow":true,"unitone":{"padding":1}} -->
	<div data-unitone-layout="decorator -shadow -padding:1" class="has-black-color has-white-background-color has-text-color has-background">
		<!-- wp:unitone/stack {"lock":{"move":true,"remove":true}} -->
		<div data-unitone-layout="stack">
			<!-- wp:unitone/center -->
			<div data-unitone-layout="center">
				<!-- wp:heading {"level":3} -->
				<h3>Lorem ipsum dolor</h3>
				<!-- /wp:heading -->
			</div>
			<!-- /wp:unitone/center -->

			<!-- wp:unitone/frame -->
			<div data-unitone-layout="frame">
				<!-- wp:image {"id":1,"width":1920,"height":1280,"lock":{"move":true,"remove":true}} -->
				<figure class="wp-block-image">
					<img src="<?php echo get_template_directory_uri(); ?>/dist/img/stocksnap_lgg8nat9jy.jpg" alt="" width="1920" height="1280" class="wp-image-1"/>
				</figure>
				<!-- /wp:image -->
			</div>
			<!-- /wp:unitone/frame -->

			<!-- wp:paragraph -->
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:unitone/stack -->
	</div>
	<!-- /wp:unitone/decorator -->
	<?php endfor; ?>
</div>
<!-- /wp:unitone/responsive-grid -->
