<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

namespace Unitone\App\Controller\Manager;

use Unitone\App\Controller\Manager\Model\Settings;

class Manager {

	/**
	 * Setting page slug.
	 *
	 * @var string
	 */
	const MENU_SLUG = 'unitone';

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, '_admin_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this, '_admin_enqueue_scripts' ) );
		add_action( 'rest_api_init', array( $this, '_rest_api_init' ) );
		add_action( 'admin_notices', array( $this, '_welcome_admin_notice' ), 1 );
		add_action( 'admin_notices', array( $this, '_activate_admin_notice' ), 2 );

		register_uninstall_hook(
			__FILE__,
			array( '\Unitone\App\Controller\Manager\Manager', '_uninstall' )
		);
	}

	/**
	 * Add admin menu.
	 */
	public function _admin_menu() {
		add_theme_page(
			__( 'unitone Setup', 'unitone' ),
			__( 'unitone Setup', 'unitone' ),
			'manage_options',
			self::MENU_SLUG,
			function () {
				?>
				<div class="edit-site" id="site-editor">
					<div id="unitone-settings" style="height: 100%"></div>
				</div>
				<?php
			}
		);
	}

	/**
	 * Uninstall
	 */
	public static function _uninstall() {
		Settings::purge();
	}

	/**
	 * Fires when enqueuing scripts for all admin pages.
	 *
	 * @param string $hook_suffix The current admin page.
	 */
	public function _admin_enqueue_scripts( $hook_suffix ) {
		if ( 'appearance_page_' . self::MENU_SLUG !== $hook_suffix ) {
			return;
		}

		add_filter(
			'admin_body_class',
			function ( $classes ) {
				return $classes . ' site-editor-php';
			}
		);

		wp_enqueue_style(
			'unitone/settings',
			get_template_directory_uri() . '/App/Controller/Manager/dist/css/app.css',
			array( 'wp-components', 'wp-edit-site' ),
			filemtime( get_template_directory() . '/App/Controller/Manager/dist/css/app.css' )
		);

		wp_enqueue_media();

		$asset_file = include get_template_directory() . '/App/Controller/Manager/dist/js/app.asset.php';
		wp_enqueue_script(
			'unitone/settings',
			get_template_directory_uri() . '/App/Controller/Manager/dist/js/app.js',
			array_merge( $asset_file['dependencies'], array( 'wp-edit-post' ) ),
			filemtime( get_template_directory() . '/App/Controller/Manager/dist/js/app.js' ),
			true
		);
		wp_set_script_translations( 'unitone/settings', 'unitone', get_template_directory() . '/languages' );

		foreach ( $asset_file['dependencies'] as $style ) {
			wp_enqueue_style( $style );
		}

		do_action( 'unitone_setup_enqueue_assets' );

		$global_settings        = wp_get_global_settings();
		$custom_templates       = Settings::get_custom_templates();
		$using_custom_templates = Settings::get_using_custom_templates();

		wp_localize_script(
			'unitone/settings',
			'defaultSettings',
			array_merge(
				Settings::get_default_settings(),
				Settings::get_default_global_styles()
			),
		);

		wp_localize_script(
			'unitone/settings',
			'currentSettings',
			array_merge(
				static::_convert_preset_value( Settings::get_merged_settings() ),
				array(
					'adminUrl'             => admin_url(),
					'homeUrl'              => home_url(),
					'templateDirectoryUri' => get_template_directory_uri(),
					'siteTitle'            => get_option( 'blogname' ),
					'siteLogoUrl'          => wp_get_attachment_url( get_option( 'site_logo' ) ),
					'siteIconUrl'          => wp_get_attachment_url( get_option( 'site_icon' ) ),
					'hasHomepage'          => ! is_null( get_page_by_path( static::_get_homepage_slug(), OBJECT, array( 'page' ) ) ),
					'hasPostsPage'         => ! is_null( get_page_by_path( static::_get_posts_page_slug(), OBJECT, array( 'page' ) ) ),
					'palette'              => ( function () use ( $global_settings ) {
						return array_reverse(
							array_map(
								function ( $palette, $key ) {
									return array(
										'name'   => $key,
										'colors' => $palette,
									);
								},
								$global_settings['color']['palette'],
								array_keys( $global_settings['color']['palette'] )
							)
						);
					} )(),
					'fontFamilies'         => ( function () use ( $global_settings ) {
						return array_map(
							function ( $font_family ) {
								return array(
									'name'       => $font_family['name'],
									'slug'       => $font_family['slug'],
									'fontFamily' => str_replace( '"', "'", $font_family['fontFamily'] ),
								);
							},
							array_merge(
								$global_settings['typography']['fontFamilies']['theme'] ?? array(),
								$global_settings['typography']['fontFamilies']['custom'] ?? array()
							)
						);
					} )(),
					'fontSizes'            => ( function () use ( $global_settings ) {
						$scale = -2;
						return array_map(
							function ( $font_size ) use ( &$scale ) {
								$new_font_size = array_merge(
									$font_size,
									array(
										'slug' => $scale,
									)
								);
								$scale++;
								return $new_font_size;
							},
							$global_settings['typography']['fontSizes']['theme']
						);
					} )(),
					'customTemplates'      => $custom_templates,
					'usingCustomTemplates' => $using_custom_templates,
				)
			)
		);
	}

	/**
	 * Fires when preparing to serve a REST API request.
	 */
	public function _rest_api_init() {

		/**
		 * The license status getter.
		 *
		 * @return string 'true' or 'false'.
		 */
		register_rest_route(
			'unitone/v1',
			'/license-status',
			array(
				'methods'             => 'GET',
				'callback'            => function () {
					return static::get_license_status( Settings::get_setting( 'license-key' ) );
				},
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);

		/**
		 * unitone settings getter.
		 *
		 * @return array
		 */
		register_rest_route(
			'unitone/v1',
			'/settings',
			array(
				'methods'             => 'GET',
				'callback'            => function ( $request ) {
					$params   = $request->get_params();
					$settings = Settings::get_merged_settings();

					return array_filter(
						$settings,
						function ( $key ) use ( $params ) {
							return in_array( $key, $params, true );
						},
						ARRAY_FILTER_USE_KEY
					);
				},
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);

		/**
		 * unitone settings updater.
		 *
		 * @param WP_REST_Request $request
		 * @return string
		 */
		register_rest_route(
			'unitone/v1',
			'/settings',
			array(
				'methods'             => 'POST',
				'callback'            => function ( $request ) {
					if ( $request->get_params() ) {
						$settings = $request->get_params();

						$default_settings = Settings::get_default_settings();
						$saved_settings   = Settings::get_settings();

						$default_global_styles = Settings::get_default_global_styles();
						$saved_global_styles   = Settings::get_global_styles();

						$default_options = Settings::get_default_options();
						$saved_options   = Settings::get_options();

						// Extract all but the core settings.
						// The new settings are sent only in difference.
						// Therefore, there are merged with the stored settings and saved as new settings.

						$new_settings = array_replace_recursive(
							$saved_settings,
							array_filter(
								$settings,
								function ( $key ) {
									return ! in_array( $key, array( 'styles', 'settings' ), true );
								},
								ARRAY_FILTER_USE_KEY
							),
						);
						$new_settings =
							array_replace_recursive(
								$default_settings,
								$new_settings
							);

						$new_global_styles = array_replace_recursive(
							$saved_global_styles,
							array( 'styles' => $settings['styles'] ?? array() ),
							array( 'settings' => $settings['settings'] ?? array() )
						);
						$new_global_styles = array_replace_recursive(
							$default_global_styles,
							$new_global_styles
						);

						$new_options = array_replace_recursive(
							$saved_options,
							$settings,
						);
						$new_options = array_replace_recursive(
							$default_options,
							$new_options
						);

						Settings::update_settings( static::_convert_preset_value( $new_settings ) );
						Settings::update_global_styles( static::_convert_preset_value( $new_global_styles ) );
						Settings::update_options( $new_options );

						if ( array_key_exists( 'license-key', $settings ) ) {
							$license_key = $settings['license-key'];
							if ( ! empty( $license_key ) ) {
								$transient_name = 'unitone-license-status-' . $license_key;
								delete_transient( $transient_name );
							}
						}

						return new \WP_REST_Response( array( 'message' => 'OK' ), 200 );
					}
					return new \WP_REST_Response( array( 'message' => 'Could not save settings' ), 400 );
				},
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);

		/**
		 * Create homepage.
		 *
		 * @param WP_REST_Request $request
		 * @return WP_Post
		 */
		register_rest_route(
			'unitone/v1',
			'/homepage',
			array(
				'methods'             => 'POST',
				'callback'            => function ( $request ) {
					if ( $request->get_params() ) {
						$settings = $request->get_params();

						$existing_page = get_page_by_path( static::_get_homepage_slug(), OBJECT, array( 'page' ) );
						if ( $existing_page ) {
							return \WP_REST_Response( array( 'message' => 'Could not create homepage' ), 400 );
						}

						$post_content = '';
						if ( $settings['pattern'] && 'blank' !== $settings['pattern'] ) {
							$pattern_properties = \WP_Block_Patterns_Registry::get_instance()->get_registered( $settings['pattern'] );
							if ( $pattern_properties ) {
								$post_content = $pattern_properties['content'];
								$post_content = str_replace( '\\u002d\\u002d', '--', $post_content );
							}
						}

						$page_id = wp_insert_post(
							array(
								'post_author'  => 1,
								'post_title'   => __( 'Home', 'unitone' ),
								'post_name'    => static::_get_homepage_slug(),
								'post_status'  => 'publish',
								'post_type'    => 'page',
								'post_content' => $post_content,
							)
						);

						$page = get_post( $page_id );

						return $page
							? new \WP_REST_Response( $page, 200 )
							: new \WP_REST_Response( array( 'message' => 'Could not create homepage' ), 400 );
					}
					return new \WP_REST_Response( array( 'message' => 'Could not create homepage' ), 400 );
				},
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);

		/**
		 * Create posts page.
		 *
		 * @param WP_REST_Request $request
		 * @return WP_Post
		 */
		register_rest_route(
			'unitone/v1',
			'/posts-page',
			array(
				'methods'             => 'POST',
				'callback'            => function ( $request ) {
					if ( $request->get_params() ) {
						$existing_page = get_page_by_path( static::_get_posts_page_slug(), OBJECT, array( 'page' ) );
						if ( $existing_page ) {
							return new \WP_REST_Response( array( 'message' => 'Could not create posts page' ), 400 );
						}

						$page_id = wp_insert_post(
							array(
								'post_author' => 1,
								'post_title'  => __( 'Blog', 'unitone' ),
								'post_name'   => static::_get_posts_page_slug(),
								'post_status' => 'publish',
								'post_type'   => 'page',
							)
						);

						$page = get_post( $page_id );

						return $page
							? new \WP_REST_Response( $page, 200 )
							: new \WP_REST_Response( array( 'message' => 'Could not create posts page' ), 400 );
					}
					return new \WP_REST_Response( array( 'message' => 'Could not create posts page' ), 400 );
				},
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);

		/**
		 * Delete remote block pattenrs cache.
		 *
		 * @return string
		 */
		register_rest_route(
			'unitone/v1',
			'/remote-block-patterns',
			array(
				'methods'             => 'DELETE',
				'callback'            => function ( $request ) {
					$settings = $request->get_params();
					if ( $settings ) {
						$license_key = $settings['license-key'] ?? null;
						if ( ! empty( $license_key ) ) {
							$transient_name = 'unitone-license-status-' . $license_key;
							delete_transient( $transient_name );
						}

						delete_transient( 'unitone-remote-patterns' );
						delete_transient( 'unitone-remote-pattern-categories' );
						return new \WP_REST_Response( array( 'message' => 'OK' ), 200 );
					}
					return new \WP_REST_Response( array( 'message' => 'Could not save settings' ), 400 );
				},
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);
	}

	/**
	 * Prints admin screen notices for setup.
	 */
	public function _welcome_admin_notice() {
		$screen = get_current_screen();
		if ( ! $screen || 'themes' !== $screen->base ) {
			return;
		}

		$template = get_template();
		if ( 'unitone' !== $template ) {
			return;
		}

		$default_settings = array_replace_recursive(
			Settings::get_default_settings(),
			Settings::get_default_global_styles(),
			Settings::get_default_options()
		);

		$merged_settings = Settings::get_merged_settings();

		$diff = array();
		foreach ( $default_settings as $default_setting_key => $default_setting_value ) {
			if ( isset( $merged_settings[ $default_setting_key ] ) ) {
				if ( wp_json_encode( $merged_settings[ $default_setting_key ] ) !== wp_json_encode( $default_setting_value ) ) {
					$diff[ $default_setting_key ] = $merged_settings[ $default_setting_key ];
				}
			}
		}

		$saved_by = ! empty( $diff );
		if ( $saved_by ) {
			return;
		}
		?>
		<div class="notice unitone-welcome-notice" style="border: none; padding: 4rem 2rem; background-color: #121212; color: #fff">
			<div style="display: flex; flex-wrap: wrap; gap: 2rem; align-items: center">
				<div style="flex: 1">
					<div style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1.2rem">
						<?php echo esc_html_e( 'unitone theme has been activated', 'unitone' ); ?>
					</div>
					<div style="font-size: 1.2rem">
						<?php echo esc_html_e( 'Let\'s start with the initial setup on the unitone setup screen.', 'unitone' ); ?>
					</div>
				</div>
				<div>
					<a class="button button-primary" style="padding: 0.75rem 1.25rem; font-size: 1rem" href="<?php echo esc_url( admin_url( '/themes.php?page=unitone' ) ); ?>"><?php esc_html_e( 'Go to the setup screen', 'unitone' ); ?></a>
				</div>
			</div>
		</div>
		<?php
	}

	/**
	 * Prints admin screen notices for activate.
	 */
	public function _activate_admin_notice() {
		$screen = get_current_screen();
		if ( ! $screen || 'post' === $screen->id ) {
			return;
		}

		$license_status = static::get_license_status( static::get_setting( 'license-key' ) );
		if ( 'true' === $license_status ) {
			return;
		}

		$message = sprintf(
			// translators: %1$s: a start tag, %2$s: a end tag, %3$s: a start tag, %4$s: a end tag.
			__( 'You have not set a valid license key. Setting a license key will allow you to use patterns registered in %3$sthe pattern library%4$s. It will also enable theme updates. A license key is issued when you subscribe to %1$sunitone license key subscription%2$s. The license key is set %5$shere%6$s.', 'unitone' ),
			'<a href="https://unitone.2inc.org/product/unitone-license-key/" target="_blank" rel="noreferrer">',
			'</a>',
			'<a href="https://unitone.2inc.org/unitone-patterns/" target="_blank" rel="noreferrer">',
			'</a>',
			'<a href="' . admin_url( 'themes.php?page=unitone' ) . '">',
			'</a>',
		);

		wp_admin_notice(
			$message,
			array(
				'type'        => 'error',
				'dismissible' => false,
			)
		);
	}

	/**
	 * Return setting.
	 *
	 * @param string $key The setting key name.
	 * @return mixed
	 */
	public static function get_setting( $key ) {
		return Settings::get_setting( $key );
	}

	/**
	 * Get license status.
	 *
	 * @param string $license_key The license key.
	 * @return boolean
	 */
	public static function get_license_status( $license_key ) {
		if ( empty( $license_key ) ) {
			return false;
		}

		$transient_name = 'unitone-license-status-' . $license_key;
		$transient      = get_transient( $transient_name );
		if ( false !== $transient ) {
			return $transient;
		}

		$status = static::_request_license_validate( $license_key );
		set_transient( $transient_name, $status ? $status : 'false', DAY_IN_SECONDS );
		return $status;
	}

	/**
	 * Validate checker.
	 *
	 * @param string $license_key The license key.
	 * @return boolean
	 */
	protected static function _request_license_validate( $license_key ) {
		global $wp_version;

		$response = wp_remote_get(
			sprintf(
				'https://unitone.2inc.org/wp-json/unitone-license-manager/v1/validate/%1$s?repository=unitone',
				$license_key
			),
			array(
				'user-agent' => 'WordPress/' . $wp_version,
				'timeout'    => 30,
				'headers'    => array(
					'Accept-Encoding'   => '',
					'X-Unitone-Version' => wp_get_theme()->get( 'Version' ),
					'X-Unitone-URL'     => home_url(),
				),
			)
		);

		$status = false;
		if ( $response && ! is_wp_error( $response ) ) {
			$response_code = wp_remote_retrieve_response_code( $response );
			if ( 200 === $response_code ) {
				$status = wp_remote_retrieve_body( $response );
			}
		}

		return $status;
	}

	/**
	 * Return default homepage slug.
	 *
	 * @return string
	 */
	protected static function _get_homepage_slug() {
		return 'home';
	}

	/**
	 * Return default posts page slug.
	 *
	 * @return string
	 */
	protected static function _get_posts_page_slug() {
		return 'blog';
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
		return Settings::get_custom_templates();
	}

	/**
	 * Converts a custom value to preset style value if one can be found.
	 *
	 * Returns value as-is if no match is found.
	 *
	 * @param string $value Value to convert.
	 * @return string The preset style value if it can be found.
	 */
	protected static function _get_preset_value_from_custom_value( $value ) {
		if ( null === $value || '' === $value ) {
			return $value;
		}

		preg_match( '/^var\(--wp--preset--(.+?)--(.+)\)$/', $value, $match );
		if ( ! $match ) {
			return $value;
		}

		return 'var:preset|' . strtolower( preg_replace( '/[A-Z]/', '-\0', $match[1] ) ) . '|' . $match[2];
	}

	/**
	 * Converts custom values to preset style value if one can be found.
	 *
	 * @param array $values Array of values to convert.
	 * @return array
	 */
	protected static function _convert_preset_value( array $values ) {
		$result = array();

		foreach ( $values as $key => $value ) {
			if ( is_array( $value ) ) {
				$filtered_array = static::_convert_preset_value( $value );
				if ( $filtered_array ) {
					$result[ $key ] = $filtered_array;
				}
			} else {
				$result[ $key ] = static::_get_preset_value_from_custom_value( $value );
			}
		}

		return $result;
	}
}
