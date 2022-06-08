<?php
/**
 * Title: Media text (Horizontal)
 * Slug: unitone/columns/3
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
<div data-unitone-layout="responsive-grid" style="--unitone--column-min-width:473px">
	<?php for ( $i = 0; $i < 4; $i ++ ) : ?>
	<!-- wp:unitone/decorator -->
	<div data-unitone-layout="decorator">
		<!-- wp:unitone/with-sidebar {"sidebarWidth":"var(--unitone--cg2)","sidebar":"left","unitone":{"alignItems":"center"},"lock":{"remove":true,"move":true}} -->
		<div data-unitone-layout="with-sidebar -sidebar:left -align-items:center" style="--unitone--sidebar-width:var(--unitone--cg2)">
			<!-- wp:unitone/with-sidebar-content {"lock":{"remove":true,"move":true}} -->
			<div data-unitone-layout="with-sidebar__content">
				<!-- wp:unitone/frame {"ratio":"4/3","lock":{"remove":true,"move":true}} -->
				<div data-unitone-layout="frame" style="--unitone--ratio:4/3">
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
			<div data-unitone-layout="with-sidebar__content">
				<!-- wp:unitone/stack {"unitone":{"gap":"-2"}} -->
				<div data-unitone-layout="stack -gap:-2">
					<!-- wp:heading {"level":3} -->
					<h3>Lorem ipsum</h3>
					<!-- /wp:heading -->

					<!-- wp:paragraph -->
					<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit</p>
					<!-- /wp:paragraph -->
				</div>
				<!-- /wp:unitone/stack -->
			</div>
			<!-- /wp:unitone/with-sidebar-content -->
		</div>
		<!-- /wp:unitone/with-sidebar -->
	</div>
	<!-- /wp:unitone/decorator -->
	<?php endfor; ?>
</div>
