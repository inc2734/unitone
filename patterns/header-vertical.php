<?php
/**
 * Title: Header (Vertical)
 * Slug: unitone/header/vertical
 * Categories: unitone-headers
 */
?>
<!-- wp:unitone/section {"tagName":"div","unitone":{"maxWidth":"100%","padding":"-1"}} -->
<div class="unitone-section">
	<div data-unitone-layout="gutters">
		<div data-unitone-layout="container">
			<div data-unitone-layout="stack">
				<!-- wp:unitone/grid {"columnsOption":"columns","smColumnsOption":"free","smGridTemplateColumns":"1fr auto","unitone":{"gap":{"row":"1","column":"-1"}}} -->
				<div class="unitone-grid" style="--unitone--sm-grid-template-columns:1fr auto;--unitone--rows:1" data-unitone-layout="-columns:columns -columns:sm:free -rows:rows">
					<!-- wp:unitone/stack {"unitone":{"gap":"0","alignSelf":"center"}} -->
					<div data-unitone-layout="stack">
						<!-- wp:site-logo /-->
						<!-- wp:site-title /-->
					</div>
					<!-- /wp:unitone/stack -->

					<!-- wp:navigation {"layout":{"type":"flex","orientation":"vertical"},"style":{"typography":{"fontWeight":"600"}},"fontSize":"unitone-s","className":"is-style-unitone-accordion","unitone":{"alignSelf":"center"}} -->
						<!-- wp:page-list /-->
					<!-- /wp:navigation -->
				</div>
				<!-- /wp:unitone/grid -->
			</div>
		</div>
	</div>
</div>
<!-- /wp:unitone/section -->
