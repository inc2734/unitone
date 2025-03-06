<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

register_block_type(
	__DIR__,
	array(
		'render_callback' => 'render_block_unitone_tab_panel',
	)
);

/**
 * Renders the `unitone/tab-panel` block on the server.
 *
 * @param array $attributes Block attributes.
 * @param string $content The saved content.
 * @return string
 */
function render_block_unitone_tab_panel( $attributes, $content ) {
	$block_wrapper_attributes = get_block_wrapper_attributes(
		array(
			'class' => 'unitone-tab-panel',
			'id'    => ! empty( $attributes['anchor'] ) ? $attributes['anchor'] : $attributes['clientId'],
		)
	);

	return sprintf(
		'<div
				role="tabpanel"
				%1$s
				data-wp-interactive="unitone/tabs"
				data-wp-context=\'{ "clientId": "%2$s" }\'
				data-wp-bind--aria-hidden="!state.selected"
			>
			%3$s
		</div>',
		$block_wrapper_attributes,
		esc_attr( $attributes['clientId'] ),
		$content
	);
}
