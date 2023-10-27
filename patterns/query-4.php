<?php
/**
 * Title: Query (Text / 2rows / Underline)
 * Slug: unitone/query/4
 * Categories: unitone-query
 * Block Types: core/query
 */
?>
<!-- wp:query {"query":{"perPage":6,"offset":0,"postType":"post","inherit":true},"className":"is-style-underline"} -->
<div class="wp-block-query is-style-underline">
	<!-- wp:post-template -->
		<!-- wp:unitone/stack {"unitone":{"gap":"-2"}} -->
		<div data-unitone-layout="stack">
			<!-- wp:post-date {"fontSize":"unitone-xs"} /-->
			<!-- wp:post-title {"isLink":true,"style":{"typography":{"fontStyle":"normal","fontWeight":"700"}},"fontSize":"unitone-xl"} /-->
		</div>
		<!-- /wp:unitone/stack -->
	<!-- /wp:post-template -->

	<!-- wp:query-pagination {"paginationArrow":"arrow","layout":{"type":"flex","justifyContent":"center"}} -->
		<!-- wp:query-pagination-numbers /-->
	<!-- /wp:query-pagination -->
</div>
<!-- /wp:query -->
