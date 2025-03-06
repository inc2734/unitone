<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

use Inc2734\WP_Breadcrumbs;

register_block_type(
	__DIR__,
	array(
		'render_callback' => 'render_block_unitone_breadcrumbs',
	)
);

/**
 * Renders the `unitone/breadcrumbs` block on the server.
 *
 * @param array $attributes Block attributes.
 *
 * @return string
 */
function render_block_unitone_breadcrumbs( $attributes ) {
	$get_breadcrumbs_items = function () {
		$breadcrumbs_items = array();
		if ( $breadcrumbs_items ) {
			return $breadcrumbs_items;
		}

		$breadcrumbs       = new WP_Breadcrumbs\Bootstrap();
		$breadcrumbs_items = apply_filters( 'unitone_breadcrumbs', $breadcrumbs->get() );
		return $breadcrumbs_items;
	};

	$items = $get_breadcrumbs_items();
	$items = array_values( $items );

	if ( ! $items ) {
		return;
	}

	$allowed_html = wp_kses_allowed_html( 'post' );
	unset( $allowed_html['a'] );

	$classes = array(
		'unitone-breadcrumbs',
	);
	if ( ! empty( $attributes['divider'] ) ) {
		$classes[] = 'unitone-breadcrumbs--divider:' . $attributes['divider'];
	}
	if ( ! empty( $attributes['fontSize'] ) ) {
		$classes[] = 'has-' . $attributes['fontSize'] . '-font-size';
	}

	$block_wrapper_attributes = get_block_wrapper_attributes(
		array(
			'class' => implode( ' ', $classes ),
			'id'    => ! empty( $attributes['anchor'] ) ? $attributes['anchor'] : false,
		)
	);

	$list_items = array();
	foreach ( $items as $key => $item ) {
		$is_last_item = (int) count( $items ) - 1 === (int) $key;

		/**
		 * @see https://github.com/WordPress/WordPress/blob/5.4-branch/wp-includes/default-filters.php#L168-L170
		 */
		$_title = wptexturize( $item['title'] );
		$_title = convert_chars( $_title );
		$_title = trim( $_title );
		$_title = wp_kses( $_title, $allowed_html );

		$list_items [] = sprintf(
			'<li
				class="unitone-breadcrumbs__item"
				itemprop="itemListElement"
				itemscope
				itemtype="http://schema.org/ListItem"
			>
				<a
					itemscope
					itemtype="http://schema.org/Thing"
					itemprop="item"
					href="%1$s"
					itemid="%1$s"
					%2$s
				>
					<span itemprop="name">%3$s</span>
				</a>
				<meta itemprop="position" content="%4$s" />
			</li>',
			esc_url( $item['link'] ),
			$is_last_item ? 'aria-current="page"' : '',
			$_title,
			$key + 1
		);
	}

	return sprintf(
		'<ol %1$s itemscope itemtype="http://schema.org/BreadcrumbList">%2$s</ol>',
		$block_wrapper_attributes,
		implode( '', $list_items )
	);
}
