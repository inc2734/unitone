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

export default function ( { settings, defaultSettings, setSettings } ) {
	const [ settingsSaving, setSettingsSaving ] = useState( false );
	const [ siteLogoUrl, setSiteLogoUrl ] = useState( undefined );
	const [ siteIconUrl, setSiteIconUrl ] = useState( undefined );

	const saveSettings = () => {
		setSettingsSaving( true );
		apiFetch( {
			path: '/unitone/v1/settings',
			method: 'POST',
			data: {
				'site-logo': settings?.[ 'site-logo' ] ?? null,
				'site-icon': settings?.[ 'site-icon' ] ?? null,
				'accent-color': settings?.[ 'accent-color' ] ?? null,
				'background-color': null, // Deprecated.
				'text-color': null, // Deprecated.
				styles: {
					color: {
						background: settings?.styles?.color?.background ?? null,
						text: settings?.styles?.color?.text ?? null,
					},
					elements: {
						link: {
							color: {
								text:
									settings?.styles?.elements?.link?.color
										?.text ?? null,
							},
							':hover': {
								color: {
									text:
										settings?.styles?.elements?.link?.[
											':hover'
										]?.color?.text ?? null,
								},
							},
							':focus': {
								color: {
									text:
										settings?.styles?.elements?.link?.[
											':focus'
										]?.color?.text ?? null,
								},
							},
						},
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
			'site-logo': undefined,
			'site-icon': undefined,
			'accent-color': defaultSettings[ 'accent-color' ],
			'background-color': null, // Deprecated.
			'text-color': null, // Deprecated.
			styles: {
				color: {
					background: defaultSettings.styles.color.background,
					text: defaultSettings.styles.color.text,
				},
				elements: {
					link: {
						color: {
							text: defaultSettings.styles.elements.link.color
								.text,
						},
						':hover': {
							color: {
								text: defaultSettings.styles.elements.link[
									':hover'
								].color.text,
							},
						},
						':focus': {
							color: {
								text: defaultSettings.styles.elements.link[
									':focus'
								].color.text,
							},
						},
					},
				},
			},
		} );
		setSiteLogoUrl( undefined );
		setSiteIconUrl( undefined );
		apiFetch( {
			path: '/unitone/v1/settings',
			method: 'POST',
			data: {
				'site-logo': null,
				'site-icon': null,
				'accent-color': null,
				'background-color': null, // Deprecated.
				'text-color': null, // Deprecated.
				styles: {
					color: {
						background: null,
						text: null,
					},
					elements: {
						link: {
							color: {
								text: null,
							},
							':hover': {
								color: {
									text: null,
								},
							},
							':focus': {
								color: {
									text: null,
								},
							},
						},
					},
				},
			},
		} ).then( () => {
			setSettingsSaving( false );
		} );
	};

	useEffect( () => {
		setSiteLogoUrl( window.currentSettings.siteLogoUrl );
		setSiteIconUrl( window.currentSettings.siteIconUrl );
	}, [] );

	const paletteColors = [
		...window.currentSettings.palette?.[ 0 ]?.colors,
		...window.currentSettings.palette?.[ 1 ]?.colors,
	];

	const backgroundColor =
		paletteColors.find(
			( color ) =>
				color.slug ===
				settings?.styles?.color?.background?.replace(
					'var:preset|color|',
					''
				)
		)?.color ||
		settings?.styles?.color?.background ||
		defaultSettings?.styles?.color?.background;

	const textColor =
		paletteColors.find(
			( color ) =>
				color.slug ===
				settings?.styles?.color?.text?.replace(
					'var:preset|color|',
					''
				)
		)?.color ||
		settings?.styles?.color?.text ||
		defaultSettings?.styles?.color?.text;

	const linkColor =
		paletteColors.find(
			( color ) =>
				color.slug ===
				settings?.styles?.elements?.link?.color?.text?.replace(
					'var:preset|color|',
					''
				)
		)?.color ||
		settings?.styles?.elements?.link?.color?.text ||
		settings?.[ 'accent-color' ] ||
		defaultSettings?.styles?.elements?.link?.color?.text;

	const linkHoverColor =
		'inherit' ===
		settings?.styles?.elements?.link?.[ ':hover' ]?.color?.text
			? undefined
			: paletteColors.find(
					( color ) =>
						color.slug ===
						settings?.styles?.elements?.link?.[
							':hover'
						]?.color?.text?.replace( 'var:preset|color|', '' )
			  )?.color ||
			  settings?.styles?.elements?.link?.[ ':hover' ]?.color?.text;

	const linkFocusColor =
		'inherit' ===
		settings?.styles?.elements?.link?.[ ':focus' ]?.color?.text
			? undefined
			: paletteColors.find(
					( color ) =>
						color.slug ===
						settings?.styles?.elements?.link?.[
							':focus'
						]?.color?.text?.replace( 'var:preset|color|', '' )
			  )?.color ||
			  settings?.styles?.elements?.link?.[ ':focus' ]?.color?.text;

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
								__nextHasNoMarginBottom
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
								__nextHasNoMarginBottom
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
											settings?.styles?.typography?.fontFamily?.replace(
												'var:preset|font-family|',
												''
											) === fontFamily.slug
									)?.fontFamily,
								} }
							>
								<div
									data-unitone-layout="decorator -padding:1 -typography:em"
									style={ {
										'--unitone--background-color':
											backgroundColor,
										'--unitone--color': textColor,
										'--unitone--border-color':
											'var(--unitone--color--light-gray)',
										'--unitone--border-width': '1px',
										'--unitone--half-leading': String(
											settings?.[ 'half-leading' ]
										),
									} }
								>
									<div data-unitone-layout="stack">
										<Preview
											linkColor={ linkColor }
											linkFocusColor={
												linkFocusColor || linkColor
											}
											linkHoverColor={
												linkHoverColor || linkColor
											}
										/>
									</div>
								</div>
							</div>
						</div>
						<div data-unitone-layout="stack">
							<ItemGroup className="unitone-settings-colors-settigs-dropdown">
								<ColorGradientSettingsDropdown
									settings={ [
										{
											label: __(
												'Accent Color',
												'unitone'
											),
											colorValue:
												settings?.[ 'accent-color' ] ||
												defaultSettings?.[
													'accent-color'
												],
											onColorChange: ( newSetting ) =>
												setSettings( {
													...settings,
													'accent-color': newSetting,
												} ),
											clearable: true,
										},
										{
											label: __(
												'Background Color',
												'unitone'
											),
											colorValue: backgroundColor,
											onColorChange: ( newSetting ) =>
												setSettings( {
													...settings,
													styles: {
														...settings?.styles,
														color: {
															...settings?.styles
																?.color,
															background:
																newSetting,
														},
													},
												} ),
											clearable: true,
										},
										{
											label: __(
												'Text Color',
												'unitone'
											),
											colorValue: textColor,
											onColorChange: ( newSetting ) =>
												setSettings( {
													...settings,
													styles: {
														...settings?.styles,
														color: {
															...settings?.styles
																?.color,
															text: newSetting,
														},
													},
												} ),
											clearable: true,
										},
										{
											label: __(
												'Link Color',
												'unitone'
											),
											colorValue: linkColor,
											onColorChange: ( newSetting ) =>
												setSettings( {
													...settings,
													styles: {
														...settings?.styles,
														elements: {
															...settings?.styles
																?.elements,
															link: {
																...settings
																	?.styles
																	?.elements
																	?.link,
																color: {
																	...settings
																		?.styles
																		?.elements
																		?.link
																		?.color,
																	text: newSetting,
																},
															},
														},
													},
												} ),
											clearable: true,
										},
										{
											label: __(
												'Link Color (:hover)',
												'unitone'
											),
											colorValue: linkHoverColor,
											onColorChange: ( newSetting ) =>
												setSettings( {
													...settings,
													styles: {
														...settings?.styles,
														elements: {
															...settings?.styles
																?.elements,
															link: {
																...settings
																	?.styles
																	?.elements
																	?.link,
																':hover': {
																	...settings
																		?.styles
																		?.elements
																		?.link?.[
																		':hover'
																	],
																	color: {
																		...settings
																			?.styles
																			?.elements
																			?.link?.[
																			':hover'
																		]
																			?.color,
																		text: newSetting,
																	},
																},
															},
														},
													},
												} ),
											clearable: true,
										},
										{
											label: __(
												'Link Color (:focus)',
												'unitone'
											),
											colorValue: linkFocusColor,
											onColorChange: ( newSetting ) =>
												setSettings( {
													...settings,
													styles: {
														...settings?.styles,
														elements: {
															...settings?.styles
																?.elements,
															link: {
																...settings
																	?.styles
																	?.elements
																	?.link,
																':focus': {
																	...settings
																		?.styles
																		?.elements
																		?.link?.[
																		':focus'
																	],
																	color: {
																		...settings
																			?.styles
																			?.elements
																			?.link?.[
																			':focus'
																		]
																			?.color,
																		text: newSetting,
																	},
																},
															},
														},
													},
												} ),
											clearable: true,
										},
									] }
									colors={ settings.palette }
								/>
							</ItemGroup>
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

const Preview = ( props ) => {
	const { linkColor, linkFocusColor, linkHoverColor } = props;
	const [ isFocus, setIsFocus ] = useState( false );
	const [ isHover, setIsHover ] = useState( false );

	let finalLinkColor = linkColor;
	if ( isHover ) {
		finalLinkColor = linkHoverColor;
	} else if ( isFocus ) {
		finalLinkColor = linkFocusColor;
	}

	return (
		<div>
			<a
				href="#_"
				onFocus={ () => setIsFocus( true ) }
				onBlur={ () => setIsFocus( false ) }
				onMouseOver={ () => setIsHover( true ) }
				onMouseLeave={ () => setIsHover( false ) }
				style={ {
					color: finalLinkColor,
				} }
			>
				するとどこかで見たわ姉は
			</a>
			細い銀いろの空から、さっきの入口から暗い牛舎の前へまた来ました。そういうふうに、眼の前を通るのですから、この次の理科の時間にお話します。
		</div>
	);
};
