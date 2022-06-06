<?php
/**
 * Title: Banners (Sideways golden ratio / Overlay)
 * Slug: unitone/banners/2
 * Categories: banners
 * Block Types: unitone/responsive-grid, unitone/layers
 */

$images = array(
	get_template_directory_uri() . '/dist/img/stocksnap_lgg8nat9jy.jpg',
	get_template_directory_uri() . '/dist/img/stocksnap_ydxj69toal.jpg',
	get_template_directory_uri() . '/dist/img/swing-ocean-sea2875.jpg',
);
?>
<!-- wp:unitone/responsive-grid {"columnMinWidth":"307px"} -->
<div data-layout="responsive-grid" style="--column-min-width:307px">
	<?php for ( $i = 0; $i < 3; $i ++ ) : ?>
	<!-- wp:unitone/layers {"unitone":{"gap":0}} -->
	<div data-layout="layers -gap:0">
		<!-- wp:unitone/layer {"gridRow":"","lock":{"remove":true,"move":true}} -->
		<div data-layout="layers__layer">
			<!-- wp:unitone/frame {"ratio":"1.618/1","lock":{"move":true,"remove":true}} -->
			<div data-layout="frame" style="--ratio:1.618/1">
				<!-- wp:image {"id":1,"width":1920,"height":1280,"lock":{"move":true,"remove":true}} -->
				<figure class="wp-block-image">
					<img src="<?php echo esc_url( $images[ $i ] ); ?>" alt="" width="1920" height="1280" class="wp-image-1"/>
				</figure>
				<!-- /wp:image -->
			</div>
			<!-- /wp:unitone/frame -->
		</div>
		<!-- /wp:unitone/layer -->

		<!-- wp:unitone/layer {"alignSelf":"end","gridRow":"","lock":{"remove":true,"move":true}} -->
		<div data-layout="layers__layer -align-self:end">
			<!-- wp:unitone/decorator {"textColor":"white","unitone":{"padding":1},"lock":{"move":true,"remove":true}} -->
			<div data-layout="decorator -padding:1" class="has-white-color has-text-color">
				<!-- wp:paragraph -->
				<p>Lorem ipsum dolor sit amet, consectetur</p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:unitone/decorator -->
		</div>
		<!-- /wp:unitone/layer -->
	</div>
	<!-- /wp:unitone/layers -->
	<?php endfor; ?>
</div>
<!-- /wp:unitone/responsive-grid -->
