<?php
/**
 * Title: Home main: Right sidebar / Page header (Image)
 * Slug: unitone/home/main/right-sidebar/page-header/image
 * Inserter: false
 */
?>
<!-- wp:unitone/decorator {"tagName":"main","className":"site-contents"} -->
<main data-unitone-layout="decorator" class="site-contents">
	<!-- wp:pattern {"slug":"unitone/home/page-header/image"} /-->

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
								<!-- wp:pattern {"slug":"unitone/query/1"} /-->
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
