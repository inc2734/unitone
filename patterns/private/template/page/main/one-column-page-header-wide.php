<?php
/**
 * Title: Main Area (One Column / Page Header (Wide)) for Pages
 * Slug: unitone/template/page/main/one-column-page-header-wide
 * Inserter: false
 */
?>
<!-- wp:unitone/decorator {"tagName":"main","className":"site-contents"} -->
<main data-unitone-layout="decorator" class="site-contents">

	<!-- wp:unitone/section {"tagName":"div","align":"full","unitone":{"padding":"3","maxWidth":"100%","gap":"3"}} -->
	<div class="alignfull unitone-section">
		<div data-unitone-layout="gutters">
			<div data-unitone-layout="container">
				<div data-unitone-layout="stack">
					<!-- wp:pattern {"slug":"unitone/template/page/page-header/wide"} /-->

					<!-- wp:post-content {"layout":{"type":"constrained"}} /-->
				</div>
			</div>
		</div>
	</div>
	<!-- /wp:unitone/section -->
</main>
<!-- /wp:unitone/decorator -->
