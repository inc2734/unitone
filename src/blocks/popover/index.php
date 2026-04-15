<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

register_block_type(
	__DIR__,
	array(
		'render_callback' => 'render_block_unitone_popover',
	)
);

/**
 * Renders the `unitone/popover` block on the server.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content The saved content.
 * @param WP_Block $block The block object.
 * @return string
 */
function render_block_unitone_popover( $attributes, $content, $block ) {
	if ( ! $content ) {
		return $content;
	}

	/**
	 * Updates popover trigger markup.
	 *
	 * @param string $content Rendered block content.
	 * @param string $popover_content_id Popover content id.
	 * @return string
	 */
	$update_popover_trigger_markup = static function ( $content, $popover_content_id ) {
		if ( ! $content || ! class_exists( '\DOMDocument' ) || ! class_exists( '\DOMXPath' ) ) {
			return $content;
		}

		$dom             = new \DOMDocument( '1.0', 'UTF-8' );
		$previous        = libxml_use_internal_errors( true );
		$encoded_content = mb_encode_numericentity(
			$content,
			array( 0x80, 0x10FFFF, 0, 0xFFFF ),
			'UTF-8'
		);

		$loaded = $dom->loadHTML(
			$encoded_content,
			LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
		);

		libxml_clear_errors();
		libxml_use_internal_errors( $previous );

		if ( ! $loaded ) {
			return $content;
		}

		$xpath   = new \DOMXPath( $dom );
		$trigger = $xpath->query(
			unitone_css_selector_to_xpath(
				'[data-unitone-layout~="popover-trigger"]'
			)
		)->item( 0 );

		if ( ! $trigger instanceof \DOMElement ) {
			return $content;
		}

		$anchors = $xpath->query(
			unitone_css_selector_to_xpath(
				':scope > .wp-block-buttons > .wp-block-button > .wp-block-button__link'
			),
			$trigger
		);
		if ( $anchors instanceof \DOMNodeList && 0 < $anchors->length ) {
			$anchor_elements = array();
			foreach ( $anchors as $anchor ) {
				if ( $anchor instanceof \DOMElement ) {
					$anchor_elements[] = $anchor;
				}
			}

			foreach ( $anchor_elements as $anchor ) {
				$button = $dom->createElement( 'button' );

				foreach ( iterator_to_array( $anchor->attributes ) as $attribute ) {
					// phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
					if ( in_array( $attribute->nodeName, array( 'href', 'target', 'rel', 'download' ), true ) ) {
						continue;
					}

					$button->setAttribute( $attribute->nodeName, $attribute->nodeValue ?? '' ); // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
				}

				// phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
				while ( $anchor->firstChild ) {
					$button->appendChild( $anchor->firstChild ); // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
				}

				$anchor->parentNode->replaceChild( $button, $anchor ); // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
			}
		}

		$targets = $xpath->query(
			unitone_css_selector_to_xpath(
				':scope > .wp-block-buttons > .wp-block-button > .wp-block-button__link'
			),
			$trigger
		);
		if ( ! $targets instanceof \DOMNodeList || 0 === $targets->length ) {
			return $dom->saveHTML();
		}

		foreach ( $targets as $target ) {
			if ( ! $target instanceof \DOMElement ) {
				continue;
			}

			$target->setAttribute( 'popovertarget', $popover_content_id );
			$target->setAttribute( 'aria-controls', $popover_content_id );
		}

		return $dom->saveHTML();
	};

	$inner_blocks       = $block->parsed_block['innerBlocks'] ?? array();
	$popover_content_id = null;

	foreach ( $inner_blocks as $inner_block ) {
		if ( 'unitone/popover-content' !== ( $inner_block['blockName'] ?? '' ) ) {
			continue;
		}

		$popover_content_id = $inner_block['attrs']['anchor'] ?? null;
		break;
	}

	$p = new \WP_HTML_Tag_Processor( $content );

	while ( $p->next_tag() ) {
		$layout = $p->get_attribute( 'data-unitone-layout' );
		if ( ! is_string( $layout ) || false === strpos( $layout, 'popover-content' ) ) {
			continue;
		}

		$popover_content_id = $p->get_attribute( 'id' );
		if ( ! is_string( $popover_content_id ) || '' === $popover_content_id ) {
			$popover_content_id = wp_unique_id( 'unitone-popover-' );
			$p->set_attribute( 'id', $popover_content_id );
		}
		break;
	}

	if ( ! $popover_content_id ) {
		return $p->get_updated_html();
	}

	return $update_popover_trigger_markup(
		$p->get_updated_html(),
		$popover_content_id
	);
}
