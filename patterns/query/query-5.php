<?php
/**
 * Title: Query (Text / Underline)
 * Slug: unitone/query/5
 * Categories: unitone-query
 * Block Types: core/query
 */
?>
<!-- wp:query {"query":{"perPage":6,"offset":0,"postType":"post","inherit":true},"className":"is-style-underline"} -->
<div class="wp-block-query is-style-underline">
	<!-- wp:post-template -->
		<!-- wp:unitone/stack {"unitone":{"gap":"-2"}} -->
		<div data-unitone-layout="stack">
			<!-- wp:unitone/with-sidebar {"sidebarWidth":"10em","contentMinWidth":"60%","sidebar":"left","unitone":{"alignItems":"center","gap":"-1"}} -->
			<div data-unitone-layout="with-sidebar -sidebar:left" style="--unitone--sidebar-width:10em;--unitone--content-min-width:60%">
				<!-- wp:unitone/with-sidebar-content {"type":"aside"} -->
				<div data-unitone-layout="with-sidebar__content">
					<!-- wp:post-date {"fontSize":"unitone-xs"} /-->
				</div>
				<!-- /wp:unitone/with-sidebar-content -->
				<!-- wp:unitone/with-sidebar-content {"type":"main"} -->
				<div data-unitone-layout="with-sidebar__content">
					<!-- wp:post-title {"isLink":true,"style":{"typography":{"fontStyle":"normal","fontWeight":"700"}},"fontSize":"unitone-l"} /-->
				</div>
				<!-- /wp:unitone/with-sidebar-content -->
			</div>
			<!-- /wp:unitone/with-sidebar -->
		</div>
		<!-- /wp:unitone/stack -->
	<!-- /wp:post-template -->

	<!-- wp:query-pagination {"paginationArrow":"arrow","layout":{"type":"flex","justifyContent":"center"}} -->
		<!-- wp:query-pagination-numbers /-->
	<!-- /wp:query-pagination -->
</div>
<!-- /wp:query -->
