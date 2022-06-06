<?php
/**
 * Title: Section (Shifted background and image)
 * Slug: unitone/section/18
 * Categories: section
 * Block Types: unitone/decorator, unitone/gutters
 */
?>
<!-- wp:unitone/decorator {"position":"relative","align":"full"} -->
<div data-layout="decorator -position:relative" class="alignfull">
	<!-- wp:unitone/decorator {"position":"absolute","top":"0","right":"0","bottom":"0","left":"max((50% - var(--container-max-width) / 2 + var(--pg1)), var(--s1))","lock":{"move":true,"remove":true},"backgroundColor":"unitone/accent"} -->
	<div style="--top:0;--right:0;--bottom:0;--left:max((50% - var(--container-max-width) / 2 + var(--pg1)), var(--s1))" data-layout="decorator -position:absolute" class="has-unitone-accent-background-color has-background"></div>
	<!-- /wp:unitone/decorator -->

	<!-- wp:unitone/gutters {"lock":{"move":true,"remove":true},"unitone":{"padding":"2"}} -->
	<div data-layout="gutters -padding:2">
		<!-- wp:unitone/container {"lock":{"move":true,"remove":true}} -->
		<div data-layout="container">
			<!-- wp:unitone/stack {"lock":{"move":true,"remove":true},"unitone":{"gap":"2"}} -->
			<div data-layout="stack -gap:2">
				<!-- wp:unitone/container {"unitone":{"gutters":"0","maxWidth":"var(--pg11)","blockAlign":"start"}} -->
				<div data-layout="container -align:start -gutters:0" style="--max-width:var(--pg11)">
					<!-- wp:unitone/frame {"ratio":"16/9"} -->
					<div data-layout="frame" style="--ratio:16/9">
						<!-- wp:image {"id":1,"width":1920,"height":1280} -->
						<figure class="wp-block-image">
							<img src="<?php echo get_template_directory_uri(); ?>/dist/img/stocksnap_lgg8nat9jy.jpg" alt="" width="1920" height="1280" class="wp-image-1"/>
						</figure>
						<!-- /wp:image -->
					</div>
					<!-- /wp:unitone/frame -->
				</div>
				<!-- /wp:unitone/container -->

				<!-- wp:unitone/decorator {"textColor":"white","unitone":{"padding":"1"}} -->
				<div data-layout="decorator -padding:1" class="has-white-color has-text-color">
					<!-- wp:unitone/text -->
					<div data-layout="text">
						<!-- wp:paragraph -->
						<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
						<!-- /wp:paragraph -->
					</div>
					<!-- /wp:unitone/text -->
				</div>
				<!-- /wp:unitone/decorator -->
			</div>
			<!-- /wp:unitone/stack -->
		</div>
		<!-- /wp:unitone/container -->
	</div>
	<!-- /wp:unitone/gutters -->
</div>
<!-- /wp:unitone/decorator -->
