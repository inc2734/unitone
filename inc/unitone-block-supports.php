<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

use Unitone\App\Controller\Manager\Manager;

/**
 * Apply unitone block supports.
 */
add_filter(
	'render_block',
	function ( $block_content, $block ) {
		if ( ! $block['blockName'] ) {
			return $block_content;
		}

		$p = new \WP_HTML_Tag_Processor( $block_content );
		$p->next_tag();

		$registry = \WP_Block_Type_Registry::get_instance();
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
		$has_support = function ( $support ) use ( $metadata, $block ) {
			return null !== unitone_array_get( $metadata->supports['unitone'] ?? array(), $support );
		};

		/**
		 * Return supported value.
		 *
		 * @param string $support The supported attribute name. Dot-accessible.
		 * @return mixed
		 */
		$get_support = function ( $support ) use ( $metadata, $block ) {
			return unitone_array_get( $metadata->supports['unitone'] ?? array(), $support );
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
			if ( null === $value || '' === $value || is_array( $value ) ) {
				return false;
			}

			return 0 === strpos( $value, 'var:style|global|' );
		};

		/**
		 * Checks is given value is a preset.
		 *
		 * @param string $value Value to check
		 * @return boolean Return true if value is string in format var:preset|.
		 */
		$is_value_preset = function ( $value ) {
			if ( null === $value || '' === $value || is_array( $value ) ) {
				return false;
			}

			return 0 === strpos( $value, 'var:preset|' );
		};

		/**
		 * Get supported attribute value.
		 *
		 * @param string $support The supported attribute name. Dot-accessible.
		 * @return string|null
		 */
		$get_attribute = function (
			$support
		) use (
			$block,
			$metadata,
			$is_value_global_style,
			$get_global_style_css_var,
			$is_value_preset
		) {
			$attribute = unitone_array_get( $block['attrs']['unitone'] ?? array(), $support ) ?? null;
			if ( is_null( $attribute ) ) {
				$attribute = unitone_array_get( $metadata->get_attributes()['unitone']['default'] ?? array(), $support ) ?? null;
			}

			if ( $is_value_global_style( $attribute ) ) {
				return $get_global_style_css_var( $attribute );
			}

			if ( $is_value_preset( $attribute ) ) {
				return unitone_get_preset_css_var( $attribute );
			}

			return $attribute;
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

				$attribute = false;
				if ( true === $value ) {
					$attribute = $name;
				} elseif ( ! is_array( $value ) ) {
					$attribute = $name . ':' . $value;
				}

				if ( $attribute && ( ! $unitone_layout || false === strpos( $unitone_layout, $attribute ) ) ) {
					$p->set_attribute( 'data-unitone-layout', trim( $unitone_layout . ' ' . $attribute ) );
				}
			}
		};

		/**
		 * Add data attribute.
		 *
		 * @param string $name The data attribute name.
		 * @param string|null $value The data attribute value.
		 */
		$add_data_attribute = function ( $name, $value ) use ( $p ) {
			if ( ! is_null( $value ) && '' !== $value ) {
				$data_attribute = $p->get_attribute( $name );

				if ( ! $data_attribute || false === strpos( $data_attribute, $value ) ) {
					$p->set_attribute( $name, trim( $data_attribute . ' ' . $value ) );
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

		// In the editor, InnerBlocks and its descendant blocks have `position: relative`.
		// Match the front as well.
		// @see /wp-includes/css/dist/block-editor/content.css.
		$block_types_allowed_to_add_block_list_data = apply_filters(
			'unitone_block_types_allowed_to_add_block_list_data',
			in_array( explode( '/', $block['blockName'] )[0] ?? '', array( 'core', 'unitone' ), true ),
			$block['blockName']
		);
		if ( $block_types_allowed_to_add_block_list_data ) {
			$add_data_attribute( 'data-unitone-block-list', 'block' );
			if ( $block['innerBlocks'] ?? array() ) {
				$add_data_attribute( 'data-unitone-block-list', 'layout' );
			}
		}

		// -auto-phrase
		if ( $has_support( 'autoPhrase' ) ) {
			$add_attribute( '-auto-phrase', $get_attribute( 'autoPhrase' ) );
		}

		// -fluid-typography
		if ( $has_support( 'fluidTypography' ) ) {
			$add_attribute( '-fluid-typography', $get_attribute( 'fluidTypography' ) );
		}

		// -background-clip
		if ( $has_support( 'backgroundClip' ) ) {
			$add_attribute( '-background-clip', $get_attribute( 'backgroundClip' ) );
		}

		// --unitone--half-leading
		if ( $has_support( 'halfLeading' ) ) {
			$new_half_leading = $get_attribute( 'halfLeading' );
			if ( ! is_null( $new_half_leading ) ) {
				$add_style( '--unitone--half-leading', $new_half_leading );

				$base_half_leading     = Manager::get_setting( 'half-leading' );
				$base_min_half_leading = Manager::get_setting( 'min-half-leading' );

				$diff = $new_half_leading > $base_half_leading || $new_half_leading < $base_min_half_leading
					? round( $new_half_leading - $base_half_leading, 2 )
					: false;

				if ( false !== $diff ) {
					$new_min_half_leading = round( $base_min_half_leading + $diff, 2 );
					if ( 0 > $new_min_half_leading ) {
						$new_min_half_leading = 0;
					}

					$add_style( '--unitone--min-half-leading', $new_min_half_leading );
				}
			}
		}

		// -align-items
		if ( $has_support( 'alignItems' ) ) {
			$add_attribute( '-align-items', $get_attribute( 'alignItems' ) );
		}

		// -auto-repeat
		if ( $has_support( 'autoRepeat' ) ) {
			$add_attribute( '-auto-repeat', $get_attribute( 'autoRepeat' ) );
		}

		// -align
		if ( $has_support( 'blockAlign' ) ) {
			$add_attribute( '-align', $get_attribute( 'blockAlign' ) );
		}

		// -divider
		if ( $has_support( 'divider' ) ) {
			$add_attribute( '-divider', $get_attribute( 'dividerType' ) );
		}

		// --unitone--divier-color
		if ( $has_support( 'divider' ) ) {
			$divider_color        = $get_attribute( 'divider.color' );
			$divider_preset_color = $get_attribute( 'dividerColor' );

			if ( is_null( $divider_color ) && $divider_preset_color ) {
				$divider_color = 'var(--wp--preset--color--' . str_replace( '/', '-', $divider_preset_color ) . ')';
			}

			$add_style( '--unitone--divider-color', $divider_color );
		}

		// --unitone--divider-style
		if ( $has_support( 'divider' ) ) {
			$add_style( '--unitone--divider-style', $get_attribute( 'divider.style' ) );
		}

		// --unitone--divider-width
		if ( $has_support( 'divider' ) ) {
			$add_style( '--unitone--divider-width', $get_attribute( 'divider.width' ) );
		}

		// -section-divider
		if ( $has_support( 'sectionDivider' ) ) {
			$top_divider_type = $get_attribute( 'sectionDivider.top.type' );
			if ( $top_divider_type ) {
				$add_attribute( '-section-divider-top', $top_divider_type );
				$add_style( '--unitone--section-divider-top-level', $get_attribute( 'sectionDivider.top.level' ) );
				$add_style( '--unitone--section-divider-top-size', $get_attribute( 'sectionDivider.top.size' ) );
				$add_style( '--unitone--section-divider-top-x', $get_attribute( 'sectionDivider.top.x' ) );
				$add_style( '--unitone--section-divider-top-trim', $get_attribute( 'sectionDivider.top.trim' ) );
				$add_attribute( '-section-overlap:top', $get_attribute( 'sectionDivider.top.overlap' ) );
			}

			$bottom_divider_type = $get_attribute( 'sectionDivider.bottom.type' );
			if ( $bottom_divider_type ) {
				$add_attribute( '-section-divider-bottom', $bottom_divider_type );
				$add_style( '--unitone--section-divider-bottom-level', $get_attribute( 'sectionDivider.bottom.level' ) );

				$is_bottom_divider_expand = 'expand' === $bottom_divider_type;
				if ( ! $is_bottom_divider_expand ) {
					$add_style( '--unitone--section-divider-bottom-size', $get_attribute( 'sectionDivider.bottom.size' ) );
					$add_style( '--unitone--section-divider-bottom-x', $get_attribute( 'sectionDivider.bottom.x' ) );
				}

				$add_style( '--unitone--section-divider-bottom-trim', $get_attribute( 'sectionDivider.bottom.trim' ) );
			}
		}

		// --unitone--drop-shadow
		if ( $has_support( 'dropShadow' ) ) {
			$add_style( '--unitone--drop-shadow', $get_attribute( 'dropShadow' ) );
		}

		// -gap
		if ( $has_support( 'gap' ) ) {
			$column_gap = $get_attribute( 'gap.column' );
			if ( ! is_null( $column_gap ) ) {
				$add_attribute( '-column-gap', $column_gap );
			}

			$row_gap = $get_attribute( 'gap.row' );
			if ( ! is_null( $row_gap ) ) {
				$add_attribute( '-row-gap', $row_gap );
			}

			if ( is_null( $column_gap ) && is_null( $row_gap ) ) {
				$add_attribute( '-gap', $get_attribute( 'gap' ) );
			}
		}

		// -gutters
		if ( $has_support( 'gutters' ) ) {
			$add_attribute( '-gutters', $get_attribute( 'gutters' ) );
		}

		// -justify-content
		if ( $has_support( 'justifyContent' ) ) {
			$add_attribute( '-justify-content', $get_attribute( 'justifyContent' ) );
		}

		// -stairs
		if ( $has_support( 'stairs' ) ) {
			$add_attribute( '-stairs', $get_attribute( 'stairs' ) );
		}

		// -stairs-up
		if ( $has_support( 'stairs' ) ) {
			if ( $get_attribute( 'stairs' ) ) {
				$add_attribute( '-stairs-up', $get_attribute( 'stairsUp' ) );
			}
		}

		// --unitone--max-width
		if ( $has_support( 'maxWidth' ) || $has_supported_attribute( 'maxWidth' ) ) {
			$add_style( '--unitone--max-width', $get_attribute( 'maxWidth' ) );
		}

		// --unitone--min-width
		if ( $has_support( 'minWidth' ) ) {
			$add_style( '--unitone--min-width', $get_attribute( 'minWidth' ) );
		}

		// --unitone--max-height
		if ( $has_support( 'maxHeight' ) || $has_supported_attribute( 'minHeight' ) ) {
			$add_style( '--unitone--max-height', $get_attribute( 'maxHeight' ) );
		}

		// --unitone--min-height
		if ( $has_support( 'minHeight' ) ) {
			$add_style( '--unitone--min-height', $get_attribute( 'minHeight' ) );
		}

		// -negative
		if ( $has_support( 'negative' ) ) {
			$add_attribute( '-negative', $get_attribute( 'negative' ) );
		}

		// -overflow
		if ( $has_support( 'overflow' ) ) {
			$add_attribute( '-overflow', $get_attribute( 'overflow' ) );
		}

		// -padding
		if ( $has_support( 'padding' ) ) {
			$add_attribute( '-padding', $get_attribute( 'padding' ) );
		}

		// -position
		if ( $has_support( 'position' ) ) {
			$add_attribute( '-position', $get_attribute( 'position.position' ) );
		}

		// --unitone--top
		if ( $has_support( 'position' ) ) {
			$add_style( '--unitone--top', $get_attribute( 'position.top' ) );
		}

		// --unitone--right
		if ( $has_support( 'position' ) ) {
			$add_style( '--unitone--right', $get_attribute( 'position.right' ) );
		}

		// --unitone--bottom
		if ( $has_support( 'position' ) ) {
			$add_style( '--unitone--bottom', $get_attribute( 'position.bottom' ) );
		}

		// --unitone--left
		if ( $has_support( 'position' ) ) {
			$add_style( '--unitone--left', $get_attribute( 'position.left' ) );
		}

		// --unitone--z-index
		if ( $has_support( 'position' ) ) {
			$add_style( '--unitone--z-index', $get_attribute( 'position.zIndex' ) );
		}

		// --unitone--flex-grow
		if ( $has_support( 'flexGrow' ) || $has_supported_attribute( 'flexGrow' ) ) {
			$add_style( '--unitone--flex-grow', $get_attribute( 'flexGrow' ) );
		}

		// --unitone--flex-shrink
		if ( $has_support( 'flexShrink' ) || $has_supported_attribute( 'flexShrink' ) ) {
			$add_style( '--unitone--flex-shrink', $get_attribute( 'flexShrink' ) );
		}

		// --unitone--flex-basis
		if ( $has_support( 'flexBasis' ) || $has_supported_attribute( 'flexBasis' ) ) {
			$add_style( '--unitone--flex-basis', $get_attribute( 'flexBasis' ) );
		}

		// -align-self
		if ( $has_support( 'alignSelf' ) || $has_supported_attribute( 'alignSelf' ) ) {
			$align_self_lg = $get_attribute( 'alignSelf.lg' );
			if ( ! is_null( $align_self_lg ) ) {
				$add_attribute( '-align-self', $align_self_lg );
			}

			$align_self_md = $get_attribute( 'alignSelf.md' );
			if ( ! is_null( $align_self_md ) ) {
				$add_attribute( '-align-self:md', $align_self_md );
			}

			$align_self_sm = $get_attribute( 'alignSelf.sm' );
			if ( ! is_null( $align_self_sm ) ) {
				$add_attribute( '-align-self:sm', $align_self_sm );
			}

			if ( is_null( $align_self_lg ) && is_null( $align_self_md ) && is_null( $align_self_sm ) ) {
				$add_attribute( '-align-self', $get_attribute( 'alignSelf' ) );
			}
		}

		// -justify-self
		if ( $has_support( 'justifySelf' ) || $has_supported_attribute( 'justifySelf' ) ) {
			$justify_self_lg = $get_attribute( 'justifySelf.lg' );
			if ( ! is_null( $justify_self_lg ) ) {
				$add_attribute( '-justify-self', $justify_self_lg );
			}

			$justify_self_md = $get_attribute( 'justifySelf.md' );
			if ( ! is_null( $justify_self_md ) ) {
				$add_attribute( '-justify-self:md', $justify_self_md );
			}

			$justify_self_sm = $get_attribute( 'justifySelf.sm' );
			if ( ! is_null( $justify_self_sm ) ) {
				$add_attribute( '-justify-self:sm', $justify_self_sm );
			}

			if ( is_null( $justify_self_lg ) && is_null( $justify_self_md ) && is_null( $justify_self_sm ) ) {
				$add_attribute( '-justify-self', $get_attribute( 'justifySelf' ) );
			}
		}

		// --unitone--grid-column
		if ( $has_support( 'gridColumn' ) || $has_supported_attribute( 'gridColumn' ) ) {
			$grid_column_lg = $get_attribute( 'gridColumn.lg' );
			if ( ! is_null( $grid_column_lg ) ) {
				$add_style( '--unitone--grid-column', $grid_column_lg );
			}

			$grid_column_md = $get_attribute( 'gridColumn.md' );
			if ( ! is_null( $grid_column_md ) ) {
				$add_style( '--unitone--md-grid-column', $grid_column_md );
			}

			$grid_column_sm = $get_attribute( 'gridColumn.sm' );
			if ( ! is_null( $grid_column_sm ) ) {
				$add_style( '--unitone--sm-grid-column', $grid_column_sm );
			}

			if ( is_null( $grid_column_lg ) && is_null( $grid_column_md ) && is_null( $grid_column_sm ) ) {
				$add_style( '--unitone--grid-column', $get_attribute( 'gridColumn' ) );
			}
		}

		// --unitone--grid-row
		if ( $has_support( 'gridRow' ) || $has_supported_attribute( 'gridRow' ) ) {
			$grid_row_lg = $get_attribute( 'gridRow.lg' );
			if ( ! is_null( $grid_row_lg ) ) {
				$add_style( '--unitone--grid-row', $grid_row_lg );
			}

			$grid_row_md = $get_attribute( 'gridRow.md' );
			if ( ! is_null( $grid_row_md ) ) {
				$add_style( '--unitone--md-grid-row', $grid_row_md );
			}

			$grid_row_sm = $get_attribute( 'gridRow.sm' );
			if ( ! is_null( $grid_row_sm ) ) {
				$add_style( '--unitone--sm-grid-row', $grid_row_sm );
			}

			if ( is_null( $grid_row_lg ) && is_null( $grid_row_md ) && is_null( $grid_row_sm ) ) {
				$add_style( '--unitone--grid-row', $get_attribute( 'gridRow' ) );
			}
		}

		// -text-orientation
		if ( $has_support( 'textOrientation' ) ) {
			$add_attribute( '-text-orientation', $get_attribute( 'textOrientation' ) );
		}

		// -mix-blend-mode
		if ( $has_support( 'mixBlendMode' ) || $has_supported_attribute( 'mixBlendMode' ) ) {
			$add_attribute( '-mix-blend-mode', $get_attribute( 'mixBlendMode' ) );
		}

		// --unitone--cell-min-width
		if ( $has_support( 'cellMinWidth' ) ) {
			$deprecated_attribute = $block['attrs']['cellMinWidth'] ?? null;
			$add_style( '--unitone--cell-min-width', $get_attribute( 'cellMinWidth' ) ?? $deprecated_attribute );
		}

		// -overlay
		if ( $has_support( 'overlay' ) ) {
			$color           = $get_attribute( 'overlay.color' );
			$custom_color    = $get_attribute( 'overlay.customColor' );
			$gradient        = $get_attribute( 'overlay.gradient' );
			$custom_gradient = $get_attribute( 'overlay.customGradient' );
			$dim_ratio       = $get_attribute( 'overlay.dimRatio' );
			$opacity         = ! is_null( $dim_ratio ) ? $dim_ratio * 0.01 : null;

			// Backward compatibility.
			if ( ! is_null( $color ) && false !== strpos( $color, '(' ) ) {
				$custom_color = $color;
				$color        = null;
			}
			if ( ! is_null( $gradient ) && false !== strpos( $gradient, '(' ) ) {
				$custom_gradient = $gradient;
				$gradient        = null;
			}

			if ( $color || $gradient || $custom_color || $custom_gradient ) {
				$radius = $block['attrs']['style']['border']['radius'] ?? null;

				$add_attribute( '-overlay', true );
				$add_style( '--unitone--overlay-color', $color ? 'var(--wp--preset--color--' . $color . ')' : $custom_color );
				$add_style( '--unitone--overlay-gradient', $gradient ? 'var(--wp--preset--gradient--' . $gradient . ')' : $custom_gradient );
				$add_style( '--unitone--overlay-opacity', $opacity );
				$add_style( '--unitone--overlay-radius', $radius );
			}
		}

		// --unitone--backdrop
		$backdrop_filter_props = ( function () use ( $get_support, $has_support, $get_attribute ) {
			$backdrop_filter_props = array();

			// Blur.
			$has_backdrop_filter_support = true === $get_support( 'backdropFilter' );
			if ( $has_support( 'backdropFilter.blur' ) || $has_backdrop_filter_support ) {
				$blur = $get_attribute( 'backdropFilter.blur' );

				if ( ! is_null( $blur ) && 0 !== $blur ) {
					$backdrop_filter_props[] = array( 'blur' => $blur . 'px' );
				}
			}

			// Brightness.
			if ( $has_support( 'backdropFilter.brightness' ) || true === $get_support( 'backdropFilter' ) ) {
				$brightness = $get_attribute( 'backdropFilter.brightness' );

				if ( ! is_null( $brightness ) && 100 !== $brightness ) {
					$backdrop_filter_props[] = array( 'brightness' => $brightness . '%' );
				}
			}

			// Contrast.
			if ( $has_support( 'backdropFilter.contrast' ) || true === $get_support( 'backdropFilter' ) ) {
				$contrast = $get_attribute( 'backdropFilter.contrast' );

				if ( ! is_null( $contrast ) && 0 !== $contrast ) {
					$backdrop_filter_props[] = array( 'contrast' => $contrast . '%' );
				}
			}

			// Grayscale.
			if ( $has_support( 'backdropFilter.grayscale' ) || true === $get_support( 'backdropFilter' ) ) {
				$grayscale = $get_attribute( 'backdropFilter.grayscale' );

				if ( ! is_null( $grayscale ) && 0 !== $grayscale ) {
					$backdrop_filter_props[] = array( 'grayscale' => $grayscale . '%' );
				}
			}

			// Hue Rotate.
			if ( $has_support( 'backdropFilter.hueRotate' ) || true === $get_support( 'backdropFilter' ) ) {
				$hue_rotate = $get_attribute( 'backdropFilter.hueRotate' );

				if ( ! is_null( $hue_rotate ) && 0 !== $hue_rotate ) {
					$backdrop_filter_props[] = array( 'hue-rotate' => $hue_rotate . 'deg' );
				}
			}

			// Invert.
			if ( $has_support( 'backdropFilter.invert' ) || true === $get_support( 'backdropFilter' ) ) {
				$invert = $get_attribute( 'backdropFilter.invert' );

				if ( ! is_null( $invert ) && 0 !== $invert ) {
					$backdrop_filter_props[] = array( 'invert' => $invert . '%' );
				}
			}

			// Saturate.
			if ( $has_support( 'backdropFilter.saturate' ) || true === $get_support( 'backdropFilter' ) ) {
				$saturate = $get_attribute( 'backdropFilter.saturate' );

				if ( ! is_null( $saturate ) && 100 !== $saturate ) {
					$backdrop_filter_props[] = array( 'saturate' => $saturate . '%' );
				}
			}

			// Sepia.
			if ( $has_support( 'backdropFilter.sepia' ) || true === $get_support( 'backdropFilter' ) ) {
				$sepia = $get_attribute( 'backdropFilter.sepia' );

				if ( ! is_null( $sepia ) && 0 !== $sepia ) {
					$backdrop_filter_props[] = array( 'sepia' => $sepia . '%' );
				}
			}

			return $backdrop_filter_props;
		} )();
		if ( $backdrop_filter_props ) {
			$backdrop_filter = implode(
				' ',
				array_map(
					function ( $v ) {
						return array_keys( $v )[0] . '(' . array_values( $v )[0] . ')';
					},
					$backdrop_filter_props
				)
			);

			$add_style( '--unitone--backdrop-filter', $backdrop_filter );
		}

		// Parallax.
		if ( $has_support( 'parallax' ) ) {
			$parallax_speed = $get_attribute( 'parallax.speed' );
			if ( $parallax_speed ) {
				$add_data_attribute( 'data-unitone-parallax', 'disable' );
				$add_data_attribute( 'data-unitone-parallax-speed', $parallax_speed );
			}
		}

		// Scroll animation.
		if ( $has_support( 'scrollAnimation' ) ) {
			$scroll_animation_type  = $get_attribute( 'scrollAnimation.type' );
			$scroll_animation_speed = $get_attribute( 'scrollAnimation.speed' );

			if ( $scroll_animation_type && 0 !== $scroll_animation_speed ) {
				$add_data_attribute( 'data-unitone-scroll-animation', $scroll_animation_type );
				$add_style( '--unitone--animation-duration', $scroll_animation_speed ? $scroll_animation_speed . 's' : null );

				$scroll_animation_delay = $get_attribute( 'scrollAnimation.delay' );
				if ( $scroll_animation_delay ) {
					$add_style( '--unitone--animation-delay', $scroll_animation_delay . 's' );
				}

				$scroll_animation_easing = $get_attribute( 'scrollAnimation.easing' );
				if ( $scroll_animation_easing ) {
					$add_data_attribute( 'data-unitone-scroll-animation', '-animation-timing-function:' . $scroll_animation_easing );
				}

				$scroll_animation_initial = $get_attribute( 'scrollAnimation.initial' );
				if ( $scroll_animation_initial ) {
					if ( in_array( $scroll_animation_type, array( 'fade-in-down', 'fade-in-up', 'fade-in-left', 'fade-in-right', 'shake-horizontal', 'shake-vertical' ), true ) ) {
						$scroll_animation_initial = $scroll_animation_initial . 'px';
					}
					$add_style( '--unitone--animation-initial', $scroll_animation_initial );
				}
			}
		}

		// Additional style.
		if ( $has_support( 'style' ) ) {
			$instance_id = $get_attribute( 'instanceId' );
			$custom_css  = $get_attribute( 'style' );

			if ( $custom_css ) {
				$custom_css = wp_strip_all_tags( $custom_css );
				$custom_css = preg_replace( '/\r?\n/', ' ', $custom_css );
				$custom_css = preg_replace( '/\s*{\s*/', ' { ', $custom_css );
				$custom_css = preg_replace( '/\s*;\s*/', '; ', $custom_css );
				$custom_css = preg_replace( '/\s*}\s*/', ' }', $custom_css );
				$custom_css = preg_replace( '/}\s*/', "}\n", $custom_css );
				$custom_css = preg_replace( '/\s+/', ' ', $custom_css );
				$custom_css = trim( $custom_css );

				$custom_css_array = explode( "\n", $custom_css );
				$custom_css       = implode(
					"\n",
					array_filter(
						$custom_css_array,
						function ( $line ) {
							return 0 === strpos( $line, '&' );
						}
					)
				);

				$custom_css = preg_replace( '|(&)(?=[^{]*\{)|', '[data-unitone-instance-id="' . $instance_id . '"]', $custom_css );
			}

			if ( $instance_id && $custom_css ) {
				$add_data_attribute( 'data-unitone-instance-id', $instance_id );

				add_action(
					'wp_enqueue_scripts',
					function () use ( $custom_css ) {
						wp_add_inline_style( 'global-styles', $custom_css );
					}
				);
			}
		}

		$block_content = $p->get_updated_html();
		return $block_content;
	},
	10,
	2
);
