<?php
/**
 * Title: Single post main: Page header (Featured image)
 * Slug: unitone/single/main/page-header/featured
 * Inserter: false
 */
?>
<!-- wp:unitone/decorator {"tagName":"main","className":"site-contents"} -->
<main data-unitone-layout="decorator" class="site-contents">
	<!-- wp:pattern {"slug":"unitone/single/page-header/featured"} /-->

	<!-- wp:unitone/gutters {"unitone":{"padding":3}} -->
	<div data-unitone-layout="gutters">
		<!-- wp:unitone/stack {"unitone":{"gap":3}} -->
		<div data-unitone-layout="stack">
			<!-- wp:post-content {"layout":{"type":"constrained"}} /-->

			<!-- wp:unitone/container {"unitone":{"maxWidth":"var(--wp--style--global--content-size)"}} -->
			<div data-unitone-layout="container">
				<!-- wp:template-part {"slug":"comments","theme":"unitone"} /-->
			</div>
			<!-- /wp:unitone/container -->
		</div>
		<!-- /wp:unitone/stack -->
	</div>
	<!-- /wp:unitone/gutters -->
</main>
<!-- /wp:unitone/decorator -->
