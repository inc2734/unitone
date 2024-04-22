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

$show_submenu_indicators = isset( $block->context['showSubmenuIcon'] ) && $block->context['showSubmenuIcon'];
$open_on_click           = isset( $block->context['openSubmenusOnClick'] ) && $block->context['openSubmenusOnClick'];
$open_on_hover_and_click = isset( $block->context['openSubmenusOnClick'] ) && ! $block->context['openSubmenusOnClick'] && $show_submenu_indicators;

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
	data-wp-context='{ "submenuOpenedBy": { "click": false, "hover": false, "focus": false }, "diffx": 0 }'
	data-wp-init="callbacks.init"
	data-wp-on--focusout="actions.handleMenuFocusout"
	<?php if ( ! $open_on_click ) : ?>
		data-wp-on--mouseleave="actions.closeMenuOnHover"
	<?php endif; ?>
	tabindex="-1"
>
	<?php if ( ! $open_on_click ) : ?>
		<?php
		$item_url = isset( $attributes['url'] ) ? $attributes['url'] : '';
		?>
		<a
			class="wp-block-navigation-item__content"
			data-wp-on--mouseover="actions.openMenuOnHover"
			data-wp-bind--aria-expanded="state.isMenuOpen"
			aria-controls="<?php echo esc_attr( $unique_id ); ?>"
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
			data-wp-on--click="actions.toggleMenuOnClick"
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
				data-wp-on--click="actions.toggleMenuOnClick"
				data-wp-bind--aria-expanded="state.isMenuOpen"
				aria-label="<?php echo esc_html( $aria_label ); ?>"
			>
				<?php echo block_core_navigation_submenu_render_submenu_icon(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</button>
		<?php else : ?>
			<span class="wp-block-navigation__submenu-icon"><?php echo block_core_navigation_submenu_render_submenu_icon(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></span>
		<?php endif; ?>
	<?php endif; ?>

	<div
		class="unitone-mega-menu__container"
		data-wp-style----unitone--diffx="state.diffx"
		data-wp-on--focus="actions.openMenuOnFocus"
		data-wp-on--focusout="actions.handleMenuFocusout"
		id="<?php echo esc_attr( $unique_id ); ?>"
	>
		<?php echo wp_kses_post( $content ); ?>
	</div>
</li>
