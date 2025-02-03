<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

/**
 * If site-logo block is empty, display unitone logo.
 *
 * @param string $block_content The block content.
 * @param array $block The full block, including name and attributes.
 * @return string
 */
function unitone_set_default_site_logo( $block_content, $block ) {
	if ( $block_content ) {
		return $block_content;
	}

	if ( is_admin() ) {
		return $block_content;
	}

	$metadata = wp_json_file_decode( ABSPATH . WPINC . '/blocks/site-logo/block.json', array( 'associative' => true ) );

	$set_default_custom_logo = function () {
		return '<a href="' . get_home_url() . '" rel="home"><img loading="lazy" width="141" height="20" src="' . get_theme_file_uri( 'dist/img/logo.svg' ) . '" class="custom-logo" alt="unitone"></a>';
	};

	$default_attributes = array();
	foreach ( $metadata['attributes'] as $key => $values ) {
		$default                    = isset( $values['default'] ) ? $values['default'] : null;
		$default_attributes[ $key ] = $default;
	}

	add_filter( 'get_custom_logo', $set_default_custom_logo );

	$attributes    = array_merge( $default_attributes, $block['attrs'] );
	$block_content = render_block_core_site_logo( $attributes );
	$block_content = preg_replace( '|class="[^"]+"|ms', 'class="wp-block-site-logo"', $block_content );

	remove_filter( 'get_custom_logo', $set_default_custom_logo );

	return $block_content;
}
add_filter( 'render_block_core/site-logo', 'unitone_set_default_site_logo', 10, 2 );

/**
 * A patch for `blocks.getSaveContent.extraProps`.
 * Changed not to use B because it sometimes causes variation errors (v4.3.3).
 * The effect of this patch is to compensate for the breakage of blocks that have already been applied.
 */
function unitone_patch_for_extraprops() {
	if ( ! current_user_can( 'edit_posts' ) ) {
		return;
	}

	$post_id = filter_input( INPUT_GET, 'post', FILTER_VALIDATE_INT, FILTER_SANITIZE_NUMBER_INT );
	if ( ! $post_id ) {
		return;
	}

	$_post = get_post( $post_id );

	$content = $_post->post_content;
	$content = preg_replace( '/ data-unitone-layout="-fluid-typography[^"]*?"/ms', '', $content );
	$content = preg_replace( '/ style="--unitone--half-leading:[^"]*?"/ms', '', $content );

	$_post->post_content = $content;
	wp_update_post( $_post, false, false );
}
add_action( 'load-post.php', 'unitone_patch_for_extraprops' );

/**
 * Remove width/height of style attribute at core/image.
 * For WordPress 6.3.0. Fixed in 6.3.1.
 *
 * @see https://github.com/WordPress/gutenberg/issues/53555
 */
add_filter(
	'render_block_core/image',
	function ( $block_content, $block ) {
		$attrs = $block['attrs'] ?? array();
		$w     = $attrs['width'] ?? '';
		$h     = $attrs['height'] ?? '';

		if ( $w && preg_match( '@^\d+@ms', $w ) && $h && preg_match( '@^\d+@ms', $h ) ) {
			$w             = str_replace( 'px', '', $w );
			$h             = str_replace( 'px', '', $h );
			$size_style    = "width:{$w}px;height:{$h}px";
			$ratio         = "{$w}/{$h}";
			$block_content = str_replace( $size_style, "aspect-ratio:{$ratio}", $block_content );
		}

		return $block_content;
	},
	10,
	2
);

/**
 * The HTML of the navigation block differs between the front page and the editor.
 * Match the front HTML to the editor.
 */
add_filter(
	'render_block_core/navigation',
	function ( $block_content, $block ) {
		$p = new \WP_HTML_Tag_Processor( $block_content );

		while (
			$p->next_tag(
				array(
					'class_name' => 'wp-block-navigation__container',
				)
			)
		) {
			$p->remove_class( 'wp-block-navigation' );
			$p->remove_class( 'is-style-default' );

			$class_names = ! empty( $block['className'] ) ? explode( ' ', $block['className'] ) : array();
			foreach ( $class_names as $class_name ) {
				$p->remove_class( $class_name );
			}
		}

		$block_content = $p->get_updated_html();

		return $block_content;
	},
	1000,
	2
);

