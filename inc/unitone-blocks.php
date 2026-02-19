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
	register_block_type( get_template_directory() . '/dist/blocks/badge' );
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
	register_block_type( get_template_directory() . '/dist/blocks/div' );
	register_block_type( get_template_directory() . '/dist/blocks/flex' );
	register_block_type( get_template_directory() . '/dist/blocks/flex-divided' );
	register_block_type( get_template_directory() . '/dist/blocks/flex-divided-content' );
	register_block_type( get_template_directory() . '/dist/blocks/frame' );
	register_block_type( get_template_directory() . '/dist/blocks/grid' );
	register_block_type( get_template_directory() . '/dist/blocks/grid-divided' );
	register_block_type( get_template_directory() . '/dist/blocks/grid-divided-content' );
	register_block_type( get_template_directory() . '/dist/blocks/layer' );
	register_block_type( get_template_directory() . '/dist/blocks/layers' );
	register_block_type( get_template_directory() . '/dist/blocks/marquee' );
	register_block_type( get_template_directory() . '/dist/blocks/masonry' );
	register_block_type( get_template_directory() . '/dist/blocks/reel' );
	register_block_type( get_template_directory() . '/dist/blocks/responsive-grid' );
	register_block_type( get_template_directory() . '/dist/blocks/responsive-grid-divided' );
	register_block_type( get_template_directory() . '/dist/blocks/responsive-grid-divided-content' );
	register_block_type( get_template_directory() . '/dist/blocks/responsive-image' );
	register_block_type( get_template_directory() . '/dist/blocks/slide' );
	register_block_type( get_template_directory() . '/dist/blocks/slider' );
	register_block_type( get_template_directory() . '/dist/blocks/gutters' );
	register_block_type( get_template_directory() . '/dist/blocks/pattern-inserter' );
	register_block_type( get_template_directory() . '/dist/blocks/stack' );
	register_block_type( get_template_directory() . '/dist/blocks/stack-divided' );
	register_block_type( get_template_directory() . '/dist/blocks/stack-divided-content' );
	register_block_type( get_template_directory() . '/dist/blocks/switcher' );
	register_block_type( get_template_directory() . '/dist/blocks/text' );
	register_block_type( get_template_directory() . '/dist/blocks/texture' );
	register_block_type( get_template_directory() . '/dist/blocks/vertical-writing' );
	register_block_type( get_template_directory() . '/dist/blocks/with-sidebar' );
	register_block_type( get_template_directory() . '/dist/blocks/with-sidebar-content' );
	register_block_type( get_template_directory() . '/dist/blocks/with-sidebar-divided' );

	register_block_type( get_template_directory() . '/dist/blocks/abstract-background' );
	register_block_type( get_template_directory() . '/dist/blocks/accordion' );
	register_block_type( get_template_directory() . '/dist/blocks/reference-sources' );
	register_block_type( get_template_directory() . '/dist/blocks/responsive-switcher-container' );
	register_block_type( get_template_directory() . '/dist/blocks/section' );
	register_block_type( get_template_directory() . '/dist/blocks/timeline-dots' );
	register_block_type( get_template_directory() . '/dist/blocks/timeline-dots-row' );
	register_block_type( get_template_directory() . '/dist/blocks/timeline-dots-column' );

	require_once get_template_directory() . '/dist/blocks/mega-menu/index.php';
	require_once get_template_directory() . '/dist/blocks/breadcrumbs/index.php';
	require_once get_template_directory() . '/dist/blocks/child-pages/index.php';
	require_once get_template_directory() . '/dist/blocks/responsive-switcher/index.php';
	require_once get_template_directory() . '/dist/blocks/tab-panel/index.php';
	require_once get_template_directory() . '/dist/blocks/tabs/index.php';

	foreach ( \WP_Block_Type_Registry::get_instance()->get_all_registered() as $block_type ) {
		if ( ! isset( $block_type->attributes['unitone'] ) ) {
			$block_type->attributes['unitone'] = array(
				'type' => 'object',
			);
		}

		if ( ! isset( $block_type->attributes['__unstableUnitoneSupports'] ) ) {
			$block_type->attributes['__unstableUnitoneSupports'] = array(
				'type' => 'object',
				'role' => 'local',
			);
		}

		if ( ! isset( $block_type->attributes['__unitoneStates'] ) ) {
			$block_type->attributes['__unitoneStates'] = array(
				'type' => 'object',
				'role' => 'local',
			);
		}

		if ( ! isset( $block_type->attributes['__unstableUnitoneBlockOutline'] ) ) {
			$block_type->attributes['__unstableUnitoneBlockOutline'] = array(
				'type' => 'boolean',
				'role' => 'local',
			);
		}
	}
}
add_action( 'init', 'unitone_register_blocks' );

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
 * Add styles with breakpoints fto unitoone/grid.
 *
 * @param string $block_content The block content.
 * @param array $block The full block, including name and attributes.
 * @return string
 */
