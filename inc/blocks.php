<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

/**
 * If site-logo block is empty, display unitone logo.
 *
 * @param string $html Custom logo HTML output.
 * @return string
 */
function unitone_set_default_site_logo( $html ) {
	if ( $html ) {
		return $html;
	}

	return sprintf(
		'<a href="%1$s" rel="home"><img loading="lazy" width="150" height="28" src="%2$s" class="custom-logo" alt="unitone"></a>',
		esc_url( get_home_url() ),
		esc_url( get_theme_file_uri( 'dist/img/logo.svg?v=2' ) )
	);
}
add_filter( 'get_custom_logo', 'unitone_set_default_site_logo' );

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
 * For WordPress 6.3.0.
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
			$w          = str_replace( 'px', '', $w );
			$h          = str_replace( 'px', '', $h );
			$size_style = "width:{$w}px;height:{$h}px";

			if ( false !== strpos( $block_content, $size_style ) ) {
				$ratio         = "{$w}/{$h}";
				$block_content = str_replace( "height:{$h}px", "aspect-ratio:{$ratio}", $block_content );
			}
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
 * Add CSS vars to core/navigation.
 */
add_filter(
	'render_block_core/navigation',
	function ( $block_content, $block ) {
		$attrs = $block['attrs'] ?? array();

		$hamburger_button_color                   = $attrs['unitone']['hamburgerButtonColor'] ?? false;
		$hamburger_button_custom_color            = $attrs['unitone']['hamburgerButtonCustomColor'] ?? false;
		$hamburger_button_background_color        = $attrs['unitone']['hamburgerButtonBackgroundColor'] ?? false;
		$hamburger_button_custom_background_color = $attrs['unitone']['hamburgerButtonCustomBackgroundColor'] ?? false;

		$overlay_menu_color                   = $attrs['unitone']['overlayMenuColor'] ?? false;
		$overlay_menu_custom_color            = $attrs['unitone']['overlayMenuCustomColor'] ?? false;
		$overlay_menu_background_color        = $attrs['unitone']['overlayMenuBackgroundColor'] ?? false;
		$overlay_menu_custom_background_color = $attrs['unitone']['overlayMenuCustomBackgroundColor'] ?? false;

		if (
			! $hamburger_button_color &&
			! $hamburger_button_custom_color &&
			! $hamburger_button_background_color &&
			! $hamburger_button_custom_background_color &&
			! $overlay_menu_color &&
			! $overlay_menu_custom_color &&
			! $overlay_menu_background_color &&
			! $overlay_menu_custom_background_color
		) {
			return $block_content;
		}

		$p = new \WP_HTML_Tag_Processor( $block_content );

		if ( $p->next_tag() ) {
			$hamburger_button_color            = $hamburger_button_color
				? 'var(--wp--preset--color--' . $hamburger_button_color . ')'
				: $hamburger_button_custom_color;
			$hamburger_button_background_color = $hamburger_button_background_color
				? 'var(--wp--preset--color--' . $hamburger_button_background_color . ')'
				: $hamburger_button_custom_background_color;

			$overlay_menu_color            = $overlay_menu_color
				? 'var(--wp--preset--color--' . $overlay_menu_color . ')'
				: $overlay_menu_custom_color;
			$overlay_menu_background_color = $overlay_menu_background_color
				? 'var(--wp--preset--color--' . $overlay_menu_background_color . ')'
				: $overlay_menu_custom_background_color;

			$classes = $p->get_attribute( 'class' );
			$classes = $classes ? explode( ' ', $classes ) : array();

			if ( $hamburger_button_color ) {
				$classes[] = 'has-hamburger-button-color';
			}
			if ( $hamburger_button_background_color ) {
				$classes[] = 'has-hamburger-button-background-color';
			}

			if ( $overlay_menu_color ) {
				$classes[] = 'has-overlay-menu-color';
			}
			if ( $overlay_menu_background_color ) {
				$classes[] = 'has-overlay-menu-background-color';
			}

			$p->set_attribute( 'class', trim( implode( ' ', $classes ) ) );

			$style = $p->get_attribute( 'style' );
			$style = $style ? explode( ';', $style ) : array();

			$new_styles = array(
				'--unitone--hamburger-button-color'        => $hamburger_button_color,
				'--unitone--hamburger-button-background-color' => $hamburger_button_background_color,
				'--unitone--overlay-menu-color'            => $overlay_menu_color,
				'--unitone--overlay-menu-background-color' => $overlay_menu_background_color,
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
 * Replace overlay menu to template part.
 *
 * Starting with WordPress 7.0, the core mobile overlay has been implemented,
 * so disable the core mobile overlay if it is in use.
 */
add_filter(
	'render_block_core/navigation',
	function ( $block_content, $block ) {
		// Core Mobile Overlay Enabled.
		if ( ! empty( $block['attrs']['overlay'] ) ) {
			return $block_content;
		}

		if ( ! ( $block['attrs']['unitone']['replaceOverlayMenu'] ?? false ) ) {
			return $block_content;
		}

		$slug = $block['attrs']['unitone']['overlayMenuSlug'] ?? 'overlay-menu';

		$responsive_container_pattern = '/<div[^>]+?class="[^"]*wp-block-navigation__responsive-container-content[^"]*"[^>]*?>/';

		if ( ! preg_match( $responsive_container_pattern, $block_content ) ) {
			return $block_content;
		}

		ob_start();
		block_template_part( $slug );
		$mobile_menu_content = ob_get_clean();

		if ( empty( $mobile_menu_content ) ) {
			return $block_content;
		}

		$mobile_menu_html = sprintf(
			'<div class="unitone-overlay-menu">%s</div>',
			$mobile_menu_content
		);

		return preg_replace(
			$responsive_container_pattern,
			'$0' . $mobile_menu_html,
			$block_content,
			1
		);
	},
	10,
	2
);

/**
 * Returns the unitone CSS variable breakpoint for a WordPress viewport state.
 *
 * @param string $breakpoint WordPress responsive style-state name.
 * @return string CSS variable breakpoint.
 */
function unitone_get_css_var_breakpoint( $breakpoint ) {
	$css_var_breakpoints = array(
		'@tablet' => 'md',
		'@mobile' => 'sm',
	);

	return $css_var_breakpoints[ $breakpoint ] ?? ltrim( $breakpoint, '@' );
}

/**
 * Returns CSS vars used to move block styles to an inner element.
 *
 * @param array       $style              Block style object.
 * @param string      $css_var_prefix     CSS variable prefix after `--unitone--`.
 * @param string|null $css_var_breakpoint Responsive CSS variable breakpoint.
 * @return array CSS variables and values.
 */
function unitone_get_border_css_vars( $style, $css_var_prefix, $css_var_breakpoint = null ) {
	$style           = is_array( $style ) ? $style : array();
	$border          = is_array( $style['border'] ?? null ) ? $style['border'] : array();
	$border_radius   = $border['radius'] ?? null;
	$variable_prefix = '--unitone--' . ( $css_var_breakpoint ? $css_var_breakpoint . '-' : '' ) . $css_var_prefix . '--';

	$css_vars = array(
		$variable_prefix . 'background-color'           => unitone_get_preset_css_var( $style['color']['background'] ?? null ),
		$variable_prefix . 'border-color'               => unitone_get_preset_css_var( $border['color'] ?? null ),
		$variable_prefix . 'border-top-color'           => unitone_get_preset_css_var( $border['top']['color'] ?? null ),
		$variable_prefix . 'border-right-color'         => unitone_get_preset_css_var( $border['right']['color'] ?? null ),
		$variable_prefix . 'border-bottom-color'        => unitone_get_preset_css_var( $border['bottom']['color'] ?? null ),
		$variable_prefix . 'border-left-color'          => unitone_get_preset_css_var( $border['left']['color'] ?? null ),
		$variable_prefix . 'border-style'               => $border['style'] ?? null,
		$variable_prefix . 'border-top-style'           => $border['top']['style'] ?? null,
		$variable_prefix . 'border-right-style'         => $border['right']['style'] ?? null,
		$variable_prefix . 'border-bottom-style'        => $border['bottom']['style'] ?? null,
		$variable_prefix . 'border-left-style'          => $border['left']['style'] ?? null,
		$variable_prefix . 'border-width'               => unitone_get_preset_css_var( $border['width'] ?? null ),
		$variable_prefix . 'border-top-width'           => unitone_get_preset_css_var( $border['top']['width'] ?? null ),
		$variable_prefix . 'border-right-width'         => unitone_get_preset_css_var( $border['right']['width'] ?? null ),
		$variable_prefix . 'border-bottom-width'        => unitone_get_preset_css_var( $border['bottom']['width'] ?? null ),
		$variable_prefix . 'border-left-width'          => unitone_get_preset_css_var( $border['left']['width'] ?? null ),
		$variable_prefix . 'border-radius'              => ! is_array( $border_radius )
			? unitone_get_preset_css_var( $border_radius )
			: null,
		$variable_prefix . 'border-top-left-radius'     => unitone_get_preset_css_var( $border_radius['topLeft'] ?? null ),
		$variable_prefix . 'border-top-right-radius'    => unitone_get_preset_css_var( $border_radius['topRight'] ?? null ),
		$variable_prefix . 'border-bottom-left-radius'  => unitone_get_preset_css_var( $border_radius['bottomLeft'] ?? null ),
		$variable_prefix . 'border-bottom-right-radius' => unitone_get_preset_css_var( $border_radius['bottomRight'] ?? null ),
	);

	return array_filter(
		$css_vars,
		static function ( $value ) {
			return false !== $value && null !== $value && '' !== $value;
		}
	);
}

/**
 * Returns responsive CSS that applies inner element style variables.
 *
 * @param string $identifier       Block instance CSS class.
 * @param string $block_selector   Block root selector.
 * @param string $inner_selector   Inner element selector.
 * @param string $css_var_prefix   CSS variable prefix after `--unitone--`.
 * @param array  $responsive_styles Responsive styles keyed by style-state name.
 * @return string Responsive CSS.
 */
function unitone_get_responsive_border_css( $identifier, $block_selector, $inner_selector, $css_var_prefix, $responsive_styles ) {
	$property_fallbacks = array(
		'background-color'           => array( 'background-color' ),
		'border-top-color'           => array( 'border-top-color', 'border-color' ),
		'border-right-color'         => array( 'border-right-color', 'border-color' ),
		'border-bottom-color'        => array( 'border-bottom-color', 'border-color' ),
		'border-left-color'          => array( 'border-left-color', 'border-color' ),
		'border-top-style'           => array( 'border-top-style', 'border-style' ),
		'border-right-style'         => array( 'border-right-style', 'border-style' ),
		'border-bottom-style'        => array( 'border-bottom-style', 'border-style' ),
		'border-left-style'          => array( 'border-left-style', 'border-style' ),
		'border-top-width'           => array( 'border-top-width', 'border-width' ),
		'border-right-width'         => array( 'border-right-width', 'border-width' ),
		'border-bottom-width'        => array( 'border-bottom-width', 'border-width' ),
		'border-left-width'          => array( 'border-left-width', 'border-width' ),
		'border-top-left-radius'     => array( 'border-top-left-radius', 'border-radius' ),
		'border-top-right-radius'    => array( 'border-top-right-radius', 'border-radius' ),
		'border-bottom-right-radius' => array( 'border-bottom-right-radius', 'border-radius' ),
		'border-bottom-left-radius'  => array( 'border-bottom-left-radius', 'border-radius' ),
	);

	$media_queries   = unitone_get_viewport_media_queries();
	$scoped_selector = $block_selector . '.' . $identifier;
	$css             = '';

	foreach ( $responsive_styles as $breakpoint => $style_vars ) {
		if ( empty( $style_vars ) || empty( $media_queries[ $breakpoint ] ) ) {
			continue;
		}

		$css_var_breakpoint = unitone_get_css_var_breakpoint( $breakpoint );
		$declarations       = '';

		foreach ( $property_fallbacks as $property => $fallbacks ) {
			$value = 'var(--unitone--' . $css_var_prefix . '--' . $fallbacks[0] . ')';

			foreach ( array_reverse( $fallbacks ) as $fallback ) {
				$value = 'var(--unitone--' . $css_var_breakpoint . '-' . $css_var_prefix . '--' . $fallback . ', ' . $value . ')';
			}

			$declarations .= $property . ':' . $value . ';';
		}

		$css .= $media_queries[ $breakpoint ]
			. '{'
			. $scoped_selector . ' ' . $inner_selector . '{' . $declarations . '}'
			. '}';
	}

	return $css;
}

/**
 * Adds CSS vars and responsive inner element styles to a core block.
 *
 * @param string $block_content Block HTML.
 * @param array  $block         Parsed block.
 * @param array  $args          Block selectors and CSS variable prefix.
 * @return string Updated block HTML.
 */
function unitone_add_border_css_vars( $block_content, $block, $args ) {
	$attrs      = $block['attrs'] ?? array();
	$class_name = $attrs['className'] ?? false;

	if (
		! $class_name ||
		( false === strpos( $class_name, 'is-style-badge' ) && false === strpos( $class_name, 'is-style-outline' ) )
	) {
		return $block_content;
	}

	$style      = is_array( $attrs['style'] ?? null ) ? $attrs['style'] : array();
	$new_styles = unitone_get_border_css_vars( $style, $args['css_var_prefix'] );

	if ( ! empty( $attrs['backgroundColor'] ) ) {
		$new_styles[ '--unitone--' . $args['css_var_prefix'] . '--background-color' ] = 'var(--wp--preset--color--' . $attrs['backgroundColor'] . ')';
	}

	if ( ! empty( $attrs['borderColor'] ) ) {
		$new_styles[ '--unitone--' . $args['css_var_prefix'] . '--border-color' ] = 'var(--wp--preset--color--' . $attrs['borderColor'] . ')';
	}

	$responsive_styles = array();
	foreach ( array_keys( unitone_get_viewport_media_queries() ) as $breakpoint ) {
		$viewport_style = unitone_get_border_css_vars(
			$style[ $breakpoint ] ?? array(),
			$args['css_var_prefix'],
			unitone_get_css_var_breakpoint( $breakpoint )
		);

		if ( empty( $viewport_style ) ) {
			continue;
		}

		$responsive_styles[ $breakpoint ] = $viewport_style;
		$new_styles                       = array_merge( $new_styles, $viewport_style );
	}

	$p = new \WP_HTML_Tag_Processor( $block_content );
	if ( ! $p->next_tag() ) {
		return $block_content;
	}

	$current_style = $p->get_attribute( 'style' );
	$current_style = $current_style ? explode( ';', $current_style ) : array();
	foreach ( $new_styles as $new_style_key => $new_style_value ) {
		$current_style[] = sprintf( '%1$s: %2$s', $new_style_key, $new_style_value );
	}
	$p->set_attribute( 'style', trim( implode( ';', $current_style ) ) );

	if ( ! empty( $responsive_styles ) ) {
		$identifier     = wp_unique_id_from_values( $block, 'unitone-responsive-style-' );
		$responsive_css = unitone_get_responsive_border_css(
			$identifier,
			$args['block_selector'],
			$args['inner_selector'],
			$args['css_var_prefix'],
			$responsive_styles
		);

		if ( $responsive_css ) {
			$p->add_class( $identifier );

			add_action(
				'wp_enqueue_scripts',
				static function () use ( $responsive_css ) {
					wp_add_inline_style( 'global-styles', $responsive_css );
				}
			);
		}
	}

	return $p->get_updated_html();
}

/**
 * Add CSS vars to core/post-terms.
 */
add_filter(
	'render_block_core/post-terms',
	static function ( $block_content, $block ) {
		return unitone_add_border_css_vars(
			$block_content,
			$block,
			array(
				'block_selector' => '.wp-block-post-terms',
				'inner_selector' => ':is(a:where(:not(.wp-element-button)),span:where(:not([class]):not([data-rich-text-placeholder])))',
				'css_var_prefix' => 'post-term',
			)
		);
	},
	10,
	2
);

/**
 * Add CSS vars to core/tag-cloud.
 */
add_filter(
	'render_block_core/tag-cloud',
	static function ( $block_content, $block ) {
		return unitone_add_border_css_vars(
			$block_content,
			$block,
			array(
				'block_selector' => '.wp-block-tag-cloud',
				'inner_selector' => 'a.tag-cloud-link',
				'css_var_prefix' => 'tag-cloud',
			)
		);
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
	$block_link = $attrs['unitone']['blockLink'] ?? false;
	$class_name = $attrs['className'] ?? false;
	if ( ! $block_link && ( ! $class_name || ( false === strpos( $class_name, 'is-style-block-link' ) ) ) ) {
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
					'-block-link',
				)
			)
		)
	);
	$block_content = $p->get_updated_html();

	$is_outer_link = apply_filters( 'unitone_is_outer_block_link', false, $block_content, $block );
	if ( ! $is_outer_link ) {
		return $block_content;
	}

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
 * Apply media link to core/image custom links.
 *
 * @param string $block_content The block content.
 * @param array  $block The full block, including name and attributes.
 * @return string
 */
function unitone_apply_media_link( $block_content, $block ) {
	$block_name     = $block['blockName'] ?? '';
	$attrs          = $block['attrs'] ?? array();
	$unitone        = $attrs['unitone'] ?? array();
	$link_type      = $attrs['linkDestination'] ?? '';
	$use_media_link = ! empty( $unitone['mediaLink'] );

	if ( ! $use_media_link ) {
		return $block_content;
	}

	if ( 'core/image' !== $block_name && 'core/button' !== $block_name ) {
		return $block_content;
	}

	if ( in_array( $link_type, array( 'media', 'attachment', 'none' ), true ) ) {
		return $block_content;
	}

	$p = new \WP_HTML_Tag_Processor( $block_content );

	while ( $p->next_tag( array( 'tag_name' => 'a' ) ) ) {
		$link_url = $p->get_attribute( 'href' );
		if ( empty( $link_url ) ) {
			return $block_content;
		}

		$class_attribute = $p->get_attribute( 'class' ) ?? '';
		if ( false === strpos( ' ' . $class_attribute . ' ', ' unitone-media-link ' ) ) {
			$p->set_attribute(
				'class',
				trim( $class_attribute . ' unitone-media-link' )
			);
		}

		$p->set_attribute( 'data-unitone-media-type', 'embed' );
		if ( 0 === strpos( $link_url, '#' ) ) {
			$target_id = ltrim( $link_url, '#' );

			if ( '' !== $target_id ) {
				$p->set_attribute( 'data-unitone-media-type', 'target' );
				$p->set_attribute( 'data-unitone-overlay-target', $target_id );
			}
		}

		return $p->get_updated_html();
	}

	return $block_content;
}
add_filter( 'render_block_core/image', 'unitone_apply_media_link', 10, 2 );
add_filter( 'render_block_core/button', 'unitone_apply_media_link', 10, 2 );

/**
 * Add CSS vars to core/table.
 */
add_filter(
	'render_block_core/table',
	function ( $block_content, $block ) {
		$attrs = $block['attrs'] ?? array();

		$header_section_color                   = $attrs['unitone']['headerSectionColor'] ?? false;
		$header_section_custom_color            = $attrs['unitone']['headerSectionCustomColor'] ?? false;
		$header_section_background_color        = $attrs['unitone']['headerSectionBackgroundColor'] ?? false;
		$header_section_custom_background_color = $attrs['unitone']['headerSectionCustomBackgroundColor'] ?? false;

		$footer_section_color                   = $attrs['unitone']['footerSectionColor'] ?? false;
		$footer_section_custom_color            = $attrs['unitone']['footerSectionCustomColor'] ?? false;
		$footer_section_background_color        = $attrs['unitone']['footerSectionBackgroundColor'] ?? false;
		$footer_section_custom_background_color = $attrs['unitone']['footerSectionCustomBackgroundColor'] ?? false;

		if (
			! $header_section_color &&
			! $header_section_custom_color &&
			! $header_section_background_color &&
			! $header_section_custom_background_color &&
			! $footer_section_color &&
			! $footer_section_custom_color &&
			! $footer_section_background_color &&
			! $footer_section_custom_background_color
		) {
			return $block_content;
		}

		$p = new \WP_HTML_Tag_Processor( $block_content );

		if ( $p->next_tag() ) {
			$header_section_color            = $header_section_color
				? 'var(--wp--preset--color--' . $header_section_color . ')'
				: $header_section_custom_color;
			$header_section_background_color = $header_section_background_color
				? 'var(--wp--preset--color--' . $header_section_background_color . ')'
				: $header_section_custom_background_color;

			$footer_section_color            = $footer_section_color
				? 'var(--wp--preset--color--' . $footer_section_color . ')'
				: $footer_section_custom_color;
			$footer_section_background_color = $footer_section_background_color
				? 'var(--wp--preset--color--' . $footer_section_background_color . ')'
				: $footer_section_custom_background_color;

			$classes = $p->get_attribute( 'class' );
			$classes = $classes ? explode( ' ', $classes ) : array();

			if ( $header_section_color ) {
				$classes[] = 'has-header-section-color';
			}
			if ( $header_section_background_color ) {
				$classes[] = 'has-header-section-background-color';
			}

			if ( $footer_section_color ) {
				$classes[] = 'has-footer-section-color';
			}
			if ( $footer_section_background_color ) {
				$classes[] = 'has-footer-section-background-color';
			}

			$p->set_attribute( 'class', trim( implode( ' ', $classes ) ) );

			$style = $p->get_attribute( 'style' );
			$style = $style ? explode( ';', $style ) : array();

			$new_styles = array(
				'--unitone--header-section-color' => $header_section_color,
				'--unitone--header-section-background-color' => $header_section_background_color,
				'--unitone--footer-section-color' => $footer_section_color,
				'--unitone--footer-section-background-color' => $footer_section_background_color,
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
