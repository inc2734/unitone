<?php
/**
 * Title: Pages: Right Sidebar / Page Header (Image)
 * Slug: unitone/page-right-sidebar-page-header-image
 * Categories: unitone-templates
 * Block Types: core/template-part/unitone/page
 * Template Types: page
 */
?>
<!-- wp:unitone/cover {"noPadding":true,"unitone":{"gap":0},"className":"site-container-right-sidebar"} -->
<div data-unitone-layout="cover -no-padding" class="site-container-right-sidebar">
	<!-- wp:unitone/cover-content {"position":"top"} -->
	<div data-unitone-layout="cover__content -valign:top">
		<!-- wp:template-part {"slug":"header","tagName":"header","className":"site-header","theme":"unitone"} /-->
	</div>
	<!-- /wp:unitone/cover-content -->

	<!-- wp:unitone/cover-content {"fill":true,"position":"center"} -->
	<div data-unitone-layout="cover__content -fill -valign:center">
		<!-- wp:pattern {"slug":"unitone/page/main/right-sidebar/page-header-image"} /-->
	</div>
	<!-- /wp:unitone/cover-content -->

	<!-- wp:unitone/cover-content {"position":"bottom"} -->
	<div data-unitone-layout="cover__content -valign:bottom">
		<!-- wp:template-part {"slug":"footer","tagName":"footer","className":"site-footer","theme":"unitone"} /-->
	</div>
	<!-- /wp:unitone/cover-content -->
</div>
<!-- /wp:unitone/cover -->
