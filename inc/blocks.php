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

	if ( ! is_null( \WP_Block_Type_Registry::get_instance()->get_registered( 'unitone/breadcrumbs' ) ) ) {
		\WP_Block_Type_Registry::get_instance()->get_registered( 'unitone/breadcrumbs' )->attributes['unitone'] = array(
			'type' => 'object',
		);
	}

	if ( ! is_null( \WP_Block_Type_Registry::get_instance()->get_registered( 'unitone/child-pages' ) ) ) {
		\WP_Block_Type_Registry::get_instance()->get_registered( 'unitone/child-pages' )->attributes['unitone'] = array(
			'type' => 'object',
		);
	}
}
add_action( 'init', 'unitone_register_blocks' );

/**
 * Correct the path in block.json in the theme, since the file will not be read correctly if editorScript is passed.
 */
add_filter(
	'plugins_url',
	function ( $url, $path, $plugin ) {
		return preg_match( '|' . get_template_directory() . '/dist/blocks/[^\/]+/block.json|', $plugin )
			? get_template_directory_uri() . str_replace( array( get_template_directory(), 'block.json' ), '', $plugin ) . $path
			: $url;
	},
	10,
	3
);

/**
 * Add support "autoPhrase" to core blocks.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_auto_phrase_support( $metadata ) {
	if ( ! in_array( $metadata['name'], array( 'core/paragraph', 'core/heading', 'core/list-item' ), true ) ) {
		return $metadata;
	}

	$metadata['supports'] = array_merge(
		$metadata['supports'],
		array(
			'unitone' => array_merge(
				$metadata['supports']['unitone'] ?? array(),
				array(
					'autoPhrase' => true,
				)
			),
		)
	);
	return $metadata;
}
add_filter( 'block_type_metadata', 'unitone_add_auto_phrase_support' );

/**
 * Add support "fluidTypography" to core blocks with typography.fontSize.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_fluid_typography_support( $metadata ) {
	if ( false === strpos( $metadata['name'], 'core/' ) ) {
		return $metadata;
	}

	if ( empty( $metadata['supports']['typography']['fontSize'] ) ) {
		return $metadata;
	}

	$metadata['supports'] = array_merge(
		$metadata['supports'],
		array(
			'unitone' => array_merge(
				$metadata['supports']['unitone'] ?? array(),
				array(
					'fluidTypography' => true,
				)
			),
		)
	);
	return $metadata;
}
add_filter( 'block_type_metadata', 'unitone_add_fluid_typography_support' );

/**
 * Add support "halfLeading" to core blocks with typography.lineHeight.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_half_leading_support( $metadata ) {
	if ( false === strpos( $metadata['name'], 'core/' ) ) {
		return $metadata;
	}

	if ( empty( $metadata['supports']['typography']['lineHeight'] ) ) {
		return $metadata;
	}

	$metadata['supports'] = array_merge(
		$metadata['supports'],
		array(
			'unitone' => array_merge(
				$metadata['supports']['unitone'] ?? array(),
				array(
					'halfLeading' => true,
				)
			),
		)
	);
	return $metadata;
}
add_filter( 'block_type_metadata', 'unitone_add_half_leading_support' );

/**
 * Add support "cellMinWidth" to core/table.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_cell_min_width_support( $metadata ) {
	if ( 'core/table' !== $metadata['name'] ) {
		return $metadata;
	}

	$metadata['supports'] = array_merge(
		$metadata['supports'],
		array(
			'unitone' => array_merge(
				$metadata['supports']['unitone'] ?? array(),
				array(
					'cellMinWidth' => true,
				)
			),
		)
	);
	return $metadata;
}
add_filter( 'block_type_metadata', 'unitone_add_cell_min_width_support' );

/**
 * Add support "gap" to core/post-template.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_gap_support( $metadata ) {
	if ( 'core/post-template' !== $metadata['name'] ) {
		return $metadata;
	}

	$metadata['supports'] = array_merge(
		$metadata['supports'],
		array(
			'unitone' => array_merge(
				$metadata['supports']['unitone'] ?? array(),
				array(
					'gap' => true,
				)
			),
		)
	);
	return $metadata;
}
add_filter( 'block_type_metadata', 'unitone_add_gap_support' );

/**
 * If site-logo block is empty, display unitone logo.
 */
