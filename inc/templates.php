<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

/**
 * If the front page is not used, front-page.html should not be used.
 */
function unitone_hidden_front_page_template_on_blog( $templates ) {
	$show_on_front = get_option( 'show_on_front' );
	$page_on_front = get_option( 'page_on_front' );
	if ( 'page' !== $show_on_front || ! $page_on_front ) {
		foreach ( $templates as $index => $template ) {
			if ( 'front-page' === $template->slug ) {
				unset( $templates[ $index ] );
			}
		}
	}
	return $templates;
}
add_filter( 'get_block_templates', 'unitone_hidden_front_page_template_on_blog' );

/**
 * Display deprecated parts at the frontend.
 * Note: Not displayed in the Site Editor.
 *
 * @see https://github.com/WordPress/wordpress-develop/blob/trunk/src/wp-includes/block-template-utils.php#L319
 */
function unitone_display_deprecated_parts() {
	if ( WP_Block_Type_Registry::get_instance()->is_registered( 'core/template-part' ) ) {
		// If it is already registered, unregister first.
		unregister_block_type( 'core/template-part' );
	}

	register_block_type_from_metadata(
		ABSPATH . WPINC . '/blocks/template-part',
		array(
			'variations'      => build_template_part_block_variations(),
			'render_callback' => function( $attributes ) {
				$template_part_id = null;
				$content          = null;
				$area             = WP_TEMPLATE_PART_AREA_UNCATEGORIZED;
				$stylesheet       = get_stylesheet();

				if (
					'footer-breadcrumbs' === $attributes['slug']
					|| 0 === strpos( $attributes['slug'], 'contents-' )
					|| 0 === strpos( $attributes['slug'], 'page-header-' )
					|| 0 === strpos( $attributes['slug'], 'template-' )
				) {
					if (
						isset( $attributes['slug'] ) &&
						isset( $attributes['theme'] ) &&
						$stylesheet === $attributes['theme']
					) {
						$template_part_id    = $attributes['theme'] . '//' . $attributes['slug'];
						$template_part_query = new WP_Query(
							array(
								'post_type'           => 'wp_template_part',
								'post_status'         => 'publish',
								'post_name__in'       => array( $attributes['slug'] ),
								'tax_query'           => array(
									array(
										'taxonomy' => 'wp_theme',
										'field'    => 'name',
										'terms'    => $attributes['theme'],
									),
								),
								'posts_per_page'      => 1,
								'no_found_rows'       => true,
								'lazy_load_term_meta' => false, // Do not lazy load term meta, as template parts only have one term.
							)
						);
						$template_part_post  = $template_part_query->have_posts() ? $template_part_query->next_post() : null;
						if ( $template_part_post ) {
							// A published post might already exist if this template part was customized elsewhere
							// or if it's part of a customized template.
							$content    = $template_part_post->post_content;
							$content = shortcode_unautop( $content );
							$content = do_shortcode( $content );
							$content = do_blocks( $content );
							$content = wptexturize( $content );
							$content = convert_smilies( $content );
							$content = wp_filter_content_tags( $content, "template_part_{$area}" );

							// Handle embeds for block template parts.
							global $wp_embed;
							$content = $wp_embed->autoembed( $content );

							if ( empty( $attributes['tagName'] ) ) {
								$area_tag = 'div';
								if ( $area_definition && isset( $area_definition['area_tag'] ) ) {
									$area_tag = $area_definition['area_tag'];
								}
								$html_tag = $area_tag;
							} else {
								$html_tag = esc_attr( $attributes['tagName'] );
							}
							$wrapper_attributes = get_block_wrapper_attributes();

							return "<$html_tag $wrapper_attributes>" . str_replace( ']]>', ']]&gt;', $content ) . "</$html_tag>";
						}
					}

					// Rewrite the slug (= path).
					// Now the HTML of the file will be output for now, but customization will be skipped.
					$attributes['slug'] = 'deprecated/' . $attributes['slug'];
				}

				return render_block_core_template_part( $attributes );
			},
		)
	);
}
add_action( 'init', 'unitone_display_deprecated_parts' );

/**
 * Avoid deprecated parts in the Site Editor > Library.
 */
