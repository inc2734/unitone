<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

use Unitone\App\Controller\Manager\Manager;

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
 * Add support "linkDecoration" to core blocks with typography.textDecoration.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_link_decoration_support( $metadata ) {
	if ( false === strpos( $metadata['name'], 'core/' ) ) {
		return $metadata;
	}

	if (
		empty( $metadata['supports']['typography']['textDecoration'] ) &&
		empty( $metadata['supports']['typography']['__experimentalTextDecoration'] )
	) {
		return $metadata;
	}

	$metadata['supports'] = array_merge(
		$metadata['supports'],
		array(
			'unitone' => array_merge(
				$metadata['supports']['unitone'] ?? array(),
				array(
					'linkDecoration' => true,
				)
			),
		)
	);
	return $metadata;
}
add_filter( 'block_type_metadata', 'unitone_add_link_decoration_support' );

/**
 * Add support "gap" to core/list, core/navigation, core/post-content,  core/post-template and core/social-links.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_gap_support( $metadata ) {
	$target = array(
		'core/list',
		'core/navigation',
		'core/post-content',
		'core/post-template',
		'core/social-links',
	);

	if ( ! in_array( $metadata['name'], $target, true ) ) {
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
 * Add divider supports to core/list.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_divider_support( $metadata ) {
	$target = array(
		'core/list',
		'core/post-template',
	);

	if ( ! in_array( $metadata['name'], $target, true ) ) {
		return $metadata;
	}

	$metadata['supports'] = array_merge(
		$metadata['supports'],
		array(
			'unitone' => array_merge(
				$metadata['supports']['unitone'] ?? array(),
				array(
					'divider'     => true,
					'dividerType' => array( '', 'stripe', 'underline', 'bordered', 'divide' ),
				)
			),
		)
	);
	return $metadata;
}
add_filter( 'block_type_metadata', 'unitone_add_divider_support' );

/**
 * Add marker color supports to core/list and core/list-item.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_marker_color_support( $metadata ) {
	$target = array(
		'core/list',
		'core/list-item',
	);

	if ( ! in_array( $metadata['name'], $target, true ) ) {
		return $metadata;
	}

	$metadata['supports'] = array_merge(
		$metadata['supports'],
		array(
			'unitone' => array_merge(
				$metadata['supports']['unitone'] ?? array(),
				array(
					'color' => array_merge(
						$metadata['supports']['unitone']['color'] ?? array(),
						array(
							'marker' => true,
						),
					),
				),
			),
		)
	);
	return $metadata;
}
add_filter( 'block_type_metadata', 'unitone_add_marker_color_support' );

/**
 * Add supports to core/navigation.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_supports_to_core_navigation( $metadata ) {
	if ( 'core/navigation' !== $metadata['name'] ) {
		return $metadata;
	}

	$metadata['supports'] = array_merge(
		$metadata['supports'],
		array(
			'unitone' => array_merge(
				$metadata['supports']['unitone'] ?? array(),
				array(
					'replaceOverlayMenu' => true,
				)
			),
		)
	);
	return $metadata;
}
add_filter( 'block_type_metadata', 'unitone_add_supports_to_core_navigation' );

/**
 * Add supports to core/table.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_supports_to_core_table( $metadata ) {
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
					'padding'      => array(
						'split' => true,
					),
				)
			),
		)
	);
	return $metadata;
}
add_filter( 'block_type_metadata', 'unitone_add_supports_to_core_table' );

/**
 * Add supports to core/post-content.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_supports_to_core_post_content( $metadata ) {
	if ( ! in_array( $metadata['name'], array( 'core/post-content' ), true ) ) {
		return $metadata;
	}

	$metadata['supports'] = array_merge(
		$metadata['supports'],
		array(
			'unitone' => array_merge(
				$metadata['supports']['unitone'] ?? array(),
				array(
					'gutters' => true,
				)
			),
		)
	);
	return $metadata;
}
add_filter( 'block_type_metadata', 'unitone_add_supports_to_core_post_content' );

/**
 * Add supports to core/button.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_supports_to_core_button( $metadata ) {
	if ( 'core/button' !== $metadata['name'] ) {
		return $metadata;
	}

	$metadata['supports'] = array_merge(
		$metadata['supports'],
		array(
			'unitone' => array_merge(
				$metadata['supports']['unitone'] ?? array(),
				array(
					'padding'        => array(
						'split' => true,
					),
					'minWidth'       => true,
					'loopAnimation'  => true,
					'hoverAnimation' => true,
				)
			),
		)
	);
	return $metadata;
}
add_filter( 'block_type_metadata', 'unitone_add_supports_to_core_button' );

/**
 * Add supports to core/image.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_supports_to_core_image( $metadata ) {
	if ( 'core/image' !== $metadata['name'] ) {
		return $metadata;
	}

	$metadata['supports'] = array_merge(
		$metadata['supports'],
		array(
			'shadow' => array(
				'__experimentalSkipSerialization' => true,
				'__experimentalDefaultControls'   => array(
					'shadow' => true,
				),
			),
		),
		array(
			'unitone' => array_merge(
				$metadata['supports']['unitone'] ?? array(),
				array(
					'overlay'         => true,
					'dropShadow'      => true,
					'opacity'         => true,
					'parallax'        => true,
					'scrollAnimation' => true,
					'loopAnimation'   => true,
					'hoverAnimation'  => true,
				)
			),
		)
	);

	return $metadata;
}
add_filter( 'block_type_metadata', 'unitone_add_supports_to_core_image' );

/**
 * Set site logo default width.
 *
 * @param array $settings Array of determined settings for registering a block type.
 * @return array
 */
