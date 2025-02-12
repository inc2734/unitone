<?php
$block_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'unitone-tab-panel',
		'id'    => ! empty( $attributes['anchor'] ) ? $attributes['anchor'] : $attributes['clientId'],
	)
);
?>
<div
	role="tabpanel"
	<?php echo wp_kses_data( $block_wrapper_attributes ); ?>
	data-wp-interactive="unitone/tabs"
	data-wp-context='{ "clientId": "<?php echo esc_attr( $attributes['clientId'] ); ?>" }'
	data-wp-bind--aria-hidden="!state.selected"
>
	<?php echo wp_kses_post( $content ); ?>
</div>
