<?php
$label = $attributes['label'] ?? '';
if ( ! $label ) {
	return null;
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

$classes = array( 'unitone-mega-menu', 'wp-block-navigation-item' );
if ( $open_on_click ) {
	$classes[] = 'open-on-click';
}
if ( $open_on_hover_and_click ) {
	$classes[] = 'open-on-hover-click';
}

$block_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => implode( ' ', $classes ),
	)
);
?>
<li
	<?php echo wp_kses_data( $block_wrapper_attributes ); ?>
	data-wp-interactive="unitone/mega-menu"
	data-wp-context='{ "submenuOpenedBy": { "click": false, "hover": false, "focus": false }, "top": 0, "left": 0 }'
	data-wp-watch="callbacks.initMenu"
	data-wp-on--focusout="actions.handleMenuFocusout"
	data-wp-on--keydown="actions.handleMenuKeydown"
	<?php if ( ! $open_on_click ) : ?>
		data-wp-on-async--mouseenter="actions.openMenuOnHover"
		data-wp-on-async--mouseleave="actions.closeMenuOnHover"
	<?php endif; ?>
	tabindex="-1"
>
	<?php if ( ! $open_on_click ) : ?>
		<?php
		$item_url = isset( $attributes['url'] ) ? $attributes['url'] : '';
		?>
		<a
			class="wp-block-navigation-item__content"
			<?php if ( ! empty( $item_url ) ) : ?>
				href="<?php echo esc_url( $item_url ); ?>"
			<?php endif; ?>
			<?php if ( isset( $attributes['opensInNewTab'] ) && true === $attributes['opensInNewTab'] ) : ?>
				target="_blank"
			<?php endif; ?>
			<?php if ( isset( $attributes['rel'] ) ) : ?>
				rel="<?php echo esc_attr( $attributes['rel'] ); ?>"
			<?php endif; ?>
			<?php if ( isset( $attributes['title'] ) ) : ?>
				title="<?php echo esc_attr( $attributes['title'] ); ?>"
			<?php endif; ?>
		>
			<?php echo esc_html( $label ); ?>
		</a>
	<?php else : ?>
		<button
			class="wp-block-navigation-item__content wp-block-navigation-submenu__toggle"
			data-wp-on-async--click="actions.toggleMenuOnClick"
			data-wp-bind--aria-expanded="state.isMenuOpen"
			aria-controls="<?php echo esc_attr( $unique_id ); ?>"
			aria-label="<?php echo esc_html( $aria_label ); ?>"
		>
			<span class="wp-block-navigation-item__label"><?php echo esc_html( $label ); ?></span>
		</button>
	<?php endif; ?>

	<?php if ( $show_submenu_indicators ) : ?>
		<?php if ( ! $open_on_click ) : ?>
			<button
				class="wp-block-navigation__submenu-icon wp-block-navigation-submenu__toggle"
				data-wp-on-async--click="actions.toggleMenuOnClick"
				data-wp-bind--aria-expanded="state.isMenuOpen"
				aria-controls="<?php echo esc_attr( $unique_id ); ?>"
				aria-label="<?php echo esc_html( $aria_label ); ?>"
			>
				<?php echo block_core_navigation_submenu_render_submenu_icon(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</button>
		<?php else : ?>
			<span class="wp-block-navigation__submenu-icon"><?php echo block_core_navigation_submenu_render_submenu_icon(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></span>
		<?php endif; ?>
	<?php endif; ?>

	<?php
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
	?>
	<div
		class="<?php echo esc_attr( implode( ' ', $inner_blocks_classes ) ); ?>"
		style="<?php echo esc_attr( implode( ';', $inner_blocks_styles ) ); ?>"
		data-wp-on-document--scroll="callbacks.documentScroll"
		data-wp-on-window--resize="callbacks.windowResize"
		data-wp-bind--aria-hidden="!state.isMenuOpen"
		data-wp-style----unitone--top="state.top"
		data-wp-style----unitone--left="state.left"
		data-wp-watch="callbacks.initMenu"
		data-wp-on-async--focus="actions.openMenuOnFocus"
		id="<?php echo esc_attr( $unique_id ); ?>"
		tabindex="0"
	>
		<div class="unitone-mega-menu__placement">
			<?php echo wp_kses_post( $content ); ?>
		</div>
	</div>
</li>
