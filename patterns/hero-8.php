<?php
/**
 * Title: Hero (Text slightly overlapping the image at the top)
 * Slug: unitone/hero/8
 * Categories: hero
 * Block Types: unitone/decorator, unitone/frame, unitone/with-slider
 */
?>
<!-- wp:unitone/decorator {"align":"full"} -->
<div data-unitone-layout="decorator" class="alignfull">
	<!-- wp:unitone/stack {"unitone":{"gap":"4","negative":true}} -->
	<div data-unitone-layout="stack -gap:4 -negative">
		<!-- wp:unitone/frame {"ratio":"2.414/1","lock":{"move":true,"remove":true}} -->
		<div data-unitone-layout="frame" style="--unitone--ratio:2.414/1">
			<!-- wp:image {"id":1,"width":1920,"height":1280} -->
			<figure class="wp-block-image">
				<img src="<?php echo get_template_directory_uri(); ?>/dist/img/stocksnap_lgg8nat9jy.jpg" alt="" width="1920" height="1280" class="wp-image-1"/>
			</figure>
			<!-- /wp:image -->
		</div>
		<!-- /wp:unitone/frame -->

		<!-- wp:unitone/container {"lock":{"move":true,"remove":true},"unitone":{"maxWidth":"var(--unitone--cg10)"}} -->
		<div data-unitone-layout="container" style="--unitone--max-width:var(--unitone--cg10)">
			<!-- wp:unitone/decorator {"tagName":"section","lock":{"move":true,"remove":true},"backgroundColor":"white"} -->
			<section data-unitone-layout="decorator" class="has-white-background-color has-background">
				<!-- wp:unitone/gutters {"lock":{"move":true,"remove":true},"unitone":{"padding":"3"}} -->
				<div data-unitone-layout="gutters -padding:3">
					<!-- wp:unitone/container {"lock":{"move":true,"remove":true},"unitone":{"maxWidth":"var(--unitone--cg8)"}} -->
					<div data-unitone-layout="container" style="--unitone--max-width:var(--unitone--cg8)">
						<!-- wp:unitone/with-sidebar {"sidebarWidth":"var(--unitone--cg3)","contentMinWidth":"","sidebar":"left","lock":{"remove":true},"unitone":{"gap":"2"}} -->
						<div data-unitone-layout="with-sidebar -sidebar:left -gap:2" style="--unitone--sidebar-width:var(--unitone--cg3)">
							<!-- wp:unitone/with-sidebar-content {"lock":{"move":true,"remove":true}} -->
							<div data-unitone-layout="with-sidebar__content">
								<!-- wp:unitone/text {"lock":{"move":true,"remove":true},"unitone":{"maxWidth":"100%"}} -->
								<div data-unitone-layout="text" style="--unitone--max-width:100%">
									<!-- wp:heading {"lock":{"move":true,"remove":true},"fontSize":"unitone-xl"} -->
									<h2 class="has-unitone-xl-font-size">Lorem ipsum dolor sit amet consectetur</h2>
									<!-- /wp:heading -->
								</div>
								<!-- /wp:unitone/text -->
							</div>
							<!-- /wp:unitone/with-sidebar-content -->

							<!-- wp:unitone/with-sidebar-content {"lock":{"move":true,"remove":true}} -->
							<div data-unitone-layout="with-sidebar__content">
								<!-- wp:unitone/text {"lock":{"move":true,"remove":true},"unitone":{"maxWidth":"100%"}} -->
								<div data-unitone-layout="text" style="--unitone--max-width:100%">
									<!-- wp:paragraph -->
									<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cill</p>
									<!-- /wp:paragraph -->
								</div>
								<!-- /wp:unitone/text -->
							</div>
							<!-- /wp:unitone/with-sidebar-content -->
						</div>
						<!-- /wp:unitone/with-sidebar -->
					</div>
					<!-- /wp:unitone/container -->
				</div>
				<!-- /wp:unitone/gutters -->
			</section>
			<!-- /wp:unitone/decorator -->
		</div>
		<!-- /wp:unitone/container -->
	</div>
	<!-- /wp:unitone/stack -->
</div>
<!-- /wp:unitone/decorator -->
