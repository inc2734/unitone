import { pick } from 'lodash';

import {
	Button,
	FontSizePicker,
	RangeControl,
	SelectControl,
} from '@wordpress/components';

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import apiFetch from '@wordpress/api-fetch';

const SETTINGS_KEYS = [
	'font-family',
	'base-font-size',
	'half-leading',
	'h2-size',
	'h3-size',
	'h4-size',
	'h5-size',
	'h6-size',
];

export default function ( { settings, defaultSettings, setSettings } ) {
	const [ settingsSaving, setSettingsSaving ] = useState( false );

	const saveSettings = () => {
		setSettingsSaving( true );
		apiFetch( {
			path: '/unitone/v1/settings',
			method: 'POST',
			data: pick( settings, SETTINGS_KEYS ),
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
				<h2>{ __( 'Typography', 'unitone' ) }</h2>
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
							<div
								aria-hidden="true"
								className="unitone-settings-colors-settigs-preview"
								data-unitone-layout="stack -gap:-2 -root:typography"
								style={ {
									'--unitone--base-font-size': String(
										settings?.[ 'base-font-size' ]
									),
									fontFamily: settings?.fontFamilies?.find(
										( fontFamily ) =>
											settings?.[ 'font-family' ] ===
											fontFamily.slug
									)?.fontFamily,
								} }
							>
								<div
									data-unitone-layout="decorator -padding:1 -typography:em"
									style={ {
										'--unitone--border-color':
											'var(--unitone--color--light-gray)',
										'--unitone--border-width': '1px',
										'--unitone--half-leading': String(
											settings?.[ 'half-leading' ]
										),
									} }
								>
									<div data-unitone-layout="stack">
										<div
											data-unitone-layout="-typography:em"
											style={ {
												'--unitone--font-size':
													settings?.[ 'h2-size' ],
												fontWeight: 'bold',
											} }
										>
											見出し2
										</div>
										<div
											data-unitone-layout="-typography:em"
											style={ {
												'--unitone--font-size':
													settings?.[ 'h3-size' ],
												fontWeight: 'bold',
											} }
										>
											見出し3
										</div>
										<div
											data-unitone-layout="-typography:em"
											style={ {
												'--unitone--font-size':
													settings?.[ 'h4-size' ],
												fontWeight: 'bold',
											} }
										>
											見出し4
										</div>
										<div
											data-unitone-layout="-typography:em"
											style={ {
												'--unitone--font-size':
													settings?.[ 'h5-size' ],
												fontWeight: 'bold',
											} }
										>
											見出し5
										</div>
										<div
											data-unitone-layout="-typography:em"
											style={ {
												'--unitone--font-size':
													settings?.[ 'h6-size' ],
												fontWeight: 'bold',
											} }
										>
											見出し6
										</div>
										<div>
											するとどこかで見たわ姉は細い銀いろの空から、さっきの入口から暗い牛舎の前へまた来ました。そういうふうに、眼の前を通るのですから、この次の理科の時間にお話します。
										</div>
									</div>
								</div>
							</div>
						</div>
						<div data-unitone-layout="stack">
							<SelectControl
								label={ __( 'Font', 'unitone' ) }
								value={ settings?.[ 'font-family' ] }
								options={ settings?.fontFamilies?.map(
									( fontFamily ) => ( {
										label: fontFamily.name,
										value: fontFamily.slug,
									} )
								) }
								onChange={ ( newSetting ) =>
									setSettings( {
										...settings,
										'font-family': newSetting,
									} )
								}
							/>

							<RangeControl
								label={ __( 'Base Font Size', 'unitone' ) }
								value={ parseFloat(
									settings?.[ 'base-font-size' ]
								) }
								onChange={ ( newSetting ) =>
									setSettings( {
										...settings,
										'base-font-size': newSetting,
									} )
								}
								min={ 14 }
								step={ 1 }
								max={ 18 }
							/>

							<RangeControl
								label={ __( 'Half Leading', 'unitone' ) }
								value={ parseFloat(
									settings?.[ 'half-leading' ]
								) }
								onChange={ ( newSetting ) =>
									setSettings( {
										...settings,
										'half-leading': newSetting,
									} )
								}
								min={ 0.1 }
								step={ 0.1 }
								max={ 0.6 }
							/>

							<div data-unitone-layout="with-sidebar -sidebar:left">
								<div>{ __( 'Size of h2', 'unitone' ) }</div>
								<div>
									<FontSizePicker
										disableCustomFontSizes
										fontSizes={ settings?.fontSizes }
										value={
											settings?.fontSizes?.find(
												( fontSize ) =>
													String(
														settings?.[ 'h2-size' ]
													) ===
													String( fontSize.slug )
											)?.size
										}
										onChange={ ( newSetting, fontSizes ) =>
											setSettings( {
												...settings,
												'h2-size':
													!! newSetting &&
													parseInt( fontSizes.slug ),
											} )
										}
									/>
								</div>
							</div>

							<div data-unitone-layout="with-sidebar -sidebar:left">
								<div>{ __( 'Size of h3', 'unitone' ) }</div>
								<div>
									<FontSizePicker
										disableCustomFontSizes
										fontSizes={ settings?.fontSizes }
										value={
											settings?.fontSizes?.find(
												( fontSize ) =>
													String(
														settings?.[ 'h3-size' ]
													) ===
													String( fontSize.slug )
											)?.size
										}
										onChange={ ( newSetting, fontSizes ) =>
											setSettings( {
												...settings,
												'h3-size':
													!! newSetting &&
													parseInt( fontSizes.slug ),
											} )
										}
									/>
								</div>
							</div>

							<div data-unitone-layout="with-sidebar -sidebar:left">
								<div>{ __( 'Size of h4', 'unitone' ) }</div>
								<div>
									<FontSizePicker
										disableCustomFontSizes
										fontSizes={ settings?.fontSizes }
										value={
											settings?.fontSizes?.find(
												( fontSize ) =>
													String(
														settings?.[ 'h4-size' ]
													) ===
													String( fontSize.slug )
											)?.size
										}
										onChange={ ( newSetting, fontSizes ) =>
											setSettings( {
												...settings,
												'h4-size':
													!! newSetting &&
													parseInt( fontSizes.slug ),
											} )
										}
									/>
								</div>
							</div>

							<div data-unitone-layout="with-sidebar -sidebar:left">
								<div>{ __( 'Size of h5', 'unitone' ) }</div>
								<div>
									<FontSizePicker
										disableCustomFontSizes
										fontSizes={ settings?.fontSizes }
										value={
											settings?.fontSizes?.find(
												( fontSize ) =>
													String(
														settings?.[ 'h5-size' ]
													) ===
													String( fontSize.slug )
											)?.size
										}
										onChange={ ( newSetting, fontSizes ) =>
											setSettings( {
												...settings,
												'h5-size':
													!! newSetting &&
													parseInt( fontSizes.slug ),
											} )
										}
									/>
								</div>
							</div>

							<div data-unitone-layout="with-sidebar -sidebar:left">
								<div>{ __( 'Size of h6', 'unitone' ) }</div>
								<div>
									<FontSizePicker
										disableCustomFontSizes
										fontSizes={ settings?.fontSizes }
										value={
											settings?.fontSizes?.find(
												( fontSize ) =>
													String(
														settings?.[ 'h6-size' ]
													) ===
													String( fontSize.slug )
											)?.size
										}
										onChange={ ( newSetting, fontSizes ) =>
											setSettings( {
												...settings,
												'h6-size':
													!! newSetting &&
													parseInt( fontSizes.slug ),
											} )
										}
									/>
								</div>
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