function unitone_apply_responsive_styles_for_grid( $block_content, $block ) {
	if ( ! $block_content ) {
		return $block_content;
	}

	$attributes   = $block['attrs'] ?? array();
	$inner_blocks = $block['innerBlocks'] ?? array();

	static $defaults = null;
	if ( null === $defaults ) {
		$block_type = \WP_Block_Type_Registry::get_instance()->get_registered( 'unitone/grid' );

		$defaults = array(
			'md'                => $block_type->attributes['mdBreakpoint']['default'] ?? null,
			'sm'                => $block_type->attributes['smBreakpoint']['default'] ?? null,
			'md_columns_option' => $block_type->attributes['mdColumnsOption']['default'] ?? null,
			'sm_columns_option' => $block_type->attributes['smColumnsOption']['default'] ?? null,
			'md_rows_option'    => $block_type->attributes['mdRowsOption']['default'] ?? null,
			'sm_rows_option'    => $block_type->attributes['smRowsOption']['default'] ?? null,
		);
	}

	$md_breakpoint = $attributes['mdBreakpoint'] ?? $defaults['md'];
	$sm_breakpoint = $attributes['smBreakpoint'] ?? $defaults['sm'];
	$client_id     = wp_unique_id( 'unitone-grid-' );

	$has_md_item_responsive = false;
	$has_sm_item_responsive = false;

	foreach ( $inner_blocks as $inner_block ) {
		$unitone = $inner_block['attrs']['unitone'] ?? array();

		if ( ! $has_md_item_responsive ) {
			if (
				( is_array( $unitone['alignSelf'] ?? null ) && ( $unitone['alignSelf']['md'] ?? null ) ) ||
				( is_array( $unitone['justifySelf'] ?? null ) && ( $unitone['justifySelf']['md'] ?? null ) ) ||
				( is_array( $unitone['gridColumn'] ?? null ) && ( $unitone['gridColumn']['md'] ?? null ) ) ||
				( is_array( $unitone['gridRow'] ?? null ) && ( $unitone['gridRow']['md'] ?? null ) )
			) {
				$has_md_item_responsive = true;
			}
		}

		if ( ! $has_sm_item_responsive ) {
			if (
				( is_array( $unitone['alignSelf'] ?? null ) && ( $unitone['alignSelf']['sm'] ?? null ) ) ||
				( is_array( $unitone['justifySelf'] ?? null ) && ( $unitone['justifySelf']['sm'] ?? null ) ) ||
				( is_array( $unitone['gridColumn'] ?? null ) && ( $unitone['gridColumn']['sm'] ?? null ) ) ||
				( is_array( $unitone['gridRow'] ?? null ) && ( $unitone['gridRow']['sm'] ?? null ) )
			) {
				$has_sm_item_responsive = true;
			}
		}

		if ( $has_md_item_responsive && $has_sm_item_responsive ) {
			break;
		}
	}

	$md_columns_option = $attributes['mdColumnsOption'] ?? $defaults['md_columns_option'];
	$sm_columns_option = $attributes['smColumnsOption'] ?? $defaults['sm_columns_option'];
	$md_rows_option    = $attributes['mdRowsOption'] ?? $defaults['md_rows_option'];
	$sm_rows_option    = $attributes['smRowsOption'] ?? $defaults['sm_rows_option'];

	$md_conditions = array(
		'columns_columns' => 'columns' === $md_columns_option && ( $attributes['mdColumns'] ?? null ),
		'columns_min'     => 'min' === $md_columns_option && ( $attributes['mdColumnMinWidth'] ?? null ),
		'columns_free'    => 'free' === $md_columns_option && ( $attributes['mdGridTemplateColumns'] ?? null ),
		'rows_rows'       => 'rows' === $md_rows_option && ( $attributes['mdRows'] ?? null ),
		'rows_free'       => 'free' === $md_rows_option && ( $attributes['mdGridTemplateRows'] ?? null ),
		'items'           => $has_md_item_responsive,
	);

	$sm_conditions = array(
		'columns_columns' => 'columns' === $sm_columns_option && ( $attributes['smColumns'] ?? null ),
		'columns_min'     => 'min' === $sm_columns_option && ( $attributes['smColumnMinWidth'] ?? null ),
		'columns_free'    => 'free' === $sm_columns_option && ( $attributes['smGridTemplateColumns'] ?? null ),
		'rows_rows'       => 'rows' === $sm_rows_option && ( $attributes['smRows'] ?? null ),
		'rows_free'       => 'free' === $sm_rows_option && ( $attributes['smGridTemplateRows'] ?? null ),
		'items'           => $has_sm_item_responsive,
	);

	$p = new \WP_HTML_Tag_Processor( $block_content );
	if ( ! $p->next_tag() ) {
		return $block_content;
	}

	$p->set_attribute( 'data-unitone-client-id', $client_id );

	static $build_css = null;
	if ( null === $build_css ) {
		$build_css = function ( $selector, $breakpoint, $size, $condition ) {
			$columns_columns = $condition['columns_columns'] ?? false;
			$columns_min     = $condition['columns_min'] ?? false;
			$columns_free    = $condition['columns_free'] ?? false;
			$rows_rows       = $condition['rows_rows'] ?? false;
			$rows_free       = $condition['rows_free'] ?? false;
			$items           = $condition['items'] ?? false;

			if (
				! $columns_columns &&
				! $columns_min &&
				! $columns_free &&
				! $rows_rows &&
				! $rows_free &&
				! $items
			) {
				return '';
			}

			$prefix = '--unitone--' . $size;
			$rules  = array();

			if ( $columns_columns ) {
				$rules[] = sprintf(
					'%1$s[data-unitone-layout~="-columns\\:%2$s\\:columns"] { grid-template-columns: repeat(var(%3$s-columns), 1fr); }',
					$selector,
					$size,
					$prefix
				);
			}

			if ( $columns_min ) {
				$rules[] = sprintf(
					'%1$s[data-unitone-layout~="-columns\\:%2$s\\:min"] { grid-template-columns: repeat(var(--unitone--column-auto-repeat), minmax(min(var(%3$s-column-min-width), 100%%), 1fr)); }',
					$selector,
					$size,
					$prefix
				);
			}

			if ( $columns_free ) {
				$rules[] = sprintf(
					'%1$s[data-unitone-layout~="-columns\\:%2$s\\:free"] { grid-template-columns: var(%3$s-grid-template-columns); }',
					$selector,
					$size,
					$prefix
				);
			}

			if ( $rows_rows ) {
				$rules[] = sprintf(
					'%1$s[data-unitone-layout~="-rows\\:%2$s\\:rows"] { grid-template-rows: repeat(var(%3$s-rows), 1fr); }',
					$selector,
					$size,
					$prefix
				);
			}

			if ( $rows_free ) {
				$rules[] = sprintf(
					'%1$s[data-unitone-layout~="-rows\\:%2$s\\:free"] { grid-template-rows: var(%3$s-grid-template-rows); }',
					$selector,
					$size,
					$prefix
				);
			}

			if ( $items ) {
				$rules[] = sprintf(
					'%1$s > * { grid-column: var(%2$s-grid-column); grid-row: var(%2$s-grid-row); align-self: var(%2$s-align-self); justify-self: var(%2$s-justify-self); }',
					$selector,
					$prefix
				);
			}

			return sprintf(
				'@media not all and (min-width: %1$s) { %2$s }',
				esc_attr( $breakpoint ),
				implode( ' ', $rules )
			);
		};
	}

	$selector = '[data-unitone-client-id="' . esc_attr( $client_id ) . '"]';
	$css      =
		$build_css( $selector, $md_breakpoint, 'md', $md_conditions ) .
		$build_css( $selector, $sm_breakpoint, 'sm', $sm_conditions );

	if ( $css ) {
		wp_add_inline_style( 'unitone-grid-style', $css );
	}

	return $p->get_updated_html();
}

