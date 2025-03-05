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
		'base-font-size'            => '16',
		'half-leading'              => '0.4',
		'min-half-leading'          => '0.1',
		'h2-size'                   => '3',
		'h3-size'                   => '2',
		'h4-size'                   => '1',
		'h5-size'                   => '0',
		'h6-size'                   => '0',
		'accent-color'              => '#090a0b', // settings.color.palette > unitone-accent.
		'enabled-custom-templates'  => array( 'template-page-header-footer' ),
		'wp-oembed-blog-card-style' => 'default',
		'font-family'               => null, // Deprecated.
		'background-color'          => null, // Deprecated.
		'text-color'                => null, // Deprecated.
		'content-size'              => null, // Deprecated.
		'wide-size'                 => null, // Deprecated.
	);

	/**
	 * Default options. Keys are for settings.
	 *
	 * @var array
	 */
	protected static $default_options = array(
		'site-logo'      => false,
		'site-icon'      => '0',
		'show-on-front'  => 'posts',
		'page-on-front'  => '0',
		'page-for-posts' => '0',
	);

	/**
	 * Default global styles.
	 *
	 * @var array
	 */
	protected static $default_global_styles = array(
		'styles'   => array(
			'color'      => array(
				'background' => '#fff',
				'text'       => '#222',
			),
			'elements'   => array(
				'link' => array(
					'color'  => array(
						'text' => '#003c78',
					),
					':hover' => array(
						'color' => array(
							'text' => null,
						),
					),
					':focus' => array(
						'color' => array(
							'text' => null,
						),
					),
				),
			),
			'typography' => array(
				'fontFamily' => 'var:preset|font-family|sans-serif',
			),
		),
		'settings' => array(
			'layout' => array(
				'contentSize' => '46rem',
				'wideSize'    => '1334px',
			),
		),
	);

	/**
	 * Return default global styles.
	 *
	 * @return array
	 */
	public static function get_default_global_styles() {
		return static::$default_global_styles;
	}

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
			? static::_remove_nulls( $settings )
			: array();
	}

	/**
	 * Return all global styles.
	 *
	 * @return array
	 */
	public static function get_global_styles() {
		$global_styles = \WP_Theme_JSON_Resolver::get_user_data()->get_raw_data();

		return static::_remove_nulls( $global_styles );
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

		update_option(
			self::SETTINGS_NAME,
			static::_remove_nulls(
				unitone_array_override_replace_recursive(
					static::$default_settings,
					$settings
				)
			)
		);
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

		$new_global_styles = static::_remove_nulls(
			unitone_array_override_replace_recursive(
				array(
					'version'                     => 3,
					'isGlobalStylesUserThemeJSON' => true,
				),
				$global_styles,
				static::$default_global_styles,
				$settings
			)
		);

		wp_update_post(
			array(
				'ID'           => $user_cpt['ID'],
				'post_content' => wp_slash( wp_json_encode( $new_global_styles ) ),
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
				$new_options['page-on-front'] = $settings['page-on-front'];
			}
			if ( isset( $settings['page-for-posts'] ) ) {
				$new_options['page-for-posts'] = $settings['page-for-posts'];
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

		$settings = unitone_array_override_replace_recursive(
			static::$default_settings,
			static::get_settings(),
			static::$default_global_styles,
			static::get_global_styles(),
			static::$default_options,
			static::get_options()
		);

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

		$custom_templates = array_map(
			function ( $template ) {
				return $template['name'];
			},
			static::get_custom_templates()
		);

		$default_using_custom_templates = static::get_default_settings()['enabled-custom-templates'];
		$using_custom_templates         = $default_using_custom_templates;

		// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.PreparedSQL.NotPrepared
		global $wpdb;
		$placeholders = implode( ',', array_fill( 0, count( $custom_templates ), '%s' ) );
		$sql          = $wpdb->prepare(
			"SELECT meta_value FROM {$wpdb->postmeta} WHERE meta_key = %s AND meta_value IN ($placeholders) GROUP BY meta_value",
			array_merge( array( '_wp_page_template' ), $custom_templates )
		);
		$results      = $wpdb->get_results( $sql, 'OBJECT' ) ?? array();
		// phpcs:enable

		foreach ( $results as $row ) {
			$template_name = $row->meta_value;
			if ( ! in_array( $template_name, $using_custom_templates, true ) ) {
				$using_custom_templates[] = $template_name;
			}
		}

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
