import {
	Button,
	RangeControl,
	SelectControl,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import apiFetch from '@wordpress/api-fetch';

export default function ( { settings, defaultSettings, setSettings } ) {
	const [ settingsSaving, setSettingsSaving ] = useState( false );

	const loadingAnimationTemplateParts =
		settings?.loadingAnimationTemplateParts ?? [];

	const saveSettings = () => {
		setSettingsSaving( true );
		apiFetch( {
			path: '/unitone/v1/settings',
			method: 'POST',
			data: {
				'loading-animation': settings?.[ 'loading-animation' ] ?? null,
				'loading-animation-delay':
					settings?.[ 'loading-animation-delay' ] ?? null,
				'content-size': null, // Deprecated.
				'wide-size': null, // Deprecated.
				settings: {
					layout: {
						contentSize:
							settings?.settings?.layout?.contentSize ?? null,
						wideSize: settings?.settings?.layout?.wideSize ?? null,
					},
				},
			},
		} ).then( () => {
			setSettingsSaving( false );
		} );
	};

	const resetSettings = () => {
		setSettingsSaving( true );
		setSettings( {
			...settings,
			'loading-animation': defaultSettings[ 'loading-animation' ],
			'loading-animation-delay':
				defaultSettings[ 'loading-animation-delay' ],
			'content-size': null, // Deprecated.
			'wide-size': null, // Deprecated.
			settings: {
				...settings?.settings,
				layout: {
					...settings?.settings?.layout,
					contentSize: defaultSettings.settings.layout.contentSize,
					wideSize: defaultSettings.settings.layout.wideSize,
				},
			},
		} );
		apiFetch( {
			path: '/unitone/v1/settings',
			method: 'POST',
			data: {
				'loading-animation': null,
				'content-size': null, // Deprecated.
				'wide-size': null, // Deprecated.
				settings: {
					layout: {
						contentSize: null,
						wideSize: null,
					},
				},
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
								__next40pxDefaultSize
								label={ __( 'Content Width', 'unitone' ) }
								value={
									settings?.settings?.layout?.contentSize ||
									''
								}
								style={ { width: '100%' } }
								onChange={ ( newSetting ) =>
									setSettings( {
										...settings,
										settings: {
											...settings?.settings,
											layout: {
												...settings?.settings?.layout,
												contentSize: newSetting,
											},
										},
									} )
								}
							/>

							<UnitControl
								__next40pxDefaultSize
								label={ __( 'Wide Width', 'unitone' ) }
								value={
									settings?.settings?.layout?.wideSize || ''
								}
								style={ { width: '100%' } }
								onChange={ ( newSetting ) =>
									setSettings( {
										...settings,
										settings: {
											...settings?.settings,
											layout: {
												...settings?.settings?.layout,
												wideSize: newSetting,
											},
										},
									} )
								}
							/>
						</div>
					</div>

					<div
						data-unitone-layout="with-sidebar -sidebar:left"
						style={ { '--unitone--sidebar-width': '20em' } }
					>
						<div data-unitone-layout="stack">
							<h3>{ __( 'Loading Animation', 'unitone' ) }</h3>
						</div>
						<div data-unitone-layout="stack">
							<SelectControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __(
									'Template Parts to Use',
									'unitone'
								) }
								help={ __(
									'You can choose from the template parts assigned to the template part area "Loading Animation".',
									'unitone'
								) }
								value={
									settings?.[ 'loading-animation' ] || ''
								}
								options={ [
									...[
										{
											label: __(
												'— Select —',
												'unitone'
											),
											value: '',
										},
									],
									...loadingAnimationTemplateParts.map(
										( part ) => {
											return {
												label: part.title,
												value: part.slug,
											};
										}
									),
								] }
								onChange={ ( newSetting ) => {
									setSettings( {
										...settings,
										'loading-animation': newSetting,
									} );
								} }
							/>

							<RangeControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __(
									'Minimum Time to Display Loading Animation (s)',
									'unitone'
								) }
								value={ parseFloat(
									settings?.[ 'loading-animation-delay' ]
								) }
								onChange={ ( newSetting ) =>
									setSettings( {
										...settings,
										'loading-animation-delay': newSetting,
									} )
								}
								min={ 0.5 }
								step={ 0.1 }
								max={ 5 }
							/>
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
