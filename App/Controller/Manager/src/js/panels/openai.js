import { Button, TextControl } from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import apiFetch from '@wordpress/api-fetch';

export default function () {
	const [ settingsSaving, setSettingsSaving ] = useState( false );

	const [ apiKey, setApiKey ] = useEntityProp(
		'root',
		'site',
		'unitone_openai_api_key'
	);

	const saveSettings = () => {
		setSettingsSaving( true );
		apiFetch( {
			path: '/unitone/v1/openai-api-key',
			method: 'POST',
			data: {
				key: apiKey,
			},
		} ).then( () => {
			setSettingsSaving( false );
		} );
	};

	const resetSettings = () => {
		setSettingsSaving( true );
		setApiKey( '' );
		apiFetch( {
			path: '/unitone/v1/openai-api-key',
			method: 'POST',
			data: {
				key: '',
			},
		} ).then( () => {
			setSettingsSaving( false );
		} );
	};

	return (
		<div
			data-unitone-layout="decorator -padding:2"
			style={ {
				'--unitone--background-color': 'white',
				'--unitone--color': '#111',
			} }
		>
			<div data-unitone-layout="stack -gap:2">
				<h2>{ __( 'OpenAI', 'unitone' ) }</h2>
				<div
					data-unitone-layout="stack -divider:stripe -gap:2"
					style={ {
						'--unitone--divider-color':
							'var(--unitone--color--light-gray)',
					} }
				>
					<div
						data-unitone-layout="with-sidebar -sidebar:left"
						style={ { '--unitone--sidebar-width': '20em' } }
					>
						<div data-unitone-layout="stack">
							<h3>{ __( 'API Key', 'unitone' ) }</h3>
						</div>
						<div data-unitone-layout="stack">
							<div data-unitone-layout="stack -gap:-2">
								<TextControl
									__next40pxDefaultSize
									__nextHasNoMarginBottom
									value={ apiKey ?? '' }
									onChange={ ( newSetting ) =>
										setApiKey( newSetting )
									}
									type="password"
								/>
							</div>
						</div>
					</div>
				</div>

				<div data-unitone-layout="cluster -gap:-1">
					<Button
						variant="primary"
						onClick={ saveSettings }
						disabled={ settingsSaving }
					>
						{ __( 'Save Settings', 'unitone' ) }
					</Button>

					<Button
						variant="secondary"
						onClick={ resetSettings }
						disabled={ settingsSaving }
					>
						{ __( 'Reset All Settings', 'unitone' ) }
					</Button>
				</div>
			</div>
		</div>
	);
}
