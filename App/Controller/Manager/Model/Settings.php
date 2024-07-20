<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

namespace Unitone\App\Controller\Manager\Model;

class Settings {

	/**
	 * Available settings name.
	 *
	 * @var string
	 */
	const SETTINGS_NAME = 'unitone-settings';

	/**
	 * Default settings.
	 *
	 * @var array
	 */
	protected static $default_settings = array(
		'license-key'               => '',
		'font-family'               => 'sans-serif',
		'base-font-size'            => '16',
		'half-leading'              => '0.4',
		'h2-size'                   => '3',
		'h3-size'                   => '2',
		'h4-size'                   => '1',
		'h5-size'                   => '0',
		'h6-size'                   => '0',
		'accent-color'              => '#090a0b', // = settings.color.palette > unitone-accent
		'background-color'          => '#fff',
		'text-color'                => '#222',
		'link-color'                => '#003c78', // = styles.elements.link.color.text
		'link-focus-color'          => null, // = styles.elements.link.:focus.color.text
		'link-hover-color'          => null, // = styles.elements.link.:hover.color.text
		'content-size'              => '46rem',
		'wide-size'                 => '1334px',
		'enabled-custom-templates'  => array(),
		'wp-oembed-blog-card-style' => 'default',
	);

	/**
	 * Default options. Keys are for settings.
	 *
	 * @var array
	 */
	protected static $default_options = array(
		'site-logo'      => false,
		'site-icon'      => false,
		'show-on-front'  => 'posts',
		'page-on-front'  => false,
		'page-for-posts' => false,
	);

	/**
	 * Default global styles.
	 *
	 * @var array
	 */
	protected static $default_global_styles = array(
		'styles'   => array(
			'color'      => array(
				'background' => null,
				'text'       => null,
			),
			'elements'   => array(
				'link' => array(
					'color' => array(
						'text' => null,
					),
				),
			),
			'typography' => array(
				'fontFamily' => null,
			),
		),
		'settings' => array(
			'layout' => array(
				'contentSize' => null,
				'wideSize'    => null,
			),
		),
	);

	/**
	 * Return default settings.
	 *
	 * @return array
	 */
	public static function get_default_settings() {
		return static::$default_settings;
	}

	/**
	 * Return default options.
	 *
	 * @return array
	 */
	public static function get_default_options() {
		return static::$default_options;
	}

	/**
	 * Return all settings.
	 *
	 * @return array
	 */
	public static function get_settings() {
		$settings = get_option( self::SETTINGS_NAME );

		return is_array( $settings )
			? $settings
			: array();
	}

	/**
	 * Return all settings. The keys are for settings.
	 *
	 * @return array
	 */
	public static function get_options() {
		$options = array();

		foreach ( static::$default_options as $name => $default ) {
			$option_name = str_replace( '-', '_', $name );

			$options[ $name ] = get_option( $option_name, $default );
		}

		return $options;
	}

	/**
	 * Return setting.
	 *
	 * @param string $key The setting key name.
	 * @return mixed
	 */
	public static function get_setting( $key ) {
		$settings = static::get_merged_settings();

		return $settings[ $key ] ?? false;
	}

	/**
	 * Update settings.
	 *
	 * @param array $settings Array of settings.
	 */
	public static function update_settings( $settings ) {
		wp_cache_delete( self::SETTINGS_NAME );

		$new_settings = array();

		foreach ( static::$default_settings as $name => $default ) {
			if ( array_key_exists( $name, $settings ) ) {
				$new_settings[ $name ] = $settings[ $name ];
			} else {
				$new_settings[ $name ] = $default;
			}
		}

		update_option( self::SETTINGS_NAME, $new_settings );
	}

	/**
	 * Update global styles.
	 *
	 * @param array $settings Array of settings.
	 */
	public static function update_global_styles( $settings ) {
		wp_cache_delete( self::SETTINGS_NAME );

		// Create wp_global_styles for unitone.
		\WP_Theme_JSON_Resolver::get_user_global_styles_post_id();

		$user_cpt           = \WP_Theme_JSON_Resolver::get_user_data_from_wp_global_styles( wp_get_theme() );
		$json_global_styles = $user_cpt['post_content'];
		$global_styles      = json_decode( $json_global_styles, true ) ?? array();
		$new_global_styles  = array_replace_recursive(
			array(
				'version'                     => 3,
				'isGlobalStylesUserThemeJSON' => true,
			),
			$global_styles,
			array(
				'styles'   => array(
					'color'      => array(
						'background' => $settings['background-color'] ?? null,
						'text'       => $settings['text-color'] ?? null,
					),
					'elements'   => array(
						'link' => array(
							'color'  => array(
								'text' => $settings['link-color'] ?? null,
							),
							':hover' => array(
								'color' => array(
									'text' => $settings['link-hover-color'] ?? null,
								),
							),
							':focus' => array(
								'color' => array(
									'text' => $settings['link-focus-color'] ?? null,
								),
							),
						),
					),
					'typography' => array(
						'fontFamily' => ! empty( $settings['font-family'] ) ? 'var:preset|font-family|' . $settings['font-family'] : null,
					),
				),
				'settings' => array(
					'layout' => array(
						'contentSize' => $settings['content-size'] ?? null,
						'wideSize'    => $settings['wide-size'] ?? null,
					),
				),
			)
		);
		$new_global_styles  = static::_remove_nulls( $new_global_styles );

		wp_update_post(
			array(
				'ID'           => $user_cpt['ID'],
				'post_content' => wp_json_encode( $new_global_styles ),
			)
		);
	}

