<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

use Unitone\App\Controller\Manager\Manager;

/**
 * If the front page is not used, front-page.html should not be used.
 *
 * @param array $query_result Array of found block templates.
 * @return array
 */
function unitone_hidden_front_page_template_on_blog( $query_result ) {
	$show_on_front = get_option( 'show_on_front' );
	$page_on_front = get_option( 'page_on_front' );

	if ( 'page' !== $show_on_front || ! $page_on_front ) {
		foreach ( $query_result as $index => $template ) {
			if ( 'front-page' === $template->slug ) {
				unset( $query_result[ $index ] );
			}
		}
	}
	return $query_result;
}
add_filter( 'get_block_templates', 'unitone_hidden_front_page_template_on_blog' );

/**
 * Disable custom templates that have not been activated in the unitone setup.
 *
 * @param array $query_result Array of found block templates.
 * @return array
 */
function unitone_hidden_custom_templates( $query_result ) {
	$enabled_custom_templates  = Manager::get_setting( 'enabled-custom-templates' );
	$custom_templates          = Manager::get_custom_templates();
	$disabled_custom_templates = array();

	foreach ( $custom_templates as $custom_template ) {
		if ( ! in_array( $custom_template['name'], $enabled_custom_templates, true ) ) {
			$disabled_custom_templates[] = $custom_template['name'];
		}
	}

	foreach ( $query_result as $index => $template ) {
		if ( in_array( $template->slug, $disabled_custom_templates, true ) ) {
			unset( $query_result[ $index ] );
		}
	}

	return $query_result;
}
add_filter( 'get_block_templates', 'unitone_hidden_custom_templates' );

/**
 * Avoid deprecated parts in the Site Editor > Library.
 */
add_filter(
	'get_block_templates',
	function ( $query_result ) {
		$new_query_result = array();
		foreach ( $query_result as $result ) {
			if ( 0 === strpos( $result->slug, 'deprecated/' ) ) {
				continue;
			}
			$new_query_result[] = $result;
		}
		return $new_query_result;
	},
	9
);

/**
 * Backward compatibility support by rearranging custom page templates.
 *
 * @param array|null $block_templates Return an array of block templates to short-circuit the default query, or null to allow WP to run its normal queries.
 * @return array
 */
function unitone_fallback_deprecated_custom_page_templates( $block_templates ) {
	if ( ! is_page() && ! is_singular( 'post' ) && is_singular( 'product' ) ) {
		return $block_templates;
	}

	$_wp_page_template = get_post_meta( get_the_ID(), '_wp_page_template', true );
	if ( empty( $_wp_page_template ) || 'default' === $_wp_page_template ) {
		return $block_templates;
	}

	$templates_mapping = array();
	if ( is_page() ) {
		// phpcs:disable WordPress.Arrays.MultipleStatementAlignment.LongIndexSpaceBeforeDoubleArrow, WordPress.Arrays.MultipleStatementAlignment.DoubleArrowNotAligned
		$templates_mapping = array(
			'page-blank'                                     => 'template-page-blank',
			'page-header-footer'                             => 'template-page-header-footer',
			'page-left-header'                               => 'template-page-left-header',
			'page-left-header-page-header-featured'          => 'template-page-left-header-page-header-featured',
			'page-left-header-page-header-image'             => 'template-page-left-header-page-header-image',
			'page-one-column'                                => 'template-page-one-column',
			'page-one-column-page-header-featured'           => 'template-page-one-column-page-header-featured',
			'page-one-column-page-header-image'              => 'template-page-one-column-page-header-image',
			'page-one-column-page-header-slim'               => 'template-page-one-column-page-header-slim',
			'page-right-sidebar'                             => 'template-page-right-sidebar',
			'page-right-sidebar-page-header-featured'        => 'template-page-right-sidebar-page-header-featured',
			'page-right-sidebar-page-header-image'           => 'template-page-right-sidebar-page-header-image',
			'custom/page/blank'                              => 'template-page-blank',
			'custom/page/header-footer'                      => 'template-page-header-footer',
			'custom/page/left-header'                        => 'template-page-left-header',
			'custom/page/left-header-page-header-featured'   => 'template-page-left-header-page-header-featured',
			'custom/page/left-header-page-header-image'      => 'template-page-left-header-page-header-image',
			'custom/page/left-header-header-footer'          => 'template-page-left-header-header-footer',
			'custom/page/one-column'                         => 'template-page-one-column',
			'custom/page/one-column-page-header-featured'    => 'template-page-one-column-page-header-featured',
			'custom/page/one-column-page-header-image'       => 'template-page-one-column-page-header-image',
			'custom/page/one-column-page-header-slim'        => 'template-page-one-column-page-header-slim',
			'custom/page/right-sidebar'                      => 'template-page-right-sidebar',
			'custom/page/right-sidebar-page-header-featured' => 'template-page-right-sidebar-page-header-featured',
			'custom/page/right-sidebar-page-header-image'    => 'template-page-right-sidebar-page-header-image',
		);
		// phpcs:enable
	} elseif ( is_singular( 'post' ) ) {
		// phpcs:disable WordPress.Arrays.MultipleStatementAlignment.LongIndexSpaceBeforeDoubleArrow, WordPress.Arrays.MultipleStatementAlignment.DoubleArrowNotAligned
		$templates_mapping = array(
			'single-header-footer'                             => 'template-single-header-footer',
			'single-left-header'                               => 'template-single-left-header',
			'single-left-header-page-header-featured'          => 'template-single-left-header-page-header-featured',
			'single-left-header-page-header-image'             => 'template-single-left-header-page-header-image',
			'single-one-column'                                => 'template-single-one-column',
			'single-one-column-page-header-featured'           => 'template-single-one-column-page-header-featured',
			'single-one-column-page-header-image'              => 'template-single-one-column-page-header-image',
			'single-right-sidebar'                             => 'template-single-right-sidebar',
			'single-right-sidebar-page-header-featured'        => 'template-single-right-sidebar-page-header-featured',
			'single-right-sidebar-page-header-image'           => 'template-single-right-sidebar-page-header-image',
			'custom/single/header-footer'                      => 'template-single-header-footer',
			'custom/single/left-header'                        => 'template-single-left-header',
			'custom/single/left-header-header-footer'          => 'template-single-left-header-header-footer',
			'custom/single/left-header-page-header-featured'   => 'template-single-left-header-page-header-featured',
			'custom/single/left-header-page-header-image'      => 'template-single-left-header-page-header-image',
			'custom/single/one-column'                         => 'template-single-one-column',
			'custom/single/one-column-page-header-featured'    => 'template-single-one-column-page-header-featured',
			'custom/single/one-column-page-header-image'       => 'template-single-one-column-page-header-image',
			'custom/single/right-sidebar'                      => 'template-single-right-sidebar',
			'custom/single/right-sidebar-page-header-featured' => 'template-single-right-sidebar-page-header-featured',
			'custom/single/right-sidebar-page-header-image'    => 'template-single-right-sidebar-page-header-image',
		);
		// phpcs:enable
	} elseif ( is_singular( 'product' ) ) {
		// phpcs:disable WordPress.Arrays.MultipleStatementAlignment.LongIndexSpaceBeforeDoubleArrow, WordPress.Arrays.MultipleStatementAlignment.DoubleArrowNotAligned
		$templates_mapping = array(
			'single-product-left-header'                            => 'template-single-product-left-header',
			'single-product-left-header-page-header-image'          => 'template-single-product-left-header-page-header-image',
			'single-product-one-column'                             => 'template-single-product-one-column',
			'single-product-one-column-page-header-image'           => 'template-single-product-one-column-page-header-image',
			'single-product-right-sidebar'                          => 'template-single-product-right-sidebar',
			'single-product-right-sidebar-page-header-image'        => 'template-single-product-right-sidebar-page-header-image',
			'custom/single-product/left-header'                     => 'template-single-product-left-header',
			'custom/single-product/left-header-page-header-image'   => 'template-single-product-left-header-page-header-image',
			'custom/single-product/one-column'                      => 'template-single-product-one-column',
			'custom/single-product/one-column-page-header-image'    => 'template-single-product-one-column-page-header-image',
			'custom/single-product/right-sidebar'                   => 'template-single-product-right-sidebar',
			'custom/single-product/right-sidebar-page-header-image' => 'template-single-product-right-sidebar-page-header-image',
		);
		// phpcs:enable
	}

	foreach ( $templates_mapping as $old_template_name => $new_template_name ) {
		if ( $old_template_name === $_wp_page_template ) {
			return array(
				get_block_template( 'unitone//' . $new_template_name ),
			);
		}
	}

	return $block_templates;
}
add_filter( 'pre_get_block_templates', 'unitone_fallback_deprecated_custom_page_templates', 9 );

