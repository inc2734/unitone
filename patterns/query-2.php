<?php
/**
 * Title: Query (Rich media / Block link)
 * Slug: unitone/query/2
 * Categories: query
 * Block Types: core/query
 */
?>
<!-- wp:query {"query":{"perPage":10,"offset":0,"postType":"post","inherit":true},"displayLayout":{"type":"flex","columns":3},"className":"is-style-block-link-underline"} -->
<div class="wp-block-query is-style-block-link-underline">
	<!-- wp:post-template -->
		<!-- wp:unitone/stack -->
		<div data-layout="stack">
			<!-- wp:unitone/decorator {"backgroundColor":"unitone/gray"} -->
			<div data-layout="decorator" class="has-unitone-gray-background-color has-background">
				<!-- wp:unitone/frame {"ratio":"4/3"} -->
				<div data-layout="frame" style="--ratio:4/3">
					<!-- wp:post-featured-image /-->
				</div>
				<!-- /wp:unitone/frame -->
			</div>
			<!-- /wp:unitone/decorator -->

			<!-- wp:unitone/stack {"unitone":{"gap":"-2"}} -->
			<div data-layout="stack -gap:-2">
				<!-- wp:post-title {"isLink":true} /-->

				<!-- wp:unitone/cluster {"fontSize":"unitone-xs","unitone":{"gap":"-1","alignItems":"center"}} -->
				<div data-layout="cluster -align-items:center -gap:-1" class="has-unitone-xs-font-size">
					<!-- wp:post-date /-->
					<!-- wp:post-terms {"term":"category","style":{"elements":{"link":{"color":{"text":"var:preset|color|white"}}}},"backgroundColor":"black","className":"is-style-badge"} /-->
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
