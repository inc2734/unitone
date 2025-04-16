<?php
/**
 * Title: Header (Simple)
 * Slug: unitone/header/simple
 * Categories: unitone-headers
 * Block Types: core/template-part/header
 */
?>
<!-- wp:unitone/section {"tagName":"div","align":"full","unitone":{"maxWidth":"100%","padding":"-1"}} -->
<div class="alignfull unitone-section">
	<div data-unitone-layout="gutters">
		<div data-unitone-layout="container">
			<div data-unitone-layout="stack">
				<!-- wp:unitone/both-sides {"unitone":{"alignItems":"center","gap":"-1"}} -->
				<div data-unitone-layout="both-sides">
					<!-- wp:unitone/stack {"unitone":{"gap":"0"}} -->
					<div data-unitone-layout="stack">
						<!-- wp:site-logo /-->
						<!-- wp:site-title /-->
					</div>
					<!-- /wp:unitone/stack -->

					<!-- wp:navigation {"overlayMenu":"always","layout":{"type":"flex","orientation":"horizontal"},"style":{"typography":{"fontWeight":"600"}},"fontSize":"unitone-s","className":"is-style-unitone-accordion"} -->
						<!-- wp:page-list /-->
					<!-- /wp:navigation -->
				</div>
				<!-- /wp:unitone/both-sides -->
			</div>
		</div>
	</div>
</div>
<!-- /wp:unitone/section -->
