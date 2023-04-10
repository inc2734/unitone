<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

/**
 * Register blocks.
 */
function unitone_register_blocks() {
	register_block_type( get_template_directory() . '/dist/blocks/both-sides' );
	register_block_type( get_template_directory() . '/dist/blocks/both-sides-content' );
	register_block_type( get_template_directory() . '/dist/blocks/decorator' );
	register_block_type( get_template_directory() . '/dist/blocks/center' );
	register_block_type( get_template_directory() . '/dist/blocks/cluster' );
	register_block_type( get_template_directory() . '/dist/blocks/cluster-divided' );
	register_block_type( get_template_directory() . '/dist/blocks/cluster-divided-content' );
	register_block_type( get_template_directory() . '/dist/blocks/container' );
	register_block_type( get_template_directory() . '/dist/blocks/cover' );
	register_block_type( get_template_directory() . '/dist/blocks/cover-content' );
	register_block_type( get_template_directory() . '/dist/blocks/frame' );
	register_block_type( get_template_directory() . '/dist/blocks/layer' );
	register_block_type( get_template_directory() . '/dist/blocks/layers' );
	register_block_type( get_template_directory() . '/dist/blocks/reel' );
	register_block_type( get_template_directory() . '/dist/blocks/responsive-grid' );
	register_block_type( get_template_directory() . '/dist/blocks/responsive-grid-divided' );
	register_block_type( get_template_directory() . '/dist/blocks/responsive-grid-divided-content' );
	register_block_type( get_template_directory() . '/dist/blocks/slide' );
	register_block_type( get_template_directory() . '/dist/blocks/slider' );
	register_block_type( get_template_directory() . '/dist/blocks/gutters' );
	register_block_type( get_template_directory() . '/dist/blocks/pattern-inserter' );
	register_block_type( get_template_directory() . '/dist/blocks/stack' );
	register_block_type( get_template_directory() . '/dist/blocks/stack-divided' );
	register_block_type( get_template_directory() . '/dist/blocks/stack-divided-content' );
	register_block_type( get_template_directory() . '/dist/blocks/switcher' );
	register_block_type( get_template_directory() . '/dist/blocks/text' );
	register_block_type( get_template_directory() . '/dist/blocks/with-sidebar' );
	register_block_type( get_template_directory() . '/dist/blocks/with-sidebar-content' );

	register_block_type( get_template_directory() . '/dist/blocks/accordion' );
	register_block_type( get_template_directory() . '/dist/blocks/breadcrumbs' );
	register_block_type( get_template_directory() . '/dist/blocks/child-pages' );
	register_block_type( get_template_directory() . '/dist/blocks/section' );

	\WP_Block_Type_Registry::get_instance()->get_registered( 'unitone/child-pages' )->attributes['unitone'] = array( 'type' => 'object' );
}
add_action( 'init', 'unitone_register_blocks' );

/**
 * Correct the path in block.json in the theme, since the file will not be read correctly if editorScript is passed.
 */
add_filter(
	'plugins_url',
	function( $url, $path, $plugin ) {
		return preg_match( '|' . get_template_directory() . '/dist/blocks/[^\/]+/block.json' . '|', $plugin )
			? get_template_directory_uri() . str_replace( array( get_template_directory(), 'block.json' ), '', $plugin ) . $path
			: $url;
	},
	10,
	3
);

/**
 * Fix .wp-container-* class being added by itself in the query loop block.
 */
remove_filter( 'render_block', 'wp_render_layout_support_flag' );
add_filter(
	'render_block',
	function( $block_content, $block ) {
		if ( 0 === strpos( $block['blockName'], 'unitone/' ) ) {
			$block_content = preg_replace(
				'|(<[^>]+?data-unitone-layout[^>]+?)wp-container-\d+?([^>]+?>)|ms',
				'$1$2',
				$block_content
			);
			return $block_content;
		}
		return wp_render_layout_support_flag( $block_content, $block );
	},
	10,
	2
);

/**
 * If site-logo block is empty, display unitone logo.
 */
