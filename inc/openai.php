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

					$response = wp_remote_post(
						'https://api.openai.com/v1/chat/completions',
						array(
							'headers' => array(
								'Content-Type'  => 'application/json',
								'Authorization' => 'Bearer ' . get_option( 'unitone_openai_api_key' ),
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
	}
);
