<?php
/**
 * Title: Sidebar (for Blog)
 * Slug: unitone/sidebar/blog
 * inserter: false
 */
?>
<!-- wp:unitone/stack -->
<div data-unitone-layout="stack">
	<!-- wp:unitone/stack {"unitone":{"gap":"-2"}} -->
	<div data-unitone-layout="stack">
		<!-- wp:heading {"level":3} -->
		<h3 class="wp-block-heading"><?php esc_html_e( 'Latest posts', 'unitone' ); ?></h3>
		<!-- /wp:heading -->

		<!-- wp:latest-posts {"displayPostDate":true} /-->
	</div>
	<!-- /wp:unitone/stack -->

	<!-- wp:unitone/stack {"unitone":{"gap":"-2"}} -->
	<div data-unitone-layout="stack">
		<!-- wp:heading {"level":3} -->
		<h3 class="wp-block-heading"><?php esc_html_e( 'Categories', 'unitone' ); ?></h3>
		<!-- /wp:heading -->

		<!-- wp:categories /-->
	</div>
	<!-- /wp:unitone/stack -->

	<!-- wp:unitone/stack {"unitone":{"gap":"-2"}} -->
	<div data-unitone-layout="stack">
		<!-- wp:heading {"level":3} -->
		<h3 class="wp-block-heading"><?php esc_html_e( 'Archives', 'unitone' ); ?></h3>
		<!-- /wp:heading -->

		<!-- wp:archives /-->
	</div>
	<!-- /wp:unitone/stack -->
</div>
<!-- /wp:unitone/stack -->
