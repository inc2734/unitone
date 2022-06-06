<?php
/**
 * Title: Panels (Horizontal)
 * Slug: unitone/columns/5
 * Categories: columns
 * Block Types: unitone/responsive-grid
 */

$images = array(
	get_template_directory_uri() . '/dist/img/stocksnap_lgg8nat9jy.jpg',
	get_template_directory_uri() . '/dist/img/stocksnap_ydxj69toal.jpg',
	get_template_directory_uri() . '/dist/img/swing-ocean-sea2875.jpg',
	get_template_directory_uri() . '/dist/img/smartphone-mobile-laptop36.jpg',
);
?>
<!-- wp:unitone/responsive-grid {"columnMinWidth":"473px"} -->
<div data-layout="responsive-grid" style="--column-min-width:473px">
	<?php for ( $i = 0; $i < 4; $i ++ ) : ?>
	<!-- wp:unitone/decorator {"shadow":true} -->
	<div data-layout="decorator -shadow">
		<!-- wp:unitone/with-sidebar {"sidebarWidth":"var(--cg2)","sidebar":"left","unitone":{"alignItems":"center","gap":0},"lock":{"remove":true,"move":true}} -->
		<div data-layout="with-sidebar -sidebar:left -align-items:center -gap:0" style="--sidebar-width:var(--cg2)">
			<!-- wp:unitone/with-sidebar-content {"lock":{"remove":true,"move":true}} -->
			<div data-layout="with-sidebar__content">
				<!-- wp:unitone/frame {"ratio":"4/3","lock":{"remove":true,"move":true}} -->
				<div data-layout="frame" style="--ratio:4/3">
					<!-- wp:image {"id":1,"width":1920,"height":1280,"lock":{"remove":true,"move":true}} -->
					<figure class="wp-block-image">
						<img src="<?php echo esc_url( $images[ $i ] ); ?>" alt="" width="1920" height="1280" class="wp-image-1"/>
					</figure>
					<!-- /wp:image -->
				</div>
				<!-- /wp:unitone/frame -->
			</div>
			<!-- /wp:unitone/with-sidebar-content -->

			<!-- wp:unitone/with-sidebar-content {"lock":{"remove":true,"move":true}} -->
			<div data-layout="with-sidebar__content">
				<!-- wp:unitone/decorator {"unitone":{"padding":"1"}} -->
				<div data-layout="decorator -padding:1">
					<!-- wp:unitone/stack {"unitone":{"gap":"-2"}} -->
					<div data-layout="stack -gap:-2">
						<!-- wp:heading {"level":3} -->
						<h3>Lorem ipsum</h3>
						<!-- /wp:heading -->

						<!-- wp:paragraph -->
						<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit</p>
						<!-- /wp:paragraph -->
					</div>
					<!-- /wp:unitone/stack -->
				</div>
				<!-- /wp:unitone/decorator -->
			</div>
			<!-- /wp:unitone/with-sidebar-content -->
		</div>
		<!-- /wp:unitone/with-sidebar -->
	</div>
	<!-- /wp:unitone/decorator -->
	<?php endfor; ?>
</div>
<!-- /wp:unitone/responsive-grid -->
