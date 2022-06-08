<?php
/**
 * Title: Hero (Large title and image)
 * Slug: unitone/hero/1
 * Categories: hero
 * Block Types: unitone/decorator, unitone/cover
 */
?>
<!-- wp:unitone/decorator {"align":"full","tagName":"section"} -->
<section data-unitone-layout="decorator" class="alignfull">
	<!-- wp:unitone/container {"lock":{"remove":true,"move":true}} -->
	<div data-unitone-layout="container">
		<!-- wp:unitone/cover {"unitone":{"minHeight":"50vh","justifyContent":"center"},"lock":{"remove":true,"move":true}} -->
		<div data-unitone-layout="cover -justify-content:center" style="--unitone--min-height:50vh">
			<!-- wp:unitone/with-sidebar {"unitone":{"alignItems":"center","lock":{"remove":true,"move":true}}} -->
			<div data-unitone-layout="with-sidebar -sidebar:right -align-items:center">
				<!-- wp:unitone/with-sidebar-content {"lock":{"remove":true,"move":true}} -->
				<div data-unitone-layout="with-sidebar__content">
					<!-- wp:paragraph {"fontSize":"unitone-6xl","unitone":{"fluidTypography":true},"lock":{"remove":true,"move":true}} -->
					<p class="has-unitone-6-xl-font-size" data-unitone-layout="-fluid-typography">Lorem</p>
					<!-- /wp:paragraph -->
				</div>
				<!-- /wp:unitone/with-sidebar-content -->

				<!-- wp:unitone/with-sidebar-content {"lock":{"remove":true,"move":true}} -->
				<div data-unitone-layout="with-sidebar__content">
					<!-- wp:unitone/stack {"unitone":{"gap":-2}} -->
					<div data-unitone-layout="stack -gap:-2">
						<!-- wp:paragraph {"fontSize":"unitone-l"} -->
						<p class="has-unitone-l-font-size">Lorem ipsum dolor sit amet</p>
						<!-- /wp:paragraph -->
						<!-- wp:paragraph -->
						<p>consectetur adipisicing elit</p>
						<!-- /wp:paragraph -->
					</div>
					<!-- /wp:unitone/stack -->
				</div>
				<!-- /wp:unitone/with-sidebar-content -->
			</div>
			<!-- /wp:unitone/with-sidebar -->
		</div>
		<!-- /wp:unitone/cover -->
	</div>
	<!-- /wp:unitone/container -->

	<!-- wp:unitone/frame {"switchRatio":true,"ratio":"16/9","lock":{"remove":true,"move":true}} -->
	<div data-unitone-layout="frame -switch" style="--unitone--ratio:16/9">
		<!-- wp:image {"id":1,"width":1920,"height":1280,"lock":{"remove":true,"move":true}} -->
		<figure class="wp-block-image">
			<img src="<?php echo get_template_directory_uri(); ?>/dist/img/stocksnap_lgg8nat9jy.jpg" alt="" width="1920" height="1280" class="wp-image-1"/>
		</figure>
		<!-- /wp:image -->
	</div>
	<!-- /wp:unitone/frame -->
</section>
<!-- /wp:unitone/decorator -->
