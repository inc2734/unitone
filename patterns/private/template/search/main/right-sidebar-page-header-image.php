<?php
/**
 * Title: Main Area (Right Sidebar / Page Header (Image)) for Search Results
 * Slug: unitone/template/search/main/right-sidebar-page-header-image
 * Inserter: false
 */
?>
<!-- wp:unitone/decorator {"tagName":"main","className":"site-contents"} -->
<main data-unitone-layout="decorator" class="site-contents">
	<!-- wp:pattern {"slug":"unitone/template/search/page-header/image"} /-->

	<!-- wp:unitone/section {"tagName":"div","align":"full","unitone":{"padding":"3","gap":"3"}} -->
	<div class="alignfull unitone-section">
		<div data-unitone-layout="gutters">
			<div data-unitone-layout="container">
				<div data-unitone-layout="stack">
					<!-- wp:unitone/with-sidebar {"sidebarWidth": "300px","contentMinWidth":"600px","unitone":{"gap":"3"}} -->
					<div data-unitone-layout="with-sidebar -sidebar:right" style="--unitone--sidebar-width:300px;--unitone--content-min-width:600px">
						<!-- wp:unitone/with-sidebar-content -->
						<div data-unitone-layout="with-sidebar__content">
							<!-- wp:unitone/stack {"unitone":{"gap":"3"}} -->
							<div data-unitone-layout="stack">
								<!-- wp:unitone/text {"className":"entry-content","unitone":{"maxWidth":"100%","gutters":"0"}} -->
								<div data-unitone-layout="text -gap" class="entry-content">
									<!-- wp:unitone/stack -->
									<div data-unitone-layout="stack">
										<!-- wp:search {"label":"Search","showLabel":false,"width":100,"widthUnit":"%","buttonText":"Search","buttonUseIcon":true} /-->

										<!-- wp:template-part {"slug":"loop"} /-->
									</div>
									<!-- /wp:unitone/stack -->
								</div>
								<!-- /wp:unitone/text -->
							</div>
							<!-- /wp:unitone/stack -->
						</div>
						<!-- /wp:unitone/with-sidebar-content -->

						<!-- wp:unitone/with-sidebar-content -->
						<div data-unitone-layout="with-sidebar__content">
							<!-- wp:pattern {"slug":"unitone/sidebar/blog"} /-->
						</div>
						<!-- /wp:unitone/with-sidebar-content -->
					</div>
					<!-- /wp:unitone/with-sidebar -->
				</div>
			</div>
		</div>
	</div>
	<!-- /wp:unitone/section -->
</main>
<!-- /wp:unitone/decorator -->
