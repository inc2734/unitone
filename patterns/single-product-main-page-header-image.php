<?php
/**
 * Title: Single product main: Page header (Image)
 * Slug: unitone/single-product/main/page-header/image
 * Inserter: false
 */
?>
<!-- wp:unitone/decorator {"tagName":"main","className":"site-contents"} -->
<main data-unitone-layout="decorator" class="site-contents">
	<!-- wp:pattern {"slug":"unitone/single-product/page-header/image"} /-->

	<!-- wp:unitone/gutters {"unitone":{"padding":3}} -->
	<div data-unitone-layout="gutters">
		<!-- wp:unitone/stack {"unitone":{"gap":3}} -->
		<div data-unitone-layout="stack">
			<!-- wp:unitone/text {"unitone":{"maxWidth":"var(--unitone--container-max-width)","gutters":"root"}} -->
			<div data-unitone-layout="text">
				<!-- wp:woocommerce/legacy-template {"template":"single-product"} /-->
			</div>
			<!-- /wp:unitone/text -->
		</div>
		<!-- /wp:unitone/stack -->
	</div>
	<!-- /wp:unitone/gutters -->
</main>
<!-- /wp:unitone/decorator -->
