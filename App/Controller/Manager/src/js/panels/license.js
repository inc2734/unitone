import { pick } from 'lodash';

import { Button, TextControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { Icon, check, close } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import apiFetch from '@wordpress/api-fetch';

const SETTINGS_KEYS = [ 'license-key' ];

export default function ( { settings, defaultSettings, setSettings } ) {
	const [ settingsSaving, setSettingsSaving ] = useState( false );
	const [ licenseStatus, setLicenseStatus ] = useState( false );

	const loadLicenseStatus = () => {
		apiFetch( { path: '/unitone/v1/license-status' } ).then(
			( options ) => {
				setLicenseStatus( 'true' === options );
			}
		);
	};

	const saveSettings = () => {
		setSettingsSaving( true );
		setLicenseStatus( false );
		apiFetch( {
			path: '/unitone/v1/settings',
			method: 'POST',
			data: pick( settings, SETTINGS_KEYS ),
		} ).then( () => {
			setSettingsSaving( false );
			loadLicenseStatus();
		} );
	};

	const resetSettings = () => {
		const newData = {};
		SETTINGS_KEYS.forEach( ( key ) => ( newData[ key ] = null ) );

		setSettingsSaving( true );
		setSettings( {
			...settings,
			...pick( defaultSettings, SETTINGS_KEYS ),
		} );
		setLicenseStatus( false );
		apiFetch( {
			path: '/unitone/v1/settings',
			method: 'POST',
			data: newData,
		} ).then( () => {
			setSettingsSaving( false );
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
							<div data-unitone-layout="with-sidebar -gap:-2">
								<TextControl
									help={ __(
										'If the license key entered is valid, the theme can be updated.',
										'unitone'
									) }
									value={ settings?.[ 'license-key' ] || '' }
									style={ { width: '100%' } }
									onChange={ ( newSetting ) =>
										setSettings( {
											...settings,
											'license-key': newSetting,
										} )
									}
								/>

								<Icon
									style={ {
										fill: licenseStatus
											? '#00d084'
											: '#cf2e2e',
									} }
									icon={ licenseStatus ? check : close }
								/>
							</div>
						</div>
					</div>
				</div>

				<div data-unitone-layout="cluster">
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
