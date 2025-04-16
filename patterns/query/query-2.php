<?php
/**
 * Title: Query (Rich media / Block link)
 * Slug: unitone/query/2
 * Categories: unitone-query
 * Block Types: core/query
 */
?>
<!-- wp:query {"query":{"perPage":6,"offset":0,"postType":"post","inherit":true},"className":"is-style-block-link"} -->
<div class="wp-block-query is-style-block-link">
	<!-- wp:post-template {"layout":{"type":"grid","columnCount":3},"unitone":{"gap":"2"}} -->
		<!-- wp:unitone/stack {"unitone":{"gap":"-1"}} -->
		<div data-unitone-layout="stack">
			<!-- wp:unitone/frame {"ratio":"4/3"} -->
			<div data-unitone-layout="frame" style="--unitone--ratio:4/3">
				<!-- wp:post-featured-image /-->
			</div>
			<!-- /wp:unitone/frame -->

			<!-- wp:unitone/stack {"unitone":{"gap":"-2"}} -->
			<div data-unitone-layout="stack">
				<!-- wp:post-title {"isLink":true} /-->

				<!-- wp:unitone/cluster {"fontSize":"unitone-xs","unitone":{"gap":"-1","alignItems":"center"}} -->
				<div data-unitone-layout="cluster" class="has-unitone-xs-font-size">
					<!-- wp:post-date /-->
					<!-- wp:post-terms {"term":"category","className":"is-style-outline"} /-->
				</div>
				<!-- /wp:unitone/cluster -->
			</div>
			<!-- /wp:unitone/stack -->
		</div>
		<!-- /wp:unitone/stack -->
	<!-- /wp:post-template -->

	<!-- wp:query-pagination {"paginationArrow":"arrow","layout":{"type":"flex","justifyContent":"center"}} -->
		<!-- wp:query-pagination-numbers /-->
	<!-- /wp:query-pagination -->
</div>
<!-- /wp:query -->
