<?php
/**
 * Title: Hero (Image on the left)
 * Slug: unitone/hero/7
 * Categories: hero
 * Block Types: unitone/decorator, core/image
 */
?>
<!-- wp:unitone/decorator {"align":"full"} -->
<div data-layout="decorator" class="alignfull">
	<!-- wp:unitone/layers {"lock":{"move":true,"remove":true}} -->
	<div data-layout="layers">
		<!-- wp:unitone/layer {"gridColumn":"1/-2","gridRow":"","lock":{"move":true,"remove":true}} -->
		<div data-layout="layers__layer" style="--grid-column:1/-2">
			<!-- wp:unitone/frame {"switchRatio":true,"ratio":"16/9","lock":{"remove":true,"move":true}} -->
			<div data-layout="frame -switch" style="--ratio:16/9">
				<!-- wp:image {"id":1,"width":1920,"height":1280,"lock":{"move":true,"remove":true}} -->
				<figure class="wp-block-image">
					<img src="<?php echo get_template_directory_uri(); ?>/dist/img/stocksnap_lgg8nat9jy.jpg" alt="" width="1920" height="1280" class="wp-image-1"/>
				</figure>
				<!-- /wp:image -->
			</div>
			<!-- /wp:unitone/frame -->
		</div>
		<!-- /wp:unitone/layer -->
	</div>
	<!-- /wp:unitone/layers -->
</div>
<!-- /wp:unitone/decorator -->

