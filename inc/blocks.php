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
	register_block_type( get_template_directory() . '/dist/blocks/center' );
	register_block_type( get_template_directory() . '/dist/blocks/cluster' );
	register_block_type( get_template_directory() . '/dist/blocks/cluster-divided' );
	register_block_type( get_template_directory() . '/dist/blocks/cluster-divided-content' );
	register_block_type( get_template_directory() . '/dist/blocks/container' );
	register_block_type( get_template_directory() . '/dist/blocks/cover' );
	register_block_type( get_template_directory() . '/dist/blocks/cover-content' );
	register_block_type( get_template_directory() . '/dist/blocks/decorator' );
	register_block_type( get_template_directory() . '/dist/blocks/flex' );
	register_block_type( get_template_directory() . '/dist/blocks/frame' );
	register_block_type( get_template_directory() . '/dist/blocks/grid' );
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
	register_block_type( get_template_directory() . '/dist/blocks/vertical-writing' );
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

		$registry            = WP_Block_Type_Registry::get_instance();
		$metadata            = $registry->get_registered( $block['blockName'] );
		$metadata_attributes = $metadata ? $metadata->get_attributes() : false;

		// -fluid-typography
		if ( isset( $block['attrs']['unitone']['fluidTypography'] ) ) {
			$unitone_layout = $p->get_attribute( 'data-unitone-layout' );
			$attribute      = '-fluid-typography';
			if ( false === strpos( $unitone_layout, $attribute ) ) {
				$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
			}
		}

		// --unitone--half-leading
		if ( isset( $block['attrs']['unitone']['halfLeading'] ) && '' !== $block['attrs']['unitone']['halfLeading'] ) {
			$style    = $p->get_attribute( 'style' ) ?? '';
			$property = '--unitone--half-leading:';
			if ( false === strpos( $style, $property ) ) {
				$style = $style ? $style . ';' : $style;
				$p->set_attribute( 'style', trim( $style . $property . $block['attrs']['unitone']['halfLeading'] ) );
			}
		}

		// -align-items
		$default   = $metadata ? $metadata->get_attributes()['unitone']['default']['alignItems'] ?? null : null;
		$attribute = false;
		if ( isset( $block['attrs']['unitone']['alignItems'] ) && '' !== $block['attrs']['unitone']['alignItems'] ) {
			$attribute = '-align-items:' . $block['attrs']['unitone']['alignItems'];
		} elseif ( ! is_null( $default ) && ! isset( $block['attrs']['unitone']['alignItems'] ) ) {
			$attribute = '-align-items:' . $default;
		}
		if ( $attribute ) {
			$unitone_layout = $p->get_attribute( 'data-unitone-layout' );
			if ( false === strpos( $unitone_layout, $attribute ) ) {
				$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
			}
		}

		// -auto-repeat
		$default   = $metadata ? $metadata->get_attributes()['unitone']['default']['autoRepeat'] ?? null : null;
		$attribute = false;
		if ( isset( $block['attrs']['unitone']['autoRepeat'] ) && '' !== $block['attrs']['unitone']['autoRepeat'] ) {
			$attribute = '-auto-repeat:' . $block['attrs']['unitone']['autoRepeat'];
		} elseif ( ! is_null( $default ) && ! isset( $block['attrs']['unitone']['autoRepeat'] ) ) {
			$attribute = '-auto-repeat:' . $default;
		}
		if ( $attribute ) {
			$unitone_layout = $p->get_attribute( 'data-unitone-layout' );
			if ( false === strpos( $unitone_layout, $attribute ) ) {
				$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
			}
		}

		// -align
		$default   = $metadata ? $metadata->get_attributes()['unitone']['default']['blockAlign'] ?? null : null;
		$attribute = false;
		if ( isset( $block['attrs']['unitone']['blockAlign'] ) && '' !== $block['attrs']['unitone']['blockAlign'] ) {
			$attribute = '-align:' . $block['attrs']['unitone']['blockAlign'];
		} elseif ( ! is_null( $default ) && ! isset( $block['attrs']['unitone']['blockAlign'] ) ) {
			$attribute = '-align:' . $default;
		}
		if ( $attribute ) {
			$unitone_layout = $p->get_attribute( 'data-unitone-layout' );
			if ( false === strpos( $unitone_layout, $attribute ) ) {
				$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
			}
		}

		// -divider
		$default   = $metadata ? $metadata->get_attributes()['unitone']['default']['dividerType'] ?? null : null;
		$attribute = false;
		if ( isset( $block['attrs']['unitone']['dividerType'] ) && '' !== $block['attrs']['unitone']['dividerType'] ) {
			$attribute = '-divider:' . $block['attrs']['unitone']['dividerType'];
		} elseif ( ! is_null( $default ) && ! isset( $block['attrs']['unitone']['dividerType'] ) ) {
			$attribute = '-divider:' . $default;
		}
		if ( $attribute ) {
			$unitone_layout = $p->get_attribute( 'data-unitone-layout' );
			if ( false === strpos( $unitone_layout, $attribute ) ) {
				$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
			}
		}

		// --unitone--divier-color
		if (
			isset( $block['attrs']['unitone']['dividerColor'] ) && '' !== $block['attrs']['unitone']['dividerColor'] ||
			isset( $block['attrs']['unitone']['divider']['color'] ) && '' !== $block['attrs']['unitone']['divider']['color']
		) {
			$style    = $p->get_attribute( 'style' ) ?? '';
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
		if ( isset( $block['attrs']['unitone']['divider']['style'] ) && '' !== $block['attrs']['unitone']['divider']['style'] ) {
			$style    = $p->get_attribute( 'style' ) ?? '';
			$property = '--unitone--divider-style:';
			if ( false === strpos( $style, $property ) ) {
				$style = $style ? $style . ';' : $style;
				$p->set_attribute( 'style', trim( $style . $property . $block['attrs']['unitone']['divider']['style'] ) );
			}
		}

		// --unitone--divider-width
		if ( isset( $block['attrs']['unitone']['divider']['width'] ) && '' !== $block['attrs']['unitone']['divider']['width'] ) {
			$style    = $p->get_attribute( 'style' ) ?? '';
			$property = '--unitone--divider-width:';
			if ( false === strpos( $style, $property ) ) {
				$style = $style ? $style . ';' : $style;
				$p->set_attribute( 'style', trim( $style . $property . $block['attrs']['unitone']['divider']['width'] ) );
			}
		}

		// -gap
		$default   = $metadata ? $metadata->get_attributes()['unitone']['default']['gap'] ?? null : null;
		$attribute = false;
		if ( isset( $block['attrs']['unitone']['gap'] ) && '' !== $block['attrs']['unitone']['gap'] ) {
			$attribute = '-gap:' . $block['attrs']['unitone']['gap'];
		} elseif ( ! is_null( $default ) && ! isset( $block['attrs']['unitone']['gap'] ) ) {
			$attribute = '-gap:' . $default;
		}
		if ( $attribute ) {
			$unitone_layout = $p->get_attribute( 'data-unitone-layout' );
			if ( false === strpos( $unitone_layout, $attribute ) ) {
				$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
			}
		}

		// -gutters
		$default   = $metadata ? $metadata->get_attributes()['unitone']['default']['gutters'] ?? null : null;
		$attribute = false;
		if ( isset( $block['attrs']['unitone']['gutters'] ) && '' !== $block['attrs']['unitone']['gutters'] ) {
			$attribute = '-gutters:' . $block['attrs']['unitone']['gutters'];
		} elseif ( ! is_null( $default ) && ! isset( $block['attrs']['unitone']['gutters'] ) ) {
			$attribute = '-gutters:' . $default;
		}
		if ( $attribute ) {
			$unitone_layout = $p->get_attribute( 'data-unitone-layout' );
			if ( false === strpos( $unitone_layout, $attribute ) ) {
				$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
			}
		}

		// -justify-content
		$default   = $metadata ? $metadata->get_attributes()['unitone']['default']['justifyContent'] ?? null : null;
		$attribute = false;
		if ( isset( $block['attrs']['unitone']['justifyContent'] ) && '' !== $block['attrs']['unitone']['justifyContent'] ) {
			$attribute = '-justify-content:' . $block['attrs']['unitone']['justifyContent'];
		} elseif ( ! is_null( $default ) && ! isset( $block['attrs']['unitone']['justifyContent'] ) ) {
			$attribute = '-justify-content:' . $default;
		}
		if ( $attribute ) {
			$unitone_layout = $p->get_attribute( 'data-unitone-layout' );
			if ( false === strpos( $unitone_layout, $attribute ) ) {
				$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
			}
		}

		// --unitone--max-width
		$default  = $metadata ? $metadata->get_attributes()['unitone']['default']['maxWidth'] ?? null : null;
		$property = false;
		if ( isset( $block['attrs']['unitone']['maxWidth'] ) && '' !== $block['attrs']['unitone']['maxWidth'] ) {
			$property = '--unitone--max-width:' . $block['attrs']['unitone']['maxWidth'];
		} elseif ( ! is_null( $default ) && ! isset( $block['attrs']['unitone']['maxWidth'] ) ) {
			$property = '--unitone--max-width:' . $default;
		}
		if ( $property ) {
			$style = $p->get_attribute( 'style' );
			if ( false === strpos( $style, $property ) ) {
				$p->set_attribute( 'style', trim( $style . ' ' . $property ) );
			}
		}

		// --unitone--max-height
		$default  = $metadata ? $metadata->get_attributes()['unitone']['default']['maxHeight'] ?? null : null;
		$property = false;
		if ( isset( $block['attrs']['unitone']['maxHeight'] ) && '' !== $block['attrs']['unitone']['maxHeight'] ) {
			$property = '--unitone--max-height:' . $block['attrs']['unitone']['maxHeight'];
		} elseif ( ! is_null( $default ) && ! isset( $block['attrs']['unitone']['maxHeight'] ) ) {
			$property = '--unitone--max-height:' . $default;
		}
		if ( $property ) {
			$style = $p->get_attribute( 'style' );
			if ( false === strpos( $style, $property ) ) {
				$p->set_attribute( 'style', trim( $style . ' ' . $property ) );
			}
		}

		// --unitone--min-height
		$default  = $metadata ? $metadata->get_attributes()['unitone']['default']['minHeight'] ?? null : null;
		$property = false;
		if ( isset( $block['attrs']['unitone']['minHeight'] ) && '' !== $block['attrs']['unitone']['minHeight'] ) {
			$property = '--unitone--min-height:' . $block['attrs']['unitone']['minHeight'];
		} elseif ( ! is_null( $default ) && ! isset( $block['attrs']['unitone']['minHeight'] ) ) {
			$property = '--unitone--min-height:' . $default;
		}
		if ( $property ) {
			$style = $p->get_attribute( 'style' );
			if ( false === strpos( $style, $property ) ) {
				$p->set_attribute( 'style', trim( $style . ' ' . $property ) );
			}
		}

		// -negative
		$default   = $metadata ? $metadata->get_attributes()['unitone']['default']['negative'] ?? null : false;
		$attribute = false;
		if ( ! empty( $block['attrs']['unitone']['negative'] ) ) {
			$attribute = '-negative';
		} elseif ( ! is_null( $default ) && ! isset( $block['attrs']['unitone']['negative'] ) ) {
			$attribute = '-negative';
		}
		if ( $attribute ) {
			$unitone_layout = $p->get_attribute( 'data-unitone-layout' );
			if ( false === strpos( $unitone_layout, $attribute ) ) {
				$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
			}
		}

		// -overflow
		$default   = $metadata ? $metadata->get_attributes()['unitone']['default']['overflow'] ?? null : null;
		$attribute = false;
		if ( isset( $block['attrs']['unitone']['overflow'] ) && '' !== $block['attrs']['unitone']['overflow'] ) {
			$attribute = '-overflow:' . $block['attrs']['unitone']['overflow'];
		} elseif ( ! is_null( $default ) && ! isset( $block['attrs']['unitone']['overflow'] ) ) {
			$attribute = '-overflow:' . $default;
		}
		if ( $attribute ) {
			$unitone_layout = $p->get_attribute( 'data-unitone-layout' );
			if ( false === strpos( $unitone_layout, $attribute ) ) {
				$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
			}
		}

		// -padding
		$default   = $metadata ? $metadata->get_attributes()['unitone']['default']['padding'] ?? null : null;
		$attribute = false;
		if ( isset( $block['attrs']['unitone']['padding'] ) && '' !== $block['attrs']['unitone']['padding'] ) {
			$attribute = '-padding:' . $block['attrs']['unitone']['padding'];
		} elseif ( ! is_null( $default ) && ! isset( $block['attrs']['unitone']['padding'] ) ) {
			$attribute = '-padding:' . $default;
		}
		if ( $attribute ) {
			$unitone_layout = $p->get_attribute( 'data-unitone-layout' );
			if ( false === strpos( $unitone_layout, $attribute ) ) {
				$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
			}
		}

		// -position
		$default   = $metadata ? $metadata->get_attributes()['unitone']['default']['position']['position'] ?? null : null;
		$attribute = false;
		if ( isset( $block['attrs']['unitone']['position']['position'] ) && '' !== $block['attrs']['unitone']['position']['position'] ) {
			$attribute = '-position:' . $block['attrs']['unitone']['position']['position'];
		} elseif ( ! is_null( $default ) && ! isset( $block['attrs']['unitone']['position']['position'] ) ) {
			$attribute = '-position:' . $default;
		}
		if ( $attribute ) {
			$unitone_layout = $p->get_attribute( 'data-unitone-layout' );
			if ( false === strpos( $unitone_layout, $attribute ) ) {
				$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
			}
		}

		// --unitone--top
		$default  = $metadata ? $metadata->get_attributes()['unitone']['default']['position']['top'] ?? null : null;
		$property = false;
		if ( isset( $block['attrs']['unitone']['position']['top'] ) && '' !== $block['attrs']['unitone']['position']['top'] ) {
			$property = '--unitone--top:' . $block['attrs']['unitone']['position']['top'];
		} elseif ( ! is_null( $default ) && ! isset( $block['attrs']['unitone']['position']['top'] ) ) {
			$property = '--unitone--top:' . $default;
		}
		if ( $property ) {
			$style = $p->get_attribute( 'style' );
			if ( false === strpos( $style, $property ) ) {
				$p->set_attribute( 'style', trim( $style . ' ' . $property ) );
			}
		}

		// --unitone--right
		$default  = $metadata ? $metadata->get_attributes()['unitone']['default']['position']['right'] ?? null : null;
		$property = false;
		if ( isset( $block['attrs']['unitone']['position']['right'] ) && '' !== $block['attrs']['unitone']['position']['right'] ) {
			$property = '--unitone--right:' . $block['attrs']['unitone']['position']['right'];
		} elseif ( ! is_null( $default ) && ! isset( $block['attrs']['unitone']['position']['right'] ) ) {
			$property = '--unitone--right:' . $default;
		}
		if ( $property ) {
			$style = $p->get_attribute( 'style' );
			if ( false === strpos( $style, $property ) ) {
				$p->set_attribute( 'style', trim( $style . ' ' . $property ) );
			}
		}

		// --unitone--bottom
		$default  = $metadata ? $metadata->get_attributes()['unitone']['default']['position']['bottom'] ?? null : null;
		$property = false;
		if ( isset( $block['attrs']['unitone']['position']['bottom'] ) && '' !== $block['attrs']['unitone']['position']['bottom'] ) {
			$property = '--unitone--bottom:' . $block['attrs']['unitone']['position']['bottom'];
		} elseif ( ! is_null( $default ) && ! isset( $block['attrs']['unitone']['position']['bottom'] ) ) {
			$property = '--unitone--bottom:' . $default;
		}
		if ( $property ) {
			$style = $p->get_attribute( 'style' );
			if ( false === strpos( $style, $property ) ) {
				$p->set_attribute( 'style', trim( $style . ' ' . $property ) );
			}
		}

		// --unitone--left
		$default  = $metadata ? $metadata->get_attributes()['unitone']['default']['position']['left'] ?? null : null;
		$property = false;
		if ( isset( $block['attrs']['unitone']['position']['left'] ) && '' !== $block['attrs']['unitone']['position']['left'] ) {
			$property = '--unitone--left:' . $block['attrs']['unitone']['position']['left'];
		} elseif ( ! is_null( $default ) && ! isset( $block['attrs']['unitone']['position']['left'] ) ) {
			$property = '--unitone--left:' . $default;
		}
		if ( $property ) {
			$style = $p->get_attribute( 'style' );
			if ( false === strpos( $style, $property ) ) {
				$p->set_attribute( 'style', trim( $style . ' ' . $property ) );
			}
		}

		// --unitone--z-index
		$default  = $metadata ? $metadata->get_attributes()['unitone']['default']['position']['zIndex'] ?? null : null;
		$property = false;
		if ( isset( $block['attrs']['unitone']['position']['zIndex'] ) && '' !== $block['attrs']['unitone']['position']['zIndex'] ) {
			$property = '--unitone--z-index:' . $block['attrs']['unitone']['position']['zIndex'];
		} elseif ( ! is_null( $default ) && ! isset( $block['attrs']['unitone']['position']['zIndex'] ) ) {
			$property = '--unitone--z-index:' . $default;
		}
		if ( $property ) {
			$style = $p->get_attribute( 'style' );
			if ( false === strpos( $style, $property ) ) {
				$p->set_attribute( 'style', trim( $style . ' ' . $property ) );
			}
		}

		// --unitone--flex-grow
		$default  = $metadata ? $metadata->get_attributes()['unitone']['default']['flexGrow'] ?? null : null;
		$property = false;
		if ( isset( $block['attrs']['unitone']['flexGrow'] ) && '' !== $block['attrs']['unitone']['flexGrow'] ) {
			$property = '--unitone--flex-grow:' . $block['attrs']['unitone']['flexGrow'];
		} elseif ( ! is_null( $default ) && ! isset( $block['attrs']['unitone']['flexGrow'] ) ) {
			$property = '--unitone--flex-grow:' . $default;
		}
		if ( $property ) {
			$style = $p->get_attribute( 'style' );
			if ( false === strpos( $style, $property ) ) {
				$p->set_attribute( 'style', trim( $style . ' ' . $property ) );
			}
		}

		// --unitone--flex-shrink
		$default  = $metadata ? $metadata->get_attributes()['unitone']['default']['flexShrink'] ?? null : null;
		$property = false;
		if ( isset( $block['attrs']['unitone']['flexShrink'] ) && '' !== $block['attrs']['unitone']['flexShrink'] ) {
			$property = '--unitone--flex-shrink:' . $block['attrs']['unitone']['flexShrink'];
		} elseif ( ! is_null( $default ) && ! isset( $block['attrs']['unitone']['flexShrink'] ) ) {
			$property = '--unitone--flex-shrink:' . $default;
		}
		if ( $property ) {
			$style = $p->get_attribute( 'style' );
			if ( false === strpos( $style, $property ) ) {
				$p->set_attribute( 'style', trim( $style . ' ' . $property ) );
			}
		}

		// --unitone--flex-basis
		$default  = $metadata ? $metadata->get_attributes()['unitone']['default']['flexBasis'] ?? null : null;
		$property = false;
		if ( isset( $block['attrs']['unitone']['flexBasis'] ) && '' !== $block['attrs']['unitone']['flexBasis'] ) {
			$property = '--unitone--flex-basis:' . $block['attrs']['unitone']['flexBasis'];
		} elseif ( ! is_null( $default ) && ! isset( $block['attrs']['unitone']['flexBasis'] ) ) {
			$property = '--unitone--flex-basis:' . $default;
		}
		if ( $property ) {
			$style = $p->get_attribute( 'style' );
			if ( false === strpos( $style, $property ) ) {
				$p->set_attribute( 'style', trim( $style . ' ' . $property ) );
			}
		}

		// -align-self
		$default   = $metadata ? $metadata->get_attributes()['unitone']['default']['alignSelf'] ?? null : null;
		$attribute = false;
		if ( isset( $block['attrs']['unitone']['alignSelf'] ) && '' !== $block['attrs']['unitone']['alignSelf'] ) {
			$attribute = '-align-self:' . $block['attrs']['unitone']['alignSelf'];
		} elseif ( ! is_null( $default ) && ! isset( $block['attrs']['unitone']['alignSelf'] ) ) {
			$attribute = '-align-self:' . $default;
		}
		if ( $attribute ) {
			$unitone_layout = $p->get_attribute( 'data-unitone-layout' );
			if ( false === strpos( $unitone_layout, $attribute ) ) {
				$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
			}
		}

		// -justify-self
		$default   = $metadata ? $metadata->get_attributes()['unitone']['default']['justifySelf'] ?? null : null;
		$attribute = false;
		if ( isset( $block['attrs']['unitone']['justifySelf'] ) && '' !== $block['attrs']['unitone']['justifySelf'] ) {
			$attribute = '-justify-self:' . $block['attrs']['unitone']['justifySelf'];
		} elseif ( ! is_null( $default ) && ! isset( $block['attrs']['unitone']['justifySelf'] ) ) {
			$attribute = '-justify-self:' . $default;
		}
		if ( $attribute ) {
			$unitone_layout = $p->get_attribute( 'data-unitone-layout' );
			if ( false === strpos( $unitone_layout, $attribute ) ) {
				$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
			}
		}

		// --unitone--grid-column
		$default  = $metadata ? $metadata->get_attributes()['unitone']['default']['gridColumn'] ?? null : null;
		$property = false;
		if ( isset( $block['attrs']['unitone']['gridColumn'] ) && '' !== $block['attrs']['unitone']['gridColumn'] ) {
			$property = '--unitone--grid-column:' . $block['attrs']['unitone']['gridColumn'];
		} elseif ( ! is_null( $default ) && ! isset( $block['attrs']['unitone']['gridColumn'] ) ) {
			$property = '--unitone--grid-column:' . $default;
		}
		if ( $property ) {
			$style = $p->get_attribute( 'style' );
			if ( false === strpos( $style, $property ) ) {
				$p->set_attribute( 'style', trim( $style . ' ' . $property ) );
			}
		}

		// --unitone--grid-row
		$default  = $metadata ? $metadata->get_attributes()['unitone']['default']['gridRow'] ?? null : null;
		$property = false;
		if ( isset( $block['attrs']['unitone']['gridRow'] ) && '' !== $block['attrs']['unitone']['gridRow'] ) {
			$property = '--unitone--grid-row:' . $block['attrs']['unitone']['gridRow'];
		} elseif ( ! is_null( $default ) && ! isset( $block['attrs']['unitone']['gridRow'] ) ) {
			$property = '--unitone--grid-row:' . $default;
		}
		if ( $property ) {
			$style = $p->get_attribute( 'style' );
			if ( false === strpos( $style, $property ) ) {
				$p->set_attribute( 'style', trim( $style . ' ' . $property ) );
			}
		}

		// -text-orientation
		if ( isset( $block['attrs']['unitone']['textOrientation'] ) ) {
			$unitone_layout = $p->get_attribute( 'data-unitone-layout' );
			$attribute      = '-text-orientation:' . $block['attrs']['unitone']['textOrientation'];
			if ( false === strpos( $unitone_layout, $attribute ) ) {
				$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
			}
		}

		// -mix-blend-mode
		if ( isset( $block['attrs']['unitone']['mixBlendMode'] ) ) {
			$unitone_layout = $p->get_attribute( 'data-unitone-layout' );
			$attribute      = '-mix-blend-mode:' . $block['attrs']['unitone']['mixBlendMode'];
			if ( false === strpos( $unitone_layout, $attribute ) ) {
				$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
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

/**
 * Remove width/height of style attribute at core/image.
 */
add_filter(
	'render_block_core/image',
	function( $block_content, $block ) {
		$block_content = preg_replace( '|width:[\d]+px;height:[\d]+px|', '', $block_content );
		return $block_content;
	},
	10,
	2
);
