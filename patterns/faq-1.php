<?php
/**
 * Title: FAQ
 * Slug: unitone/faq/1
 * Categories: faq
 * Block Types: unitone/responsive-grid
 */
?>
<!-- wp:unitone/responsive-grid {"columnMinWidth":"465px","unitone":{"gap":2}} -->
<div data-unitone-layout="responsive-grid -gap:2" style="--unitone--column-min-width:465px">
	<?php for ( $i = 0; $i < 4; $i ++ ) : ?>
	<!-- wp:unitone/decorator -->
	<div data-unitone-layout="decorator">
		<!-- wp:unitone/stack {"lock":{"move":true,"remove":true},"unitone":{"gap":-2}} -->
		<div data-unitone-layout="stack -gap:-2">
			<!-- wp:unitone/with-sidebar {"sidebarWidth":"var(--unitone--rem2)","sidebar":"left","lock":{"move":true,"remove":true},"unitone":{"alignItems":"center"}} -->
			<div data-unitone-layout="with-sidebar -sidebar:left -align-items:center" style="--unitone--sidebar-width:var(--unitone--rem2)">
				<!-- wp:unitone/with-sidebar-content -->
				<div data-unitone-layout="with-sidebar__content">
					<!-- wp:paragraph {"textColor":"unitone/accent","fontSize":"unitone-3xl"} -->
					<p class="has-unitone-accent-color has-text-color has-unitone-3-xl-font-size"><strong>Q</strong></p>
					<!-- /wp:paragraph -->
				</div>
				<!-- /wp:unitone/with-sidebar-content -->

				<!-- wp:unitone/with-sidebar-content -->
				<div data-unitone-layout="with-sidebar__content">
					<!-- wp:heading {"level":3,"lock":{"move":true,"remove":true}} -->
					<h3>連携で得きるカレンダーツールは何がありますか。</h3>
					<!-- /wp:heading -->
				</div>
				<!-- /wp:unitone/with-sidebar-content -->
			</div>
			<!-- /wp:unitone/with-sidebar -->

			<!-- wp:unitone/with-sidebar {"sidebarWidth":"var(--unitone--rem2)","sidebar":"left","lock":{"move":true,"remove":true},"unitone":{"alignItems":"center"}} -->
			<div data-unitone-layout="with-sidebar -sidebar:left -align-items:center" style="--unitone--sidebar-width:var(--unitone--rem2)">
				<!-- wp:unitone/with-sidebar-content -->
				<div data-unitone-layout="with-sidebar__content"></div>
				<!-- /wp:unitone/with-sidebar-content -->

				<!-- wp:unitone/with-sidebar-content -->
				<div data-unitone-layout="with-sidebar__content">
					<!-- wp:unitone/text {"lock":{"move":true,"remove":true},"unitone":{"maxWidth":"100%"}} -->
					<div data-unitone-layout="text" style="--unitone--max-width:100%">
						<!-- wp:paragraph -->
						<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cill</p>
						<!-- /wp:paragraph -->

						<!-- wp:paragraph -->
						<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cill</p>
						<!-- /wp:paragraph -->
					</div>
					<!-- /wp:unitone/text -->
				</div>
				<!-- /wp:unitone/with-sidebar-content -->
			</div>
			<!-- /wp:unitone/with-sidebar -->
		</div>
		<!-- /wp:unitone/stack -->
	</div>
	<!-- /wp:unitone/decorator -->
	<?php endfor; ?>
</div>
<!-- /wp:unitone/responsive-grid -->
