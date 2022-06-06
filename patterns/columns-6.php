<?php
/**
 * Title: Step
 * Slug: unitone/columns/6
 * Categories: columns
 * Block Types: unitone/switcher
 */

$images = array(
	get_template_directory_uri() . '/dist/img/stocksnap_lgg8nat9jy.jpg',
	get_template_directory_uri() . '/dist/img/stocksnap_ydxj69toal.jpg',
	get_template_directory_uri() . '/dist/img/swing-ocean-sea2875.jpg',
);
?>
<!-- wp:unitone/switcher {"threshold":"calc(var(--measure) * 1.25)","unitone":{"gap":"2"}} -->
<div data-layout="switcher -gap:2" style="--threshold:calc(var(--measure) * 1.25)">
	<?php for ( $i = 0; $i < 3; $i ++ ) : ?>
	<!-- wp:unitone/decorator -->
	<div data-layout="decorator">
		<!-- wp:unitone/decorator {"position":"absolute","top":"calc(-1 * var(--s1))","left":"calc(-1 * var(--s1))","zIndex":"1","lock":{"move":true,"remove":true}} -->
		<div style="--top:calc(-1 * var(--s1));--left:calc(-1 * var(--s1));--z-index:1" data-layout="decorator -position:absolute">
			<!-- wp:paragraph {"lock":{"move":true,"remove":true},"textColor":"unitone/gray","fontSize":"unitone-4xl"} -->
			<p class="has-unitone-gray-color has-text-color has-unitone-4-xl-font-size"><strong><?php echo esc_html( sprintf( '%02d', $i + 1 ) ); ?></strong></p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:unitone/decorator -->

		<!-- wp:unitone/stack {"lock":{"move":true,"remove":true},"unitone":{"gap":"-1"}} -->
		<div data-layout="stack -gap:-1">
			<!-- wp:unitone/frame {"ratio":"16/9"} -->
			<div data-layout="frame" style="--ratio:16/9">
				<!-- wp:image {"id":1,"width":1920,"height":1280} -->
				<figure class="wp-block-image">
					<img src="<?php echo esc_url( $images[ $i ] ); ?>" alt="" width="1920" height="1280" class="wp-image-1"/>
				</figure>
				<!-- /wp:image -->
			</div>
			<!-- /wp:unitone/frame -->

			<!-- wp:heading {"level":3} -->
			<h3>Lorem ipsum dolor sit amet</h3>
			<!-- /wp:heading -->

			<!-- wp:paragraph -->
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit</p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:unitone/stack -->
	</div>
	<!-- /wp:unitone/decorator -->
	<?php endfor; ?>
</div>
<!-- /wp:unitone/switcher -->
