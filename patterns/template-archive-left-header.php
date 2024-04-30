<?php
/**
 * Title: All Archives: Left Header
 * Slug: unitone/template/archive/left-header
 * Categories: unitone-templates
 * Template Types: archive, category, tag, author, date, taxonomy
 * Inserter: no
 */
?>
<!-- wp:unitone/grid {"className":"site-container-left-header","columnsOption":"free","gridTemplateColumns":"clamp(var(--unitone--cg2), 30%, var(--unitone--cg3)) 1fr","smColumnsOption":"free","smGridTemplateColumns":"auto","align":"full","unitone":{"gap":"0"}} -->
<div class="alignfull unitone-grid site-container-left-header" style="--unitone--grid-template-columns:clamp(var(--unitone--cg2), 30%, var(--unitone--cg3)) 1fr;--unitone--sm-grid-template-columns:auto;--unitone--rows:1" data-unitone-layout="-columns:free -columns:sm:free -rows:rows">
	<!-- wp:template-part {"slug":"header-vertical","tagName":"header","className":"site-header"} /-->

	<!-- wp:unitone/cover {"noPadding":true,"unitone":{"gap":0}} -->
	<div data-unitone-layout="cover -no-padding">
		<!-- wp:unitone/cover-content {"position":"top"} -->
		<div data-unitone-layout="cover__content -valign:top">
			<!-- wp:pattern {"slug":"unitone/template/archive/main/one-column"} /-->
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
