<?php
/**
 * Title: All Archives: Sticky Header / One Column / Page Header (Image)
 * Slug: unitone/template/archive/sticky-header-one-column-page-header-image
 * Categories: unitone-templates
 * Template Types: archive, category, tag, author, date, taxonomy
 * Inserter: no
 */
?>
<!-- wp:unitone/cover {"unitone":{"gap":"0","padding":"0"}} -->
<div data-unitone-layout="cover">
	<!-- wp:template-part {"slug":"header-wrapper-sticky","tagName":"div","area":"unitone/header-wrapper","className":"site-header-wrapper"} /-->

	<!-- wp:unitone/cover-content {"fill":true,"position":"center"} -->
	<div data-unitone-layout="cover__content -fill -valign:center">
		<!-- wp:pattern {"slug":"unitone/template/archive/main/one-column-page-header-image"} /-->
	</div>
	<!-- /wp:unitone/cover-content -->

	<!-- wp:unitone/cover-content {"position":"bottom"} -->
	<div data-unitone-layout="cover__content -valign:bottom">
		<!-- wp:template-part {"slug":"footer","tagName":"footer","className":"site-footer"} /-->
	</div>
	<!-- /wp:unitone/cover-content -->
</div>
<!-- /wp:unitone/cover -->

