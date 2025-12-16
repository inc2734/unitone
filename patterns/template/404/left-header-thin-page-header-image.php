<?php
/**
 * Title: 404: Left Header (Thin) / Page Header (Image)
 * Slug: unitone/template/404/left-header-thin-page-header-image
 * Categories: unitone-templates
 * Template Types: 404
 * Inserter: no
 */
?>
<!-- wp:unitone/grid {"className":"site-container-left-header site-container-left-header--thin","columnsOption":"free","gridTemplateColumns":"100px 1fr","smColumnsOption":"free","smGridTemplateColumns":"auto","align":"full","unitone":{"gap":"0"}} -->
<div class="alignfull unitone-grid site-container-left-header site-container-left-header--thin" style="--unitone--grid-template-columns:100px 1fr;--unitone--sm-grid-template-columns:auto;--unitone--rows:1" data-unitone-layout="-columns:free -columns:sm:free -rows:rows">
	<!-- wp:template-part {"slug":"header-vertical-thin","tagName":"header","className":"site-header"} /-->

	<!-- wp:unitone/cover {"unitone":{"gap":"0","padding":"0"}} -->
	<div data-unitone-layout="cover">
		<!-- wp:unitone/cover-content {"position":"top"} -->
		<div data-unitone-layout="cover__content -valign:top">
			<!-- wp:pattern {"slug":"unitone/template/404/main/one-column-page-header-image"} /-->
		</div>
		<!-- /wp:unitone/cover-content -->

		<!-- wp:unitone/cover-content {"position":"bottom"} -->
		<div data-unitone-layout="cover__content -valign:bottom">
			<!-- wp:template-part {"slug":"footer","tagName":"footer","className":"site-footer"} /-->
		</div>
		<!-- /wp:unitone/cover-content -->
	</div>
	<!-- /wp:unitone/cover -->
</div>
<!-- /wp:unitone/grid -->
