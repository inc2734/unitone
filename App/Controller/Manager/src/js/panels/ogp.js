import { Button, ToggleControl, TextControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import apiFetch from '@wordpress/api-fetch';

export default function ( { settings, defaultSettings, setSettings } ) {
	const [ settingsSaving, setSettingsSaving ] = useState( false );

	const saveSettings = () => {
		setSettingsSaving( true );
		apiFetch( {
			path: '/unitone/v1/settings',
			method: 'POST',
			data: {
				'output-ogp-tags': settings?.[ 'output-ogp-tags' ] ?? null,
				'twitter-site': settings?.[ 'twitter-site' ] ?? null,
			},
		} ).then( () => {
			setSettingsSaving( false );
		} );
	};

	const resetSettings = () => {
		setSettingsSaving( true );
		setSettings( {
			...settings,
			'output-ogp-tags': defaultSettings[ 'output-ogp-tags' ],
			'twitter-site': defaultSettings[ 'twitter-site' ],
		} );
		apiFetch( {
			path: '/unitone/v1/settings',
			method: 'POST',
			data: {
				'output-ogp-tags': null,
				'twitter-site': null,
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
				<h2>{ __( 'OGP', 'unitone' ) }</h2>
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
							<h3>{ __( 'OGP Tags', 'unitone' ) }</h3>
						</div>
						<div data-unitone-layout="stack">
							<div data-unitone-layout="stack -gap:-2">
								<ToggleControl
									__nextHasNoMarginBottom
									label={ __( 'Output tags', 'unitone' ) }
									checked={
										settings?.[ 'output-ogp-tags' ] ?? false
									}
									onChange={ ( newSetting ) =>
										setSettings( {
											...settings,
											'output-ogp-tags': newSetting,
										} )
									}
								/>
							</div>
						</div>
					</div>

					{ !! settings?.[ 'output-ogp-tags' ] && (
						<div
							data-unitone-layout="with-sidebar -sidebar:left"
							style={ { '--unitone--sidebar-width': '20em' } }
						>
							<div data-unitone-layout="stack">
								<h3>{ __( 'Twitter Cards', 'unitone' ) }</h3>
							</div>
							<div data-unitone-layout="stack">
								<div data-unitone-layout="stack -gap:-2">
									<TextControl
										__nextHasNoMarginBottom
										label={ __(
											'twitter:site',
											'unitone'
										) }
										help={ __(
											'@username for the website used in the card footer.',
											'unitone'
										) }
										value={
											settings?.[ 'twitter-site' ] ?? ''
										}
										onChange={ ( newSetting ) =>
											setSettings( {
												...settings,
												'twitter-site': newSetting,
											} )
										}
									/>
								</div>
							</div>
						</div>
					) }
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
