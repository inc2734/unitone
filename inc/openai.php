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

					update_option( 'unitone_openai_api_key', $key );

					return true;
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
						return new \WP_REST_Response( array( 'message' => 'The prompt is empty.' ), 400 );
					}

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
									'model'    => 'gpt-4o',
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
						return array();
					}

					$response_code = wp_remote_retrieve_response_code( $response );
					if ( 200 !== $response_code ) {
						return array();
					}

					return json_decode( wp_remote_retrieve_body( $response ), true );
				},
			)
		);
	}
);
