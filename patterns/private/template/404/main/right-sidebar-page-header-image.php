<!-- wp:unitone/decorator {"tagName":"main","className":"site-contents"} -->
<main data-unitone-layout="decorator" class="site-contents">
	<!-- wp:pattern {"slug":"unitone/template/404/page-header/image"} /-->

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
