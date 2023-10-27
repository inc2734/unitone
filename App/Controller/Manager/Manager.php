<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

namespace Unitone\App\Controller\Manager;

class Manager {

	/**
	 * Setting page slug.
	 *
	 * @var string
	 */
	const MENU_SLUG = 'unitone';

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
	const DEFAULT_SETTINGS = array(
		'license-key'      => '',
		'font-family'      => 'sans-serif',
		'base-font-size'   => 16,
		'half-leading'     => 0.4,
		'h2-size'          => 3,
		'h3-size'          => 2,
		'h4-size'          => 1,
		'h5-size'          => 0,
		'h6-size'          => 0,
		'accent-color'     => '#1f1640',
		'background-color' => '#fff',
		'text-color'       => 'var(--unitone--color--text)',
		'link-color'       => null,
		'content-size'     => '46rem',
		'wide-size'        => '1334px',
	);

	/**
	 * constructor
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, '_admin_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this, '_admin_enqueue_scripts' ) );
		add_action( 'rest_api_init', array( $this, '_rest_api_init' ) );
		add_action( 'admin_notices', array( $this, '_welcome_admin_notice' ), 1 );

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
			function() {
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
		delete_option( self::SETTINGS_NAME );
	}

	/**
	 * Fires when enqueuing scripts for all admin pages.
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

		$asset_file = include( get_template_directory() . '/App/Controller/Manager/dist/js/app.asset.php' );
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

		// $theme_json_data = \WP_Theme_JSON_Resolver::get_merged_data()->get_raw_data();
		$global_settings = wp_get_global_settings();

		wp_localize_script(
			'unitone/settings',
			'defaultSettings',
			self::DEFAULT_SETTINGS,
		);

		wp_localize_script(
			'unitone/settings',
			'currentSettings',
			array_merge(
				static::get_settings(),
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
								function( $palette, $key ) {
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
							function( $font_family ) {
								return array(
									'name'       => $font_family['name'],
									'slug'       => $font_family['slug'],
									'fontFamily' => $font_family['fontFamily'],
								);
							},
							$global_settings['typography']['fontFamilies']['theme']
						);
					} )(),
					'fontSizes'            => ( function () use ( $global_settings ) {
						$scale = -2;
						return array_map(
							function( $font_size ) use ( &$scale ) {
								$new_font_size = array_merge(
									$font_size,
									array(
										'slug' => $scale,
									)
								);
								$scale ++;
								return $new_font_size;
							},
							$global_settings['typography']['fontSizes']['theme']
						);
					} )(),
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
				'callback'            => function() {
					return static::get_license_status( static::get_setting( 'license-key' ) );
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
				'callback'            => function( $request ) {
					return static::get_settings( $request->get_params() );
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
				'callback'            => function( $request ) {
					if ( $request->get_params() ) {
						$settings = $request->get_params();

						$new_settings = array();

						// Extract all but the core settings.
						foreach ( self::DEFAULT_SETTINGS as $name => $default ) {
							if ( array_key_exists( $name, $settings ) ) {
								$new_settings[ $name ] = $settings[ $name ];
							}
						}

						// The new settings are sent only in difference.
						// Therefore, there are merged with the stored settings and saved as new settings.
						$new_settings = array_merge(
							get_option( self::SETTINGS_NAME ) ? get_option( self::SETTINGS_NAME ) : array(),
							$new_settings
						);

						// The settings to be deleted are sent as null, so the null settings are removed.
						// Also, if the settings are the same as the default settings, there are not saved.
						$new_settings = array_filter(
							$new_settings,
							function( $value, $key ) {
								return ! is_null( $value ) && self::DEFAULT_SETTINGS[ $key ] !== $value;
							},
							ARRAY_FILTER_USE_BOTH
						);

						update_option( self::SETTINGS_NAME, $new_settings );

						if ( array_key_exists( 'site-logo', $settings ) ) {
							if ( ! is_null( $settings['site-logo'] ) ) {
								update_option( 'site_logo', $settings['site-logo'] );
							} else {
								delete_option( 'site_logo' );
							}
						}

						if ( array_key_exists( 'site-icon', $settings ) ) {
							if ( ! is_null( $settings['site-icon'] ) ) {
								update_option( 'site_icon', $settings['site-icon'] );
							} else {
								delete_option( 'site_icon' );
							}
						}

						if ( array_key_exists( 'show-on-front', $settings ) ) {
							switch ( $settings['show-on-front'] ) {
								case 'posts':
									update_option( 'show_on_front', $settings['show-on-front'] );
									break;
								case 'page':
									update_option( 'show_on_front', $settings['show-on-front'] );
									if ( isset( $settings['page-on-front'] ) ) {
										update_option( 'page_on_front', $settings['page-on-front'] );
									}
									if ( isset( $settings['page-for-posts'] ) ) {
										update_option( 'page_for_posts', $settings['page-for-posts'] );
									}
									break;
								default:
									update_option( 'show_on_front', 'posts' );
									delete_option( 'page_on_front' );
									delete_option( 'page_for_posts' );
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
				'callback'            => function( $request ) {
					if ( $request->get_params() ) {
						$settings = $request->get_params();

						$existing_page = get_page_by_path( static::_get_homepage_slug(), OBJECT, array( 'page' ) );
						if ( $existing_page ) {
							return \WP_REST_Response( array( 'message' => 'Could not create homepage' ), 400 );
						}

						$post_content = null;
						if ( $settings['pattern'] && 'blank' !== $settings['pattern'] ) {
							$pattern_properties = \WP_Block_Patterns_Registry::get_instance()->get_registered( $settings['pattern'] );
							if ( $pattern_properties ) {
								$post_content = $pattern_properties['content'];
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
				'callback'            => function( $request ) {
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
				'callback'            => function( $request ) {
					if ( $request->get_params() ) {
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
	 * Prints admin screen notices.
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

		if ( ! empty( array_diff_assoc( self::DEFAULT_SETTINGS, static::get_settings() ) ) ) {
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
	 * Return all settings.
	 *
	 * @param array $keys Array of settings keys.
	 * @return array
	 */
	public static function get_settings( $keys = array() ) {
		$settings = shortcode_atts( self::DEFAULT_SETTINGS, get_option( self::SETTINGS_NAME ) );

		$site_logo = get_option( 'site_logo' );
		if ( $site_logo ) {
			$settings['site-logo'] = $site_logo;
		}

		$site_icon = get_option( 'site_icon' );
		if ( $site_icon ) {
			$settings['site-icon'] = $site_icon;
		}

		$show_on_front = get_option( 'show_on_front' );
		if ( $show_on_front ) {
			$settings['show-on-front'] = $show_on_front;
		}

		$page_on_front = get_option( 'page_on_front' );
		if ( $page_on_front ) {
			$settings['page-on-front'] = $page_on_front;
		}

		$page_for_posts = get_option( 'page_for_posts' );
		if ( $page_for_posts ) {
			$settings['page-for-posts'] = $page_for_posts;
		}

		return $keys
			? array_filter(
				$settings,
				function( $key ) use ( $keys ) {
					return in_array( $key, $keys, true );
				},
				ARRAY_FILTER_USE_KEY
			)
			: $settings;
	}

	/**
	 * Return setting.
	 *
	 * @param string $key The setting key name.
	 * @return mixed
	 */
	public static function get_setting( $key ) {
		return static::get_settings( array( $key ) )[ $key ] ?? false;
	}

	/**
	 * Get license status.
	 *
	 * @param string $license_key The license key.
	 * @return boolean
	 */
	public static function get_license_status( $license_key ) {
		$transient = get_transient( 'unitone-license-status-' . sha1( $license_key ) );
		if ( false !== $transient ) {
			// return $transient;
		}

		$status = static::_request_license_validate( $license_key );
		set_transient( 'unitone-license-status-' . sha1( $license_key ), $status ? $status : 'false', DAY_IN_SECONDS );
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
					'Accept-Encoding' => '',
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

	protected static function _get_homepage_slug() {
		return 'home';
	}

	protected static function _get_posts_page_slug() {
		return 'blog';
	}
}
