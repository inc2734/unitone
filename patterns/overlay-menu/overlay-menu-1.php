<?php
/**
 * Title: Overlay Menu 1
 * Slug: unitone/overlay-menu/1
 * Categories: unitone-overlay-menus
 * Block Types: core/template-part/unitone/overlay-menu, core/template-part/navigation-overlay
 */
?>
<!-- wp:unitone/decorator {"fontSize":"unitone-m","unitone":{"position":{"position":"relative"},"overflow":"visible","minHeight":"full","alignContent":"stretch"}} -->
<div class="has-unitone-m-font-size" data-unitone-layout="decorator">
	<!-- wp:unitone/section {"tagName":"div","unitone":{"gap":"2","padding":"-1"}} -->
	<div class="unitone-section">
		<div data-unitone-layout="gutters">
			<div data-unitone-layout="container">
				<div data-unitone-layout="stack">
					<!-- wp:group {"className":"unitone-overlay-menu__close","layout":{"type":"flex","justifyContent":"right"}} -->
					<div class="wp-block-group unitone-overlay-menu__close">
						<!-- wp:navigation-overlay-close /-->
					</div>
					<!-- /wp:group -->

					<!-- wp:site-logo {"align":"center"} /-->

					<!-- wp:buttons {"style":{"spacing":{"blockGap":{"top":"var:preset|spacing|30"}}}} -->
					<div class="wp-block-buttons">
						<!-- wp:button {"backgroundColor":"unitone-bright-gray","textColor":"unitone-text-black","width":100,"style":{"elements":{"link":{"color":{"text":"var:preset|color|unitone-text-black"}}}}} -->
						<div class="wp-block-button has-custom-width wp-block-button__width-100"><a class="wp-block-button__link has-unitone-text-black-color has-unitone-bright-gray-background-color has-text-color has-background has-link-color wp-element-button">Home</a></div>
						<!-- /wp:button -->

						<!-- wp:button {"backgroundColor":"unitone-bright-gray","textColor":"unitone-text-black","width":100,"style":{"elements":{"link":{"color":{"text":"var:preset|color|unitone-text-black"}}}}} -->
						<div class="wp-block-button has-custom-width wp-block-button__width-100"><a class="wp-block-button__link has-unitone-text-black-color has-unitone-bright-gray-background-color has-text-color has-background has-link-color wp-element-button">About</a></div>
						<!-- /wp:button -->

						<!-- wp:button {"backgroundColor":"unitone-bright-gray","textColor":"unitone-text-black","width":100,"style":{"elements":{"link":{"color":{"text":"var:preset|color|unitone-text-black"}}}}} -->
						<div class="wp-block-button has-custom-width wp-block-button__width-100"><a class="wp-block-button__link has-unitone-text-black-color has-unitone-bright-gray-background-color has-text-color has-background has-link-color wp-element-button">Services</a></div>
						<!-- /wp:button -->

						<!-- wp:button {"backgroundColor":"unitone-bright-gray","textColor":"unitone-text-black","width":100,"style":{"elements":{"link":{"color":{"text":"var:preset|color|unitone-text-black"}}}}} -->
						<div class="wp-block-button has-custom-width wp-block-button__width-100"><a class="wp-block-button__link has-unitone-text-black-color has-unitone-bright-gray-background-color has-text-color has-background has-link-color wp-element-button">Contact</a></div>
						<!-- /wp:button -->
					</div>
					<!-- /wp:buttons -->

					<!-- wp:social-links {"align":"center"} -->
					<ul class="wp-block-social-links aligncenter">
						<!-- wp:social-link {"url":"#","service":"x"} /-->
						<!-- wp:social-link {"url":"#","service":"facebook"} /-->
					</ul>
					<!-- /wp:social-links -->
				</div>
			</div>
		</div>
	</div>
	<!-- /wp:unitone/section -->
</div>
<!-- /wp:unitone/decorator -->
