<?php
/**
 * Title: Header (Simple)
 * Slug: unitone/header/simple
 * Categories: header
 * Block Types: core/template-part/header
 */
?>
<!-- wp:unitone/container {"unitone":{"maxWidth":"100%"}} -->
<div data-unitone-layout="container">
	<!-- wp:unitone/gutters {"unitone":{"padding":"-1"}} -->
	<div data-unitone-layout="gutters">
		<!-- wp:unitone/both-sides {"unitone":{"alignItems":"center","gap":-1}} -->
		<div data-unitone-layout="both-sides">
			<!-- wp:unitone/both-sides-content -->
			<div data-unitone-layout="both-sides__content">
				<!-- wp:site-logo /-->
				<!-- wp:site-title /-->
			</div>
			<!-- /wp:unitone/both-sides-content -->

			<!-- wp:unitone/both-sides-content {"contentMaxWidth":"100%"} -->
			<div data-unitone-layout="both-sides__content" style="--unitone--content-max-width:100%">
				<!-- wp:navigation {"overlayMenu":"always","layout":{"type":"flex","orientation":"horizontal"},"style":{"typography":{"fontWeight":"600"}},"fontSize":"unitone-s","className":"is-style-unitone"} -->
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
			<!-- /wp:unitone/both-sides-content -->
		</div>
		<!-- /wp:unitone/both-sides -->
	</div>
	<!-- /wp:unitone/gutters -->
</div>
<!-- /wp:unitone/container -->
