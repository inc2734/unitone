<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

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
 * Add support "cellMinWidth" to core/table.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_cell_min_width_support( $metadata ) {
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
				)
			),
		)
	);
	return $metadata;
}
add_filter( 'block_type_metadata', 'unitone_add_cell_min_width_support' );

/**
 * Add support "gap" to core/post-content and core/post-template.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_gap_support( $metadata ) {
	if ( ! in_array( $metadata['name'], array( 'core/navigation', 'core/post-content', 'core/post-template' ), true ) ) {
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
 * Add support "gutters" to core/post-content.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_gutters_support( $metadata ) {
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
add_filter( 'block_type_metadata', 'unitone_add_gutters_support' );

/**
 * Add support "padding" to core/button.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_padding_support( $metadata ) {
	if ( 'core/button' !== $metadata['name'] ) {
		return $metadata;
	}

	$metadata['supports'] = array_merge(
		$metadata['supports'],
		array(
			'unitone' => array_merge(
				$metadata['supports']['unitone'] ?? array(),
				array(
					'padding' => true,
				)
			),
		)
	);
	return $metadata;
}
add_filter( 'block_type_metadata', 'unitone_add_padding_support' );

/**
 * Add support "overlay" to core/image.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_overlay_support( $metadata ) {
	if ( 'core/image' !== $metadata['name'] ) {
		return $metadata;
	}

	$metadata['supports'] = array_merge(
		$metadata['supports'],
		array(
			'unitone' => array_merge(
				$metadata['supports']['unitone'] ?? array(),
				array(
					'overlay' => true,
				)
			),
		)
	);
	return $metadata;
}
add_filter( 'block_type_metadata', 'unitone_add_overlay_support' );

/**
 * Add support "filter:drop-shadow" to core/image.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_drop_shadow_support( $metadata ) {
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
					'dropShadow' => true,
				)
			),
		)
	);
	return $metadata;
}
add_filter( 'block_type_metadata', 'unitone_add_drop_shadow_support' );

/**
 * Add support "Parallax" to core/image.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_parallax_support( $metadata ) {
	if ( 'core/image' !== $metadata['name'] ) {
		return $metadata;
	}

	$metadata['supports'] = array_merge(
		$metadata['supports'],
		array(
			'unitone' => array_merge(
				$metadata['supports']['unitone'] ?? array(),
				array(
					'parallax' => true,
				)
			),
		)
	);
	return $metadata;
}
add_filter( 'block_type_metadata', 'unitone_add_parallax_support' );

/**
 * Add support "Scroll animation" to core/image.
 *
 * @param array $metadata Metadata for registering a block type.
 * @return array
 */
function unitone_add_scroll_animation_support( $metadata ) {
	if ( 'core/image' !== $metadata['name'] ) {
		return $metadata;
	}

	$metadata['supports'] = array_merge(
		$metadata['supports'],
		array(
			'unitone' => array_merge(
				$metadata['supports']['unitone'] ?? array(),
				array(
					'scrollAnimation' => true,
				)
			),
		)
	);
	return $metadata;
}
add_filter( 'block_type_metadata', 'unitone_add_scroll_animation_support' );
