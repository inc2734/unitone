<?php
/**
 * Title: 404 main: Right sidebar / Page header (Image)
 * Slug: unitone/404/main/right-sidebar/page-header-image
 * Inserter: false
 */
?>
<!-- wp:unitone/decorator {"tagName":"main","className":"site-contents"} -->
<main data-unitone-layout="decorator" class="site-contents">
	<!-- wp:pattern {"slug":"unitone/404/page-header/image"} /-->

	<!-- wp:unitone/gutters {"unitone":{"padding":3}} -->
	<div data-unitone-layout="gutters">
		<!-- wp:unitone/stack {"unitone":{"gap":3}} -->
		<div data-unitone-layout="stack">
			<!-- wp:unitone/container -->
			<div data-unitone-layout="container">
				<!-- wp:unitone/with-sidebar {"sidebarWidth": "300px","contentMinWidth":"var(--unitone--measure)","unitone":{"gap":3}} -->
				<div data-unitone-layout="with-sidebar" style="--unitone--sidebar-width:300px;--unitone--content-min-width:var(--unitone--measure)">
					<!-- wp:unitone/with-sidebar-content -->
					<div data-unitone-layout="with-sidebar__content">
						<!-- wp:unitone/stack {"unitone":{"gap":3}} -->
						<div data-unitone-layout="stack">
							<!-- wp:unitone/text {"unitone":{"maxWidth":"100%"}} -->
							<div data-unitone-layout="text">
								<!-- wp:paragraph -->
								<p><?php esc_html_e( 'Woops! Page not found. The page you are looking for may be moved or deleted. Please search this search box.', 'unitone' ); ?></p>
								<!-- /wp:paragraph -->

								<!-- wp:search {"label":"Search","showLabel":false,"buttonText":"Search","buttonUseIcon":true} /-->
							</div>
							<!-- /wp:unitone/text -->
						</div>
						<!-- /wp:unitone/stack -->
					</div>
					<!-- /wp:unitone/with-sidebar-content -->

					<!-- wp:unitone/with-sidebar-content -->
					<div data-unitone-layout="with-sidebar__content">
						<!-- wp:pattern {"slug":"unitone/sidebar"} /-->
					</div>
					<!-- /wp:unitone/with-sidebar-content -->
				</div>
				<!-- /wp:unitone/with-sidebar -->
			</div>
			<!-- /wp:unitone/container -->
		</div>
		<!-- /wp:unitone/stack -->
	</div>
	<!-- /wp:unitone/gutters -->
</main>
<!-- /wp:unitone/decorator -->
