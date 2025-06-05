<?php
/**
 * Title: Main Area for All Archives (One Column)
 * Slug: unitone/template/archive/main/one-column
 * Inserter: false
 */
?>
<!-- wp:unitone/section {"tagName":"main","unitone":{"gutters":"0","padding":"3","gap":"3","maxWidth":"100%"},"className":"site-contents"} -->
<main class="unitone-section site-contents">
	<div data-unitone-layout="gutters">
		<div data-unitone-layout="container">
			<div data-unitone-layout="stack">
				<!-- wp:pattern {"slug":"unitone/template/archive/page-header/default"} /-->

				<!-- wp:unitone/section {"tagName":"div","align":"full","unitone":{"padding":"0","maxWidth":"100%","gap":"3"}} -->
				<div class="alignfull unitone-section">
					<div data-unitone-layout="gutters">
						<div data-unitone-layout="container">
							<div data-unitone-layout="stack">
								<!-- wp:unitone/text {"className":"entry-content","unitone":{"gutters":"0","maxWidth":"var(--wp--style--global--wide-size)"}} -->
								<div data-unitone-layout="text -gap" class="entry-content">
									<!-- wp:template-part {"slug":"loop"} /-->
								</div>
								<!-- /wp:unitone/text -->
							</div>
						</div>
					</div>
				</div>
				<!-- /wp:unitone/section -->
			</div>
		</div>
	</div>
</main>
<!-- /wp:unitone/section -->
