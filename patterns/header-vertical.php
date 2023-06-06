<?php
/**
 * Title: Header (Vertical)
 * Slug: unitone/header/vertical
 * Categories: unitone-headers
 */
?>
<!-- wp:unitone/container {"unitone":{"maxWidth":"100%"}} -->
<div data-unitone-layout="container">
	<!-- wp:unitone/gutters {"unitone":{"padding":"-1"}} -->
	<div data-unitone-layout="gutters">
		<!-- wp:unitone/both-sides {"unitone":{"alignItems":"center","gap":-1}} -->
		<div data-unitone-layout="both-sides">
			<!-- wp:unitone/stack {"unitone":{"gap":"0"}} -->
			<div data-unitone-layout="stack">
				<!-- wp:site-logo /-->
				<!-- wp:site-title /-->
			</div>
			<!-- /wp:unitone/stack -->

			<!-- wp:navigation {"layout":{"type":"flex","orientation":"vertical"},"style":{"typography":{"fontWeight":"600"}},"fontSize":"unitone-s","className":"is-style-unitone"} -->
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
		<!-- /wp:unitone/both-sides -->
	</div>
	<!-- /wp:unitone/gutters -->
</div>
<!-- /wp:unitone/container -->
