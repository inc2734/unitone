<?php
/**
 * Title: full width page for blank page
 * Slug: unitone/pages/2
 * Categories: pages
 * Block Types: core/post-content
 */
?>
<!-- wp:unitone/decorator {"align":"full"},"lock":{"remove":true,"move":true}} -->
<div data-unitone-layout="decorator" class="alignfull">
	<!-- wp:unitone/cover {"noPadding":true,"unitone":{"gap":0}} -->
	<div data-unitone-layout="cover -no-padding -gap:0">
		<!-- wp:unitone/cover-content {"position":"top"} -->
		<div data-unitone-layout="cover__content -valign:top">
			<!-- wp:unitone/decorator {"tagName":"header","className":"site-header"} -->
			<header data-unitone-layout="decorator" class="site-header">
				<!-- wp:pattern {"slug":"unitone/header/1row"} /-->
			</header>
			<!-- /wp:unitone/decorator -->
		</div>
		<!-- /wp:unitone/cover-content -->

		<!-- wp:unitone/cover-content {"fill":true,"position":"center"} -->
		<div data-unitone-layout="cover__content -fill -valign:center">
			<!-- wp:unitone/decorator {"className":"site-contents"},"lock":{"remove":true,"move":true}} -->
			<div data-unitone-layout="decorator" class="site-contents">
				<!-- wp:paragraph -->
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cill</p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:unitone/decorator -->
		</div>
		<!-- /wp:unitone/cover-content -->

		<!-- wp:unitone/cover-content {"position":"bottom"} -->
		<div data-unitone-layout="cover__content -valign:bottom">
			<!-- wp:unitone/decorator {"tagName":"footer","className":"site-footer"} -->
			<footer data-unitone-layout="decorator" class="site-footer">
				<!-- wp:pattern {"slug":"unitone/footer/1"} /-->
			</footer>
			<!-- /wp:unitone/decorator -->
		</div>
		<!-- /wp:unitone/cover-content -->
	</div>
	<!-- /wp:unitone/cover -->
</div>
<!-- /wp:unitone/decorator -->
