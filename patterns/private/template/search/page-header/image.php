<?php
/**
 * Title: Page Header (Image) for Search Results
 * Slug: unitone/template/search/page-header/image
 * Inserter: false
 */
?>
<!-- wp:unitone/decorator {"tagName":"header"} -->
<header data-unitone-layout="decorator">
	<!-- wp:unitone/layers {"cover":true} -->
	<div data-unitone-layout="layers -cover -portrait">
		<!-- wp:unitone/layer -->
		<div data-unitone-layout="layers__layer">
			<!-- wp:pattern {"slug":"unitone/image"} /-->
		</div>
		<!-- /wp:unitone/layer -->

		<!-- wp:unitone/layer {"unitone":{"alignSelf":"center"}} -->
		<div data-unitone-layout="layers__layer">
			<!-- wp:unitone/cover {"unitone":{"minHeight":"50vmin","padding":"0"}} -->
			<div data-unitone-layout="cover">
				<!-- wp:unitone/cover-content {"position":"center"} -->
				<div data-unitone-layout="cover__content -valign:center">
					<!-- wp:unitone/container -->
					<div data-unitone-layout="container">
						<!-- wp:unitone/stack {"textColor":"white","unitone":{"gap":"-2"}} -->
						<div data-unitone-layout="stack" class="has-white-color has-text-color">
							<!-- wp:heading {"level":1,"fontSize":"unitone-3xl"} -->
							<h1 class="wp-block-heading has-unitone-3-xl-font-size"><?php esc_html_e( 'Search results', 'unitone' ); ?></h1>
							<!-- /wp:heading -->
						</div>
						<!-- /wp:unitone/stack -->
					</div>
					<!-- /wp:unitone/container -->
				</div>
				<!-- /wp:unitone/cover-content -->
			</div>
			<!-- /wp:unitone/cover -->
		</div>
		<!-- /wp:unitone/layer -->
	</div>
	<!-- /wp:unitone/layers -->
</header>
<!-- /wp:unitone/decorator -->
