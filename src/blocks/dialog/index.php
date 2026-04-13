<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

register_block_type(
	__DIR__,
	array(
		'render_callback' => 'render_block_unitone_dialog',
	)
);

/**
 * Renders the `unitone/dialog` block on the server.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content The saved content.
 * @param WP_Block $block The block object.
 * @return string
 */
function render_block_unitone_dialog( $attributes, $content, $block ) {
	if ( ! $content ) {
		return $content;
	}

	$inner_blocks       = $block->parsed_block['innerBlocks'] ?? array();
	$dialog_content_id  = null;
	$dialog_content_tag = null;

	foreach ( $inner_blocks as $inner_block ) {
		if ( 'unitone/dialog-content' !== ( $inner_block['blockName'] ?? '' ) ) {
			continue;
		}

		$dialog_content_id = $inner_block['attrs']['anchor'] ?? null;
		break;
	}

	$p = new \WP_HTML_Tag_Processor( $content );

	while ( $p->next_tag() ) {
		$layout = $p->get_attribute( 'data-unitone-layout' );
		if ( ! is_string( $layout ) || false === strpos( $layout, 'dialog-content' ) ) {
			continue;
		}

		$dialog_content_tag = $p->get_tag();
		$dialog_content_id  = $p->get_attribute( 'id' );

		if ( ! is_string( $dialog_content_id ) || '' === $dialog_content_id ) {
			$dialog_content_id = wp_unique_id( 'unitone-dialog-' );
			$p->set_attribute( 'id', $dialog_content_id );
		}

		$p->set_attribute( 'data-wp-on--click', 'actions.closeOnBackdropClick' );
		break;
	}

	$content = $p->get_updated_html();
	if ( ! $dialog_content_id ) {
		return $content;
	}

	$p = new \WP_HTML_Tag_Processor( $content );

	if ( $p->next_tag() ) {
		$p->set_attribute( 'data-wp-interactive', 'unitone/dialog' );
		$p->set_attribute(
			'data-wp-context',
			wp_json_encode(
				array(
					'dialogId' => $dialog_content_id,
				)
			)
		);
	}

	while ( $p->next_tag() ) {
		$tag_name = $p->get_tag();
		if ( 'BUTTON' !== $tag_name && 'INPUT' !== $tag_name ) {
			continue;
		}

		$p->set_attribute( 'data-wp-on--click', 'actions.open' );
		$p->set_attribute( 'aria-controls', $dialog_content_id );
		$p->set_attribute( 'aria-haspopup', $dialog_content_tag ? strtolower( $dialog_content_tag ) : 'dialog' );

		if ( 'BUTTON' === $tag_name && ! $p->get_attribute( 'type' ) ) {
			$p->set_attribute( 'type', 'button' );
		}

		break;
	}

	return $p->get_updated_html();
}