add_filter(
	'render_block',
	function ( $block_content, $block ) {
		if ( 'core/site-logo' === $block['blockName'] && ! $block_content ) {
			if ( is_admin() ) {
				return $block_content;
			}

			$metadata                = wp_json_file_decode( ABSPATH . WPINC . '/blocks/site-logo/block.json', array( 'associative' => true ) );
			$set_default_custom_logo = function () {
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

		$registry = WP_Block_Type_Registry::get_instance();
		$metadata = $registry->get_registered( $block['blockName'] );
		if ( ! $metadata ) {
			return $block_content;
		}

		/**
		 * Return true when supported.
		 *
		 * @param string $support The supported attribute name. Dot-accessible.
		 * @return boolean
		 */
		$is_supported = function ( $support ) use ( $metadata ) {
			return isset( $metadata->supports['unitone'][ $support ] );
		};

		/**
		 * Converts a global style into a custom value.
		 *
		 * @param string $value Value to convert.
		 * @return string CSS var string for given global style value.
		 */
		$get_global_style_css_var = function ( $value ) {
			if ( null === $value || '' === $value ) {
				return $value;
			}

			preg_match( '/var:style\|global\|(.+)/', $value, $match );
			if ( ! $match ) {
				return $value;
			}

			return 'var(--wp--style--global--' . $match[1] . ')';
		};

		/**
		 * Converts a custom value to global style value if one can be found.
		 *
		 * Returns value as-is if no match is found.
		 *
		 * @param string $value Value to convert
		 * @return string The global style value if it can be found.
		 */
		$get_global_style_value_from_custom_value = function ( $value ) {
			if ( null === $value || '' === $value ) {
				return $value;
			}

			preg_match( '/^var\(--wp--style--global--(.+)\)$/', $value, $match );
			if ( ! $match ) {
				return $value;
			}

			return 'var:style|global|' . $match[1];
		};

		/**
		 * Checks is given value is a global style.
		 *
		 * @param string $value Value to check
		 * @return boolean Return true if value is string in format var:style|global|.
		 */
		$is_value_global_style = function ( $value ) {
			if ( null === $value || '' === $value ) {
				return false;
			}

			return 0 === strpos( $value, 'var:style|global|' );
		};

		/**
		 * Get supported attribute value.
		 *
		 * @param string $support The supported attribute name. Dot-accessible.
		 * @return string|null
		 */
		$get_attribute = function ( $support ) use ( $block, $metadata, $is_value_global_style, $get_global_style_css_var ) {
			$array_get = function ( array $vars, $format ) {
				foreach ( explode( '.', (string) $format ) as $key ) {
					if ( ! isset( $vars[ $key ] ) ) {
						return null;
					}
					$vars = $vars[ $key ];
				}
				return $vars;
			};

			$attribute = $array_get( $block['attrs']['unitone'] ?? array(), $support ) ?? null;
			if ( is_null( $attribute ) ) {
				$attribute = $array_get( $metadata->get_attributes()['unitone']['default'] ?? array(), $support ) ?? null;
			}

			return $is_value_global_style( $attribute )
				? $get_global_style_css_var( $attribute )
				: $attribute;
		};

		/**
		 * Add style attribute.
		 *
		 * @param string $property The CSS custom property name.
		 * @param string|null $value The CSS custom property value.
		 */
		$add_style = function ( $property, $value ) use ( $p ) {
			if ( ! is_null( $value ) && '' !== $value ) {
				$style    = $p->get_attribute( 'style' ) ?? '';
				$property = $property . ':';

				if ( ! $style || false === strpos( $style, $property ) ) {
					$style = $style ? $style . ';' : $style;
					$p->set_attribute( 'style', trim( $style . $property . $value, "; \n\r\t\v\x00" ) );
				}
			}
		};

		/**
		 * Add unitone attribute.
		 *
		 * @param string $name The unitone attribute name.
		 * @param string|bool|null $value The unitone attribute value.
		 */
		$add_attribute = function ( $name, $value ) use ( $p ) {
			if ( ! is_null( $value ) && '' !== $value ) {
				$unitone_layout = $p->get_attribute( 'data-unitone-layout' );

				if ( is_bool( $value ) ) {
					$attribute = $name;
				} else {
					$attribute = $name . ':' . $value;
				}

				if ( ! $unitone_layout || false === strpos( $unitone_layout, $attribute ) ) {
					$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
				}
			}
		};

		/**
		 * Returns true when attributes has a support value.
		 *
		 * @param string $support The supported attribute name. Dot-accessible.
		 * @return boolean
		 */
		$has_supported_attribute = function ( $support ) use ( $block ) {
			$value = $block['attrs']['unitone'][ $support ] ?? null;
			return ! is_null( $value );
		};

		// -auto-phrase
		if ( $is_supported( 'autoPhrase' ) ) {
			$add_attribute( '-auto-phrase', $get_attribute( 'autoPhrase' ) );
		}

		// -fluid-typography
		if ( $is_supported( 'fluidTypography' ) ) {
			$add_attribute( '-fluid-typography', $get_attribute( 'fluidTypography' ) );
		}

		// --unitone--half-leading
		if ( $is_supported( 'halfLeading' ) ) {
			$add_style( '--unitone--half-leading', $get_attribute( 'halfLeading' ) );
		}

		// -align-items
		if ( $is_supported( 'alignItems' ) ) {
			$add_attribute( '-align-items', $get_attribute( 'alignItems' ) );
		}

		// -auto-repeat
		if ( $is_supported( 'autoRepeat' ) ) {
			$add_attribute( '-auto-repeat', $get_attribute( 'autoRepeat' ) );
		}

		// -align
		if ( $is_supported( 'blockAlign' ) ) {
			$add_attribute( '-align', $get_attribute( 'blockAlign' ) );
		}

		// -divider
		if ( $is_supported( 'divider' ) ) {
			$add_attribute( '-divider', $get_attribute( 'dividerType' ) );
		}

		// --unitone--divier-color
		if ( $is_supported( 'divider' ) ) {
			$divider_color        = $get_attribute( 'divider.color' );
			$divider_preset_color = $get_attribute( 'dividerColor' );

			if ( is_null( $divider_color ) && $divider_preset_color ) {
				$divider_color = 'var(--wp--preset--color--' . str_replace( '/', '-', $divider_preset_color ) . ')';
			}

			$add_style( '--unitone--divider-color', $divider_color );
		}

		// --unitone--divider-style
		if ( $is_supported( 'divider' ) ) {
			$add_style( '--unitone--divider-style', $get_attribute( 'divider.style' ) );
		}

		// --unitone--divider-width
		if ( $is_supported( 'divider' ) ) {
			$add_style( '--unitone--divider-width', $get_attribute( 'divider.width' ) );
		}

		// -gap
		if ( $is_supported( 'gap' ) ) {
			$add_attribute( '-gap', $get_attribute( 'gap' ) );
		}

		// -gutters
		if ( $is_supported( 'gutters' ) ) {
			$add_attribute( '-gutters', $get_attribute( 'gutters' ) );
		}

		// -justify-content
		if ( $is_supported( 'justifyContent' ) ) {
			$add_attribute( '-justify-content', $get_attribute( 'justifyContent' ) );
		}

		// -stairs
		if ( $is_supported( 'stairs' ) ) {
			$add_attribute( '-stairs', $get_attribute( 'stairs' ) );
		}

		// -stairs-up
		if ( $is_supported( 'stairs' ) ) {
			if ( $get_attribute( 'stairs' ) ) {
				$add_attribute( '-stairs-up', $get_attribute( 'stairsUp' ) );
			}
		}

		// --unitone--max-width
		if ( $is_supported( 'maxWidth' ) || $has_supported_attribute( 'maxWidth' ) ) {
			$add_style( '--unitone--max-width', $get_attribute( 'maxWidth' ) );
		}

		// --unitone--max-height
		if ( $is_supported( 'maxHeight' ) || $has_supported_attribute( 'minHeight' ) ) {
			$add_style( '--unitone--max-height', $get_attribute( 'maxHeight' ) );
		}

		// --unitone--min-height
		if ( $is_supported( 'minHeight' ) ) {
			$add_style( '--unitone--min-height', $get_attribute( 'minHeight' ) );
		}

		// -negative
		if ( $is_supported( 'negative' ) ) {
			$add_attribute( '-negative', $get_attribute( 'negative' ) );
		}

		// -overflow
		if ( $is_supported( 'overflow' ) ) {
			$add_attribute( '-overflow', $get_attribute( 'overflow' ) );
		}

		// -padding
		if ( $is_supported( 'padding' ) ) {
			$add_attribute( '-padding', $get_attribute( 'padding' ) );
		}

		// -position
		if ( $is_supported( 'position' ) ) {
			$add_attribute( '-position', $get_attribute( 'position.position' ) );
		}

		// --unitone--top
		if ( $is_supported( 'position' ) ) {
			$add_style( '--unitone--top', $get_attribute( 'position.top' ) );
		}

		// --unitone--right
		if ( $is_supported( 'position' ) ) {
			$add_style( '--unitone--right', $get_attribute( 'position.right' ) );
		}

		// --unitone--bottom
		if ( $is_supported( 'position' ) ) {
			$add_style( '--unitone--bottom', $get_attribute( 'position.bottom' ) );
		}

		// --unitone--left
		if ( $is_supported( 'position' ) ) {
			$add_style( '--unitone--left', $get_attribute( 'position.left' ) );
		}

		// --unitone--z-index
		if ( $is_supported( 'position' ) ) {
			$add_style( '--unitone--z-index', $get_attribute( 'position.zIndex' ) );
		}

		// --unitone--flex-grow
		if ( $is_supported( 'flexGrow' ) || $has_supported_attribute( 'flexGrow' ) ) {
			$add_style( '--unitone--flex-grow', $get_attribute( 'flexGrow' ) );
		}

		// --unitone--flex-shrink
		if ( $is_supported( 'flexShrink' ) || $has_supported_attribute( 'flexShrink' ) ) {
			$add_style( '--unitone--flex-shrink', $get_attribute( 'flexShrink' ) );
		}

		// --unitone--flex-basis
		if ( $is_supported( 'flexBasis' ) || $has_supported_attribute( 'flexBasis' ) ) {
			$add_style( '--unitone--flex-basis', $get_attribute( 'flexBasis' ) );
		}

		// -align-self
		if ( $is_supported( 'alignSelf' ) || $has_supported_attribute( 'alignSelf' ) ) {
			$add_attribute( '-align-self', $get_attribute( 'alignSelf' ) );
		}

		// -justify-self
		if ( $is_supported( 'justifySelf' ) || $has_supported_attribute( 'justifySelf' ) ) {
			$add_attribute( '-justify-self', $get_attribute( 'justifySelf' ) );
		}

		// --unitone--grid-column
		if ( $is_supported( 'gridColumn' ) || $has_supported_attribute( 'gridColumn' ) ) {
			$add_style( '--unitone--grid-column', $get_attribute( 'gridColumn' ) );
		}

		// --unitone--grid-row
		if ( $is_supported( 'gridRow' ) || $has_supported_attribute( 'gridRow' ) ) {
			$add_style( '--unitone--grid-row', $get_attribute( 'gridRow' ) );
		}

		// -text-orientation
		if ( $is_supported( 'textOrientation' ) ) {
			$add_attribute( '-text-orientation', $get_attribute( 'textOrientation' ) );
		}

		// -mix-blend-mode
		if ( $is_supported( 'mixBlendMode' ) || $has_supported_attribute( 'mixBlendMode' ) ) {
			$add_attribute( '-mix-blend-mode', $get_attribute( 'mixBlendMode' ) );
		}

		// --unitone--cell-min-width
		if ( $is_supported( 'cellMinWidth' ) ) {
			$deprecated_attribute = $block['attrs']['cellMinWidth'] ?? null;
			$add_style( '--unitone--cell-min-width', $get_attribute( 'cellMinWidth' ) ?? $deprecated_attribute );
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
	function ( $block_content, $block ) {
		if ( ! isset( $block['attrs']['intrinsic'] ) && false === strpos( $block_content, '-intrinsic' ) ) {
			$p = new \WP_HTML_Tag_Processor( $block_content );
			$p->next_tag();
			$p->set_attribute( 'data-unitone-layout', $p->get_attribute( 'data-unitone-layout' ) . ' -intrinsic' );
			$block_content = $p->get_updated_html();
		}
		return $block_content;
	},
	10,
	2
);

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