function unitone_set_site_logo_default_width( $settings ) {
	if ( 'core/site-logo' !== $settings['name'] ) {
		return $settings;
	}

	$site_logo_width = Manager::get_setting( 'site-logo-width' );
	if ( $site_logo_width ) {
		$settings['attributes']['width']['default'] = $site_logo_width;
	}

	return $settings;
}
add_filter( 'block_type_metadata_settings', 'unitone_set_site_logo_default_width' );

/**
 * Build hover color supports from the default color and border supports.
 *
 * @param array $supports Block supports.
 * @return array
 */
function unitone_get_hover_color_support_from_supports( $supports ) {
	$hover_supports = array();
	$color_support  = $supports['color'] ?? null;
	$border_support = $supports['__experimentalBorder'] ?? null;

	if ( true === $color_support ) {
		$hover_supports['color'] = array(
			'background' => true,
			'text'       => true,
		);
	} elseif ( is_array( $color_support ) ) {
		if ( false !== ( $color_support['background'] ?? null ) ) {
			$hover_supports['color']['background'] = true;
		}

		if ( ! empty( $color_support['gradients'] ) ) {
			$hover_supports['color']['gradients'] = true;
		}

		if ( false !== ( $color_support['text'] ?? null ) ) {
			$hover_supports['color']['text'] = true;
		}
	}

	if (
		true === $border_support ||
		( is_array( $border_support ) && ! empty( $border_support['color'] ) )
	) {
		$hover_supports['border']['color'] = true;
	}

	return $hover_supports;
}

/**
 * Add hover color supports.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_hover_color_support( $metadata ) {
	$name = $metadata['name'] ?? '';

	if (
		'core/button' !== $name &&
		0 !== strpos( $name, 'unitone/' )
	) {
		return $metadata;
	}

	$hover_supports = unitone_get_hover_color_support_from_supports(
		$metadata['supports'] ?? array()
	);

	if ( empty( $hover_supports ) ) {
		return $metadata;
	}

	$unitone_supports          = $metadata['supports']['unitone'] ?? array();
	$unitone_supports          = is_array( $unitone_supports ) ? $unitone_supports : array();
	$unitone_supports['hover'] = $hover_supports;

	$metadata['supports'] = array_merge(
		$metadata['supports'] ?? array(),
		array(
			'unitone' => $unitone_supports,
		)
	);

	return $metadata;
}
add_filter( 'block_type_metadata', 'unitone_add_hover_color_support' );

/**
 * Add hover color attributes.
 *
 * @param array $settings Array of determined settings for registering a block type.
 * @return array
 */
function unitone_add_hover_color_attributes( $settings ) {
	$has_hover_background_support   = unitone_has_block_support( 'unitone.hover.color.background', $settings );
	$has_hover_gradient_support     = unitone_has_block_support( 'unitone.hover.color.gradients', $settings );
	$has_hover_color_support        = unitone_has_block_support( 'unitone.hover.color.text', $settings );
	$has_hover_border_color_support = unitone_has_block_support( 'unitone.hover.border.color', $settings );

	if ( $has_hover_background_support ) {
		$settings['attributes'] = array_merge(
			$settings['attributes'],
			array(
				'hoverBackgroundColor'       => array(
					'type' => 'string',
				),
				'customHoverBackgroundColor' => array(
					'type' => 'string',
				),
			)
		);
	}

	if ( $has_hover_gradient_support ) {
		$settings['attributes'] = array_merge(
			$settings['attributes'],
			array(
				'hoverGradient'       => array(
					'type' => 'string',
				),
				'customHoverGradient' => array(
					'type' => 'string',
				),
			)
		);
	}

	if ( $has_hover_color_support ) {
		$settings['attributes'] = array_merge(
			$settings['attributes'],
			array(
				'hoverTextColor'       => array(
					'type' => 'string',
				),
				'customHoverTextColor' => array(
					'type' => 'string',
				),
			)
		);
	}

	if ( $has_hover_border_color_support ) {
		$settings['attributes'] = array_merge(
			$settings['attributes'],
			array(
				'hoverBorderColor'       => array(
					'type' => 'string',
				),
				'customHoverBorderColor' => array(
					'type' => 'string',
				),
			)
		);
	}

	return $settings;
}
add_filter( 'block_type_metadata_settings', 'unitone_add_hover_color_attributes' );