add_filter(
	'render_block',
	function( $block_content, $block ) {
		if ( 'core/site-logo' === $block['blockName'] && ! $block_content ) {
			if ( is_admin() ) {
				return $block_content;
			}

			$metadata                = wp_json_file_decode( ABSPATH . WPINC . '/blocks/site-logo/block.json', array( 'associative' => true ) );
			$set_default_custom_logo = function( $html ) {
				return '<a href="' . get_home_url() . '" rel="home"><img loading="lazy" width="141" height="20" src="' . get_theme_file_uri( 'dist/img/logo.svg' ) . '" class="custom-logo" alt="unitone"></a>';
			};

			$default_attributes = array();
			foreach ( $metadata['attributes'] as $key => $values ) {
				$default                    = isset( $values['default'] ) ? $values['default'] : null;
				$default_attributes[ $key ] = $default;
			}
			add_filter( 'get_custom_logo', $set_default_custom_logo );
			$attributes = array_merge( $default_attributes, $block['attrs'] );
			$html       = render_block_core_site_logo( $attributes );
			$html       = preg_replace( '|class="[^"]+"|ms', 'class="wp-block-site-logo"', $html );
			remove_filter( 'get_custom_logo', $set_default_custom_logo );
			return $html;
		}
		return $block_content;
	},
	10,
	2
);

/**
 * Hooks.
 */