add_filter(
	'render_block_unitone/grid',
	function ( $block_content, $block ) {
		return unitone_apply_responsive_styles_for_grid( $block_content, $block );
	},
	10,
	2
);

add_filter(
	'render_block_unitone/grid-divided',
	function ( $block_content, $block ) {
		return unitone_apply_responsive_styles_for_grid( $block_content, $block );
	},
	10,
	2
);

/**
 * Add "Outer block link" support to unitone/decorator.
 *
 * @param string $block_content The block content.
 * @param array $block The full block, including name and attributes.
 * @return string
 */
function unitone_apply_block_link_to_decorator( $block_content, $block ) {
	$p = new \WP_HTML_Tag_Processor( $block_content );
	if ( ! $p->next_tag() ) {
		return $block_content;
	}

	$layout = $p->get_attribute( 'data-unitone-layout' );
	if ( false === strpos( $layout, '-has-link' ) ) {
		return $block_content;
	}

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

	return str_replace( array( '<a ', '</a>' ), array( '<span ', '</span>' ), $p->get_updated_html() );
}
add_filter( 'render_block_unitone/decorator', 'unitone_apply_block_link_to_decorator', 10, 2 );

/**
 * Remove .unitone-timeline-dots-column--nonentity
 *
 * @param string $block_content The block content.
 * @param array $block The full block, including name and attributes.
 * @return string
 */
