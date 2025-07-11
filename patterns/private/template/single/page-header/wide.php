<?php
/**
 * Title: Page Header (Wide) for Single Posts
 * Slug: unitone/template/single/page-header/wide
 * Inserter: false
 */
?>
<!-- wp:unitone/section {"tagName":"header","align":"full","unitone":{"padding":"0","gutters":"root","gap":"-2"}} -->
<header class="alignfull unitone-section">
	<div data-unitone-layout="gutters">
		<div data-unitone-layout="container">
			<div data-unitone-layout="stack">
				<!-- wp:post-title {"level":1,"fontSize":"unitone-3xl"} /-->

				<!-- wp:unitone/cluster {"fontSize":"unitone-xs","unitone":{"gap":"-1"}} -->
				<div data-unitone-layout="cluster" class="has-unitone-xs-font-size">
					<!-- wp:post-date /-->
					<!-- wp:post-terms {"term":"category"} /-->
				</div>
				<!-- /wp:unitone/cluster -->
			</div>
		</div>
	</div>
</header>
<!-- /wp:unitone/section -->
