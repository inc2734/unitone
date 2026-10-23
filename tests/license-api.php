<?php
/**
 * Run with `php tests/license-api.php`. No WordPress installation or network is used.
 *
 * @package unitone
 */

// phpcs:disable -- Minimal WordPress stand-ins for isolated regression tests.
namespace Unitone\App\Controller\Manager\Model {
	class Settings {
		public static $values = array( 'license-key' => 'test-key' );
		public static function get_setting( $key ) { return self::$values[ $key ] ?? false; }
		public static function get_settings() { return self::$values; }
		public static function get_default_settings() { return array( 'license-key' => '' ); }
		public static function get_default_global_styles() { return array(); }
		public static function get_global_styles() { return array(); }
		public static function get_default_options() { return array(); }
		public static function get_options() { return array(); }
		public static function update_settings( $values ) { self::$values = $values; }
		public static function update_global_styles( $values ) {}
		public static function update_options( $values ) {}
	}
}

namespace Inc2734\WP_GitHub_Theme_Updater {
	class Bootstrap {
		public function __construct( ...$args ) {}
	}
}

namespace {
	use Unitone\App\Controller\Manager\Manager;
	use Unitone\App\Controller\Manager\Model\Settings;

	const MINUTE_IN_SECONDS = 60;
	const DAY_IN_SECONDS = 86400;
	const WEEK_IN_SECONDS = 604800;
	$wp_version = '7.1';
	$state = array();
	$hooks = array();
	$routes = array();
	$assertions = 0;

	class WP_Error {
		public $code;
		public $message;
		public $data;
		public function __construct( $code = '', $message = '', $data = null ) { $this->code = $code; $this->message = $message; $this->data = $data; }
		public function get_error_code() { return $this->code; }
		public function get_error_data() { return $this->data; }
	}
	class WP_REST_Response {
		public $status;
		public function __construct( $data, $status = 200 ) { $this->status = $status; }
	}
	class Unitone_Test_Request {
		private $params;
		public function __construct( $params = array() ) { $this->params = $params; }
		public function get_params() { return $this->params; }
		public function get_param( $name ) { return $this->params[ $name ] ?? null; }
	}
	class WP_Block_Patterns_Registry {
		public static function get_instance() { return new self(); }
		public function is_registered( $name ) { return false; }
	}
	function __( $text, $domain = '' ) { return $text; }
	function add_action( $hook, $callback, $priority = 10, $accepted = 1 ) { $GLOBALS['hooks'][ $hook ][ $priority ][] = $callback; }
	function add_filter( ...$args ) { add_action( ...$args ); }
	function do_action( $hook ) { apply_filters( $hook, null ); }
	function apply_filters( $hook, $value, ...$args ) {
		$callbacks = $GLOBALS['hooks'][ $hook ] ?? array();
		ksort( $callbacks );
		foreach ( $callbacks as $items ) {
			foreach ( $items as $callback ) { $value = $callback( $value, ...$args ); }
		}
		return $value;
	}
	function register_uninstall_hook( ...$args ) {}
	function register_rest_route( $namespace, $route, $args ) { $GLOBALS['routes'][ $route ][ $args['methods'] ] = $args; }
	function current_user_can( $cap ) { return $GLOBALS['state']['allowed']; }
	function wp_unslash( $value ) { return $value; }
	function esc_html( $value ) { return $value; }
	function sanitize_key( $value ) { return $value; }
	function trailingslashit( $value ) { return rtrim( $value, '/' ) . '/'; }
	function is_admin() { return $GLOBALS['state']['admin']; }
	function wp_should_load_block_assets_on_demand() { return true; }
	function wp_get_theme( $template = '' ) { return new class { public function get( $name ) { return '28.9.1'; } }; }
	function get_template() { return 'unitone'; }
	function home_url() { return 'https://example.test'; }
	function get_locale() { return 'ja'; }
	function add_query_arg( $args, $url ) { return $url . '?' . http_build_query( $args ); }
	function is_wp_error( $value ) { return $value instanceof WP_Error; }
	function wp_remote_retrieve_body( $response ) { return $response['body']; }
	function wp_remote_retrieve_response_code( $response ) { return $response['code']; }
	function wp_remote_get( $url, $args ) {
		$GLOBALS['state']['requests'][] = array( $url, $args );
		return '' === $url ? new WP_Error( 'http_request_failed' ) : call_user_func( $GLOBALS['state']['http'], $url );
	}
	function wp_remote_head( $url, $args ) { return array( 'code' => 200, 'body' => '' ); }
	function get_transient( $name ) {
		$entry = $GLOBALS['state']['cache'][ $name ] ?? null;
		return $entry && $entry['until'] > $GLOBALS['state']['now'] ? $entry['value'] : false;
	}
	function set_transient( $name, $value, $ttl ) {
		$GLOBALS['state']['cache'][ $name ] = array( 'value' => $value, 'until' => $GLOBALS['state']['now'] + $ttl, 'ttl' => $ttl );
		return true;
	}
	function delete_transient( $name ) { unset( $GLOBALS['state']['cache'][ $name ] ); return true; }
	function register_block_style( $types, $style ) { $GLOBALS['state']['styles'][] = $style; }
	function register_block_pattern( $name, $pattern ) { $GLOBALS['state']['patterns'][] = $pattern; }
	function register_block_pattern_category( $name, $category ) { $GLOBALS['state']['categories'][] = $category; }
	function unitone_array_filter_override_replace_recursive( ...$arrays ) { return array_replace_recursive( ...$arrays ); }

