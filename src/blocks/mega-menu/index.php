<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

register_block_type(
	__DIR__,
	array(
		'render_callback' => 'render_block_unitone_mega_menu',
	)
);

/**
 * Renders the `unitone/mega-menu` block on the server.
 *
 * @param array $attributes Block attributes.
 * @param string $content The saved content.
 * @return string
 */
function render_block_unitone_mega_menu( $attributes, $content ) {
	$label = $attributes['label'] ?? '';
	if ( ! $label ) {
		return;
	}

	$aria_label = sprintf(
		/* translators: Accessibility text. %s: Parent page title. */
		__( '%s mega menu', 'unitone' ),
		wp_strip_all_tags( $label )
	);

	$unique_id = wp_unique_id( 'p-' );

	$item_url                = isset( $attributes['url'] ) ? $attributes['url'] : '';
	$show_submenu_indicators = isset( $attributes['showSubmenuIcon'] ) && $attributes['showSubmenuIcon'];
	$open_on_click           = ( isset( $attributes['openSubmenusOnClick'] ) && $attributes['openSubmenusOnClick'] ) || ! $item_url;
	$open_on_hover_and_click = isset( $attributes['openSubmenusOnClick'] ) && ! $attributes['openSubmenusOnClick'] && $show_submenu_indicators;
	$has_width               = isset( $attributes['width'] );

	$classes = array( 'unitone-mega-menu', 'wp-block-navigation-item' );
	if ( $open_on_click ) {
		$classes[] = 'open-on-click';
	}
	if ( $open_on_hover_and_click ) {
		$classes[] = 'open-on-hover-click';
	}
	if ( $has_width ) {
		$classes[] = 'unitone-mega-menu--width:' . $attributes['width'];
	}

	$block_wrapper_attributes = get_block_wrapper_attributes(
		array(
			'class' => implode( ' ', $classes ),
		)
	);

	$html  = '<li ' . $block_wrapper_attributes;
	$html .= ' data-wp-interactive="unitone/mega-menu"';
	$html .= ' data-wp-context=\'{ "submenuOpenedBy": { "click": false, "hover": false, "focus": false }, rect: { "top": 0, "left": 0, "width": 0 }, megaMenuRect: { "left": 0, "width": 0, "diff": 0 }, viewport: { "width": 0, "height": 0 } }\'';
	$html .= ' data-wp-watch="callbacks.initMenu"';
	$html .= ' data-wp-on--focusout="actions.handleMenuFocusout"';
	$html .= ' data-wp-on--keydown="actions.handleMenuKeydown"';
	$html .= ' data-wp-style----unitone--rect-top="state.top"';
	$html .= ' data-wp-style----unitone--rect-left="state.left"';
	$html .= ' data-wp-style----unitone--rect-right="state.right"';
	$html .= ' data-wp-style----unitone--mega-menu-diff="state.diff"';
	$html .= ' tabindex="-1"';

	if ( ! $open_on_click ) {
		$html .= ' data-wp-on-async--mouseenter="actions.openMenuOnHover"';
		$html .= ' data-wp-on-async--mouseleave="actions.closeMenuOnHover"';
		$html .= '>';

		$item_url = isset( $attributes['url'] ) ? $attributes['url'] : '';

		$html .= '<a class="wp-block-navigation-item__content"';
		if ( ! empty( $item_url ) ) {
			$html .= ' href="' . esc_url( $item_url ) . '"';
		}
		if ( isset( $attributes['opensInNewTab'] ) && true === $attributes['opensInNewTab'] ) {
			$html .= ' target="_blank"';
		}
		if ( isset( $attributes['rel'] ) ) {
			$html .= ' rel="' . esc_attr( $attributes['rel'] ) . '"';
		}
		if ( isset( $attributes['title'] ) ) {
			$html .= ' title="' . esc_attr( $attributes['title'] ) . '"';
		}
		$html .= '>' . esc_html( $label ) . '</a>';
	} else {
		$html .= '>';
		$html .= '<button class="wp-block-navigation-item__content wp-block-navigation-submenu__toggle"';
		$html .= ' data-wp-on-async--click="actions.toggleMenuOnClick"';
		$html .= ' data-wp-bind--aria-expanded="state.isMenuOpen"';
		$html .= ' aria-controls="' . esc_attr( $unique_id ) . '"';
		$html .= ' aria-label="' . esc_attr( $aria_label ) . '"';
		$html .= '>';
		$html .= '<span class="wp-block-navigation-item__label">' . esc_html( $label ) . '</span>';
		$html .= '</button>';
	}

	if ( $show_submenu_indicators ) {
		$html .= '<button class="wp-block-navigation__submenu-icon wp-block-navigation-submenu__toggle"';
		$html .= ' data-wp-on-async--click="actions.toggleMenuOnClick"';
		$html .= ' data-wp-bind--aria-expanded="state.isMenuOpen"';
		$html .= ' aria-controls="' . esc_attr( $unique_id ) . '"';
		$html .= ' aria-label="' . esc_html( $aria_label ) . '"';
		$html .= '>';
		$html .= block_core_navigation_submenu_render_submenu_icon();
		$html .= '</button>';
	}

	$inner_blocks_classes = array( 'unitone-mega-menu__container' );
	$inner_blocks_styles  = array();

	// Background color.
	$has_named_background_color  = array_key_exists( 'overlayBackgroundColor', $attributes );
	$has_custom_background_color = array_key_exists( 'customOverlayBackgroundColor', $attributes );

	// If has background color.
	if ( $has_custom_background_color || $has_named_background_color ) {
		// Add has-background class.
		$inner_blocks_classes[] = 'has-background';
	}

	if ( $has_named_background_color ) {
		// Add the background-color class.
		$inner_blocks_classes[] = sprintf( 'has-%s-background-color', $attributes['overlayBackgroundColor'] );
	} elseif ( $has_custom_background_color ) {
		// Add the custom background-color inline style.
		$inner_blocks_styles[] = sprintf( 'background-color: %s', $attributes['customOverlayBackgroundColor'] );
	}

	$html .= '<div';
	$html .= ' class="' . esc_attr( implode( ' ', $inner_blocks_classes ) ) . '"';
	$html .= ' style="' . esc_attr( implode( ';', $inner_blocks_styles ) ) . '"';
	$html .= ' data-wp-on--wheel="callbacks.wheel"';
	$html .= ' data-wp-on-window--resize="callbacks.windowResize"';
	$html .= ' data-wp-bind--aria-hidden="!state.isMenuOpen"';
	$html .= ' data-wp-watch="callbacks.initMenu"';
	$html .= ' data-wp-on-async--focus="actions.openMenuOnFocus"';
	$html .= ' id="' . esc_attr( $unique_id ) . '"';
	$html .= ' tabindex="0">';
	$html .= '<div class="unitone-mega-menu__placement">' . $content . '</div>';
	$html .= '</div>';
	$html .= '</li>';

	return $html;
}
