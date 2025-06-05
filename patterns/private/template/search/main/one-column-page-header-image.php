<?php
/**
 * Title: Main Area (One Column / Page Header (Image)) for Search Results
 * Slug: unitone/template/search/main/one-column-page-header-image
 * Inserter: false
 */
?>
<!-- wp:unitone/section {"tagName":"main","unitone":{"gutters":"0","padding":{"top":"0","bottom":"3"},"gap":"3","maxWidth":"100%"},"className":"site-contents"} -->
<main class="unitone-section site-contents">
	<div data-unitone-layout="gutters">
		<div data-unitone-layout="container">
			<div data-unitone-layout="stack">
				<!-- wp:pattern {"slug":"unitone/template/search/page-header/image"} /-->

				<!-- wp:unitone/section {"tagName":"div","align":"full","unitone":{"padding":"0","maxWidth":"100%","gap":"3"}} -->
				<div class="alignfull unitone-section">
					<div data-unitone-layout="gutters">
						<div data-unitone-layout="container">
							<div data-unitone-layout="stack">
								<!-- wp:search {"label":"Search","showLabel":false,"width":100,"widthUnit":"%","buttonText":"Search","buttonUseIcon":true} /-->

								<!-- wp:unitone/text {"className":"entry-content","unitone":{"gutters":"0","maxWidth":"var(--wp--style--global--wide-size)"}} -->
								<div data-unitone-layout="text -gap" class="entry-content">
									<!-- wp:unitone/stack -->
									<div data-unitone-layout="stack">
										<!-- wp:template-part {"slug":"loop"} /-->
									</div>
									<!-- /wp:unitone/stack -->
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