/**
 * Fallback for changes in display due to discontinuation of template parts for templates.
 * If a template part for a template has been customized, it will be displayed.
 * However, it is not reflected on the editor.
 *
 * @see https://github.com/inc2734/unitone/issues/217
 *
 * @param string $template The path of the template to include.
 * @return string
 */
function unitone_display_deprecated_parts_for_template( $template ) {
	global $_wp_current_template_id, $_wp_current_template_content;

	$template_object      = get_block_template( $_wp_current_template_id, 'wp_template' );
	$template_part_object = get_block_template( $_wp_current_template_id, 'wp_template_part' );

	// When the template is customized.
	if ( ( $template_object && $template_object->is_custom ) || ! empty( $template_object->modified ) ) {
		return $template;
	}

	// When the template part are not customized.
	if ( ! $template_part_object || ! $template_part_object->is_custom ) {
		return $template;
	}

	// Output the template part.
	$template_part_slug           = str_replace( get_stylesheet() . '//', '', $_wp_current_template_id );
	$_wp_current_template_content = '<!-- wp:template-part {"slug":"' . $template_part_slug . '"} /-->';

	return $template;
}
add_filter( 'template_include', 'unitone_display_deprecated_parts_for_template', 9 );

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
			'render_callback' => function ( $attributes ) {
				$template_part_id = null;
				$content          = null;
				$area             = WP_TEMPLATE_PART_AREA_UNCATEGORIZED;
				$stylesheet       = get_stylesheet();

				if (
					isset( $attributes['slug'] ) &&
					isset( $attributes['theme'] ) &&
					$stylesheet === $attributes['theme']
				) {
					if (
						'footer-breadcrumbs' === $attributes['slug']
						|| 0 === strpos( $attributes['slug'], 'contents-' )
						|| 0 === strpos( $attributes['slug'], 'page-header-' )
						|| 0 === strpos( $attributes['slug'], 'template-' )
					) {
						// Rewrite the slug (= path).
						// Now the HTML of the file will be output for now, but customization will be skipped.
						$attributes['slug'] = 'deprecated/' . $attributes['slug'];
					}
				}

				return render_block_core_template_part( $attributes );
			},
		)
	);
}
add_action( 'init', 'unitone_display_deprecated_parts', 21 );
