<?php
/**
 * Run with `wp eval-file tests/preset.php` in a WordPress environment using unitone.
 * No posts, options, or other persistent data are changed.
 *
 * @package unitone
 */

( static function () {
	$assert_same = static function ( $expected, $actual ) {
		if ( $expected !== $actual ) {
			throw new RuntimeException( 'Expected ' . var_export( $expected, true ) . ', got ' . var_export( $actual, true ) ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_var_export,WordPress.Security.EscapeOutput.ExceptionNotEscaped -- CLI assertion output.
		}
	};

	$slugs = json_decode( file_get_contents( __DIR__ . '/fixtures/preset-slugs.json' ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	foreach ( $slugs as list( $slug, $expected ) ) {
		$assert_same( $expected, _wp_to_kebab_case( $slug ) );
		foreach ( array( 'color', 'gradient', 'shadow', 'font-family', 'font-size', 'spacing' ) as $type ) {
			$reference = 'var(--wp--preset--' . $type . '--' . $expected . ')';
			$assert_same( $reference, unitone_get_preset_css_var_from_slug( $type, $slug ) );
			$assert_same( $reference, unitone_get_preset_css_var( 'var:preset|' . $type . '|' . $slug ) );
			$legacy_reference = 'var(--wp--preset--' . $type . '--' . $slug . ')';
			$compatible       = $slug === $expected || false !== strpos( $slug, '/' ) || false !== strpos( $slug, "'" )
				? $reference
				: 'var(--wp--preset--' . $type . '--' . $slug . ', ' . $reference . ')';
			$assert_same( $compatible, unitone_get_compatible_preset_references( $legacy_reference ) );
			$assert_same( $compatible, unitone_get_compatible_preset_references( $compatible ) );
		}
	}

	foreach ( array( null, false, 0, '', '#fd780f', 'var(--custom)', 'calc(1rem + 2px)' ) as $value ) {
		$assert_same( $value, unitone_get_preset_css_var( $value ) );
	}

	$legacy   = '<div style="--unitone--background-color:var(--wp--preset--color--custom-)"><span style="--unitone--text-shadow-color:var(--wp--preset--color--BrandBlue)">Text</span></div>';
	$expected = '<div style="--unitone--background-color:var(--wp--preset--color--custom-, var(--wp--preset--color--custom))"><span style="--unitone--text-shadow-color:var(--wp--preset--color--BrandBlue, var(--wp--preset--color--brand-blue))">Text</span></div>';
	$rendered = unitone_render_compatible_preset_references( $legacy );
	$assert_same( $expected, $rendered );
	$assert_same( $rendered, unitone_render_compatible_preset_references( $rendered ) );
	$parsed = array(
		'blockName'   => 'core/paragraph',
		'attrs'       => array(),
		'innerBlocks' => array(),
	);
	$assert_same( $expected, apply_filters( 'render_block', $legacy, $parsed, new WP_Block( $parsed ) ) );

	// Leave unrelated styles, already valid references, and user-provided fallbacks intact.
	foreach ( array(
		'<p style="color:var(--wp--preset--color--custom-)">Text</p>',
		'<p style="color:red; --unitone--color: var(--wp--preset--color--unitone-accent)">Text</p>',
		'<p style="--unitone--color:var(--wp--preset--color--custom-, #fff)">Text</p>',
	) as $html ) {
		$assert_same( $html, unitone_render_compatible_preset_references( $html ) );
	}
	$assert_same(
		'<div style="--swiper-navigation-color:var(--wp--preset--color--custom-, var(--wp--preset--color--custom))"></div>',
		unitone_render_compatible_preset_references( '<div style="--swiper-navigation-color:var(--wp--preset--color--custom-)"></div>' )
	);
	$assert_same( 'var(--wp--preset--color--unitone-accent)', unitone_get_compatible_preset_references( 'var(--wp--preset--color--unitone/accent)' ) );
	$assert_same( 'var(--wp--preset--color--brand-blue)', unitone_get_compatible_preset_references( 'var(--wp--preset--color--Brand Blue)' ) );
	$assert_same( 'var(--wp--preset--color--custom-, var(--wp--preset--color--custom))', unitone_get_compatible_preset_references( 'var(--wp--preset--color--custom- )' ) );

	// Repeated hyphens belong to the slug, and non-ASCII identifiers remain valid.
	foreach ( array( 'brand--blue', 'foo😀Bar' ) as $slug ) {
		$assert_same(
			'var(--wp--preset--color--' . $slug . ', ' . unitone_get_preset_css_var_from_slug( 'color', $slug ) . ')',
			unitone_get_compatible_preset_references( 'var(--wp--preset--color--' . $slug . ')' )
		);
	}

	$assert_same(
		array( '--unitone--sm-post-term--border-color' => 'var(--wp--preset--color--custom)' ),
		unitone_get_border_css_vars( array( 'border' => array( 'color' => 'var:preset|color|custom-' ) ), 'post-term', 'sm' )
	);

	// Exercise the actual navigation filter without needing a saved menu or post.
	$navigation = apply_filters(
		'render_block_core/navigation', // phpcs:ignore WordPress.NamingConventions.ValidHookName.UseUnderscores -- Core hook name.
		'<nav class="wp-block-navigation"></nav>',
		array( 'attrs' => array( 'unitone' => array( 'overlayMenuBackgroundColor' => 'custom-' ) ) )
	);
	$p          = new WP_HTML_Tag_Processor( $navigation );
	$p->next_tag();
	$assert_same( true, $p->has_class( 'has-overlay-menu-background-color' ) );
	$assert_same( '--unitone--overlay-menu-background-color: var(--wp--preset--color--custom)', $p->get_attribute( 'style' ) );

	echo "Preset PHP checks passed.\n";
} )();
