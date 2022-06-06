<?php
/**
 * Title: Header (1 row)
 * Slug: unitone/header/1row
 * Categories: header
 * Block Types: core/template-part/header
 */
?>
<!-- wp:unitone/container -->
<div data-layout="container">
	<!-- wp:unitone/gutters {"unitone":{"padding":"1"}} -->
	<div data-layout="gutters -padding:1">
		<!-- wp:unitone/both-sides {"unitone":{"alignItems":"center"}} -->
		<div data-layout="both-sides -align-items:center">
			<!-- wp:unitone/both-sides-content -->
			<div data-layout="both-sides__content">
				<!-- wp:site-logo /-->
				<!-- wp:site-title /-->
			</div>
			<!-- /wp:unitone/both-sides-content -->

			<!-- wp:unitone/both-sides-content {"contentMaxWidth":"100%"} -->
			<div data-layout="both-sides__content" style="--content-max-width:100%">
				<!-- wp:navigation {"layout":{"type":"flex","orientation":"horizontal"},"style":{"typography":{"fontWeight":"600"}},"fontSize":"unitone-xs"} -->
					<!-- wp:page-list /-->
				<!-- /wp:navigation -->
			</div>
			<!-- /wp:unitone/both-sides-content -->
		</div>
		<!-- /wp:unitone/both-sides -->
	</div>
	<!-- /wp:unitone/gutters -->
</div>
<!-- /wp:unitone/container -->
