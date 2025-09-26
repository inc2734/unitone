<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

use Unitone\App\Controller\Manager\Manager;

/**
 * Add support "autoPhrase" to core blocks.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_auto_phrase_support( $metadata ) {
	if ( ! in_array( $metadata['name'], array( 'core/paragraph', 'core/heading', 'core/list-item' ), true ) ) {
		return $metadata;
	}

	$metadata['supports'] = array_merge(
		$metadata['supports'],
		array(
			'unitone' => array_merge(
				$metadata['supports']['unitone'] ?? array(),
				array(
					'autoPhrase' => true,
				)
			),
		)
	);
	return $metadata;
}
add_filter( 'block_type_metadata', 'unitone_add_auto_phrase_support' );

/**
 * Add support "fluidTypography" to core blocks with typography.fontSize.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_fluid_typography_support( $metadata ) {
	if ( false === strpos( $metadata['name'], 'core/' ) ) {
		return $metadata;
	}

	if ( empty( $metadata['supports']['typography']['fontSize'] ) ) {
		return $metadata;
	}

	$metadata['supports'] = array_merge(
		$metadata['supports'],
		array(
			'unitone' => array_merge(
				$metadata['supports']['unitone'] ?? array(),
				array(
					'fluidTypography' => true,
				)
			),
		)
	);
	return $metadata;
}
add_filter( 'block_type_metadata', 'unitone_add_fluid_typography_support' );

/**
 * Add support "halfLeading" to core blocks with typography.lineHeight.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_half_leading_support( $metadata ) {
	if ( false === strpos( $metadata['name'], 'core/' ) ) {
		return $metadata;
	}

	if ( empty( $metadata['supports']['typography']['lineHeight'] ) ) {
		return $metadata;
	}

	$metadata['supports'] = array_merge(
		$metadata['supports'],
		array(
			'unitone' => array_merge(
				$metadata['supports']['unitone'] ?? array(),
				array(
					'halfLeading' => true,
				)
			),
		)
	);
	return $metadata;
}
add_filter( 'block_type_metadata', 'unitone_add_half_leading_support' );


/**
 * Add support "linkDecoration" to core blocks with typography.textDecoration.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_link_decoration_support( $metadata ) {
	if ( false === strpos( $metadata['name'], 'core/' ) ) {
		return $metadata;
	}

	if (
		empty( $metadata['supports']['typography']['textDecoration'] ) &&
		empty( $metadata['supports']['typography']['__experimentalTextDecoration'] )
	) {
		return $metadata;
	}

	$metadata['supports'] = array_merge(
		$metadata['supports'],
		array(
			'unitone' => array_merge(
				$metadata['supports']['unitone'] ?? array(),
				array(
					'linkDecoration' => true,
				)
			),
		)
	);
	return $metadata;
}
add_filter( 'block_type_metadata', 'unitone_add_link_decoration_support' );

/**
 * Add support "gap" to core/list, core/navigation, core/post-content,  core/post-template and core/social-links.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_gap_support( $metadata ) {
	$target = array(
		'core/list',
		'core/navigation',
		'core/post-content',
		'core/post-template',
		'core/social-links',
	);

	if ( ! in_array( $metadata['name'], $target, true ) ) {
		return $metadata;
	}

	$metadata['supports'] = array_merge(
		$metadata['supports'],
		array(
			'unitone' => array_merge(
				$metadata['supports']['unitone'] ?? array(),
				array(
					'gap' => true,
				)
			),
		)
	);
	return $metadata;
}
add_filter( 'block_type_metadata', 'unitone_add_gap_support' );

/**
 * Add supports to core/list.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_divider_support( $metadata ) {
	$target = array(
		'core/list',
	);

	if ( ! in_array( $metadata['name'], $target, true ) ) {
		return $metadata;
	}

	$metadata['supports'] = array_merge(
		$metadata['supports'],
		array(
			'unitone' => array_merge(
				$metadata['supports']['unitone'] ?? array(),
				array(
					'divider'     => true,
					'dividerType' => array( 'stripe', 'underline', 'bordered', 'divide' ),
				)
			),
		)
	);
	return $metadata;
}
add_filter( 'block_type_metadata', 'unitone_add_divider_support' );

/**
 * Add supports to core/navigation.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_supports_to_core_navigation( $metadata ) {
	if ( 'core/navigation' !== $metadata['name'] ) {
		return $metadata;
	}

	$metadata['supports'] = array_merge(
		$metadata['supports'],
		array(
			'unitone' => array_merge(
				$metadata['supports']['unitone'] ?? array(),
				array(
					'replaceOverlayMenu' => true,
				)
			),
		)
	);
	return $metadata;
}
add_filter( 'block_type_metadata', 'unitone_add_supports_to_core_navigation' );

/**
 * Add supports to core/table.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_supports_to_core_table( $metadata ) {
	if ( 'core/table' !== $metadata['name'] ) {
		return $metadata;
	}

	$metadata['supports'] = array_merge(
		$metadata['supports'],
		array(
			'unitone' => array_merge(
				$metadata['supports']['unitone'] ?? array(),
				array(
					'cellMinWidth' => true,
					'padding'      => array(
						'split' => true,
					),
				)
			),
		)
	);
	return $metadata;
}
add_filter( 'block_type_metadata', 'unitone_add_supports_to_core_table' );

/**
 * Add supports to core/post-content.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_supports_to_core_post_content( $metadata ) {
	if ( ! in_array( $metadata['name'], array( 'core/post-content' ), true ) ) {
		return $metadata;
	}

	$metadata['supports'] = array_merge(
		$metadata['supports'],
		array(
			'unitone' => array_merge(
				$metadata['supports']['unitone'] ?? array(),
				array(
					'gutters' => true,
				)
			),
		)
	);
	return $metadata;
}
add_filter( 'block_type_metadata', 'unitone_add_supports_to_core_post_content' );

/**
 * Add supports to core/button.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_supports_to_core_button( $metadata ) {
	if ( 'core/button' !== $metadata['name'] ) {
		return $metadata;
	}

	$metadata['supports'] = array_merge(
		$metadata['supports'],
		array(
			'unitone' => array_merge(
				$metadata['supports']['unitone'] ?? array(),
				array(
					'padding'  => true,
					'minWidth' => true,
				)
			),
		)
	);
	return $metadata;
}
add_filter( 'block_type_metadata', 'unitone_add_supports_to_core_button' );

/**
 * Add supports to core/image.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_supports_to_core_image( $metadata ) {
	if ( 'core/image' !== $metadata['name'] ) {
		return $metadata;
	}

	$metadata['supports'] = array_merge(
		$metadata['supports'],
		array(
			'shadow' => array(
				'__experimentalSkipSerialization' => true,
				'__experimentalDefaultControls'   => array(
					'shadow' => true,
				),
			),
		),
		array(
			'unitone' => array_merge(
				$metadata['supports']['unitone'] ?? array(),
				array(
					'overlay'         => true,
					'dropShadow'      => true,
					'parallax'        => true,
					'scrollAnimation' => true,
				)
			),
		)
	);

	return $metadata;
}
add_filter( 'block_type_metadata', 'unitone_add_supports_to_core_image' );

/**
 * Set site logo default width.
 *
 * @param array $settings Array of determined settings for registering a block type.
 * @return array
 */
function unitone_set_site_logo_default_width( $settings ) {
	if ( 'core/site-logo' !== $settings['name'] ) {
		return $settings;
	}

	$site_logo_width = Manager::get_setting( 'site-logo-width' );
	if ( $site_logo_width ) {
		$settings['attributes']['width']['default'] = $site_logo_width;
	}

	return $settings;
}
add_filter( 'block_type_metadata_settings', 'unitone_set_site_logo_default_width' );
