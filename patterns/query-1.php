<?php
/**
 * Title: Query (Simple / Block link)
 * Slug: unitone/query/1
 * Categories: query
 * Block Types: core/query
 */
?>
<!-- wp:query {"query":{"perPage":10,"offset":0,"postType":"post","inherit":true},"className":"is-style-block-link-underline"} -->
<div class="wp-block-query is-style-block-link-underline">
	<!-- wp:post-template -->
		<!-- wp:unitone/stack {"unitone":{"gap":"-2"}} -->
		<div data-unitone-layout="stack -gap:-2">
			<!-- wp:unitone/cluster {"fontSize":"unitone-xs","unitone":{"gap":"-1","alignItems":"center"}} -->
			<div data-unitone-layout="cluster -align-items:center -gap:-1" class="has-unitone-xs-font-size">
				<!-- wp:post-date /-->
				<!-- wp:post-terms {"term":"category","className":"is-style-badge"} /-->
			</div>
			<!-- /wp:unitone/cluster -->

			<!-- wp:post-title {"isLink":true} /-->
		</div>
		<!-- /wp:unitone/stack -->
	<!-- /wp:post-template -->

	<!-- wp:query-pagination {"paginationArrow":"arrow","layout":{"type":"flex","justifyContent":"center"}} -->
		<!-- wp:query-pagination-numbers /-->
	<!-- /wp:query-pagination -->
</div>
<!-- /wp:query -->
