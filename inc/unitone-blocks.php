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
	register_block_type( get_template_directory() . '/dist/blocks/masonry' );
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

	$attributes = $block['attrs'] ?? array();

	static $defaults = null;
	if ( null === $defaults ) {
		$block_type = \WP_Block_Type_Registry::get_instance()->get_registered( 'unitone/grid' );

		$defaults = array(
			'md' => $block_type->attributes['mdBreakpoint']['default'],
			'sm' => $block_type->attributes['smBreakpoint']['default'],
		);
	}

	$md_breakpoint = $attributes['mdBreakpoint'] ?? $defaults['md'];
	$sm_breakpoint = $attributes['smBreakpoint'] ?? $defaults['sm'];
	$client_id     = $attributes['clientId'] ?? wp_rand();

	$p = new \WP_HTML_Tag_Processor( $block_content );
	if ( ! $p->next_tag() ) {
		return $block_content;
	}

	if ( ! $p->get_attribute( 'data-unitone-client-id' ) ) {
		$p->set_attribute( 'data-unitone-client-id', $client_id );
	}

	static $build_css = function ( $selector, $breakpoint, $size ) {
		$prefix = '--unitone--' . $size;

		return sprintf(
			'@media not all and (min-width: %1$s) { %2$s > * { grid-column: var(%3$s-grid-column); grid-row: var(%3$s-grid-row); } %2$s[data-unitone-layout~="-columns\\:%4$s\\:columns"] { grid-template-columns: repeat(var(%3$s-columns), 1fr); }\ %2$s[data-unitone-layout~="-columns\\:%4$s\\:min"] { grid-template-columns: repeat(var(--unitone--column-auto-repeat), minmax(min(var(%3$s-column-min-width), 100%%), 1fr)); }\ %2$s[data-unitone-layout~="-columns\\:%4$s\\:free"] { grid-template-columns: var(%3$s-grid-template-columns); }\ %2$s[data-unitone-layout~="-rows\\:%4$s\\:rows"] { grid-template-rows: repeat(var(%3$s-rows), 1fr); }\ %2$s[data-unitone-layout~="-rows\\:%4$s\\:free"] { grid-template-rows: var(%3$s-grid-template-rows); } }',
			esc_attr( $breakpoint ),
			$selector,
			$prefix,
			$size
		);
	};

	$selector = '[data-unitone-client-id="' . esc_attr( $client_id ) . '"]';

	wp_add_inline_style(
		'unitone-grid-style',
		$build_css( $selector, $md_breakpoint, 'md' ) . $build_css( $selector, $sm_breakpoint, 'sm' )
	);

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
