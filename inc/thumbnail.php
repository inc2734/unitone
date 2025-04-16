<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

use Unitone\App\Controller\Manager\Manager;

/**
 * Filters the post thumbnail HTML.
 *
 * @param string $html The post thumbnail HTML.
 * @return string
 */
function unitone_set_empty_thumbnail( $html ) {
	if ( ! $html ) {
		$defualt_featured_image     = Manager::get_setting( 'default-featured-image' );
		$defualt_featured_image_url = $defualt_featured_image
			? wp_get_attachment_url( $defualt_featured_image )
			: false;

		if ( $defualt_featured_image_url ) {
			return sprintf(
				'<img src="%1$s" alt="">',
				esc_url( $defualt_featured_image_url )
			);
		}

		return '<div style="background-color: var(--wp--preset--color--unitone-bright-gray); aspect-ratio: var(--unitone--ratio); height: 100%; width: 100%"></div>';
	}

	return $html;
}
add_filter( 'post_thumbnail_html', 'unitone_set_empty_thumbnail' );

/**
 * Registers a REST API route.
 * This API will auto-generate post thumbnails from the post title.
 *
 * @see /wp-json/unitone/v1/thumbnail?post_id=xxxx
 */
add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			'unitone/v1',
			'/thumbnail',
			array(
				'methods'             => 'GET',
				'args'                => array(
					'post_id' => array(
						'required'          => true,
						'validate_callback' => function ( $param ) {
							return ! is_null( get_post( $param ) );
						},
						'aspect-ratio'      => array(
							'required'          => false,
							'default'           => '1.91:1',
							'validate_callback' => function ( $param ) {
								return in_array( $param, array( '1.91:1', '16:9', '4:3' ), true );
							},
						),
						'background'        => array(
							'required' => false,
							'type'     => 'string',
						),
						'text'              => array(
							'required' => false,
							'type'     => 'string',
						),
					),
				),
				'permission_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
				'callback'            => function ( $request ) {
					$post_id      = (int) $request['post_id'];
					$aspect_ratio = $request['aspect-ratio'];
					$background   = $request['background'];
					$text         = $request['text'];

					if ( empty( $text ) ) {
						$text = get_the_title( $post_id );
					}

					switch ( $aspect_ratio ) {
						case '4:3':
							$width                  = 1400;
							$height                 = 1050;
							$text_length            = 140;
							$text_size              = 64;
							$custom_logo_max_width  = 360;
							$custom_logo_max_height = 72;
							$blog_name_size         = 42;
							$padding                = 24 * 3;
							break;
						case '16:9':
							$width                  = 1920;
							$height                 = 1080;
							$text_length            = 120;
							$text_size              = 72;
							$custom_logo_max_width  = 420;
							$custom_logo_max_height = 96;
							$blog_name_size         = 48;
							$padding                = 24 * 3;
							break;
						case '1.91:1':
						default:
							$width                  = 1200;
							$height                 = 630;
							$text_length            = 80;
							$text_size              = 52;
							$custom_logo_max_width  = 210;
							$custom_logo_max_height = 48;
							$blog_name_size         = 36;
							$padding                = 24 * 2;
							break;
					}

					$convert_path_to_base64 = function ( $path ) {
						$body   = file_get_contents( $path ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
						$finfo  = finfo_open( FILEINFO_MIME_TYPE );
						$type   = finfo_file( $finfo, $path );
						finfo_close( $finfo );
						$base64 = 'data:' . $type . ';base64,' . base64_encode( $body ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
						return $base64;
					};

					$custom_logo = '';
					$blog_name   = '';

					if ( has_custom_logo() ) {
						$custom_logo_id   = get_theme_mod( 'custom_logo' );
						$custom_logo_path = get_attached_file( $custom_logo_id );
						$custom_logo_src  = wp_get_attachment_image_src( $custom_logo_id, 'full' );

						if ( $custom_logo_path ) {
							$base64      = $convert_path_to_base64( $custom_logo_path );
							$custom_logo = sprintf(
								'<image href="%1$s" xlink:href="%1$s" width="%2$d" height="%3$d" preserveAspectRatio="xMaxYMid meet" x="%4$d" y="%5$d" />',
								esc_attr( $base64 ),
								esc_attr( min( $custom_logo_max_width, $custom_logo_src[0] ) ),
								esc_attr( min( $custom_logo_max_height, $custom_logo_src[1] ) ),
								esc_attr( $width - $custom_logo_max_width - $padding * 1.5 ),
								esc_attr( $height - $custom_logo_max_height - $padding * 1.5 )
							);
						}
					}

					if ( ! $custom_logo ) {
						$blog_name = sprintf(
							'<div style="font-size: %1$dpx; font-family: \'Helvetica Neue\', Arial, \'Hiragino Kaku Gothic ProN\', \'Hiragino Sans\', Meiryo, sans-serif; padding: 0 %2$dpx %2$dpx">
								%3$s
							</div>',
							esc_html( $blog_name_size ),
							esc_attr( $padding * .5 ),
							esc_html( get_bloginfo( 'name' ) )
						);
					}

					$background_image = '<rect width="100%" height="100%" fill="#eee" />';
					if ( $background ) {
						$background_path = get_template_directory() . '/dist/blocks/abstract-background/img/' . $background . '.svg';
						if ( file_exists( $background_path ) ) {
							$background_image = sprintf(
								'<image
									href="%1$s"
									xlink:href="%1$s"
									width="100%%"
									height="100%%"
									preserveAspectRatio="xMidYMid slice"
								/>',
								esc_attr( $convert_path_to_base64( $background_path ) )
							);
						}
					}

					$svg = apply_filters(
						'unitone_post_thumbnail_svg',
						sprintf(
							'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="%1$d" height="%2$d" viewport="0 0 %1$d %2$d">
								<defs>
									<filter id="shadow">
										<feDropShadow dx="0" dy="0" stdDeviation="16" flood-opacity="0.1" />
									</filter>
								</defs>
								%13$s
								<rect x="%3$d" y="%4$d" width="%5$d" height="%6$d" rx="24" fill="#fff" filter="url(#shadow)" />
								<foreignObject x="%3$d" y="%4$d" width="%7$d" height="%8$d">
									<html xmlns="http://www.w3.org/1999/xhtml" style="width: 100%%; height: 100%%; display: grid; grid-template-rows: repeat(3, 1fr)">
										<div></div>
										<div style="display: grid; place-content: center">
											<div style="font-size: %9$dpx; line-height: 1.6; font-family: \'Helvetica Neue\', Arial, \'Hiragino Kaku Gothic ProN\', \'Hiragino Sans\', Meiryo, sans-serif; font-weight: bold; padding: %3$dpx">
												%10$s
											</div>
										</div>
										<div style="justify-self: end; align-self: end">
											%11$s
										</div>
									</html>
								</foreignObject>
								%12$s
							</svg>',
							esc_attr( $width ),                 // 1. SVG and the background width.
							esc_attr( $height ),                // 2. SVG and the background height.
							esc_attr( $padding ),               // 3. The content area x.
							esc_attr( $padding ),               // 4. The content area y.
							esc_attr( $width - $padding * 2 ),  // 5. The content area width.
							esc_attr( $height - $padding * 2 ), // 6. The content area height.
							esc_attr( $width - $padding * 2 ),  // 7. The text area width.
							esc_attr( $height - $padding * 2 ), // 8. The text area height.
							esc_attr( $text_size ),             // 9. Text size.
							esc_html( wp_trim_words( $text, $text_length, '...' ) ),
							wp_kses_post( $blog_name ),
							$custom_logo,
							$background_image
						),
						array(
							'height'     => $height,
							'width'      => $width,
							'text'       => $text,
							'background' => $background_image,
						)
					);

					if ( ! $svg ) {
						return new \WP_Error( 'not_found', 'Post not found', array( 'status' => 404 ) );
					}

					header( 'Content-Type: image/svg+xml' );
					echo $svg; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					exit;
				},
			)
		);
	}
);