add_filter(
	'render_block',
	function ( $block_content, $block ) {
		$p = new \WP_HTML_Tag_Processor( $block_content );
		$p->next_tag();

		// -fluid-typography
		if ( isset( $block['attrs']['unitone']['fluidTypography'] ) ) {
			$unitone_layout = $p->get_attribute( 'data-unitone-layout' );
			$attribute      = '-fluid-typography';
			if ( false === strpos( $unitone_layout, $attribute ) ) {
				$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
			}
		}

		// --unitone--half-leading
		if ( isset( $block['attrs']['unitone']['halfLeading'] ) ) {
			$style    = $p->get_attribute( 'style' );
			$property = '--unitone--half-leading:';
			if ( false === strpos( $style, $property ) ) {
				$style = $style ? $style . ';' : $style;
				$p->set_attribute( 'style', trim( $style . $property . $block['attrs']['unitone']['halfLeading'] ) );
			}
		}

		// -align-items
		if ( isset( $block['attrs']['unitone']['alignItems'] ) ) {
			$unitone_layout = $p->get_attribute( 'data-unitone-layout' );
			$attribute      = '-align-items:' . $block['attrs']['unitone']['alignItems'];
			if ( false === strpos( $unitone_layout, $attribute ) ) {
				$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
			}
		}

		// -auto-repeat
		if ( isset( $block['attrs']['unitone']['autoRepeat'] ) ) {
			$unitone_layout = $p->get_attribute( 'data-unitone-layout' );
			$attribute      = '-auto-repeat:' . $block['attrs']['unitone']['autoRepeat'];
			if ( false === strpos( $unitone_layout, $attribute ) ) {
				$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
			}
		}

		// -align
		if ( isset( $block['attrs']['unitone']['blockAlign'] ) ) {
			$unitone_layout = $p->get_attribute( 'data-unitone-layout' );
			$attribute      = '-align:' . $block['attrs']['unitone']['blockAlign'];
			if ( false === strpos( $unitone_layout, $attribute ) ) {
				$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
			}
		}

		// -divider
		if ( isset( $block['attrs']['unitone']['dividerType'] ) ) {
			$unitone_layout = $p->get_attribute( 'data-unitone-layout' );
			$attribute      = '-divider:' . $block['attrs']['unitone']['dividerType'];
			if ( false === strpos( $unitone_layout, $attribute ) ) {
				$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
			}
		}

		// --unitone--divier-color
		if (
			isset( $block['attrs']['unitone']['dividerColor'] ) ||
			isset( $block['attrs']['unitone']['divider']['color'] )
		) {
			$style    = $p->get_attribute( 'style' );
			$property = '--unitone--divider-color:';

			$preset_color = ! empty( $block['attrs']['unitone']['dividerColor'] )
				? 'var(--wp--preset--color--' . str_replace( '/', '-', $block['attrs']['unitone']['dividerColor'] ) . ')'
				: false;
			$color        = ! empty( $block['attrs']['unitone']['divider']['color'] )
				? $block['attrs']['unitone']['divider']['color']
				: false;

			if ( false === strpos( $style, $property ) ) {
				$style = $style ? $style . ';' : $style;
				$p->set_attribute( 'style', trim( $style . $property . ( $color ? $color : $preset_color ) ) );
			}
		}

		// --unitone--divider-style
		if ( isset( $block['attrs']['unitone']['divider']['style'] ) ) {
			$style    = $p->get_attribute( 'style' );
			$property = '--unitone--divider-style:';
			if ( false === strpos( $style, $property ) ) {
				$style = $style ? $style . ';' : $style;
				$p->set_attribute( 'style', trim( $style . $property . $block['attrs']['unitone']['divider']['style'] ) );
			}
		}

		// --unitone--divider-width
		if ( isset( $block['attrs']['unitone']['divider']['width'] ) ) {
			$style    = $p->get_attribute( 'style' );
			$property = '--unitone--divider-width:';
			if ( false === strpos( $style, $property ) ) {
				$style = $style ? $style . ';' : $style;
				$p->set_attribute( 'style', trim( $style . $property . $block['attrs']['unitone']['divider']['width'] ) );
			}
		}

		// -gap
		if ( isset( $block['attrs']['unitone']['gap'] ) ) {
			$unitone_layout = $p->get_attribute( 'data-unitone-layout' );
			$attribute      = '-gap:' . $block['attrs']['unitone']['gap'];
			if ( false === strpos( $unitone_layout, $attribute ) ) {
				$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
			}
		}

		// -gutters
		if ( isset( $block['attrs']['unitone']['gutters'] ) ) {
			$unitone_layout = $p->get_attribute( 'data-unitone-layout' );
			$attribute      = '-gutters:' . $block['attrs']['unitone']['gutters'];
			if ( false === strpos( $unitone_layout, $attribute ) ) {
				$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
			}
		}

		// -justify-content
		if ( isset( $block['attrs']['unitone']['justifyContent'] ) ) {
			$unitone_layout = $p->get_attribute( 'data-unitone-layout' );
			$attribute      = '-justify-content:' . $block['attrs']['unitone']['justifyContent'];
			if ( false === strpos( $unitone_layout, $attribute ) ) {
				$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
			}
		}

		// --unitone--max-width
		if ( isset( $block['attrs']['unitone']['maxWidth'] ) ) {
			$style    = $p->get_attribute( 'style' );
			$property = '--unitone--max-width:';
			if ( false === strpos( $style, $property ) ) {
				$style = $style ? $style . ';' : $style;
				$p->set_attribute( 'style', trim( $style . $property . $block['attrs']['unitone']['maxWidth'] ) );
			}
		}

		// --unitone--min-height
		if ( isset( $block['attrs']['unitone']['minHeight'] ) ) {
			$style    = $p->get_attribute( 'style' );
			$property = '--unitone--min-height:';
			if ( false === strpos( $style, $property ) ) {
				$style = $style ? $style . ';' : $style;
				$p->set_attribute( 'style', trim( $style . $property . $block['attrs']['unitone']['minHeight'] ) );
			}
		}

		// -negative
		if ( isset( $block['attrs']['unitone']['negative'] ) ) {
			$unitone_layout = $p->get_attribute( 'data-unitone-layout' );
			$attribute      = '-negative';
			if ( false === strpos( $unitone_layout, $attribute ) ) {
				$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
			}
		}

		// -overflow
		if ( isset( $block['attrs']['unitone']['overflow'] ) ) {
			$unitone_layout = $p->get_attribute( 'data-unitone-layout' );
			$attribute      = '-overflow:' . $block['attrs']['unitone']['overflow'];
			if ( false === strpos( $unitone_layout, $attribute ) ) {
				$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
			}
		}

		// -padding
		if ( isset( $block['attrs']['unitone']['padding'] ) ) {
			$unitone_layout = $p->get_attribute( 'data-unitone-layout' );
			$attribute      = '-padding:' . $block['attrs']['unitone']['padding'];
			if ( false === strpos( $unitone_layout, $attribute ) ) {
				$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
			}
		}

		// -position
		if ( isset( $block['attrs']['unitone']['position']['position'] ) ) {
			$unitone_layout = $p->get_attribute( 'data-unitone-layout' );
			$attribute      = '-position:' . $block['attrs']['unitone']['position']['position'];
			if ( false === strpos( $unitone_layout, $attribute ) ) {
				$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
			}
		}

		// --unitone--top
		if ( isset( $block['attrs']['unitone']['position']['top'] ) ) {
			$style    = $p->get_attribute( 'style' );
			$property = '--unitone--top:';
			if ( false === strpos( $style, $property ) ) {
				$style = $style ? $style . ';' : $style;
				$p->set_attribute( 'style', trim( $style . $property . $block['attrs']['unitone']['position']['top'] ) );
			}
		}

		// --unitone--right
		if ( isset( $block['attrs']['unitone']['position']['right'] ) ) {
			$style    = $p->get_attribute( 'style' );
			$property = '--unitone--right:';
			if ( false === strpos( $style, $property ) ) {
				$style = $style ? $style . ';' : $style;
				$p->set_attribute( 'style', trim( $style . $property . $block['attrs']['unitone']['position']['right'] ) );
			}
		}

		// --unitone--bottom
		if ( isset( $block['attrs']['unitone']['position']['bottom'] ) ) {
			$style    = $p->get_attribute( 'style' );
			$property = '--unitone--bottom:';
			if ( false === strpos( $style, $property ) ) {
				$style = $style ? $style . ';' : $style;
				$p->set_attribute( 'style', trim( $style . $property . $block['attrs']['unitone']['position']['bottom'] ) );
			}
		}

		// --unitone--left
		if ( isset( $block['attrs']['unitone']['position']['left'] ) ) {
			$style    = $p->get_attribute( 'style' );
			$property = '--unitone--left:';
			if ( false === strpos( $style, $property ) ) {
				$style = $style ? $style . ';' : $style;
				$p->set_attribute( 'style', trim( $style . $property . $block['attrs']['unitone']['position']['left'] ) );
			}
		}

		// --unitone--z-index
		if ( isset( $block['attrs']['unitone']['position']['zIndex'] ) ) {
			$style    = $p->get_attribute( 'style' );
			$property = '--unitone--z-index:';
			if ( false === strpos( $style, $property ) ) {
				$style = $style ? $style . ';' : $style;
				$p->set_attribute( 'style', trim( $style . $property . $block['attrs']['unitone']['position']['zIndex'] ) );
			}
		}

		// --unitone--flex-basis
		if ( isset( $block['attrs']['unitone']['flexBasis'] ) ) {
			$style    = $p->get_attribute( 'style' );
			$property = '--unitone--flex-basis:';
			if ( false === strpos( $style, $property ) ) {
				$style = $style ? $style . ';' : $style;
				$p->set_attribute( 'style', trim( $style . $property . $block['attrs']['unitone']['flexBasis'] ) );
			}
		}

		// -align-self
		if ( isset( $block['attrs']['unitone']['alignSelf'] ) ) {
			$unitone_layout = $p->get_attribute( 'data-unitone-layout' );
			$attribute      = '-align-self:' . $block['attrs']['unitone']['alignSelf'];
			if ( false === strpos( $unitone_layout, $attribute ) ) {
				$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
			}
		}

		// -justify-self
		if ( isset( $block['attrs']['unitone']['justifySelf'] ) ) {
			$unitone_layout = $p->get_attribute( 'data-unitone-layout' );
			$attribute      = '-justify-self:' . $block['attrs']['unitone']['justifySelf'];
			if ( false === strpos( $unitone_layout, $attribute ) ) {
				$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
			}
		}

		// --unitone--grid-column
		if ( isset( $block['attrs']['unitone']['gridColumn'] ) ) {
			$style    = $p->get_attribute( 'style' );
			$property = '--unitone--grid-column:';
			if ( false === strpos( $style, $property ) ) {
				$style = $style ? $style . ';' : $style;
				$p->set_attribute( 'style', trim( $style . $property . $block['attrs']['unitone']['gridColumn'] ) );
			}
		}

		// --unitone--grid-row
		if ( isset( $block['attrs']['unitone']['gridRow'] ) ) {
			$style    = $p->get_attribute( 'style' );
			$property = '--unitone--grid-row:';
			if ( false === strpos( $style, $property ) ) {
				$style = $style ? $style . ';' : $style;
				$p->set_attribute( 'style', trim( $style . $property . $block['attrs']['unitone']['gridRow'] ) );
			}
		}

		$block_content = $p->get_updated_html();
		return $block_content;
	},
	10,
	2
);

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
 * Fallback patch for unitone/cover.
 */
add_filter(
	'render_block_unitone/center',
	function( $block_content, $block ) {
		if ( ! isset( $block['attrs']['intrinsic'] ) && false === strpos( $block_content, '-intrinsic' ) ) {
			$p = new \WP_HTML_Tag_Processor( $block_content );
			$p->next_tag();
			$p->set_attribute( 'data-unitone-layout', $p->get_attribute( 'data-unitone-layout' ) . ' ' . '-intrinsic' );
			$block_content = $p->get_updated_html();
		}
		return $block_content;
	},
	10,
	2
);
