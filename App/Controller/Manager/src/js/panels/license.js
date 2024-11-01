import { Button, TextControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { Icon, check, close } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import apiFetch from '@wordpress/api-fetch';

/**
 * If a value is stored in License key, use this value instead, since it is secret.
 */
const SAVED_VALUE = 'THIS_IS_DUMMY_SAVED_VALUE_BECAUSE_THIS_VALUE_IS_SECRET';

export default function ( { settings, defaultSettings, setSettings } ) {
	const [ settingsSaving, setSettingsSaving ] = useState( false );
	const [ licenseStatus, setLicenseStatus ] = useState( undefined );
	const [ remotePatternsSaving, setRemotePatternsSaving ] = useState( false );

	const loadLicenseStatus = () => {
		apiFetch( { path: '/unitone/v1/license-status' } ).then(
			( options ) => {
				setLicenseStatus( 'true' === options );
			}
		);
	};

	const resetRemotePattenrsCache = () => {
		setRemotePatternsSaving( true );
		apiFetch( {
			path: '/unitone/v1/remote-block-patterns',
			method: 'DELETE',
		} ).then( () => {
			setRemotePatternsSaving( false );
		} );
	};

	const saveSettings = () => {
		setSettingsSaving( true );
		setLicenseStatus( undefined );
		apiFetch( {
			path: '/unitone/v1/settings',
			method: 'POST',
			data: {
				'license-key': settings?.[ 'license-key' ] ?? null,
			},
		} ).then( () => {
			setSettingsSaving( false );
			loadLicenseStatus();
			resetRemotePattenrsCache();
		} );
	};

	const resetSettings = () => {
		setSettingsSaving( true );
		setSettings( {
			...settings,
			'license-key': defaultSettings[ 'license-key' ],
		} );
		setLicenseStatus( false );
		apiFetch( {
			path: '/unitone/v1/settings',
			method: 'POST',
			data: {
				'license-key': null,
			},
		} ).then( () => {
			setSettingsSaving( false );
			resetRemotePattenrsCache();
		} );
	};

	useEffect( () => {
		loadLicenseStatus();
	}, [] );

	return (
		<div
			data-unitone-layout="decorator -padding:2"
			style={ { '--unitone--background-color': 'white' } }
		>
			<div data-unitone-layout="stack -gap:2">
				<h2>{ __( 'License', 'unitone' ) }</h2>
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
						<div>
							<h3>{ __( 'License Key', 'unitone' ) }</h3>
						</div>
						<div data-unitone-layout="stack">
							<p>
								{ __(
									'If your license key is valid, you will be able to use unitone more conveniently.',
									'unitone'
								) }
							</p>
							<div
								data-unitone-layout="with-sidebar -gap:-2"
								style={ { '--unitone--sidebar-width': '25px' } }
							>
								<TextControl
									__nextHasNoMarginBottom
									help={ __(
										'If the license key entered is valid, the theme can be updated.',
										'unitone'
									) }
									type="password"
									value={ ( () => {
										if ( !! settings?.[ 'license-key' ] ) {
											if (
												settings?.[ 'license-key' ] !==
												window.currentSettings?.[
													'license-key'
												]
											) {
												return settings?.[
													'license-key'
												];
											}
											return SAVED_VALUE;
										}
										return '';
									} )() }
									style={ { width: '100%' } }
									onChange={ ( newSetting ) =>
										setSettings( {
											...settings,
											'license-key': newSetting,
										} )
									}
								/>

								<div style={ { paddingTop: '4px' } }>
									{ null == licenseStatus ? (
										<div
											className="unitone-loading-icon"
											style={ { margin: '4px' } }
										></div>
									) : (
										<Icon
											style={ {
												fill: licenseStatus
													? '#00d084'
													: '#cf2e2e',
											} }
											icon={
												licenseStatus ? check : close
											}
										/>
									) }
								</div>
							</div>
						</div>
					</div>
				</div>

				<div data-unitone-layout="cluster">
					<Button
						variant="primary"
						onClick={ saveSettings }
						disabled={ settingsSaving || remotePatternsSaving }
					>
						{ __( 'Save Settings', 'unitone' ) }
					</Button>

					<Button
						variant="secondary"
						onClick={ resetSettings }
						disabled={ settingsSaving || remotePatternsSaving }
					>
						{ __( 'Reset All Settings', 'unitone' ) }
					</Button>
				</div>
			</div>
		</div>
	);
}
