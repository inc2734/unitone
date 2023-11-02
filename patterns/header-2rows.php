<?php
/**
 * Title: Header (2 rows)
 * Slug: unitone/header/2row
 * Categories: unitone-headers
 * Block Types: core/template-part/header
 */
?>
<!-- wp:unitone/container {"unitone":{"maxWidth":"100%"}} -->
<div data-unitone-layout="container">
	<!-- wp:unitone/gutters {"unitone":{"padding":"-1"}} -->
	<div data-unitone-layout="gutters">
		<!-- wp:unitone/with-sidebar {"sidebarWidth":"calc(((601px - var(--unitone--gutters) * 2 - 100%) * 999) * -1)","unitone":{"alignItems":"center","gap":-1}} -->
		<div data-unitone-layout="with-sidebar -sidebar:right" style="--unitone--sidebar-width:calc(((601px - var(--unitone--gutters) * 2 - 100%) * 999) * -1)">
			<!-- wp:unitone/with-sidebar-content -->
			<div data-unitone-layout="with-sidebar__content">
				<!-- wp:site-logo /-->
				<!-- wp:site-title /-->
			</div>
			<!-- /wp:unitone/with-sidebar-content -->

			<!-- wp:unitone/with-sidebar-content -->
			<div data-unitone-layout="with-sidebar__content">
				<!-- wp:navigation {"layout":{"type":"flex","justifyContent":"left","orientation":"horizontal"},"style":{"typography":{"fontWeight":"600"}},"fontSize":"unitone-s","className":"is-style-unitone"} /-->
			</div>
			<!-- /wp:unitone/with-sidebar-content -->
		</div>
		<!-- /wp:unitone/with-sidebar -->
	</div>
	<!-- /wp:unitone/gutters -->
</div>
<!-- /wp:unitone/container -->
