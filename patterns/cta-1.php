<?php
/**
 * Title: Call to action (Right button)
 * Slug: unitone/cta/1
 * Categories: cta
 * Block Types: unitone/decorator, unitone/gutters, unitone/with-sidebar, core/buttons
 */
?>
<!-- wp:unitone/decorator {"align":"full","textColor":"white","gradient":"unitone-accent"} -->
<div data-unitone-layout="decorator" class="alignfull has-white-color has-unitone-accent-gradient-background has-text-color has-background">
	<!-- wp:unitone/gutters {"lock":{"move":true,"remove":true}} -->
	<div data-unitone-layout="gutters">
		<!-- wp:unitone/container {"lock":{"move":true,"remove":true}} -->
		<div data-unitone-layout="container">
			<!-- wp:unitone/with-sidebar {"sidebarWidth":"var(--unitone--cg3)","lock":{"move":true,"remove":true},"unitone":{"alignItems":"center"}} -->
			<div data-unitone-layout="with-sidebar -sidebar:right -align-items:center" style="--unitone--sidebar-width:var(--unitone--cg3)">
				<!-- wp:unitone/with-sidebar-content -->
				<div data-unitone-layout="with-sidebar__content">
					<!-- wp:unitone/stack {"unitone":{"gap":"-2"}} -->
					<div data-unitone-layout="stack -gap:-2">
						<!-- wp:paragraph {"fontSize":"unitone-2xl"} -->
						<p class="has-unitone-2-xl-font-size">Lorem ipsum dolor sit amet</p>
						<!-- /wp:paragraph -->

						<!-- wp:paragraph {"fontSize":"unitone-s"} -->
						<p class="has-unitone-s-font-size"><em>consectetur adipisicing elit, sed do</em></p>
						<!-- /wp:paragraph -->
					</div>
					<!-- /wp:unitone/stack -->
				</div>
				<!-- /wp:unitone/with-sidebar-content -->

				<!-- wp:unitone/with-sidebar-content -->
				<div data-unitone-layout="with-sidebar__content">
					<!-- wp:buttons {"lock":{"move":true,"remove":true},"layout":{"type":"flex","justifyContent":"right"}} -->
					<div class="wp-block-buttons">
						<!-- wp:button {"width":100,"style":{"border":{"radius":"0px"}},"className":"is-style-outline"} -->
						<div class="wp-block-button has-custom-width wp-block-button__width-100 is-style-outline">
							<a class="wp-block-button__link" style="border-radius:0px">Lorem ipsum</a>
						</div>
						<!-- /wp:button -->
					</div>
					<!-- /wp:buttons -->
				</div>
				<!-- /wp:unitone/with-sidebar-content -->
			</div>
			<!-- /wp:unitone/with-sidebar -->
		</div>
		<!-- /wp:unitone/container -->
	</div>
	<!-- /wp:unitone/gutters -->
</div>
<!-- /wp:unitone/decorator -->
