<?php
/**
 * Title: Search Results: Left Header / Page Header (Image)
 * Slug: unitone/template/search/left-header-page-header-image
 * Categories: unitone-templates
 * Template Types: search
 * Inserter: no
 */
?>
<!-- wp:unitone/cover {"noPadding":true,"unitone":{"gap":0},"className":"site-container-left-header"} -->
<div data-unitone-layout="cover -no-padding" class="site-container-left-header">
	<!-- wp:unitone/cover-content {"position":"top"} -->
	<div data-unitone-layout="cover__content -valign:top">
		<!-- wp:template-part {"slug":"header-vertical","tagName":"header","className":"site-header","theme":"unitone"} /-->
	</div>
	<!-- /wp:unitone/cover-content -->

	<!-- wp:unitone/cover-content {"fill":true,"position":"center"} -->
	<div data-unitone-layout="cover__content -fill -valign:center">
		<!-- wp:pattern {"slug":"unitone/template/search/main/one-column-page-header-image"} /-->
	</div>
	<!-- /wp:unitone/cover-content -->

	<!-- wp:unitone/cover-content {"position":"bottom"} -->
	<div data-unitone-layout="cover__content -valign:bottom">
		<!-- wp:template-part {"slug":"footer","tagName":"footer","className":"site-footer","theme":"unitone"} /-->
	</div>
	<!-- /wp:unitone/cover-content -->
</div>
<!-- /wp:unitone/cover -->
