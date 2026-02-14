import { pick } from 'lodash';

import { ToggleControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

import apiFetch from '@wordpress/api-fetch';

import { LoadingButton, ResetButton, SaveButton } from '../components/buttons';
import { withMinDelay } from '../utils/utils';

export default function ( { settings, defaultSettings, setSettings } ) {
	const [ remotePatternsSaving, setRemotePatternsSaving ] = useState( false );
	const [ settingsSaving, setSettingsSaving ] = useState( false );

	const resetRemotePattenrsCache = () => {
		setRemotePatternsSaving( true );

		withMinDelay(
			apiFetch( {
				path: '/unitone/v1/remote-block-patterns',
				method: 'DELETE',
				data: pick( settings, 'license-key' ),
			} )
		).then( () => {
			setRemotePatternsSaving( false );
		} );
	};

	const saveSettings = () => {
		setSettingsSaving( 'save' );

		withMinDelay(
			apiFetch( {
				path: '/unitone/v1/settings',
				method: 'POST',
				data: {
					'disable-remote-block-patterns':
						settings?.[ 'disable-remote-block-patterns' ] ?? null,
				},
			} )
		).then( () => {
			setSettingsSaving( false );
		} );
	};

	const resetSettings = () => {
		setSettingsSaving( 'reset' );

		setSettings( {
			...settings,
			'disable-remote-block-patterns':
				defaultSettings?.[ 'disable-remote-block-patterns' ] ?? false,
		} );

		withMinDelay(
			apiFetch( {
				path: '/unitone/v1/settings',
				method: 'POST',
				data: {
					'disable-remote-block-patterns': null,
				},
			} )
		).then( () => {
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
				<h2>{ __( 'Patterns / Styles Library', 'unitone' ) }</h2>
				<div
					data-unitone-layout="stack -divider:stripe -gap:2"
					style={ {
						'--unitone--divider-color':
							'var(--unitone--color--light-gray)',
					} }
				>
					<div
						data-unitone-layout="with-sidebar -sidebar:left"
						style={ {
							'--unitone--sidebar-width': '20em',
						} }
					>
						<div>
							<h3>{ __( 'Pattern Library', 'unitone' ) }</h3>
						</div>
						<div data-unitone-layout="stack">
							<div data-unitone-layout="stack -gap:-2">
								<ToggleControl
									__nextHasNoMarginBottom
									label={ __(
										'Disable pattenrs of the Pattern Library',
										'unitone'
									) }
									help={ __(
										'Disables loading of patterns from the pattern library. Already placed patterns will still be displayed.',
										'unitone'
									) }
									checked={
										settings?.[
											'disable-remote-block-patterns'
										] ?? false
									}
									onChange={ ( newSetting ) =>
										setSettings( {
											...settings,
											'disable-remote-block-patterns':
												newSetting,
										} )
									}
									disabled={ !! settingsSaving }
								/>
							</div>
						</div>
					</div>

					<div>
						<div data-unitone-layout="cluster -gap:-1">
							<SaveButton
								onClick={ saveSettings }
								isSaving={ settingsSaving }
							/>

							<ResetButton
								onClick={ resetSettings }
								isSaving={ settingsSaving }
							/>
						</div>
					</div>
				</div>

				<div
					data-unitone-layout="decorator -padding:2m"
					style={ {
						'--unitone--border-color':
							'var(--unitone--color--light-gray)',
						'--unitone--border-width': '1px',
					} }
				>
					<div
						data-unitone-layout="with-sidebar -sidebar:left"
						style={ {
							'--unitone--sidebar-width': '20em',
						} }
					>
						<div>
							<h3>{ __( 'Cache', 'unitone' ) }</h3>
						</div>
						<div data-unitone-layout="stack">
							<p>
								<span
									dangerouslySetInnerHTML={ {
										__html: sprintf(
											// translators: %1$s: <a>, %2$s: </a>, %3$s: <a>, %4$s: </a>
											__(
												'If the license key is valid, patterns from %1$sthe patterns library%2$s and styles from %3$sthe styles library%4$s can be used.',
												'unitone'
											),
											'<a href="https://unitone.2inc.org/unitone-patterns/" target="_blank">',
											'</a>',
											'<a href="https://unitone.2inc.org/unitone-styles/" target="_blank">',
											'</a>'
										),
									} }
								/>
								{ __(
									'Patterns data retrieved from the patterns library and styles data retrieved from the styles library is cached for a certain period of time to speed up operation, so new patterns and styles may not be reflected immediately.',
									'unitone'
								) }
								{ __(
									'To force reacquisition of the latest data, click the button below.',
									'unitone'
								) }
							</p>

							<div>
								<LoadingButton
									label={ __( 'Retrieve data', 'unitone' ) }
									onClick={ resetRemotePattenrsCache }
									isLoading={ remotePatternsSaving }
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