/**
 * Apply hover color.
 *
 * @param string $block_content The block content.
 * @param array $block The full block, including name and attributes.
 * @return string
 */
function unitone_apply_hover_color( $block_content, $block ) {
	if ( ! $block['blockName'] ) {
		return $block_content;
	}

	$p = new \WP_HTML_Tag_Processor( $block_content );
	if ( ! $p->next_tag() ) {
		return $block_content;
	}

	$metadata = \WP_Block_Type_Registry::get_instance()->get_registered( $block['blockName'] );
	if ( ! $metadata ) {
		return $block_content;
	}

	$has_hover_background_support   = unitone_has_block_support( 'unitone.hover.color.background', $metadata );
	$has_hover_gradient_support     = unitone_has_block_support( 'unitone.hover.color.gradients', $metadata );
	$has_hover_color_support        = unitone_has_block_support( 'unitone.hover.color.text', $metadata );
	$has_hover_border_color_support = unitone_has_block_support( 'unitone.hover.border.color', $metadata );

	if (
		! $has_hover_background_support &&
		! $has_hover_gradient_support &&
		! $has_hover_color_support &&
		! $has_hover_border_color_support
	) {
		return $block_content;
	}

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

	// Apply hover background color.
	if ( $has_hover_background_support ) {
		$hover_background_color        = $block['attrs']['hoverBackgroundColor'] ?? null;
		$custom_hover_background_color = $block['attrs']['customHoverBackgroundColor'] ?? null;

		if ( $hover_background_color || $custom_hover_background_color ) {
			$p->add_class( 'has-unitone-hover' );
			$p->add_class( 'has-unitone-background-hover' );

			if ( $hover_background_color ) {
				$add_style( '--unitone--background-color--hover', 'var(--wp--preset--color--' . $hover_background_color . ')' );
			} elseif ( $custom_hover_background_color ) {
				$add_style( '--unitone--background-color--hover', $custom_hover_background_color );
			}
		}
	}

	// Apply hover gradient.
	if ( $has_hover_gradient_support ) {
		$hover_gradient        = $block['attrs']['hoverGradient'] ?? null;
		$custom_hover_gradient = $block['attrs']['customHoverGradient'] ?? null;

		if ( $hover_gradient || $custom_hover_gradient ) {
			$p->add_class( 'has-unitone-hover' );
			$p->add_class( 'has-unitone-gradient-background-hover' );

			if ( $hover_gradient ) {
				$add_style( '--unitone--background-image--hover', 'var(--wp--preset--gradient--' . $hover_gradient . ')' );
			} elseif ( $custom_hover_gradient ) {
				$add_style( '--unitone--background-image--hover', $custom_hover_gradient );
			}
		}
	}

	// Apply hover text color.
	if ( $has_hover_color_support ) {
		$hover_text_color        = $block['attrs']['hoverTextColor'] ?? null;
		$custom_hover_text_color = $block['attrs']['customHoverTextColor'] ?? null;

		if ( $hover_text_color || $custom_hover_text_color ) {
			$p->add_class( 'has-unitone-hover' );
			$p->add_class( 'has-unitone-text-color-hover' );

			if ( $hover_text_color ) {
				$add_style( '--unitone--color--hover', 'var(--wp--preset--color--' . $hover_text_color . ')' );
			} elseif ( $custom_hover_text_color ) {
				$add_style( '--unitone--color--hover', $custom_hover_text_color );
			}
		}
	}

	// Apply hover border color.
	if ( $has_hover_border_color_support ) {
		$hover_border_color        = $block['attrs']['hoverBorderColor'] ?? null;
		$custom_hover_border_color = $block['attrs']['customHoverBorderColor'] ?? null;

		if ( $hover_border_color || $custom_hover_border_color ) {
			$p->add_class( 'has-unitone-hover' );
			$p->add_class( 'has-unitone-border-color-hover' );

			if ( $hover_border_color ) {
				$add_style( '--unitone--border-color--hover', 'var(--wp--preset--color--' . $hover_border_color . ')' );
			} elseif ( $custom_hover_border_color ) {
				$add_style( '--unitone--border-color--hover', $custom_hover_border_color );
			}
		}
	}

	return $p->get_updated_html();
}
add_filter( 'render_block', 'unitone_apply_hover_color', 10, 2 );