	$root = dirname( __DIR__ );
	$original_display = ini_get( 'display_errors' );
	$original_reporting = error_reporting();
	$original_logging = ini_get( 'log_errors' );
	require $root . '/App/Controller/Manager/Manager.php';
	require $root . '/inc/remote-block-styles.php';
	require $root . '/inc/remote-block-patterns.php';
	require $root . '/vendor/inc2734/wp-github-theme-updater/src/App/Model/Requester.php';
	require $root . '/vendor/inc2734/wp-github-theme-updater/src/App/Model/GitHubReleases.php';
	require $root . '/inc/updater.php';
	( new Manager() )->_rest_api_init();

	$reset = static function () use ( &$state ) {
		$state = array(
			'now' => 1000, 'cache' => array(), 'requests' => array(), 'styles' => array(), 'patterns' => array(), 'categories' => array(),
			'admin' => true, 'allowed' => true,
			'http' => static function ( $url ) { return array( 'code' => 200, 'body' => false !== strpos( $url, '/validate/' ) ? 'true' : '[]' ); },
		);
		Settings::$values = array( 'license-key' => 'test-key' );
	};
	$equal = static function ( $expected, $actual ) use ( &$assertions ) {
		++$assertions;
		if ( $expected !== $actual ) { throw new RuntimeException( 'Expected ' . var_export( $expected, true ) . ', got ' . var_export( $actual, true ) ); }
	};
	$fail_on_warning = static function ( $severity, $message, $file, $line ) { throw new ErrorException( $message, 0, $severity, $file, $line ); };
	set_error_handler( $fail_on_warning );

