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

	/**
	 * Returns the valid trigger type for the dialog block.
	 *
	 * @param array $attributes Block attributes.
	 * @return string|null
	 */
	$get_dialog_trigger_type = static function ( $attributes ) {
		$variation = $attributes['variation'] ?? null;

		if ( 'dialog-box' === $variation ) {
			return 'box';
		}

		if ( 'dialog-button' === $variation ) {
			return 'button';
		}

		return null;
	};

	/**
	 * Converts direct dialog button links to buttons.
	 *
	 * @param DOMDocument $dom DOM document.
	 * @param DOMXPath    $xpath XPath instance.
	 * @param DOMElement  $trigger Trigger element.
	 * @return void
	 */
	$convert_dialog_button_links_to_buttons = static function ( $dom, $xpath, $trigger ) {
		$targets = $xpath->query(
			unitone_css_selector_to_xpath(
				':scope > .wp-block-buttons > .wp-block-button > .wp-block-button__link'
			),
			$trigger
		);
		if ( ! $targets instanceof \DOMNodeList || 0 === $targets->length ) {
			return;
		}

		$anchor_elements = array();
		foreach ( $targets as $target ) {
			// phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
			if ( ! $target instanceof \DOMElement || 'a' !== strtolower( $target->tagName ) ) {
				continue;
			}

			$anchor_elements[] = $target;
		}

		if ( ! $anchor_elements ) {
			return;
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
	};

	/**
	 * Adds role="button" to direct dialog decorators.
	 *
	 * @param DOMXPath   $xpath XPath instance.
	 * @param DOMElement $trigger Trigger element.
	 * @return void
	 */
	$add_role_button_to_dialog_decorators = static function ( $xpath, $trigger ) {
		$decorators = $xpath->query(
			unitone_css_selector_to_xpath(
				':scope > [data-unitone-layout~="decorator"]'
			),
			$trigger
		);
		if ( ! $decorators instanceof \DOMNodeList || 0 === $decorators->length ) {
			return;
		}

		foreach ( $decorators as $decorator ) {
			if ( ! $decorator instanceof \DOMElement || $decorator->hasAttribute( 'role' ) ) {
				continue;
			}

			$decorator->setAttribute( 'role', 'button' );
		}
	};

	/**
	 * Adds dialog trigger attributes to the first valid trigger target.
	 *
	 * @param string      $content Rendered block content.
	 * @param string      $dialog_content_id Dialog content id.
	 * @param string|null $dialog_content_tag Dialog content tag name.
	 * @param string|null $trigger_type Dialog trigger type.
	 * @return string
	 */
	$update_dialog_trigger_markup = static function ( $content, $dialog_content_id, $dialog_content_tag, $trigger_type ) use ( $convert_dialog_button_links_to_buttons, $add_role_button_to_dialog_decorators ) {
		if ( ! class_exists( '\DOMDocument' ) || ! class_exists( '\DOMXPath' ) ) {
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
				'[data-unitone-layout~="dialog-trigger"]'
			)
		)->item( 0 );

		if ( ! $trigger instanceof \DOMElement ) {
			return $content;
		}

		$trigger->setAttribute( 'data-wp-on--click', 'actions.open' );

		if ( 'button' === $trigger_type ) {
			$convert_dialog_button_links_to_buttons( $dom, $xpath, $trigger );
		} elseif ( 'box' === $trigger_type ) {
			$add_role_button_to_dialog_decorators( $xpath, $trigger );
		}

		if ( 'button' === $trigger_type ) {
			$query = unitone_css_selector_to_xpath(
				':scope > .wp-block-buttons > .wp-block-button > .wp-block-button__link'
			);
		} elseif ( 'box' === $trigger_type ) {
			$query = unitone_css_selector_to_xpath(
				':scope > [data-unitone-layout~="decorator"]'
			);
		} else {
			$query = unitone_css_selector_to_xpath(
				':scope .wp-block-button__link, :scope [data-unitone-layout~="decorator"][role="button"]'
			);
		}

		$targets = $xpath->query( $query, $trigger );
		if ( ! $targets instanceof \DOMNodeList || 0 === $targets->length ) {
			return $dom->saveHTML();
		}

		foreach ( $targets as $target ) {
			if ( ! $target instanceof \DOMElement ) {
				continue;
			}

			$target->setAttribute( 'aria-controls', $dialog_content_id );
			$target->setAttribute( 'aria-haspopup', $dialog_content_tag ? strtolower( $dialog_content_tag ) : 'dialog' );

			// phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
			if ( 'button' === strtolower( $target->tagName ) && ! $target->hasAttribute( 'type' ) ) {
				$target->setAttribute( 'type', 'button' );
			}

			if ( 'box' === $trigger_type && ! $target->hasAttribute( 'role' ) && $target->hasAttribute( 'data-unitone-layout' ) ) {
				$target->setAttribute( 'role', 'button' );
			}
		}

		return $dom->saveHTML();
	};

	$inner_blocks       = $block->parsed_block['innerBlocks'] ?? array();
	$dialog_content_id  = null;
	$dialog_content_tag = null;
	$trigger_type       = $get_dialog_trigger_type( $attributes );

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
					'dialogId'  => $dialog_content_id,
					'variation' => $attributes['variation'] ?? '',
				)
			)
		);
	}

	return $update_dialog_trigger_markup(
		$p->get_updated_html(),
		$dialog_content_id,
		$dialog_content_tag,
		$trigger_type
	);
}
