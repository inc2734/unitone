<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

add_action(
	'rest_api_init',
	function () {
		register_setting(
			'reading',
			'unitone_openai_api_key',
			array(
				'type'              => 'string',
				'sanitize_callback' => 'esc_attr',
				'show_in_rest'      => true,
			)
		);

		register_setting(
			'reading',
			'unitone_openai_model',
			array(
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
				'default'           => 'gpt-4o-mini',
			)
		);

		/**
		 * Save OpenAI API Key.
		 *
		 * @param WP_REST_Request $request
		 * @return boolean
		 */
		register_rest_route(
			'unitone/v1',
			'/openai-api-key',
			array(
				'methods'             => 'POST',
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
				'callback'            => function ( $request ) {
					$key = $request->get_param( 'key' );
					if ( is_string( $key ) ) {
						$key = trim( $key );
					}

					update_option( 'unitone_openai_api_key', $key );

					return true;
				},
			)
		);

		/**
		 * Save OpenAI model.
		 *
		 * @param WP_REST_Request $request
		 * @return boolean
		 */
		register_rest_route(
			'unitone/v1',
			'/openai-model',
			array(
				'methods'             => 'POST',
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
				'callback'            => function ( $request ) {
					$model = $request->get_param( 'model' );
					if ( is_string( $model ) ) {
						$model = trim( $model );
					}

					update_option( 'unitone_openai_model', $model );

					return true;
				},
			)
		);

		/**
		 * Fetch OpenAI models.
		 *
		 * @return array
		 */
		register_rest_route(
			'unitone/v1',
			'/openai-models',
			array(
				'methods'             => 'GET',
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
				'callback'            => function () {
					$api_key = get_option( 'unitone_openai_api_key' );
					if ( ! $api_key ) {
						return new \WP_REST_Response(
							array( 'message' => 'The API key is empty.' ),
							400
						);
					}

					$response = wp_remote_get(
						'https://api.openai.com/v1/models',
						array(
							'headers' => array(
								'Authorization' => 'Bearer ' . $api_key,
							),
							'timeout' => 30,
						)
					);

					if ( ! $response || is_wp_error( $response ) ) {
						return new \WP_REST_Response(
							array( 'message' => 'Failed to request OpenAI.' ),
							500
						);
					}

					$response_code = wp_remote_retrieve_response_code( $response );
					if ( 200 !== $response_code ) {
						$body = json_decode( wp_remote_retrieve_body( $response ), true );
						$error_message = $body['error']['message'] ?? 'OpenAI returned an error.';
						return new \WP_REST_Response(
							array( 'message' => $error_message ),
							$response_code
						);
					}

					$body   = json_decode( wp_remote_retrieve_body( $response ), true );
					$models = array();

					foreach ( $body['data'] ?? array() as $model ) {
						if ( ! empty( $model['id'] ) ) {
							$models[] = $model['id'];
						}
					}

					rsort( $models );

					return array(
						'models' => $models,
					);
				},
			)
		);

		/**
		 * Request to OpenAI.
		 *
		 * @param WP_REST_Request $request
		 * @return string
		 */
		register_rest_route(
			'unitone/v1',
			'/openai',
			array(
				'methods'             => 'POST',
				'permission_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
				'callback'            => function ( $request ) {
					$prompt = $request->get_param( 'prompt' );
					if ( ! $prompt ) {
						return new \WP_REST_Response(
							array( 'message' => 'The prompt is empty.' ),
							400
						);
					}

					$openai_model = get_option( 'unitone_openai_model' );
					$openai_key   = get_option( 'unitone_openai_api_key' );
					if ( ! $openai_model || ! $openai_key ) {
						return new \WP_REST_Response(
							array(
								'message' => 'OpenAI setup is not configured. Configure WordPress AI Connectors or set the legacy OpenAI API key/model in unitone setup.',
							),
							400
						);
					}

					$response = wp_remote_post(
						'https://api.openai.com/v1/chat/completions',
						array(
							'headers' => array(
								'Content-Type'  => 'application/json',
								'Authorization' => 'Bearer ' . $openai_key,
							),
							'timeout' => 30,
							'body'    => wp_json_encode(
								array(
									'model'    => $openai_model,
									'messages' => array(
										array(
											'role'    => 'user',
											'content' => $prompt,
										),
									),
								)
							),
						)
					);

					if ( ! $response || is_wp_error( $response ) ) {
						return new \WP_REST_Response(
							array( 'message' => 'Failed to request OpenAI.' ),
							500
						);
					}

					$response_code = wp_remote_retrieve_response_code( $response );
					if ( 200 !== $response_code ) {
						$body = json_decode( wp_remote_retrieve_body( $response ), true );
						$error_message = $body['error']['message'] ?? 'OpenAI returned an error.';
						return new \WP_REST_Response(
							array( 'message' => $error_message ),
							$response_code
						);
					}

					return json_decode( wp_remote_retrieve_body( $response ), true );
				},
			)
		);

		/**
		 * Check whether WordPress AI Connectors are configured for text generation.
		 */
		register_rest_route(
			'unitone/v1',
			'/ai-connectors-status',
			array(
				'methods'             => 'GET',
				'permission_callback' => function () {
					return current_user_can( 'edit_posts' ) || current_user_can( 'manage_options' );
				},
				'callback'            => function () {
					global $wpdb;

					$cache_key   = 'unitone_ai_connectors_candidate_rows';
					$cache_group = 'unitone';
					$candidate_rows = wp_cache_get( $cache_key, $cache_group );

					if ( false === $candidate_rows ) {
						// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
						$candidate_rows = $wpdb->get_results(
							"SELECT option_value FROM {$wpdb->options} WHERE option_name LIKE '%ai%' AND option_name LIKE '%connectors_ai_%' LIMIT 100",
							ARRAY_A
						);
						wp_cache_set( $cache_key, $candidate_rows, $cache_group, MINUTE_IN_SECONDS );
					}

					$has_wp_ai_client = function_exists( 'wp_ai_client_prompt' );
					$active_plugins   = (array) get_option( 'active_plugins', array() );
					if ( is_multisite() ) {
						$active_plugins = array_merge(
							$active_plugins,
							array_keys( (array) get_site_option( 'active_sitewide_plugins', array() ) )
						);
					}

					$has_active_provider_plugin = false;
					foreach ( $active_plugins as $plugin_file ) {
						$normalized = (string) $plugin_file;
						if (
							false !== strpos( $normalized, 'ai-provider-' ) ||
							false !== strpos( $normalized, '/ai-provider-' ) ||
							false !== strpos( $normalized, 'wordpress-ai-services' ) ||
							false !== strpos( $normalized, '/ai-services' )
						) {
							$has_active_provider_plugin = true;
							break;
						}
					}

					$has_connector_credentials = false;
					$has_non_empty_string      = function ( $value ) use ( &$has_non_empty_string ) {
						if ( is_string( $value ) ) {
							return '' !== trim( $value );
						}

						if ( is_array( $value ) ) {
							foreach ( $value as $item ) {
								if ( $has_non_empty_string( $item ) ) {
									return true;
								}
							}
						}

						return false;
					};

					foreach ( $candidate_rows as $row ) {
						$value = maybe_unserialize( $row['option_value'] ?? '' );
						if ( $has_non_empty_string( $value ) ) {
							$has_connector_credentials = true;
							break;
						}
					}

					return $has_connector_credentials && $has_wp_ai_client && $has_active_provider_plugin;
				},
			)
		);

		/**
		 * Generate text via WordPress standard AI client.
		 */
		register_rest_route(
			'unitone/v1',
			'/ai-generate',
			array(
				'methods'             => 'POST',
				'permission_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
				'callback'            => function ( $request ) {
					$prompt = $request->get_param( 'prompt' );
					if ( ! $prompt ) {
						return new \WP_REST_Response(
							array( 'message' => 'The prompt is empty.' ),
							400
						);
					}

					if ( ! function_exists( 'wp_ai_client_prompt' ) ) {
						return new \WP_REST_Response(
							array( 'message' => 'WordPress AI client is not available.' ),
							500
						);
					}

					try {
						$text = wp_ai_client_prompt( $prompt )->generate_text();

						if ( is_wp_error( $text ) ) {
							$status = 500;
							$data   = $text->get_error_data();
							if ( is_array( $data ) && ! empty( $data['status'] ) ) {
								$status = $data['status'];
							}

							return new \WP_REST_Response(
								array( 'message' => $text->get_error_message() ),
								$status
							);
						}

						$trimmed = is_string( $text ) ? trim( $text ) : '';
						if ( '' === $trimmed ) {
							return new \WP_REST_Response(
								array( 'message' => 'WordPress AI returned an empty response.' ),
								500
							);
						}

						return array(
							'results' => array(
								array(
									'id'   => 'r1',
									'text' => $trimmed,
								),
							),
							'source'  => 'wp-ai-client',
						);
					} catch ( \Throwable $e ) {
						return new \WP_REST_Response(
							array( 'message' => $e->getMessage() ),
							500
						);
					}
				},
			)
		);
	}
);
