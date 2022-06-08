<?php
/**
 * Title: Section (Slim and full width content)
 * Slug: unitone/section/10
 * Categories: section
 * Block Types: unitone/decorator, unitone/gutters
 */
?>
<!-- wp:unitone/decorator {"tagName":"section","align":"full"} -->
<section data-unitone-layout="decorator" class="alignfull">
	<!-- wp:unitone/gutters {"lock":{"remove":true,"move":true}} -->
	<div data-unitone-layout="gutters">
		<!-- wp:unitone/container {"lock":{"remove":true,"move":true}} -->
		<div data-unitone-layout="container">
			<!-- wp:unitone/stack {"lock":{"remove":true,"move":true},"unitone":{"gap":"2"}} -->
			<div data-unitone-layout="stack -gap:2">
				<!-- wp:unitone/container {"lock":{"move":true,"remove":true},"unitone":{"maxWidth":"var(--unitone--measure)","gutters":"0"}} -->
				<div data-unitone-layout="container -gutters:0" style="--unitone--max-width:var(--unitone--measure)">
					<!-- wp:unitone/center -->
					<div data-unitone-layout="center">
						<!-- wp:heading {"lock":{"remove":true,"move":true},"fontSize":"unitone-3xl"} -->
						<h2 class="has-unitone-3-xl-font-size">Lorem ipsum dolor sit amet</h2>
						<!-- /wp:heading -->
					</div>
					<!-- /wp:unitone/center -->
				</div>
				<!-- /wp:unitone/container -->

				<!-- wp:unitone/text {"lock":{"move":true,"remove":true}} -->
				<div data-unitone-layout="text">
					<!-- wp:paragraph -->
					<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cill</p>
					<!-- /wp:paragraph -->
				</div>
				<!-- /wp:unitone/text -->

				<!-- wp:unitone/text {"unitone":{"maxWidth":"100%"},"lock":{"move":true,"remove":true}} -->
				<div data-unitone-layout="text" style="--unitone--max-width:100%">
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
