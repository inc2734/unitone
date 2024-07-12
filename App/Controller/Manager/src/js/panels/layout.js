import { pick } from 'lodash';

import {
	Button,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import apiFetch from '@wordpress/api-fetch';

const SETTINGS_KEYS = [ 'content-size', 'wide-size' ];

export default function ( { settings, defaultSettings, setSettings } ) {
	const [ settingsSaving, setSettingsSaving ] = useState( false );

	const saveSettings = () => {
		const newData = {};
		SETTINGS_KEYS.forEach(
			( key ) => ( newData[ key ] = settings?.[ key ] ?? null )
		);

		setSettingsSaving( true );
		apiFetch( {
			path: '/unitone/v1/settings',
			method: 'POST',
			data: newData,
		} ).then( () => {
			setSettingsSaving( false );
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
		apiFetch( {
			path: '/unitone/v1/settings',
			method: 'POST',
			data: newData,
		} ).then( () => {
			setSettingsSaving( false );
		} );
	};

	return (
		<div
			data-unitone-layout="decorator -padding:2"
			style={ { '--unitone--background-color': 'white' } }
		>
			<div data-unitone-layout="stack -gap:2">
				<h2>{ __( 'Layout', 'unitone' ) }</h2>
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
							<h3>{ __( 'Size', 'unitone' ) }</h3>
						</div>
						<div data-unitone-layout="stack">
							<UnitControl
								label={ __( 'Content Width', 'unitone' ) }
								value={ settings?.[ 'content-size' ] || '' }
								style={ { width: '100%' } }
								onChange={ ( newSetting ) =>
									setSettings( {
										...settings,
										'content-size': newSetting,
									} )
								}
							/>

							<UnitControl
								label={ __( 'Wide', 'unitone' ) }
								value={ settings?.[ 'wide-size' ] || '' }
								style={ { width: '100%' } }
								onChange={ ( newSetting ) =>
									setSettings( {
										...settings,
										'wide-size': newSetting,
									} )
								}
							/>
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
