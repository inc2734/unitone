<?php
/**
 * Title: Cart: Left Header
 * Slug: unitone/template/cart/left-header
 * Categories: unitone-templates
 * Template Types: page-cart
 * Inserter: no
 */
?>
<!-- wp:unitone/cover {"noPadding":true,"unitone":{"gap":0},"className":"site-container-left-header"} -->
<div data-unitone-layout="cover -no-padding" class="site-container-left-header">
	<!-- wp:unitone/cover-content {"position":"top"} -->
	<div data-unitone-layout="cover__content -valign:top">
		<!-- wp:template-part {"slug":"header-vertical","tagName":"header","className":"site-header"} /-->
	</div>
	<!-- /wp:unitone/cover-content -->

	<!-- wp:unitone/cover-content {"fill":true,"position":"center"} -->
	<div data-unitone-layout="cover__content -fill -valign:center">
		<!-- wp:pattern {"slug":"unitone/template/cart/main/one-column"} /-->
	</div>
	<!-- /wp:unitone/cover-content -->

	<!-- wp:unitone/cover-content {"position":"bottom"} -->
	<div data-unitone-layout="cover__content -valign:bottom">
		<!-- wp:template-part {"slug":"footer","tagName":"footer","className":"site-footer"} /-->
	</div>
	<!-- /wp:unitone/cover-content -->
</div>
<!-- /wp:unitone/cover -->
