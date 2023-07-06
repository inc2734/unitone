<?php
/**
 * Title: Single product page header: Image
 * Slug: unitone/single-product/page-header/image
 * Inserter: false
 */
?>
<!-- wp:unitone/decorator {"tagName":"header"} -->
<header data-unitone-layout="decorator">
	<!-- wp:unitone/layers {"cover":true} -->
	<div data-unitone-layout="layers -cover">
		<!-- wp:unitone/layer {"gridRow":""} -->
		<div data-unitone-layout="layers__layer">
			<!-- wp:pattern {"slug":"unitone/image"} /-->
		</div>
		<!-- /wp:unitone/layer -->

		<!-- wp:unitone/layer {"gridRow":"","alignSelf":"center"} -->
		<div data-unitone-layout="layers__layer -align-self:center">
			<!-- wp:unitone/cover {"noPadding":true,"unitone":{"minHeight":"50vh"}} -->
			<div data-unitone-layout="cover -no-padding">
				<!-- wp:unitone/cover-content {"position":"center"} -->
				<div data-unitone-layout="cover__content -valign:center">
					<!-- wp:unitone/container -->
					<div data-unitone-layout="container">
						<!-- wp:unitone/stack {"textColor":"white","unitone":{"gap":"-2"}} -->
						<div data-unitone-layout="stack" class="has-white-color has-text-color">
							<!-- wp:post-title {"level":1,"fontSize":"unitone-3xl"} /-->
						</div>
						<!-- /wp:unitone/stack -->
					</div>
					<!-- /wp:unitone/container -->
				</div>
				<!-- /wp:unitone/cover-content -->
			</div>
			<!-- /wp:unitone/cover -->
		</div>
		<!-- /wp:unitone/layer -->
	</div>
	<!-- /wp:unitone/layers -->
</header>
<!-- /wp:unitone/decorator -->