	/**
	 * Update global options.
	 *
	 * @param array $settings Array of settings.
	 */
	public static function update_options( $settings ) {
		wp_cache_delete( self::SETTINGS_NAME );

		$new_options = array();

		foreach ( static::$default_options as $name => $default ) {
			if ( array_key_exists( $name, $settings ) ) {
				$new_options[ $name ] = $settings[ $name ];
			} else {
				$new_options[ $name ] = $default;
			}
		}

		if ( 'page' === $settings['show-on-front'] ) {
			if ( isset( $settings['page-on-front'] ) ) {
				$new_options['page_on_front'] = $settings['page-on-front'];
			}
			if ( isset( $settings['page-for-posts'] ) ) {
				$new_options['page_for_posts'] = $settings['page-for-posts'];
			}
		}

		foreach ( $new_options as $name => $value ) {
			$option_name = str_replace( '-', '_', $name );

			if ( false === $value ) {
				delete_option( $option_name );
			} else {
				update_option( $option_name, $value );
			}
		}
	}

	/**
	 * Purge settings.
	 */
	public static function purge() {
		delete_option( self::SETTINGS_NAME );
	}

	/**
	 * All the various settings are merged and returned.
	 *
	 * @return array
	 */
	public static function get_merged_settings() {
		$cache = wp_cache_get( self::SETTINGS_NAME );
		if ( false !== $cache ) {
			return $cache;
		}

		$settings = shortcode_atts( static::$default_settings, static::get_settings() );

		$user_data = \WP_Theme_JSON_Resolver::get_user_data()->get_raw_data();
		$user_data = array_replace_recursive(
			static::$default_global_styles,
			$user_data
		);

		$settings = array_merge(
			$settings,
			array(
				'background-color' => $user_data['styles']['color']['background'] ?? $settings['background-color'],
				'text-color'       => $user_data['styles']['color']['text'] ?? $settings['text-color'],
				'link-color'       => $user_data['styles']['elements']['link']['color']['text'] ?? $settings['link-color'],
				'link-hover-color' => $user_data['styles']['elements']['link'][':hover']['color']['text'] ?? $settings['link-hover-color'],
				'link-focus-color' => $user_data['styles']['elements']['link'][':focus']['color']['text'] ?? $settings['link-focus-color'],
				'content-size'     => $user_data['settings']['layout']['contentSize'] ?? $settings['content-size'],
				'wide-size'        => $user_data['settings']['layout']['wideSize'] ?? $settings['wide-size'],
			),
			static::get_options()
		);

		if ( empty( $settings['enabled-custom-templates'] ) ) {
			$settings['enabled-custom-templates'] = static::get_using_custom_templates();
		}

		wp_cache_set( self::SETTINGS_NAME, $settings );

		return $settings;
	}

	/**
	 * Return information about the custom templates provided by unitone.
	 *
	 * @return array Array of using custom template name.
	 */
	public static function get_using_custom_templates() {
		$cache_key = 'unitone_get_using_custom_templates';
		$cache     = wp_cache_get( $cache_key );
		if ( false !== $cache ) {
			return $cache;
		}

		$custom_templates       = static::get_custom_templates();
		$using_custom_templates = array();

		foreach ( $custom_templates as $template ) {
			// phpcs:disable WordPress.DB.SlowDBQuery.slow_db_query_meta_query
			$using_custom_templates_query = new \WP_Query(
				array(
					'no_found_rows'  => true,
					'posts_per_page' => 1,
					'post_type'      => array( 'post', 'page', 'single-product' ),
					'post_status'    => array( 'publish', 'future', 'private' ),
					'meta_query'     => array(
						array(
							'key'     => '_wp_page_template',
							'value'   => $template['name'],
							'compare' => '=',
						),
					),
				)
			);
			// phpcs:enable

			if ( $using_custom_templates_query->post_count ) {
				$using_custom_templates[] = $template['name'];
			}
		}

		$using_custom_templates = array_unique( $using_custom_templates );

		wp_cache_set( $cache_key, $using_custom_templates );

		return $using_custom_templates;
	}

	/**
	 * Return information about the custom templates provided by unitone.
	 *
	 * @return array
	 *   @var string name
	 *   @var string title
	 *   @var array postTypes
	 */
	public static function get_custom_templates() {
		$cache_key = 'unitone_get_custom_templates';
		$cache     = wp_cache_get( $cache_key );
		if ( false !== $cache ) {
			return $cache;
		}

		$_all_templates = \WP_Theme_JSON_Resolver::get_merged_data( 'theme' )->get_custom_templates();
		$all_templates  = array();
		foreach ( $_all_templates as $slug => $template ) {
			if ( $template['postTypes'] && ! in_array( 'false', $template['postTypes'], true ) ) {
				$all_templates[] = array_merge(
					$template,
					array(
						'slug' => $slug,
					)
				);
			}
		}

		$templates = array_map(
			function ( $template ) {
				return array(
					'name'      => $template['slug'],
					'title'     => $template['title'],
					'postTypes' => $template['postTypes'],
				);
			},
			$all_templates
		);

		ksort( $templates );
		$templates = array_values( $templates );
		wp_cache_set( $cache_key, $templates );

		return $templates;
	}

	/**
	 * Removes arrays from multidimensional arrays from null and so on.
	 *
	 * @param array $source Array.
	 * @return array
	 */
	protected static function _remove_nulls( array $source ) {
		$result = array();

		foreach ( $source as $key => $value ) {
			if ( is_array( $value ) ) {
				$filtered_array = static::_remove_nulls( $value );
				if ( $filtered_array ) {
					$result[ $key ] = $filtered_array;
				}
			} elseif ( ! is_null( $value ) ) {
					$result[ $key ] = $value;
			}
		}

		return $result;
	}
}
