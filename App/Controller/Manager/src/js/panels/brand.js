import { pick } from 'lodash';

import {
	BaseControl,
	Button,
	__experimentalItemGroup as ItemGroup,
} from '@wordpress/components';

import { MediaUpload } from '@wordpress/block-editor';
import { useEffect, useState } from '@wordpress/element';
import { sprintf, __ } from '@wordpress/i18n';

import apiFetch from '@wordpress/api-fetch';

import ColorGradientSettingsDropdown from '../color-gradient-settings-dropdown';

const SETTINGS_KEYS = [
	'site-logo',
	'site-icon',
	'accent-color',
	'background-color',
	'text-color',
	'link-color',
];

export default function ( { settings, defaultSettings, setSettings } ) {
	const [ settingsSaving, setSettingsSaving ] = useState( false );
	const [ siteLogoUrl, setSiteLogoUrl ] = useState( undefined );
	const [ siteIconUrl, setSiteIconUrl ] = useState( undefined );

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
			...{
				'site-logo': undefined,
				'site-icon': undefined,
			},
		} );
		setSiteLogoUrl( undefined );
		setSiteIconUrl( undefined );
		apiFetch( {
			path: '/unitone/v1/settings',
			method: 'POST',
			data: newData,
		} ).then( () => {
			setSettingsSaving( false );
		} );
	};

	useEffect( () => {
		setSiteLogoUrl( window.currentSettings.siteLogoUrl );
		setSiteIconUrl( window.currentSettings.siteIconUrl );
	}, [] );

	return (
		<div
			data-unitone-layout="decorator -padding:2"
			style={ { '--unitone--background-color': 'white' } }
		>
			<div data-unitone-layout="stack -gap:2">
				<h2>{ __( 'Brand', 'unitone' ) }</h2>
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
							<h3>{ __( 'Site Logo', 'unitone' ) }</h3>
						</div>
						<div>
							<BaseControl
								id="unitone-settings-site-logo"
								help={ __(
									'Display an image to represent this site.',
									'unitone'
								) }
							>
								<MediaUpload
									onSelect={ ( media ) => {
										setSettings( {
											...settings,
											'site-logo': media.id,
										} );
										setSiteLogoUrl( media.url );
									} }
									type="image"
									value={ settings?.[ 'site-logo' ] }
									render={ ( { open } ) => {
										if ( siteLogoUrl ) {
											return (
												<div data-unitone-layout="cluster -gap:-1 -align-items:center">
													<Button
														variant="secondary"
														onClick={ () => {
															setSettings( {
																...settings,
																'site-logo':
																	null,
															} );
															setSiteLogoUrl(
																undefined
															);
														} }
													>
														{ __(
															'Remove Image',
															'unitone'
														) }
													</Button>

													<img
														src={ siteLogoUrl }
														alt={ __(
															'Site Logo',
															'unitone'
														) }
														style={ {
															maxWidth: '120px',
															height: 'auto',
														} }
													/>
												</div>
											);
										}

										return (
											<Button
												variant="secondary"
												onClick={ open }
											>
												{ __(
													'Select Image',
													'unitone'
												) }
											</Button>
										);
									} }
								/>
							</BaseControl>
						</div>
					</div>

					<div
						data-unitone-layout="with-sidebar -sidebar:left"
						style={ { '--unitone--sidebar-width': '20em' } }
					>
						<div data-unitone-layout="stack">
							<h3>{ __( 'Site Icon', 'unitone' ) }</h3>
						</div>
						<div>
							<BaseControl
								id="unitone-settings-site-icon"
								help={
									__(
										'Site Icons are what you see in browser tabs, bookmark bars, and within the WordPress mobile apps. Upload one here!',
										'unitone'
									) +
									sprintf(
										// translators: %s: Site icon size in pixels.
										__(
											'Site Icons should be square and at least %s pixels.',
											'unitone'
										),
										'512 x 512'
									)
								}
							>
								<MediaUpload
									onSelect={ ( media ) => {
										setSettings( {
											...settings,
											'site-icon': media.id,
										} );
										setSiteIconUrl( media.url );
									} }
									type="image"
									value={ settings?.[ 'site-icon' ] }
									render={ ( { open } ) => {
										if ( siteIconUrl ) {
											return (
												<div data-unitone-layout="cluster -gap:-1 -align-items:center">
													<Button
														variant="secondary"
														onClick={ () => {
															setSettings( {
																...settings,
																'site-icon':
																	null,
															} );
															setSiteIconUrl(
																undefined
															);
														} }
													>
														{ __(
															'Remove Image',
															'unitone'
														) }
													</Button>

													<img
														src={ siteIconUrl }
														alt={ __(
															'Site Icon',
															'unitone'
														) }
														style={ {
															maxWidth: '120px',
															height: 'auto',
														} }
													/>
												</div>
											);
										}

										return (
											<Button
												variant="secondary"
												onClick={ open }
											>
												{ __(
													'Select Image',
													'unitone'
												) }
											</Button>
										);
									} }
								/>
							</BaseControl>
						</div>
					</div>

					<div
						data-unitone-layout="with-sidebar -sidebar:left"
						style={ { '--unitone--sidebar-width': '20em' } }
					>
						<div data-unitone-layout="stack">
							<h3>{ __( 'Colors', 'unitone' ) }</h3>

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
										'--unitone--background-color':
											settings?.[ 'background-color' ],
										'--unitone--color':
											settings?.[ 'text-color' ],
										'--unitone--border-color':
											'var(--unitone--color--light-gray)',
										'--unitone--border-width': '1px',
										'--unitone--half-leading': String(
											settings?.[ 'half-leading' ]
										),
									} }
								>
									<div data-unitone-layout="stack">
										<div>
											<a
												href="#_"
												style={ {
													color:
														settings?.[
															'link-color'
														] ||
														settings?.[
															'accent-color'
														] ||
														defaultSettings?.[
															'accent-color'
														],
												} }
											>
												するとどこかで見たわ姉は
											</a>
											細い銀いろの空から、さっきの入口から暗い牛舎の前へまた来ました。そういうふうに、眼の前を通るのですから、この次の理科の時間にお話します。
										</div>
									</div>
								</div>
							</div>
						</div>
						<div data-unitone-layout="stack">
							<BaseControl
								help={ __(
									'This setting is the default setting for the theme. The Site Editor setting overrides this setting.',
									'unitone'
								) }
								id="unitone-settings-colors-settigs-dropdown"
							>
								<ItemGroup className="unitone-settings-colors-settigs-dropdown">
									<ColorGradientSettingsDropdown
										settings={ [
											{
												label: __(
													'Accent Color',
													'unitone'
												),
												colorValue:
													settings?.[
														'accent-color'
													] ||
													defaultSettings?.[
														'accent-color'
													],
												onColorChange: ( newSetting ) =>
													setSettings( {
														...settings,
														'accent-color':
															newSetting,
													} ),
												clearable: true,
											},
											{
												label: __(
													'Background Color',
													'unitone'
												),
												colorValue:
													settings?.[
														'background-color'
													] ||
													defaultSettings?.[
														'background-color'
													],
												onColorChange: ( newSetting ) =>
													setSettings( {
														...settings,
														'background-color':
															newSetting,
													} ),
												clearable: true,
											},
											{
												label: __(
													'Text Color',
													'unitone'
												),
												colorValue:
													settings?.[
														'text-color'
													] ||
													defaultSettings?.[
														'text-color'
													],
												onColorChange: ( newSetting ) =>
													setSettings( {
														...settings,
														'text-color':
															newSetting,
													} ),
												clearable: true,
											},
											{
												label: __(
													'Link Color',
													'unitone'
												),
												colorValue:
													settings?.[
														'link-color'
													] ||
													settings?.[
														'accent-color'
													] ||
													defaultSettings?.[
														'link-color'
													],
												onColorChange: ( newSetting ) =>
													setSettings( {
														...settings,
														'link-color':
															newSetting ||
															defaultSettings?.[
																'link-color'
															],
													} ),
												clearable: true,
											},
										] }
										colors={ settings.palette }
									/>
								</ItemGroup>
							</BaseControl>
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
