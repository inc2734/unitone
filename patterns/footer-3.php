<?php
/**
 * Title: Footer 3
 * Slug: unitone/footer/3
 * Categories: footer
 * Block Types: core/template-part/footer
 */
?>
<!-- wp:unitone/decorator {"align":"full","fontSize":"unitone-xs"} -->
<div data-layout="decorator" class="alignfull has-unitone-xs-font-size">
	<!-- wp:unitone/gutters {"unitone":{"padding":"-1"}} -->
	<div data-layout="gutters -padding:-1">
		<!-- wp:unitone/container -->
		<div data-layout="container">
			<!-- wp:unitone/stack -->
			<div data-layout="stack">
				<!-- wp:unitone/stack {"unitone":{"gap":0}} -->
				<div data-layout="stack -gap:0">
					<!-- wp:site-logo /-->
					<!-- wp:site-title /-->
				</div>
				<!-- /wp:unitone/stack -->

				<!-- wp:unitone/with-sidebar {"contentMinWidth":"calc(var(--measure) / 2)","sidebarWidth":"var(--pg7)","unitone":{"gap":2}} -->
				<div data-layout="with-sidebar -sidebar:right -gap:2" style="--content-min-width:calc(var(--measure) / 2);--sidebar-width:var(--pg7)">
					<!-- wp:unitone/with-sidebar-content -->
					<div data-layout="with-sidebar__content">
						<!-- wp:unitone/stack -->
						<div data-layout="stack">
							<!-- wp:paragraph -->
							<p>Lorem ipsum dolor sit amet,<br>consectetur adipisicing elit,<br>sed do eiusmod tempor incididunt ut</p>
							<!-- /wp:paragraph -->

							<!-- wp:social-links {"openInNewTab":true,"className":"is-style-default","layout":{"type":"flex"}} -->
							<ul class="wp-block-social-links is-style-default">
								<!-- wp:social-link {"url":"#","service":"twitter"} /-->
								<!-- wp:social-link {"url":"#","service":"facebook"} /-->
								<!-- wp:social-link {"url":"#","service":"instagram"} /-->
							</ul>
							<!-- /wp:social-links -->
						</div>
						<!-- /wp:unitone/stack -->
					</div>
					<!-- /wp:unitone/with-sidebar-content -->

					<!-- wp:unitone/with-sidebar-content -->
					<div data-layout="with-sidebar__content">
						<!-- wp:unitone/responsive-grid {"columnMinWidth":"150px","unitone":{"gap":2}} -->
						<div data-layout="responsive-grid -gap:2" style="--column-min-width:150px">
							<!-- wp:navigation {"overlayMenu":"never","layout":{"type":"flex","justifyContent":"left","orientation":"vertical"}} -->
								<!-- wp:page-list /-->
							<!-- /wp:navigation -->

							<!-- wp:navigation {"overlayMenu":"never","layout":{"type":"flex","justifyContent":"left","orientation":"vertical"}} -->
								<!-- wp:page-list /-->
							<!-- /wp:navigation -->

							<!-- wp:navigation {"overlayMenu":"never","layout":{"type":"flex","justifyContent":"left","orientation":"vertical"}} -->
								<!-- wp:page-list /-->
							<!-- /wp:navigation -->
						</div>
						<!-- /wp:unitone/responsive-grid -->
					</div>
					<!-- /wp:unitone/with-sidebar-content -->
				</div>
				<!-- /wp:unitone/with-sidebar -->
			</div>
			<!-- /wp:unitone/stack -->
		</div>
		<!-- /wp:unitone/container -->
	</div>
	<!-- /wp:unitone/gutters -->

	<!-- wp:unitone/decorator -->
	<div data-layout="decorator">
		<!-- wp:unitone/gutters {"unitone":{"padding":"-1"}} -->
		<div data-layout="gutters -padding:-1">
			<!-- wp:unitone/container -->
			<div data-layout="container">
				<!-- wp:paragraph -->
				<p>Proudly powered by <a href="https://wordpress.org/">WordPress</a>.</p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:unitone/container -->
		</div>
		<!-- /wp:unitone/gutters -->
	</div>
	<!-- /wp:unitone/decorator -->
</div>
<!-- /wp:unitone/decorator -->
