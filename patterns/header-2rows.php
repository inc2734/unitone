<?php
/**
 * Title: Header (2 rows)
 * Slug: unitone/header/2row
 * Categories: unitone-headers
 * Block Types: core/template-part/header
 */
?>
<!-- wp:unitone/section {"tagName":"div","align":"full","unitone":{"maxWidth":"100%","padding":"-1"}} -->
<div class="alignfull unitone-section">
	<div data-unitone-layout="gutters">
		<div data-unitone-layout="container">
			<div data-unitone-layout="stack">
				<!-- wp:unitone/grid {"columnsOption":"columns","smColumnsOption":"free","smColumns":2,"smGridTemplateColumns":"1fr auto","unitone":{"gap":{"row":"-2","column":"-1"}}} -->
				<div class="unitone-grid" style="--unitone--sm-grid-template-columns:1fr auto;--unitone--rows:1" data-unitone-layout="-columns:columns -columns:sm:free -rows:rows">
					<!-- wp:unitone/stack {"unitone":{"gap":"0","alignSelf":"stretch","justifySelf":"stretch","gridColumn":"auto","gridRow":"auto"}} -->
					<div data-unitone-layout="stack">
						<!-- wp:site-logo /-->
						<!-- wp:site-title /-->
					</div>
					<!-- /wp:unitone/stack -->

					<!-- wp:navigation {"layout":{"type":"flex","justifyContent":"left","orientation":"horizontal"},"style":{"typography":{"fontWeight":"600"}},"fontSize":"unitone-s","className":"is-style-unitone-accordion"} -->
						<!-- wp:page-list /-->
					<!-- /wp:navigation -->
				</div>
				<!-- /wp:unitone/grid -->
			</div>
		</div>
	</div>
</div>
<!-- /wp:unitone/section -->
