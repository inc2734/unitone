<?php
/**
 * Title: Main Area (One Column / Page Header (Featured Image)) for Pages
 * Slug: unitone/template/page/main/one-column-page-header-featured
 * Inserter: false
 */
?>
<!-- wp:unitone/section {"tagName":"main","unitone":{"gutters":"0","padding":{"top":"0","bottom":"3"},"gap":"3","maxWidth":"100%"},"className":"site-contents"} -->
<main class="unitone-section site-contents">
	<div data-unitone-layout="gutters">
		<div data-unitone-layout="container">
			<div data-unitone-layout="stack">
				<!-- wp:pattern {"slug":"unitone/template/page/page-header/featured"} /-->

				<!-- wp:unitone/section {"tagName":"div","align":"full","unitone":{"padding":"0","maxWidth":"100%","gap":"3"}} -->
				<div class="alignfull unitone-section">
					<div data-unitone-layout="gutters">
						<div data-unitone-layout="container">
							<div data-unitone-layout="stack">
								<!-- wp:post-content {"layout":{"type":"constrained"}} /-->
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
