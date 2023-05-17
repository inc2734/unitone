<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

namespace Unitone\App\Controller;

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
		'license-key' => null,
	);

	/**
	 * constructor
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, '_admin_menu' ) );
		add_action( 'admin_init', array( $this, '_init' ) );

		register_uninstall_hook(
			__FILE__,
			array( '\Unitone\App\Controller\Manager', '_uninstall' )
		);
	}

	/**
	 * Add admin menu.
	 */
	public function _admin_menu() {
		add_options_page(
			__( 'unitone settings', 'unitone' ),
			__( 'unitone settings', 'unitone' ),
			'manage_options',
			self::MENU_SLUG,
			function() {
				?>
				<div class="wrap">
					<h1><?php esc_html_e( 'unitone settings', 'unitone' ); ?></h1>
					<form method="post" action="options.php">
						<?php
						settings_fields( self::MENU_SLUG );
						do_settings_sections( self::MENU_SLUG );
						submit_button();
						?>
					</form>

					<form method="post" action="options.php">
						<input type="hidden" name="<?php echo esc_attr( self::SETTINGS_NAME ); ?>[reset]" value="1">
						<?php
						settings_fields( self::MENU_SLUG );
						submit_button(
							esc_html__( 'Reset settings', 'unitone' ),
							'secondary'
						);
						?>
					</form>

					<hr>

					<form method="post" action="options.php">
						<input type="hidden" name="<?php echo esc_attr( self::SETTINGS_NAME ); ?>[clear-remote-patterns-cache]" value="1">
						<?php
						settings_fields( self::MENU_SLUG );
						submit_button(
							esc_html__( 'Clear remote patterns caches', 'unitone' ),
							'primary'
						);
						?>
					</form>
				</div>
				<?php
			}
		);
	}

	/**
	 * Initialize available blocks settings.
	 */
	public function _init() {
		if ( ! $this->_is_option_page() && ! $this->_is_options_page() ) {
			return;
		}

		if ( ! get_option( self::SETTINGS_NAME ) ) {
			update_option( self::SETTINGS_NAME, self::DEFAULT_SETTINGS );
		}

		register_setting(
			self::MENU_SLUG,
			self::SETTINGS_NAME,
			function( $option ) {
				if ( isset( $option['license-key'] ) ) {
					if ( empty( $option['license-key'] ) ) {
						delete_transient( 'unitone-license-status' );
						delete_transient( 'unitone-remote-patterns' );
					} elseif ( static::get_option( 'license-key' ) !== $option['license-key'] ) {
						global $wp_version;

						$response = wp_remote_get(
							sprintf(
								'https://unitone.2inc.org/wp-json/unitone-license-manager/v1/validate/%1$s?repository=unitone',
								esc_attr( $option['license-key'] )
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

						if ( $status ) {
							set_transient( 'unitone-license-status', $status, 60 * 10 );
						} else {
							delete_transient( 'unitone-license-status' );
						}

						delete_transient( 'unitone-remote-patterns' );
					}

					return $option;
				}

				if ( isset( $option['clear-remote-patterns-cache'] ) && '1' === $option['clear-remote-patterns-cache'] ) {
					$transient = delete_transient( 'unitone-remote-patterns' );
					return get_option( self::SETTINGS_NAME );
				}

				if ( isset( $option['reset'] ) && '1' === $option['reset'] ) {
					delete_transient( 'unitone-remote-patterns' );
					return array();
				}

				return $option;
			}
		);

		add_settings_section(
			self::SETTINGS_NAME,
			__( 'Settings', 'unitone' ),
			function() {
			},
			self::MENU_SLUG
		);

		add_settings_field(
			'license-key',
			'<label for="license-key">' . esc_html__( 'License key', 'unitone' ) . '</label>',
			function( $args ) {
				$transient_name = 'unitone-license-status';
				$transient      = get_transient( $transient_name );

				$button = 'true' === $transient
					? array(
						'label'   => __( 'Enable', 'unitone' ),
						'color'   => '#fff',
						'bgcolor' => '#51cf66',
					)
					: array(
						'label'   => __( 'Disable', 'unitone' ),
						'color'   => '#fff',
						'bgcolor' => '#e03131',
					);
				?>
				<div style="display: flex; align-items: center; gap: .5rem">
					<div style="flex: 1 1 auto">
						<input
							type="text"
							id="license-key"
							class="widefat"
							name="<?php echo esc_attr( self::SETTINGS_NAME ); ?>[license-key]"
							value="<?php echo esc_attr( static::get_option( 'license-key' ) ); ?>"
						>
					</div>
					<div style="flex: 0 0 auto">
						<span style="background-color: <?php echo esc_attr( $button['bgcolor'] ); ?>; color: <?php echo esc_attr( $button['color'] ); ?>; padding: .25em .5em; display: inline-block; font-size: 14px"><?php echo esc_html( $button['label'] ); ?></span>
					</div>
				</div>
				<p class="description">
					<?php esc_html_e( 'If the license key entered is valid, the theme can be updated.', 'unitone' ); ?>
				</p>
				<?php
			},
			self::MENU_SLUG,
			self::SETTINGS_NAME
		);
	}

	/**
	 * Uninstall
	 */
	public static function _uninstall() {
		delete_option( self::SETTINGS_NAME );
	}

	/**
	 * Return option.
	 *
	 * @param string $key The option key name.
	 * @return mixed
	 */
	public static function get_option( $key ) {
		$option = get_option( self::SETTINGS_NAME );
		if ( ! $option ) {
			return false;
		}

		return isset( $option[ $key ] ) ? $option[ $key ] : false;
	}

	/**
	 * Return true is option page.
	 *
	 * @return boolean
	 */
	protected function _is_option_page() {
		$current_url = admin_url( '/options-general.php?page=' . static::MENU_SLUG );
		$current_url = preg_replace( '|^(.+)?(/wp-admin/.*?)$|', '$2', $current_url );
		$request_uri = $_SERVER['REQUEST_URI'];
		$request_uri = preg_replace( '|^(.+)?(/wp-admin/.*?)$|', '$2', $request_uri );
		return false !== strpos( $request_uri, $current_url );
	}

	/**
	 * Return true is options page.
	 *
	 * @return boolean
	 */
	protected function _is_options_page() {
		$current_url = admin_url( '/options.php' );
		$current_url = preg_replace( '|^(.+)?(/wp-admin/.*?)$|', '$2', $current_url );
		$request_uri = $_SERVER['REQUEST_URI'];
		$request_uri = preg_replace( '|^(.+)?(/wp-admin/.*?)$|', '$2', $request_uri );
		return false !== strpos( $request_uri, $current_url );
	}
}
