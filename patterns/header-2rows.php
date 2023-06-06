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
		<div data-unitone-layout="with-sidebar" style="--unitone--sidebar-width:calc(((601px - var(--unitone--gutters) * 2 - 100%) * 999) * -1)">
			<!-- wp:unitone/with-sidebar-content -->
			<div data-unitone-layout="with-sidebar__content">
				<!-- wp:site-logo /-->
				<!-- wp:site-title /-->
			</div>
			<!-- /wp:unitone/with-sidebar-content -->

			<!-- wp:unitone/with-sidebar-content -->
			<div data-unitone-layout="with-sidebar__content">
				<!-- wp:navigation {"layout":{"type":"flex","justifyContent":"left","orientation":"horizontal"},"style":{"typography":{"fontWeight":"600"}},"fontSize":"unitone-s","className":"is-style-unitone"} -->
					<!-- wp:navigation-link {"label":"<?php esc_html_e( 'Home', 'unitone' ); ?>","url":"#"} /-->
					<!-- wp:navigation-link {"label":"<?php esc_html_e( 'About', 'unitone' ); ?>","url":"#"} /-->
					<!-- wp:navigation-submenu {"label":"<?php esc_html_e( 'Services', 'unitone' ); ?>","url":"#"} -->
						<!-- wp:navigation-link {"label":"<?php esc_html_e( 'Service 1', 'unitone' ); ?>","url":"#"} /-->
						<!-- wp:navigation-link {"label":"<?php esc_html_e( 'Service 2', 'unitone' ); ?>","url":"#"} /-->
						<!-- wp:navigation-link {"label":"<?php esc_html_e( 'Service 3', 'unitone' ); ?>","url":"#"} /-->
					<!-- /wp:navigation-submenu -->
					<!-- wp:navigation-link {"label":"<?php esc_html_e( 'Blog', 'unitone' ); ?>","url":"#"} /-->
					<!-- wp:navigation-link {"label":"<?php esc_html_e( 'Contact', 'unitone' ); ?>","url":"#"} /-->
				<!-- /wp:navigation -->
			</div>
			<!-- /wp:unitone/with-sidebar-content -->
		</div>
		<!-- /wp:unitone/with-sidebar -->
	</div>
	<!-- /wp:unitone/gutters -->
</div>
<!-- /wp:unitone/container -->
