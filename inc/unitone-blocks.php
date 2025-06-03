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
	register_block_type( get_template_directory() . '/dist/blocks/responsive-switcher' );
	register_block_type( get_template_directory() . '/dist/blocks/responsive-switcher-container' );
	register_block_type( get_template_directory() . '/dist/blocks/section' );
	register_block_type( get_template_directory() . '/dist/blocks/timeline-dots' );
	register_block_type( get_template_directory() . '/dist/blocks/timeline-dots-row' );
	register_block_type( get_template_directory() . '/dist/blocks/timeline-dots-column' );

	require_once get_template_directory() . '/dist/blocks/mega-menu/index.php';
	require_once get_template_directory() . '/dist/blocks/breadcrumbs/index.php';
	require_once get_template_directory() . '/dist/blocks/child-pages/index.php';
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
