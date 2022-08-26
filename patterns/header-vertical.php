<?php
/**
 * Title: Header (Vertical)
 * Slug: unitone/header/vertical
 * Categories: header
 */
?>
<!-- wp:unitone/container -->
<div data-unitone-layout="container">
	<!-- wp:unitone/gutters {"unitone":{"padding":"-1"}} -->
	<div data-unitone-layout="gutters -padding:-1">
		<!-- wp:unitone/both-sides {"unitone":{"alignItems":"center","gap":-1}} -->
		<div data-unitone-layout="both-sides -align-items:center -gap:-1">
			<!-- wp:unitone/both-sides-content -->
			<div data-unitone-layout="both-sides__content">
				<!-- wp:site-logo /-->
				<!-- wp:site-title /-->
			</div>
			<!-- /wp:unitone/both-sides-content -->

			<!-- wp:unitone/both-sides-content {"contentMaxWidth":"100%"} -->
			<div data-unitone-layout="both-sides__content" style="--unitone--content-max-width:100%">
				<!-- wp:navigation {"layout":{"type":"flex","orientation":"vertical"},"style":{"typography":{"fontWeight":"600"}},"fontSize":"unitone-s","className":"is-style-unitone"} -->
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
