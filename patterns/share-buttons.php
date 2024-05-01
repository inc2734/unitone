<?php
/**
 * Title: Share buttons
 * Slug: unitone/share-buttons
 * Categories: unitone-others
 */
?>
<!-- wp:buttons {"style":{"spacing":{"blockGap":"var:preset|spacing|20"}}} -->
<div class="wp-block-buttons">
	<!-- wp:button {"backgroundColor":"black","textColor":"white","metadata":{"bindings":{"url":{"source":"unitone/share-button","args":{"key":"x"}}}},"fontSize":"unitone-xs","unitone":{"halfLeading":0,"padding":"-1"}} -->
	<div class="wp-block-button has-custom-font-size has-unitone-xs-font-size"><a class="wp-block-button__link has-white-color has-black-background-color has-text-color has-background wp-element-button" title="<?php esc_attr_e( 'Post this entry to X', 'unitone' ); ?>" target="_blank" rel="nofollow noopener"><strong>X</strong></a></div>
	<!-- /wp:button -->

	<!-- wp:button {"textColor":"white","metadata":{"bindings":{"url":{"source":"unitone/share-button","args":{"key":"facebook"}}}},"style":{"color":{"background":"#0965fe"}},"fontSize":"unitone-xs","unitone":{"halfLeading":0,"padding":"-1"}} -->
	<div class="wp-block-button has-custom-font-size has-unitone-xs-font-size"><a class="wp-block-button__link has-white-color has-text-color has-background wp-element-button" title="<?php esc_attr_e( 'Share this entry to Facebook', 'unitone' ); ?>" style="background-color:#0965fe" target="_blank" rel="nofollow noopener"><strong>Facebook</strong></a></div>
	<!-- /wp:button -->

	<!-- wp:button {"textColor":"white","metadata":{"bindings":{"url":{"source":"unitone/share-button","args":{"key":"hatena"}}}},"style":{"color":{"background":"#01a4de"}},"fontSize":"unitone-xs","unitone":{"halfLeading":0,"padding":"-1"}} -->
	<div class="wp-block-button has-custom-font-size has-unitone-xs-font-size"><a class="wp-block-button__link has-white-color has-text-color has-background wp-element-button" title="<?php esc_attr_e( 'Add this entry to Hatena Bookmarks', 'unitone' ); ?>" style="background-color:#01a4de" target="_blank" rel="nofollow noopener"><strong>B! ブックマーク</strong></a></div>
	<!-- /wp:button -->

	<!-- wp:button {"textColor":"white","metadata":{"bindings":{"url":{"source":"unitone/share-button","args":{"key":"line"}}}},"style":{"color":{"background":"#06c755"}},"fontSize":"unitone-xs","unitone":{"halfLeading":0,"padding":"-1"}} -->
	<div class="wp-block-button has-custom-font-size has-unitone-xs-font-size"><a class="wp-block-button__link has-white-color has-text-color has-background wp-element-button" title="<?php esc_attr_e( 'Share this entry to LINE', 'unitone' ); ?>" style="background-color:#06c755" target="_blank" rel="nofollow noopener"><strong>LINE</strong></a></div>
	<!-- /wp:button -->
</div>
<!-- /wp:buttons -->
