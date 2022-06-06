<?php
/**
 * Title: Section (Right images / Vertically shifted images)
 * Slug: unitone/section/17
 * Categories: section
 * Block Types: unitone/decorator, unitone/gutters, unitone/with-sidebar
 */
?>
<!-- wp:unitone/decorator {"tagName":"section","align":"full"} -->
<section data-layout="decorator" class="alignfull">
	<!-- wp:unitone/gutters {"lock":{"move":true,"remove":true}} -->
	<div data-layout="gutters">
		<!-- wp:unitone/with-sidebar {"sidebarWidth":"50%","contentMinWidth":"var(--measure)","contentMaxWidth":"","sidebar":"right","lock":{"move":true,"remove":true},"unitone":{"alignItems":"center"}} -->
		<div data-layout="with-sidebar -sidebar:right -align-items:center" style="--sidebar-width:50%;--content-min-width:var(--measure)">
			<!-- wp:unitone/with-sidebar-content {"lock":{"move":true,"remove":true}} -->
			<div data-layout="with-sidebar__content">
				<!-- wp:unitone/decorator {"lock":{"move":true,"remove":true},"unitone":{"padding":"2"}} -->
				<div data-layout="decorator -padding:2">
					<!-- wp:unitone/container {"lock":{"move":true,"remove":true},"unitone":{"maxWidth":"var(--measure)","gutters":"0"}} -->
					<div data-layout="container -gutters:0" style="--max-width:var(--measure)">
						<!-- wp:unitone/stack {"lock":{"move":true,"remove":true},"unitone":{"gap":"2"}} -->
						<div data-layout="stack -gap:2">
							<!-- wp:heading {"fontSize":"unitone-3xl"} -->
							<h2 class="has-unitone-3-xl-font-size">Lorem ipsum dolor sit amet</h2>
							<!-- /wp:heading -->

							<!-- wp:unitone/text {"lock":{"move":true,"remove":true}} -->
							<div data-layout="text">
								<!-- wp:paragraph -->
								<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cill</p>
								<!-- /wp:paragraph -->

								<!-- wp:paragraph -->
								<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cill</p>
								<!-- /wp:paragraph -->
							</div>
							<!-- /wp:unitone/text -->
						</div>
						<!-- /wp:unitone/stack -->
					</div>
					<!-- /wp:unitone/container -->
				</div>
				<!-- /wp:unitone/decorator -->
			</div>
			<!-- /wp:unitone/with-sidebar-content -->

			<!-- wp:unitone/with-sidebar-content {"lock":{"move":true,"remove":true}} -->
			<div data-layout="with-sidebar__content">
				<!-- wp:unitone/responsive-grid {"columnMinWidth":"234px","lock":{"move":true,"remove":true},"unitone":{"gap":"2"}} -->
				<div data-layout="responsive-grid -gap:2" style="--column-min-width:234px">
					<!-- wp:unitone/decorator {"position":"relative","top":"calc(-1 * var(--s1))","lock":{"move":true,"remove":true}} -->
					<div style="--top:calc(-1 * var(--s1))" data-layout="decorator -position:relative">
						<!-- wp:unitone/frame {"ratio":"9/16","lock":{"move":true,"remove":true}} -->
						<div data-layout="frame" style="--ratio:9/16">
							<!-- wp:image {"id":1,"width":1920,"height":1280} -->
							<figure class="wp-block-image">
								<img src="<?php echo get_template_directory_uri(); ?>/dist/img/stocksnap_lgg8nat9jy.jpg" alt="" width="1920" height="1280" class="wp-image-1"/>
							</figure>
							<!-- /wp:image -->
						</div>
						<!-- /wp:unitone/frame -->
					</div>
					<!-- /wp:unitone/decorator -->

					<!-- wp:unitone/decorator {"position":"relative","bottom":"calc(-1 * var(--s1))","lock":{"move":true,"remove":true}} -->
					<div style="--bottom:calc(-1 * var(--s1))" data-layout="decorator -position:relative">
						<!-- wp:unitone/frame {"ratio":"9/16","lock":{"move":true,"remove":true}} -->
						<div data-layout="frame" style="--ratio:9/16">
							<!-- wp:image {"id":1,"width":1920,"height":1280} -->
							<figure class="wp-block-image">
								<img src="<?php echo get_template_directory_uri(); ?>/dist/img/stocksnap_ydxj69toal.jpg" alt="" width="1920" height="1280" class="wp-image-1"/>
							</figure>
							<!-- /wp:image -->
						</div>
						<!-- /wp:unitone/frame -->
					</div>
					<!-- /wp:unitone/decorator -->
				</div>
				<!-- /wp:unitone/responsive-grid -->
			</div>
			<!-- /wp:unitone/with-sidebar-content -->
		</div>
		<!-- /wp:unitone/with-sidebar -->
	</div>
	<!-- /wp:unitone/gutters -->
</section>
<!-- /wp:unitone/decorator -->
