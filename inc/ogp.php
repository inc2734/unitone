<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

use Inc2734\WP_OGP;
use Unitone\App\Controller\Manager\Manager;

/**
 * Register meta.
 */
add_action(
	'init',
	function () {
		register_meta(
			'post',
			'unitone-ogp-image-id',
			array(
				'show_in_rest'  => true,
				'type'          => 'integer',
				'single'        => true,
				'auth_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}
);

/**
 * Output OGP tags
 */
function unitone_output_ogp_tags() {
	if ( ! apply_filters( 'unitone_output_ogp_tags', Manager::get_setting( 'output-ogp-tags' ) ) ) {
		return;
	}

	$ogp = new WP_OGP\Bootstrap();

	$ogp_image_url = '';
	if ( is_singular() ) {
		$ogp_image_id = get_post_meta( get_the_ID(), 'unitone-ogp-image-id', true );
		if ( $ogp_image_id ) {
			$ogp_image_url = wp_get_attachment_url( $ogp_image_id );
		}
	}

	$og_title       = $ogp->get_title();
	$og_type        = $ogp->get_type();
	$og_url         = $ogp->get_url();
	$og_image       = $ogp_image_url ? $ogp_image_url : $ogp->get_image();
	$og_site_name   = $ogp->get_site_name();
	$og_description = $ogp->get_description();
	$og_locale      = $ogp->get_locale();

	$twitter_site = Manager::get_setting( 'twitter-site' );
	$twitter_site = 0 !== strpos( $twitter_site, '@' ) ? '@' . $twitter_site : $twitter_site;
	?>
	<?php if ( $og_title ) : ?>
		<meta property="og:title" content="<?php echo esc_attr( wp_strip_all_tags( $og_title ) ); ?>">
	<?php endif; ?>

	<?php if ( $og_type ) : ?>
		<meta property="og:type" content="<?php echo esc_attr( $og_type ); ?>">
	<?php endif; ?>

	<?php if ( $og_url ) : ?>
		<meta property="og:url" content="<?php echo esc_attr( $og_url ); ?>">
	<?php endif; ?>

	<?php if ( $og_image ) : ?>
		<meta property="og:image" content="<?php echo esc_attr( $og_image ); ?>">
	<?php endif; ?>

	<?php if ( $og_site_name ) : ?>
		<meta property="og:site_name" content="<?php echo esc_attr( $og_site_name ); ?>">
	<?php endif; ?>

	<?php if ( $og_description ) : ?>
		<meta property="og:description" content="<?php echo esc_attr( wp_strip_all_tags( $og_description ) ); ?>">
	<?php endif; ?>

	<?php if ( $og_locale ) : ?>
		<meta property="og:locale" content="<?php echo esc_attr( $og_locale ); ?>">
	<?php endif; ?>

	<meta name="twitter:card" content="summary_large_image">

	<?php if ( $twitter_site ) : ?>
		<meta name="twitter:site" content="<?php echo esc_attr( $twitter_site ); ?>">
	<?php endif; ?>
	<?php
}
add_action( 'wp_head', 'unitone_output_ogp_tags' );

/**
 * Delete old generated featured images.
 *
 * @param int $post_id Post ID.
 */
function unitone_delete_old_generated_ogp_image( $post_id ) {
	$ogp_image_id = get_post_meta( $post_id, 'unitone-ogp-image-id', true );
	if ( ! $ogp_image_id ) {
		return;
	}

	$attachments = get_children(
		array(
			'post_parent' => $post_id,
			'post_type'   => 'attachment',
		)
	);

	$generated_ogp_image_ids = array();
	foreach ( $attachments as $attachment ) {
		if ( preg_match( '/^unitone-generated-ogp-image-(\d+)-(\d+)$/', $attachment->post_title ) ) {
			$generated_ogp_image_ids[] = $attachment->ID;
		}
	}

	if ( $generated_ogp_image_ids ) {
		rsort( $generated_ogp_image_ids );
		array_shift( $generated_ogp_image_ids );
		foreach ( $generated_ogp_image_ids as $attachment_id ) {
			wp_delete_attachment( $attachment_id, false );
		}
	}
}
add_action( 'wp_insert_post', 'unitone_delete_old_generated_ogp_image' );

/**
 * Add global variables.
 */
add_action(
	'unitone_enqueue_block_editor_assets',
	function () {
		wp_localize_script(
			'unitone/editor',
			'unitoneOGP',
			array(
				'outputOGPTags' => Manager::get_setting( 'output-ogp-tags' ),
			)
		);
	}
);
