<?php
/**
 * Title: Hero (Right title)
 * Slug: unitone/hero/5
 * Categories: hero
 * Block Types: unitone/decorator, unitone/cover
 */
?>
<!-- wp:unitone/decorator {"align":"full","tagName":"section"} -->
<section data-layout="decorator" class="alignfull">
	<!-- wp:unitone/layers {"cover":true,"lock":{"remove":true,"move":true}} -->
	<div data-layout="layers -cover">
		<!-- wp:unitone/layer {"gridRow":"","lock":{"remove":true,"move":true}} -->
		<div data-layout="layers__layer">
			<!-- wp:image {"id":1,"width":1920,"height":1280,"lock":{"remove":true,"move":true}} -->
			<figure class="wp-block-image">
				<img src="<?php echo get_template_directory_uri(); ?>/dist/img/smartphone-mobile-laptop36.jpg" alt="" width="1920" height="1280" class="wp-image-1"/>
			</figure>
			<!-- /wp:image -->
		</div>
		<!-- /wp:unitone/layer -->

		<!-- wp:unitone/layer {"alignSelf":"center","gridRow":"","lock":{"remove":true,"move":true}} -->
		<div data-layout="layers__layer -align-self:center">
			<!-- wp:unitone/decorator {"textColor":"white","lock":{"remove":true,"move":true}} -->
			<div data-layout="decorator" class="has-white-color has-text-color">
				<!-- wp:unitone/cover {"noPadding":true,"unitone":{"justifyContent":"center"},"lock":{"remove":true,"move":true}} -->
				<div data-layout="cover -no-padding -justify-content:center">
					<!-- wp:unitone/gutters {"unitone":{"padding":"2"},"lock":{"remove":true,"move":true}} -->
					<div data-layout="gutters -padding:2">
						<!-- wp:unitone/container {"unitone":{"blockAlign":"end","maxWidth":"var(--measure)"},"lock":{"remove":true,"move":true}} -->
						<div data-layout="container -align:end" style="--max-width:var(--measure)">
							<!-- wp:unitone/stack {"lock":{"remove":true,"move":true}} -->
							<div data-layout="stack">
								<!-- wp:paragraph {"fontSize":"unitone-5xl","unitone":{"fluidTypography":true}} -->
								<p class="has-unitone-5-xl-font-size" data-layout="-fluid-typography"><strong>Lorem ipsum dolor sit amet</strong></p>
								<!-- /wp:paragraph -->

								<!-- wp:paragraph {"fontSize":"unitone-xl"} -->
								<p class="has-unitone-xl-font-size"><strong>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et</strong></p>
								<!-- /wp:paragraph -->
							</div>
							<!-- /wp:unitone/stack -->
						</div>
						<!-- /wp:unitone/container -->
					</div>
					<!-- /wp:unitone/gutters -->
				</div>
				<!-- /wp:unitone/cover -->
			</div>
			<!-- /wp:unitone/decorator -->
		</div>
		<!-- /wp:unitone/layer -->
	</div>
	<!-- /wp:unitone/layers -->
</section>
<!-- /wp:unitone/decorator -->
