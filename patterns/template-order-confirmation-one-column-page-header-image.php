<?php
/**
 * Title: Order Confirmation: One Column / Page Header (Image)
 * Slug: unitone/template/order-confirmation/one-column-page-header-image
 * Categories: unitone-templates
 * Block Types: core/template-part/unitone/order-confirmation
 * Template Types: order-confirmation
 */
?>
<!-- wp:unitone/cover {"noPadding":true,"unitone":{"gap":0}} -->
<div data-unitone-layout="cover -no-padding">
	<!-- wp:unitone/cover-content {"position":"top"} -->
	<div data-unitone-layout="cover__content -valign:top">
		<!-- wp:template-part {"slug":"header","tagName":"header","className":"site-header","theme":"unitone"} /-->
	</div>
	<!-- /wp:unitone/cover-content -->

	<!-- wp:unitone/cover-content {"fill":true,"position":"center"} -->
	<div data-unitone-layout="cover__content -fill -valign:center">
		<!-- wp:pattern {"slug":"unitone/template/order-confirmation/main/one-column-page-header-image"} /-->
	</div>
	<!-- /wp:unitone/cover-content -->

	<!-- wp:unitone/cover-content {"position":"bottom"} -->
	<div data-unitone-layout="cover__content -valign:bottom">
		<!-- wp:template-part {"slug":"footer","tagName":"footer","className":"site-footer","theme":"unitone"} /-->
	</div>
	<!-- /wp:unitone/cover-content -->
</div>
<!-- /wp:unitone/cover -->
