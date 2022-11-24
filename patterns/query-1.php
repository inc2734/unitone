<?php
/**
 * Title: Query (Underline)
 * Slug: unitone/query/1
 * Categories: query
 * Block Types: core/query
 */
?>
<!-- wp:query {"query":{"perPage":10,"offset":0,"postType":"post","inherit":true},"className":"is-style-underline"} -->
<div class="wp-block-query is-style-underline">
	<!-- wp:post-template -->
		<!-- wp:unitone/stack {"unitone":{"gap":"-2"}} -->
		<div data-unitone-layout="stack -gap:-2">
			<!-- wp:unitone/with-sidebar {"sidebar":"left"} -->
			<div data-unitone-layout="with-sidebar -sidebar:left">
				<!-- wp:unitone/with-sidebar-content -->
				<div data-unitone-layout="with-sidebar__content">
					<!-- wp:post-date {"fontSize":"unitone-xs"} /-->
				</div>
				<!-- /wp:unitone/with-sidebar-content -->

				<!-- wp:unitone/with-sidebar-content -->
				<div data-unitone-layout="with-sidebar__content">
					<!-- wp:unitone/stack {"unitone":{"gap":"-2"}} -->
					<div data-unitone-layout="stack -gap:-2">
						<!-- wp:post-terms {"term":"category","style":{"elements":{"link":{"color":{"text":"var:preset|color|unitone/accent"}}}},"className":"is-style-default","fontSize":"unitone-xs"} /-->

						<!-- wp:post-title {"isLink":true,"style":{"typography":{"fontStyle":"normal","fontWeight":"400"}}} /-->
					</div>
					<!-- /wp:unitone/stack -->
				</div>
				<!-- /wp:unitone/with-sidebar-content -->
			</div>
			<!-- /wp:unitone/with-sidebar -->
		</div>
		<!-- /wp:unitone/stack -->
	<!-- /wp:post-template -->
</div>
<!-- /wp:query -->