/**
 * Add CSS vars to core/post-terms.
 */
add_filter(
	'render_block_core/post-terms',
	function ( $block_content, $block ) {
		$attrs      = $block['attrs'] ?? array();
		$class_name = $attrs['className'] ?? false;
		if (
			! $class_name ||
			( false === strpos( $class_name, 'is-style-badge' ) && false === strpos( $class_name, 'is-style-outline' ) )
		) {
			return $block_content;
		}

		$background_color       = $attrs['backgroundColor'] ?? false;
		$style_color_background = $attrs['style']['color']['background'] ?? false;

		$border_color              = $attrs['borderColor'] ?? false;
		$style_border_color        = $attrs['style']['border']['color'] ?? false;
		$style_border_top_color    = unitone_get_preset_css_var( $attrs['style']['border']['top']['color'] ?? false );
		$style_border_right_color  = unitone_get_preset_css_var( $attrs['style']['border']['right']['color'] ?? false );
		$style_border_bottom_color = unitone_get_preset_css_var( $attrs['style']['border']['bottom']['color'] ?? false );
		$style_border_left_color   = unitone_get_preset_css_var( $attrs['style']['border']['left']['color'] ?? false );

		$style_border_style        = $attrs['style']['border']['style'] ?? false;
		$style_border_top_style    = $attrs['style']['border']['top']['style'] ?? false;
		$style_border_right_style  = $attrs['style']['border']['right']['style'] ?? false;
		$style_border_bottom_style = $attrs['style']['border']['bottom']['style'] ?? false;
		$style_border_left_style   = $attrs['style']['border']['left']['style'] ?? false;

		$style_border_width        = $attrs['style']['border']['width'] ?? false;
		$style_border_top_width    = $attrs['style']['border']['top']['width'] ?? false;
		$style_border_right_width  = $attrs['style']['border']['right']['width'] ?? false;
		$style_border_bottom_width = $attrs['style']['border']['bottom']['width'] ?? false;
		$style_border_left_width   = $attrs['style']['border']['left']['width'] ?? false;

		$style_border_radius              = isset( $attrs['style']['border']['radius'] ) && ! is_array( $attrs['style']['border']['radius'] )
			? $attrs['style']['border']['radius']
			: false;
		$style_border_top_left_radius     = $attrs['style']['border']['radius']['topLeft'] ?? false;
		$style_border_top_right_radius    = $attrs['style']['border']['radius']['topRight'] ?? false;
		$style_border_bottom_left_radius  = $attrs['style']['border']['radius']['bottomLeft'] ?? false;
		$style_border_bottom_right_radius = $attrs['style']['border']['radius']['bottomRight'] ?? false;

		$p = new \WP_HTML_Tag_Processor( $block_content );

		if ( $p->next_tag() ) {
			$style = explode( ';', $p->get_attribute( 'style' ) ?? '' );

			$new_styles = array(
				'--unitone--post-term--background-color'   => (bool) $background_color
					? 'var(--wp--preset--color--' . $background_color . ')'
					: $style_color_background,
				'--unitone--post-term--border-color'       => (bool) $border_color
					? 'var(--wp--preset--color--' . $border_color . ')'
					: $style_border_color,
				'--unitone--post-term--border-top-color'   => $style_border_top_color,
				'--unitone--post-term--border-right-color' => $style_border_right_color,
				'--unitone--post-term--border-bottom-color' => $style_border_bottom_color,
				'--unitone--post-term--border-left-color'  => $style_border_left_color,
				'--unitone--post-term--border-style'       => $style_border_style,
				'--unitone--post-term--border-top-style'   => $style_border_top_style,
				'--unitone--post-term--border-right-style' => $style_border_right_style,
				'--unitone--post-term--border-bottom-style' => $style_border_bottom_style,
				'--unitone--post-term--border-left-style'  => $style_border_left_style,
				'--unitone--post-term--border-width'       => $style_border_width,
				'--unitone--post-term--border-top-width'   => $style_border_top_width,
				'--unitone--post-term--border-right-width' => $style_border_right_width,
				'--unitone--post-term--border-bottom-width' => $style_border_bottom_width,
				'--unitone--post-term--border-left-width'  => $style_border_left_width,
				'--unitone--post-term--border-radius'      => $style_border_radius,
				'--unitone--post-term--border-top-left-radius' => $style_border_top_left_radius,
				'--unitone--post-term--border-top-right-radius' => $style_border_top_right_radius,
				'--unitone--post-term--border-bottom-left-radius' => $style_border_bottom_left_radius,
				'--unitone--post-term--border-bottom-right-radius' => $style_border_bottom_right_radius,
			);

			$new_styles = array_filter(
				$new_styles,
				function ( $value ) {
					return false !== $value && ! is_null( $value ) && '' !== $value;
				}
			);

			foreach ( $new_styles as $new_style_key => $new_style_value ) {
				$style[] = sprintf( '%1$s: %2$s', $new_style_key, $new_style_value );
			}

			$p->set_attribute( 'style', trim( implode( ';', $style ) ) );
		}

		return $p->get_updated_html();
	},
	10,
	2
);