/**
 * Delete old generated featured images.
 *
 * @param int $post_id Post ID.
 */
function unitone_delete_old_generated_featured_image( $post_id ) {
	$post_thumbnail_id = get_post_thumbnail_id( $post_id );
	if ( ! $post_thumbnail_id ) {
		return;
	}

	$attachments = get_children(
		array(
			'post_parent' => $post_id,
			'post_type'   => 'attachment',
		)
	);

	$generated_featured_image_ids = array();
	foreach ( $attachments as $attachment ) {
		if ( preg_match( '/^unitone-generated-featured-image-(\d+)-(\d+)$/', $attachment->post_title ) ) {
			$generated_featured_image_ids[] = $attachment->ID;
		}
	}

	if ( $generated_featured_image_ids ) {
		rsort( $generated_featured_image_ids );
		array_shift( $generated_featured_image_ids );
		foreach ( $generated_featured_image_ids as $attachment_id ) {
			wp_delete_attachment( $attachment_id, false );
		}
	}
}
add_action( 'wp_insert_post', 'unitone_delete_old_generated_featured_image' );

/**
 * Add global variables.
 */
add_action(
	'unitone_enqueue_block_editor_assets',
	function () {
		wp_localize_script(
			'unitone/editor',
			'unitoneFeaturedImageGenerator',
			array(
				'nonce'       => wp_create_nonce( 'wp_rest' ),
				'aspectRatio' => Manager::get_setting( 'generated-featured-image-aspect-ratio' ),
				'background'  => Manager::get_setting( 'generated-thumbnail-background' ),
			)
		);
	}
);
