<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

use Unitone\App\Controller\Manager\Manager;

/**
 * The loading animation will be displayed according to the settings on the setup screen.
 */
function unitone_display_loading_animation() {
	$template_part = Manager::get_setting( 'loading-animation' );
	if ( ! $template_part ) {
		return;
	}
	?>
	<div class="unitone-loading-animation" aria-hidden="false">
		<?php block_template_part( $template_part ); ?>
	</div>
	<?php
}
add_action( 'wp_body_open', 'unitone_display_loading_animation' );