add_filter(
	'get_block_templates',
	function( $query_result ) {
		$new_query_result = array();
		foreach ( $query_result as $result ) {
			if ( 0 === strpos( $result->slug, 'deprecated/' ) ) {
				continue;
			}
			$new_query_result[] = $result;
		}
		return $new_query_result;
	}
);

/**
 * Backward compatibility support by rearranging custom page templates.
 */
function unitone_fallback_deprecated_custom_page_templates( $query_result ) {
	if ( is_page() || is_singular( 'post' ) || is_singular( 'product' ) ) {
		$_wp_page_template = get_post_meta( get_the_ID(), '_wp_page_template', true );

		if ( is_page() ) {
			// phpcs:disable WordPress.Arrays.MultipleStatementAlignment.LongIndexSpaceBeforeDoubleArrow, WordPress.Arrays.MultipleStatementAlignment.DoubleArrowNotAligned
			$templates = array(
				'page-blank'                              => 'custom/page/blank',
				'page-header-footer'                      => 'custom/page/header-footer',
				'page-left-header'                        => 'custom/page/left-header',
				'page-left-header-page-header-featured'   => 'custom/page/left-header-page-header-featured',
				'page-left-header-page-header-image'      => 'custom/page/left-header-page-header-image',
				'page-one-column'                         => 'custom/page/one-column',
				'page-one-column-page-header-featured'    => 'custom/page/one-column-page-header-featured',
				'page-one-column-page-header-image'       => 'custom/page/one-column-page-header-image',
				'page-one-column-page-header-slim'        => 'custom/page/one-column-page-header-slim',
				'page-right-sidebar'                      => 'custom/page/right-sidebar',
				'page-right-sidebar-page-header-featured' => 'custom/page/right-sidebar-page-header-featured',
				'page-right-sidebar-page-header-image'    => 'custom/page/right-sidebar-page-header-image',
			);
			// phpcs:enable
		} elseif ( is_singular( 'post' ) ) {
			// phpcs:disable WordPress.Arrays.MultipleStatementAlignment.LongIndexSpaceBeforeDoubleArrow, WordPress.Arrays.MultipleStatementAlignment.DoubleArrowNotAligned
			$templates = array(
				'single-header-footer'                      => 'custom/single/header-footer',
				'single-left-header'                        => 'custom/single/left-header',
				'single-left-header-page-header-featured'   => 'custom/single/left-header-page-header-featured',
				'single-left-header-page-header-image'      => 'custom/single/left-header-page-header-image',
				'single-one-column'                         => 'custom/single/one-column',
				'single-one-column-page-header-featured'    => 'custom/single/one-column-page-header-featured',
				'single-one-column-page-header-image'       => 'custom/single/one-column-page-header-image',
				'single-right-sidebar'                      => 'custom/single/right-sidebar',
				'single-right-sidebar-page-header-featured' => 'custom/single/right-sidebar-page-header-featured',
				'single-right-sidebar-page-header-image'    => 'custom/single/right-sidebar-page-header-image',
			);
			// phpcs:enable
		} elseif ( is_singular( 'product' ) ) {
			// phpcs:disable WordPress.Arrays.MultipleStatementAlignment.LongIndexSpaceBeforeDoubleArrow, WordPress.Arrays.MultipleStatementAlignment.DoubleArrowNotAligned
			$templates = array(
				'single-product-left-header'                     => 'custom/single-product/left-header',
				'single-product-left-header-page-header-image'   => 'custom/single-product/left-header-page-header-image',
				'single-product-one-column'                      => 'custom/single-product/one-column',
				'single-product-one-column-page-header-image'    => 'custom/single-product/one-column-page-header-image',
				'single-product-right-sidebar'                   => 'custom/single-product/right-sidebar',
				'single-product-right-sidebar-page-header-image' => 'custom/single-product/right-sidebar-page-header-image',
			);
			// phpcs:enable
		}

		foreach ( $templates as $old_template_name => $new_template_name ) {
			if ( $old_template_name === $_wp_page_template ) {
				return array(
					get_block_template( 'unitone//' . $new_template_name ),
				);
			}
		}
	}

		return $query_result;
}
add_filter( 'pre_get_block_templates', 'unitone_fallback_deprecated_custom_page_templates' );