function unitone_remove_timeline_dots_column_nonentity( $block_content, $block ) {
	if ( $block['attrs']['nonentity'] ?? false ) {
		return '';
	}
	return $block_content;
}
add_filter( 'render_block_unitone/timeline-dots-column', 'unitone_remove_timeline_dots_column_nonentity', 10, 2 );

/**
 * Add thumbnails to slider block.
 *
 * @param string $block_content The block content.
 * @param array $block The full block, including name and attributes.
 * @return string
 */
function unitone_apply_slider_thumbnails( $block_content, $block ) {
	$inner_blocks = $block['innerBlocks'] ?? array();
	$attributes   = $block['attrs'];
	$thumbnails   = $attributes['thumbnails'] ?? false;

	if ( ! $thumbnails ) {
		return $block_content;
	}

	$thumbnails_html = '';
	foreach ( $inner_blocks as $slide ) {
		if ( 'unitone/slide' === $slide['blockName'] ) {
			$thumbnails_html .= preg_replace( '|^<div |s', '<div role="button" tabindex="0" ', trim( render_block( $slide ) ) );
		}
	}

	$block_content = preg_replace(
		'|<div class="unitone-slider-thumbnails"></div>|s',
		'<div class="unitone-slider-thumbnails">' . $thumbnails_html . '</div>',
		$block_content
	);

	return $block_content;
}
add_filter( 'render_block_unitone/slider', 'unitone_apply_slider_thumbnails', 10, 2 );

/**
 * Filters the supported block attributes for block bindings of unitone/badge.
 *
 * @param array $supported_block_attributes The block's attributes that are supported by block bindings.
 */
add_filter(
	'block_bindings_supported_attributes_unitone/badge',
	function ( $supported_block_attributes ) {
		$supported_block_attributes[] = 'content';
		return $supported_block_attributes;
	}
);

/**
 * Make core/list-item injectable into unitone/reference-sources.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
add_filter(
	'block_type_metadata',
	function ( $metadata ) {
		if ( 'core/list-item' === $metadata['name'] ) {
			$metadata['parent'] = array_merge(
				$metadata['parent'],
				array( 'unitone/reference-sources' )
			);
		}
		return $metadata;
	}
);
