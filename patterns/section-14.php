<?php
/**
 * Title: Section (Left image / Shifted background)
 * Slug: unitone/section/14
 * Categories: section
 * Block Types: unitone/decorator, unitone/gutters, unitone/with-sidebar
 */
?>
<!-- wp:unitone/decorator {"tagName":"section","align":"full"} -->
<section data-unitone-layout="decorator" class="alignfull">
	<!-- wp:unitone/decorator {"position":"absolute","top":"calc(var(--unitone--s3) * -1)","right":"0","bottom":"30%","left":"0","zIndex":"-1","lock":{"move":true,"remove":true},"gradient":"unitone-accent"} -->
	<div style="--unitone--top:calc(var(--unitone--s3) * -1);--unitone--right:0;--unitone--bottom:30%;--unitone--left:0;--unitone--z-index:-1" data-unitone-layout="decorator -position:absolute" class="has-unitone-accent-gradient-background has-background"></div>
	<!-- /wp:unitone/decorator -->

	<!-- wp:unitone/gutters {"lock":{"move":true,"remove":true}} -->
	<div data-unitone-layout="gutters">
		<!-- wp:unitone/container {"lock":{"move":true,"remove":true}} -->
		<div data-unitone-layout="container">
			<!-- wp:unitone/with-sidebar {"sidebarWidth":"var(--unitone--cg4)","contentMaxWidth":"var(--unitone--measure)","revert":true,"sidebar":"left","lock":{"move":true,"remove":true},"unitone":{"alignItems":"start"}} -->
			<div data-unitone-layout="with-sidebar -sidebar:left -revert -align-items:start" style="--unitone--sidebar-width:var(--unitone--cg4);--unitone--content-max-width:var(--unitone--measure)">
				<!-- wp:unitone/with-sidebar-content {"unitone":{"blockAlign":"center"},"lock":{"move":true,"remove":true}} -->
				<div data-unitone-layout="with-sidebar__content -align:center">
					<!-- wp:unitone/stack {"lock":{"move":false,"remove":false}} -->
					<div data-unitone-layout="stack">
						<!-- wp:unitone/decorator {"textColor":"white","lock":{"move":true,"remove":true},"unitone":{"padding":"2"}} -->
						<div data-unitone-layout="decorator -padding:2" class="has-white-color has-text-color">
							<!-- wp:heading {"fontSize":"unitone-xl"} -->
							<h2 class="has-unitone-xl-font-size">Lorem ipsum dolor sit amet, consectetur adipisicing elit</h2>
							<!-- /wp:heading -->
						</div>
						<!-- /wp:unitone/decorator -->

						<!-- wp:unitone/decorator {"position":"","lock":{"move":true,"remove":true},"backgroundColor":"white","unitone":{"padding":"2"}} -->
						<div data-unitone-layout="decorator -padding:2" class="has-white-background-color has-background">
							<!-- wp:unitone/text {"lock":{"move":true,"remove":true}} -->
							<div data-unitone-layout="text">
								<!-- wp:paragraph -->
								<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cill</p>
								<!-- /wp:paragraph -->

								<!-- wp:paragraph -->
								<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cill
								</p>
								<!-- /wp:paragraph -->
							</div>
							<!-- /wp:unitone/text -->
						</div>
						<!-- /wp:unitone/decorator -->
					</div>
					<!-- /wp:unitone/stack -->
				</div>
				<!-- /wp:unitone/with-sidebar-content -->

				<!-- wp:unitone/with-sidebar-content {"lock":{"move":true,"remove":true}} -->
				<div data-unitone-layout="with-sidebar__content">
					<!-- wp:unitone/frame {"lock":{"move":true,"remove":true}} -->
					<div data-unitone-layout="frame">
						<!-- wp:image {"id":1,"width":1920,"height":1280,"lock":{"move":true,"remove":true}} -->
						<figure class="wp-block-image">
							<img src="<?php echo esc_attr( get_template_directory_uri() . '/dist/img/stocksnap_lgg8nat9jy.jpg' ); ?>" alt="" width="1920" height="1280" class="wp-image-1"/>
						</figure>
						<!-- /wp:image -->
					</div>
					<!-- /wp:unitone/frame -->
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
