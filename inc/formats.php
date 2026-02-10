<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

/**
 * Register formats.
 */
function unitone_register_formats() {
	$asset = include get_theme_file_path( 'dist/formats/formats.asset.php' );
	wp_enqueue_script(
		'unitone/formats',
		get_theme_file_uri( 'dist/formats/formats.js' ),
		$asset['dependencies'],
		filemtime( get_theme_file_path( 'dist/formats/formats.js' ) ),
		array(
			'strategy'  => 'defer',
			'in_footer' => false,
		)
	);
	wp_set_script_translations( 'unitone/formats', 'unitone', get_template_directory() . '/languages' );
}
add_action( 'enqueue_block_editor_assets', 'unitone_register_formats' );

/**
 * Enqueue assets.
 */
function unitone_enqueue_formats_assets() {
	wp_enqueue_style(
		'unitone/formats',
		get_theme_file_uri( 'dist/formats/formats.css' ),
		array(),
		filemtime( get_theme_file_path( 'dist/formats/formats.css' ) )
	);
}
add_action( 'enqueue_block_assets', 'unitone_enqueue_formats_assets' );

/**
 * Add media link overlay container.
 *
 * @param string $block_content The block content.
 * @return string
 */
function unitone_detect_media_link( $block_content ) {
	static $has_media_link = false;
	static $embed_urls     = array();

	$contains_media_link = false !== strpos( $block_content, 'unitone-media-link' );

	if ( $contains_media_link ) {
		$processor = new WP_HTML_Tag_Processor( $block_content );

		while ( $processor->next_tag( array( 'tag_name' => 'a' ) ) ) {
			$class_attribute = $processor->get_attribute( 'class' );
			if ( false === strpos( ' ' . $class_attribute . ' ', ' unitone-media-link ' ) ) {
				continue;
			}

			$media_type = $processor->get_attribute( 'data-unitone-media-type' );
			if ( 'embed' !== $media_type ) {
				continue;
			}

			$href = $processor->get_attribute( 'href' );
			if ( ! empty( $href ) ) {
				$embed_urls[ $href ] = true;
			}
		}
	}

	if ( ! $has_media_link && $contains_media_link ) {
		$has_media_link = true;

		// For lightbox styles.
		wp_enqueue_style( 'wp-block-image' );

		$asset = include get_theme_file_path( 'dist/js/app/media-link.asset.php' );
		wp_enqueue_script(
			'unitone/app/media-link',
			get_theme_file_uri( 'dist/js/app/media-link.js' ),
			$asset['dependencies'],
			filemtime( get_theme_file_path( 'dist/js/app/media-link.js' ) ),
			array(
				'strategy'  => 'defer',
				'in_footer' => false,
			)
		);

		add_action(
			'wp_footer',
			static function () use ( &$has_media_link, &$embed_urls ) {
				if ( ! $has_media_link ) {
					return;
				}

				$has_media_link = false;

				// If the current theme does NOT have a `theme.json`, or the colors are not
				// defined, it needs to set the background color & close button color to some
				// default values because it can't get them from the Global Styles.
				$background_color   = '#fff';
				$close_button_color = '#000';
				if ( wp_theme_has_theme_json() ) {
					$global_styles_color = wp_get_global_styles( array( 'color' ) );
					if ( ! empty( $global_styles_color['background'] ) ) {
						$background_color = esc_attr( $global_styles_color['background'] );
					}
					if ( ! empty( $global_styles_color['text'] ) ) {
						$close_button_color = esc_attr( $global_styles_color['text'] );
					}
				}

				printf(
					'<div
						class="wp-lightbox-overlay unitone-lightbox-overlay zoom"
						aria-hidden="true"
						>
							<button type="button" aria-label="%1$s" style="fill: %2$s" class="close-button">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="m13.06 12 6.47-6.47-1.06-1.06L12 10.94 5.53 4.47 4.47 5.53 10.94 12l-6.47 6.47 1.06 1.06L12 13.06l6.47 6.47 1.06-1.06L13.06 12Z"></path></svg>
							</button>
							<div class="lightbox-image-container">
								<figure></figure>
							</div>
							<div class="lightbox-image-container unitone-lightbox-embed-container" hidden>
								<div class="unitone-lightbox-embed-container__inner"></div>
							</div>
							<div class="lightbox-image-container unitone-lightbox-target-container" hidden>
								<div class="unitone-lightbox-target-container__inner"></div>
							</div>
							<div class="scrim" style="background-color: %3$s" aria-hidden="true"></div>
					</div>',
					esc_attr__( 'Close', 'unitone' ),
					esc_attr( $close_button_color ),
					esc_attr( $background_color )
				);

				$preloaded_embeds = array();
				foreach ( array_keys( $embed_urls ) as $embed_url ) {
					$html = wp_oembed_get( $embed_url, array( 'width' => '1024px' ) );
					if ( empty( $html ) && class_exists( '\Inc2734\WP_OEmbed_Blog_Card\App\View\View' ) ) {
						$html = \Inc2734\WP_OEmbed_Blog_Card\App\View\View::get_template( $embed_url );
					}

					if ( ! empty( $html ) ) {
						$preloaded_embeds[ $embed_url ] = $html;
					}
				}

				if ( ! empty( $preloaded_embeds ) ) {
					echo '<div class="unitone-lightbox-embed-preload" hidden aria-hidden="true" style="display: none">';
					foreach ( $preloaded_embeds as $url => $html ) {
						printf(
							'<div class="unitone-lightbox-embed-container__embed" data-unitone-embed-url="%1$s">%2$s</div>',
							esc_url( $url ),
							$html // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
						);
					}
					echo '</div>';
				}

				$embed_urls = array();
			},
			20
		);
	}

	return $block_content;
}
add_filter( 'render_block', 'unitone_detect_media_link' );
