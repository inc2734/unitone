<?php
/**
 * Title: Single Posts: Sticky Header / Right Sidebar / Page Header (Image)
 * Slug: unitone/template/single/sticky-header-right-sidebar-page-header-image
 * Categories: unitone-templates
 * Template Types: single
 * Inserter: no
 */
?>
<!-- wp:unitone/cover {"unitone":{"gap":"0","padding":"0"}} -->
<div data-unitone-layout="cover">
	<!-- wp:unitone/cover-content {"position":"top","unitone":{"position":{"position":"sticky","zIndex":"2","left":"0px","right":"0px","top":"var(--wp-admin--admin-bar--height, 0px)"}},"style":{"elements":{"link":{"color":{"text":"var:preset|color|unitone-text"}}},"shadow":"var:preset|shadow|unitone-natural"},"backgroundColor":"unitone-background","textColor":"unitone-text"} -->
	<div data-unitone-layout="cover__content -valign:top" class="has-unitone-text-color has-unitone-background-background-color has-text-color has-background has-link-color" style="box-shadow:var(--wp--preset--shadow--unitone-natural)">
		<!-- wp:template-part {"slug":"header","tagName":"header","className":"site-header"} /-->
	</div>
	<!-- /wp:unitone/cover-content -->

	<!-- wp:unitone/cover-content {"fill":true,"position":"center"} -->
	<div data-unitone-layout="cover__content -fill -valign:center">
		<!-- wp:pattern {"slug":"unitone/template/single/main/right-sidebar-page-header-image"} /-->
	</div>
	<!-- /wp:unitone/cover-content -->

	<!-- wp:unitone/cover-content {"position":"bottom"} -->
	<div data-unitone-layout="cover__content -valign:bottom">
		<!-- wp:template-part {"slug":"footer","tagName":"footer","className":"site-footer"} /-->
	</div>
	<!-- /wp:unitone/cover-content -->
</div>
<!-- /wp:unitone/cover -->
