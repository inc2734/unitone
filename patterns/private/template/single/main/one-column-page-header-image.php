<?php
/**
 * Title: Main Area (Page Header (Image)) for Single Posts
 * Slug: unitone/template/single/main/one-column-page-header-image
 * Inserter: false
 */
?>
<!-- wp:unitone/section {"tagName":"main","unitone":{"gutters":"0","padding":{"top":"0","bottom":"3"},"gap":"3","maxWidth":"100%"},"className":"site-contents"} -->
<main class="unitone-section site-contents">
	<div data-unitone-layout="gutters">
		<div data-unitone-layout="container">
			<div data-unitone-layout="stack">
				<!-- wp:pattern {"slug":"unitone/template/single/page-header/image"} /-->

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

				<!-- wp:unitone/section {"tagName":"div","unitone":{"padding":"0","maxWidth":"var(--wp--style--global--content-size)","gap":"3"},"align":"full"} -->
				<div class="alignfull unitone-section">
					<div data-unitone-layout="gutters">
						<div data-unitone-layout="container">
							<div data-unitone-layout="stack">
								<!-- wp:template-part {"slug":"comments"} /-->
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
