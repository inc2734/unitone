<?php
/**
 * Title: Section
 * Slug: unitone/section/1
 * Categories: section
 * Block Types: unitone/decorator, unitone/gutters
 */
?>
<!-- wp:unitone/decorator {"align":"full","tagName":"section"} -->
<section data-layout="decorator" class="alignfull">
	<!-- wp:unitone/gutters {"lock":{"remove":true,"move":true}} -->
	<div data-layout="gutters">
		<!-- wp:unitone/container {"lock":{"remove":true,"move":true}} -->
		<div data-layout="container">
			<!-- wp:unitone/stack {"unitone":{"gap":"3"},"lock":{"remove":true,"move":true}} -->
			<div data-layout="stack -gap:3">
				<!-- wp:unitone/container {"lock":{"move":true,"remove":true},"unitone":{"maxWidth":"100%","gutters":"0"}} -->
				<div data-layout="container -gutters:0" style="--max-width:100%">
					<!-- wp:unitone/center -->
					<div data-layout="center">
						<!-- wp:heading {"fontSize":"unitone-3xl","lock":{"remove":true,"move":true}} -->
						<h2 class="has-unitone-3-xl-font-size">Lorem ipsum dolor sit amet</h2>
						<!-- /wp:heading -->
					</div>
					<!-- /wp:unitone/center -->
				</div>
				<!-- /wp:unitone/container -->

				<!-- wp:unitone/text {"unitone":{"maxWidth":"100%"},"lock":{"remove":true,"move":true}} -->
				<div data-layout="text" style="--max-width:100%">
					<!-- wp:paragraph -->
					<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cill</p>
					<!-- /wp:paragraph -->
				</div>
				<!-- /wp:unitone/text -->
			</div>
			<!-- /wp:unitone/stack -->
		</div>
		<!-- /wp:unitone/container -->
	</div>
	<!-- /wp:unitone/gutters -->
</section>
<!-- /wp:unitone/decorator -->
