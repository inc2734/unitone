<?php
/**
 * Title: Main Area (One Column / Page Header (Image)) for 404
 * Slug: unitone/template/404/main/one-column-page-header-image
 * Inserter: false
 */
?>
<!-- wp:unitone/section {"tagName":"main","unitone":{"gutters":"0","padding":{"top":"0","bottom":"3"},"gap":"3","maxWidth":"100%"},"className":"site-contents"} -->
<main class="unitone-section site-contents">
	<div data-unitone-layout="gutters">
		<div data-unitone-layout="container">
			<div data-unitone-layout="stack">
				<!-- wp:pattern {"slug":"unitone/template/404/page-header/image"} /-->

				<!-- wp:unitone/section {"tagName":"div","align":"full","unitone":{"padding":"0","maxWidth":"100%","gap":"3"}} -->
				<div class="alignfull unitone-section">
					<div data-unitone-layout="gutters">
						<div data-unitone-layout="container">
							<div data-unitone-layout="stack">
								<!-- wp:unitone/text {"className":"entry-content","unitone":{"gutters":"0"}} -->
								<div data-unitone-layout="text -gap" class="entry-content">
									<!-- wp:paragraph -->
									<p><?php esc_html_e( 'Woops! Page not found. The page you are looking for may be moved or deleted. Please search this search box.', 'unitone' ); ?></p>
									<!-- /wp:paragraph -->

									<!-- wp:search {"label":"Search","showLabel":false,"buttonText":"Search","buttonUseIcon":true} /-->
								</div>
								<!-- /wp:unitone/text -->
							</div>
						</div>
					</div>
				</div>
				<!-- /wp:unitone/section -->
			</div>
		</div>
	</div>
</main>
<!-- /wp:unitone/section -->