	try {
		// Normal decisions last a day; transport, HTTP, and payload failures last one minute.
		foreach ( array(
			array( 200, 'true', 'true', DAY_IN_SECONDS ), array( 200, " false\n", 'false', DAY_IN_SECONDS ),
			array( 403, '"Blocked."', 'false', DAY_IN_SECONDS ), array( 403, '"Failed request."', 'false', DAY_IN_SECONDS ),
			array( 503, 'Unavailable', '503', MINUTE_IN_SECONDS ), array( 403, 'Forbidden', '403', MINUTE_IN_SECONDS ),
			array( 403, '<html>Forbidden</html>', '403', MINUTE_IN_SECONDS ), array( 403, '"Forbidden"', '403', MINUTE_IN_SECONDS ),
			array( 200, '<html>Error</html>', 'error', MINUTE_IN_SECONDS ), array( 200, '"true"', 'error', MINUTE_IN_SECONDS ),
			array( 200, 'null', 'error', MINUTE_IN_SECONDS ), array( 200, '{}', 'error', MINUTE_IN_SECONDS ),
			array( 200, '0', 'error', MINUTE_IN_SECONDS ),
		) as list( $code, $body, $expected, $ttl ) ) {
			$reset();
			$state['http'] = static function () use ( $code, $body ) { return array( 'code' => $code, 'body' => $body ); };
			$equal( $expected, Manager::get_license_status( 'test-key' ) );
			$cache_name = 'unitone-license-status-test-key';
			$equal( $ttl, $state['cache'][ $cache_name ]['ttl'] );
			$equal( $expected, get_transient( $cache_name ) );
			$equal( array( $cache_name ), array_keys( $state['cache'] ) );
			$equal( $expected, Manager::get_license_status( 'test-key' ) );
			$equal( 1, count( $state['requests'] ) );
		}
		$reset();
		$state['http'] = static function () { return new WP_Error( 'timeout' ); };
		$equal( 'error', Manager::get_license_status( 'test-key' ) );
		$equal( MINUTE_IN_SECONDS, $state['cache']['unitone-license-status-test-key']['ttl'] );
		$equal( 'false', Manager::get_license_status( '' ) );
		$equal( 1, count( $state['requests'] ) );
		$state['http'] = static function () { return array( 'code' => 200, 'body' => 'true' ); };
		$equal( 'error', Manager::get_license_status( 'test-key' ) );
		$state['now'] += 61;
		$equal( 1, count( $state['requests'] ) );
		$equal( 'true', Manager::get_license_status( 'test-key' ) );
		$equal( 'true', get_transient( 'unitone-license-status-test-key' ) );

		// Preserve existing cache values; explicit reauthentication also bypasses old day-long errors.
		foreach ( array( 'true', 'false', '503' ) as $legacy ) {
			$reset();
			set_transient( 'unitone-license-status-test-key', $legacy, DAY_IN_SECONDS );
			$equal( $legacy, Manager::get_license_status( 'test-key' ) );
			$equal( 0, count( $state['requests'] ) );
			$equal( 'true', Manager::get_license_status( 'test-key', true ) );
		}
		$reset();
		set_transient( 'unitone-license-status-test-key', 'false', DAY_IN_SECONDS );
		$equal( 'true', Manager::get_license_status( 'test-key', true ) );
		$equal( true, false !== strpos( $state['requests'][0][0], 'force=1' ) );
		$equal( 'true', get_transient( 'unitone-license-status-test-key' ) );
		$reset();
		set_transient( 'unitone-license-status-test-key', 'error', MINUTE_IN_SECONDS );
		$equal( 'true', Manager::get_license_status( 'test-key', true ) );
		$equal( 'true', get_transient( 'unitone-license-status-test-key' ) );

		// Failed libraries use their existing cache keys for one minute, including empty results.
		foreach ( array( 'true', 'false' ) as $status ) {
			$reset();
			set_transient( 'unitone-license-status-test-key', $status, DAY_IN_SECONDS );
			$state['http'] = static function () { return array( 'code' => 503, 'body' => 'Unavailable' ); };
			unitone_register_remote_block_styles();
			unitone_register_remote_block_patterns();
			$names = array( 'unitone-remote-pattern-categories', 'true' === $status ? 'unitone-premium-remote-patterns' : 'unitone-free-remote-patterns' );
			if ( 'true' === $status ) { $names[] = 'unitone-remote-styles'; }
			foreach ( $names as $name ) {
				$equal( array(), get_transient( $name ) );
				$equal( MINUTE_IN_SECONDS, $state['cache'][ $name ]['ttl'] );
			}
			$equal( count( $names ) + 1, count( $state['cache'] ) );
			unitone_register_remote_block_styles();
			unitone_register_remote_block_patterns();
			$equal( count( $names ), count( $state['requests'] ) );
			$state['now'] += 61;
			$equal( count( $names ), count( $state['requests'] ) );
			$state['http'] = static function () { return array( 'code' => 200, 'body' => '[]' ); };
			unitone_register_remote_block_styles();
			unitone_register_remote_block_patterns();
			$equal( count( $names ) * 2, count( $state['requests'] ) );
			foreach ( $names as $name ) {
				$equal( array(), get_transient( $name ) );
				$equal( WEEK_IN_SECONDS, $state['cache'][ $name ]['ttl'] );
			}
		}

		// Both registration branches tolerate missing and malformed caches during an outage.
		foreach ( array( true, false ) as $admin ) {
			$reset();
			$state['admin'] = $admin;
			set_transient( 'unitone-license-status-test-key', 'error', MINUTE_IN_SECONDS );
			unitone_register_remote_block_styles();
			unitone_register_remote_block_patterns();
			$equal( array(), $state['styles'] );
			$equal( array(), $state['patterns'] );
			set_transient( 'unitone-remote-styles', array( false, 'broken', array( 'name' => 'bad', 'blockTypes' => 'core-paragraph' ) ), WEEK_IN_SECONDS );
			set_transient( 'unitone-premium-remote-patterns', array( false, 'broken', array() ), WEEK_IN_SECONDS );
			set_transient( 'unitone-remote-pattern-categories', array( false, 'broken', array() ), WEEK_IN_SECONDS );
			unitone_register_remote_block_styles();
			unitone_register_remote_block_patterns();
			$equal( array(), $state['styles'] );
			$equal( array(), $state['patterns'] );
		}
		$reset();
		$style = array( 'name' => 'test', 'label' => 'Test', 'inline_style' => 'color:red;', 'blockTypes' => array( 'core-paragraph' ) );
		$pattern = array( 'slug' => 'test', 'title' => 'Test', 'content' => '<!-- wp:paragraph --><p>Test</p><!-- /wp:paragraph -->' );
		set_transient( 'unitone-license-status-test-key', 'error', MINUTE_IN_SECONDS );
		set_transient( 'unitone-remote-styles', array( $style ), WEEK_IN_SECONDS );
		set_transient( 'unitone-premium-remote-patterns', array( $pattern ), WEEK_IN_SECONDS );
		set_transient( 'unitone-remote-pattern-categories', array(), WEEK_IN_SECONDS );
		unitone_register_remote_block_styles();
		unitone_register_remote_block_patterns();
		$equal( array( $style ), $state['styles'] );
		$equal( array( $pattern ), $state['patterns'] );
		$equal( 0, count( $state['requests'] ) );

		// Successful requests still register data and cache it for a week.
		$reset();
		$state['http'] = static function ( $url ) use ( $style, $pattern ) {
			if ( false !== strpos( $url, '/validate/' ) ) { return array( 'code' => 200, 'body' => 'true' ); }
			if ( false !== strpos( $url, '/styles/' ) ) { $data = array( $style ); }
			elseif ( false !== strpos( $url, '/pattern-categories/' ) ) { $data = array( array( 'slug' => 'test', 'name' => 'Test' ) ); }
			else { $data = array( $pattern ); }
			return array( 'code' => 200, 'body' => json_encode( $data ) );
		};
		unitone_register_remote_block_styles();
		unitone_register_remote_block_patterns();
		$equal( 1440, $state['styles'][0]['viewportWidth'] );
		$equal( 1440, $state['patterns'][0]['viewportWidth'] );
		$equal( '[unitone] Test', $state['categories'][0]['label'] );
		$equal( WEEK_IN_SECONDS, $state['cache']['unitone-remote-styles']['ttl'] );
		$equal( WEEK_IN_SECONDS, $state['cache']['unitone-premium-remote-patterns']['ttl'] );
		$equal( 4, count( $state['requests'] ) );

		$reset();
		set_transient( 'unitone-license-status-test-key', 'false', DAY_IN_SECONDS );
		set_transient( 'unitone-premium-remote-patterns', array( $pattern ), WEEK_IN_SECONDS );
		unitone_register_remote_block_styles();
		unitone_register_remote_block_patterns();
		$equal( array(), $state['styles'] );
		$equal( false, get_transient( 'unitone-premium-remote-patterns' ) );

		// Existing PHP getters always return arrays, including failures and malformed responses.
		foreach ( array( 'false', 'null', '<html>Error</html>', '["broken"]', '[{}]' ) as $body ) {
			$reset();
			$state['http'] = static function () use ( $body ) { return array( 'code' => 200, 'body' => $body ); };
			foreach ( array( 'unitone_get_premium_remote_block_styles', 'unitone_get_premium_remote_block_patterns', 'unitone_get_free_remote_block_patterns', 'unitone_get_remote_block_patten_categories' ) as $getter ) {
				$equal( array(), $getter() );
			}
			$equal( array(), _unitone_get_remote_block_styles( 'https://example.test/styles' ) );
			$equal( array(), _unitone_get_remote_block_patterns( 'https://example.test/patterns' ) );
			foreach ( array( 'unitone_get_premium_remote_block_styles', 'unitone_get_premium_remote_block_patterns', 'unitone_get_free_remote_block_patterns', 'unitone_get_remote_block_patten_categories' ) as $getter ) {
				$success = true;
				$equal( array(), $getter( $success ) );
				$equal( false, $success );
			}
		}
		foreach ( array( '[]', '{}' ) as $body ) {
			$reset();
			$state['http'] = static function () use ( $body ) { return array( 'code' => 200, 'body' => $body ); };
			foreach ( array( 'unitone_get_premium_remote_block_styles', 'unitone_get_premium_remote_block_patterns', 'unitone_get_free_remote_block_patterns', 'unitone_get_remote_block_patten_categories' ) as $getter ) {
				$success = false;
				$equal( array(), $getter( $success ) );
				$equal( true, $success );
			}
		}
		$reset();
		$state['http'] = static function () { return array( 'code' => 503, 'body' => 'Unavailable' ); };
		$equal( array(), unitone_get_premium_remote_block_styles() );
		$equal( array(), unitone_get_premium_remote_block_patterns() );
		$equal( array(), unitone_get_free_remote_block_patterns() );
		$equal( array(), unitone_get_remote_block_patten_categories() );

		// Keep valid entries and their collection keys when malformed entries are mixed in.
		$reset();
		$state['http'] = static function ( $url ) use ( $style, $pattern ) {
			if ( false !== strpos( $url, '/validate/' ) ) { return array( 'code' => 200, 'body' => 'true' ); }
			if ( false !== strpos( $url, '/styles/' ) ) { $data = array( 'bad' => array( 'name' => 'bad' ), 'valid' => $style ); }
			elseif ( false !== strpos( $url, '/pattern-categories/' ) ) { $data = array( false, array( 'slug' => 'test', 'name' => 'Test' ), array() ); }
			else { $data = array( 'bad' => array( 'slug' => 'bad', 'content' => '' ), 'valid' => $pattern ); }
			return array( 'code' => 200, 'body' => json_encode( $data ) );
		};
		unitone_register_remote_block_styles();
		unitone_register_remote_block_patterns();
		$equal( 1, count( $state['styles'] ) );
		$equal( 1, count( $state['patterns'] ) );
		$equal( 1, count( $state['categories'] ) );
		$equal( 'test', $state['styles'][0]['name'] );
		$equal( 'test', $state['patterns'][0]['slug'] );
		$equal( array( 'valid' ), array_keys( get_transient( 'unitone-remote-styles' ) ) );
		$equal( array( 'valid' ), array_keys( get_transient( 'unitone-premium-remote-patterns' ) ) );
		$equal( WEEK_IN_SECONDS, $state['cache']['unitone-remote-styles']['ttl'] );

		// Entirely malformed libraries are briefly cached as failures, not as valid empty libraries.
		$reset();
		set_transient( 'unitone-license-status-test-key', 'true', DAY_IN_SECONDS );
		$state['http'] = static function () { return array( 'code' => 200, 'body' => '[{}]' ); };
		unitone_register_remote_block_styles();
		unitone_register_remote_block_patterns();
		foreach ( array( 'unitone-remote-styles', 'unitone-remote-pattern-categories', 'unitone-premium-remote-patterns' ) as $name ) {
			$equal( array(), get_transient( $name ) );
			$equal( MINUTE_IN_SECONDS, $state['cache'][ $name ]['ttl'] );
		}

		// Explicit denials disable premium data; an unrelated proxy's 403 preserves existing data.
		foreach ( array( '"Blocked."', '"Failed request."', '<html>Forbidden</html>' ) as $body ) {
			$reset();
			$state['http'] = static function () use ( $body ) { return array( 'code' => 403, 'body' => $body ); };
			set_transient( 'unitone-remote-styles', array( $style ), WEEK_IN_SECONDS );
			set_transient( 'unitone-premium-remote-patterns', array( $pattern ), WEEK_IN_SECONDS );
			set_transient( 'unitone-remote-pattern-categories', array(), WEEK_IN_SECONDS );
			unitone_register_remote_block_styles();
			unitone_register_remote_block_patterns();
			$unknown = '<html>Forbidden</html>' === $body;
			$equal( $unknown ? array( $style ) : array(), $state['styles'] );
			$equal( $unknown ? array( $pattern ) : array(), $state['patterns'] );
			$equal( $unknown ? array( $pattern ) : false, get_transient( 'unitone-premium-remote-patterns' ) );
		}

		// Recovery works without changing the saved key; cache deletion needs no API connection.
		$reset();
		set_transient( 'unitone-license-status-test-key', '503', DAY_IN_SECONDS );
		$equal( '503', $routes['/license-status']['GET']['callback']( new Unitone_Test_Request() ) );
		$equal( 'true', $routes['/license-status']['GET']['callback']( new Unitone_Test_Request( array( 'force' => 1 ) ) ) );
		$equal( 'true', get_transient( 'unitone-license-status-test-key' ) );
		set_transient( 'unitone-remote-styles', array(), MINUTE_IN_SECONDS );
		$equal( 200, $routes['/remote-block-patterns']['DELETE']['callback']()->status );
		$equal( false, get_transient( 'unitone-remote-styles' ) );
		set_transient( 'unitone-license-status-test-key', '503', DAY_IN_SECONDS );
		set_transient( 'unitone-license-status-new-key', 'error', MINUTE_IN_SECONDS );
		$state['requests'] = array();
		$equal( 200, $routes['/settings']['POST']['callback']( new Unitone_Test_Request( array( 'license-key' => 'new-key' ) ) )->status );
		$equal( 'new-key', Settings::get_setting( 'license-key' ) );
		$equal( false, get_transient( 'unitone-license-status-test-key' ) );
		$equal( false, get_transient( 'unitone-license-status-new-key' ) );
		$equal( 0, count( $state['requests'] ) );
		$equal( true, is_wp_error( $routes['/settings']['POST']['callback']( new Unitone_Test_Request( array( 'license-key' => array() ) ) ) ) );
		$state['allowed'] = false;
		$equal( false, $routes['/settings']['POST']['permission_callback']() );
		$equal( false, $routes['/license-status']['GET']['permission_callback']() );
		$equal( false, $routes['/remote-block-patterns']['DELETE']['permission_callback']() );

		// The update client converts authentication and response failures into WP_Error.
		foreach ( array( 'false', 'error', '503' ) as $status ) {
			$reset();
			set_transient( 'unitone-license-status-test-key', $status, MINUTE_IN_SECONDS );
			$client = new \Inc2734\WP_GitHub_Theme_Updater\App\Model\GitHubReleases( 'unitone', 'inc2734', 'unitone' );
			$equal( true, is_wp_error( $client->get() ) );
		}
		foreach ( array( array( 503, 'Unavailable' ), array( 200, 'false' ), array( 200, '<html>Error</html>' ) ) as list( $code, $body ) ) {
			$reset();
			set_transient( 'unitone-license-status-test-key', 'true', DAY_IN_SECONDS );
			$state['http'] = static function () use ( $code, $body ) { return array( 'code' => $code, 'body' => $body ); };
			$client = new \Inc2734\WP_GitHub_Theme_Updater\App\Model\GitHubReleases( 'unitone', 'inc2734', 'unitone' );
			$equal( true, is_wp_error( $client->get() ) );
		}

		// Source-level guards must not alter PHP error display or reporting for any request.
		$equal( false, function_exists( 'unitone_is_rest_api_request' ) );
		do_action( 'after_setup_theme' );
		$equal( $original_display, ini_get( 'display_errors' ) );
		$equal( $original_reporting, error_reporting() );
		$equal( $original_logging, ini_get( 'log_errors' ) );

		echo 'License/API regressions passed (' . $assertions . " assertions).\n";
	} finally {
		restore_error_handler();
	}
}
