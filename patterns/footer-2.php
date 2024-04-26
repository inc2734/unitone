<?php
/**
 * Title: Footer 2
 * Slug: unitone/footer/2
 * Categories: unitone-footers
 * Block Types: core/template-part/footer
 */
?>
<!-- wp:unitone/decorator {"align":"full","fontSize":"unitone-xs"} -->
<div data-unitone-layout="decorator" class="alignfull has-unitone-xs-font-size">
	<!-- wp:unitone/gutters {"unitone":{"padding":"-1"}} -->
	<div data-unitone-layout="gutters">
		<!-- wp:unitone/container -->
		<div data-unitone-layout="container">
			<!-- wp:unitone/cluster {"unitone":{"alignItems":"center","justifyContent":"space-between"}} -->
			<div data-unitone-layout="cluster">
				<!-- wp:paragraph -->
				<p>Proudly powered by <a href="https://wordpress.org/">WordPress</a>.</p>
				<!-- /wp:paragraph -->

				<!-- wp:navigation {"overlayMenu":"never","layout":{"type":"flex","justifyContent":"center"},"unitone":{"gap":"var(--unitone--s-1)"}} -->
					<!-- wp:navigation-link {"label":"<?php esc_html_e( 'Home', 'unitone' ); ?>","url":"#"} /-->
					<!-- wp:navigation-link {"label":"<?php esc_html_e( 'About', 'unitone' ); ?>","url":"#"} /-->
					<!-- wp:navigation-link {"label":"<?php esc_html_e( 'Services', 'unitone' ); ?>","url":"#"} /-->
					<!-- wp:navigation-link {"label":"<?php esc_html_e( 'Blog', 'unitone' ); ?>","url":"#"} /-->
					<!-- wp:navigation-link {"label":"<?php esc_html_e( 'Contact', 'unitone' ); ?>","url":"#"} /-->
				<!-- /wp:navigation -->

				<!-- wp:social-links {"openInNewTab":true,"className":"is-style-default","layout":{"type":"flex","justifyContent":"right"}} -->
				<ul class="wp-block-social-links is-style-default">
					<!-- wp:social-link {"url":"#","service":"twitter"} /-->
					<!-- wp:social-link {"url":"#","service":"facebook"} /-->
					<!-- wp:social-link {"url":"#","service":"instagram"} /-->
				</ul>
				<!-- /wp:social-links -->
			</div>
			<!-- /wp:unitone/cluster -->
		</div>
		<!-- /wp:unitone/container -->
	</div>
	<!-- /wp:unitone/gutters -->
</div>
<!-- /wp:unitone/decorator -->
