<?php
$inner_blocks = $block->parsed_block['innerBlocks'] ?? array();

$block_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'unitone-tabs',
		'id'    => ! empty( $attributes['anchor'] ) ? $attributes['anchor'] : false,
	)
);

$interactivity_context = wp_interactivity_data_wp_context(
	array(
		'current' => $inner_blocks[0]['attrs']['clientId'] ?? false,
	)
);

$tab_bar_classes = array( 'unitone-tab-bar' );
if ( $attributes['tabBarJustification'] ) {
	$tab_bar_classes[] = 'unitone-tab-bar--justification:' . $attributes['tabBarJustification'];
}
?>
<div
	<?php echo wp_kses_data( $block_wrapper_attributes ); ?>
	data-wp-interactive="unitone/tabs"
	<?php echo wp_kses_data( $interactivity_context ); ?>
>
	<div class="unitone-tabs__tab-bar" role="tablist">
		<div class="<?php echo esc_attr( implode( ' ', $tab_bar_classes ) ); ?>" role="tablist">
			<?php foreach ( $inner_blocks as $i => $tab_panel ) : ?>
				<?php
				$style = array();
				if ( ! empty( $tab_panel['attrs']['backgroundColor'] ) ) {
					$style[] = '--unitone--active-background-color: var(--wp--preset--color--' . $tab_panel['attrs']['backgroundColor'] . ')';
				} elseif ( ! empty( $tab_panel['attrs']['style']['color']['background'] ) ) {
					$style[] = '--unitone--active-background-color: ' . $tab_panel['attrs']['style']['color']['background'];
				}
				if ( ! empty( $tab_panel['attrs']['textColor'] ) ) {
					$style[] = '--unitone--active-color: var(--wp--preset--color--' . $tab_panel['attrs']['textColor'] . ')';
				} elseif ( ! empty( $tab_panel['attrs']['style']['color']['text'] ) ) {
					$style[] = '--unitone--active-color: ' . $tab_panel['attrs']['style']['color']['text'];
				}
				?>
				<button
					role="tab"
					class="unitone-tab"
					aria-controls="<?php echo esc_attr( ! empty( $tab_panel['attrs']['anchor'] ) ? $tab_panel['attrs']['anchor'] : $tab_panel['attrs']['clientId'] ); ?>"
					data-wp-context='{ "clientId": "<?php echo esc_attr( $tab_panel['attrs']['clientId'] ); ?>" }'
					data-wp-bind--aria-selected="state.selected"
					data-wp-on--click="actions.handleTabClick"
					<?php if ( $style ) : ?>
						style="<?php echo esc_attr( implode( ';', $style ) ); ?>"
					<?php endif; ?>
				>
					<div class="unitone-tab__label">
						<?php echo wp_kses_post( $tab_panel['attrs']['tabLabel'] ?? '' ); ?>
					</div>
				</button>
			<?php endforeach; ?>
		</div>
	</div>
	<div class="unitone-tabs__tab-view">
		<div class="unitone-tab-view">
			<?php echo wp_kses_post( $content ); ?>
		</div>
	</div>
</div>