/**
 * Add "Outer block link" support to core/query.
 *
 * @param string $block_content The block content.
 * @param array $block The full block, including name and attributes.
 * @return string
 */
function unitone_apply_block_link( $block_content, $block ) {
	$attrs      = $block['attrs'] ?? array();
	$class_name = $attrs['className'] ?? false;
	if ( ! $class_name || ( false === strpos( $class_name, 'is-style-block-link' ) ) ) {
		return $block_content;
	}

	$is_outer_link = apply_filters( 'unitone_is_outer_block_link', false, $block_content, $block );
	if ( ! $is_outer_link ) {
		return $block_content;
	}

	$p = new \WP_HTML_Tag_Processor( $block_content );
	$p->next_tag();
	$p->set_attribute(
		'data-unitone-layout',
		implode(
			' ',
			array_filter(
				array(
					$p->get_attribute( 'data-unitone-layout' ),
					'-has-outer-block-link',
				)
			)
		)
	);

	return $p->get_updated_html();
}
add_filter( 'render_block_core/query', 'unitone_apply_block_link', 10, 2 );

/**
 * Add context of block link to core/post-template.
 *
 * @param array $context Default context.
 * @param array $parsed_block An associative array of the block being rendered. See WP_Block_Parser_Block.
 * @param WP_Block|null $parent_block If this is a nested block, a reference to the parent block.
 * @return array
 */
function unitone_add_block_link_context( $context, $parsed_block, $parent_block ) {
	if ( false === strpos( $parent_block->parsed_block['attrs']['className'] ?? '', 'is-style-block-link' ) ) {
		return $context;
	}

	$context['unitone'] = array_merge(
		$context['unitone'] ?? array(),
		array(
			'post-block-link' => true,
		)
	);

	return $context;
}
add_filter( 'render_block_context', 'unitone_add_block_link_context', 10, 3 );

/**
 * Disable links for block link.
 *
 * @param string $block_content The block content.
 * @param array $block The full block, including name and attributes.
 * @param WP_Block $instance The block instance.
 * @return string
 */
function unitone_disable_links_for_block_link( $block_content, $block, $instance ) {
	$context = $instance->context['unitone']['post-block-link'] ?? false;
	if ( ! $context ) {
		return $block_content;
	}
	return str_replace( array( '<a ', '</a>' ), array( '<span ', '</span>' ), $block_content );
}
add_filter( 'render_block_core/post-template', 'unitone_disable_links_for_block_link', 10, 3 );
