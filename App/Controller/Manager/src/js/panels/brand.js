import {
	BaseControl,
	Button,
	RangeControl,
	__experimentalItemGroup as ItemGroup,
} from '@wordpress/components';

import { MediaUpload } from '@wordpress/block-editor';
import { useEffect, useState, useMemo } from '@wordpress/element';
import { sprintf, __ } from '@wordpress/i18n';

import apiFetch from '@wordpress/api-fetch';

import ColorGradientSettingsDropdown from '../color-gradient-settings-dropdown';

const MIN_SIZE = 20;

export default function ( { settings, defaultSettings, setSettings } ) {
	const [ settingsSaving, setSettingsSaving ] = useState( false );
	const [ siteLogoUrl, setSiteLogoUrl ] = useState( undefined );
	const [ { naturalWidth, naturalHeight }, setNaturalSize ] = useState( {} );
	const [ siteIconUrl, setSiteIconUrl ] = useState( undefined );
	const [ defaultFeaturedImageUrl, setDefaultFeaturedImageUrl ] =
		useState( undefined );

	const saveSettings = () => {
		setSettingsSaving( true );
		apiFetch( {
			path: '/unitone/v1/settings',
			method: 'POST',
			data: {
				'site-logo': settings?.[ 'site-logo' ] ?? null,
				'site-logo-width': settings?.[ 'site-logo-width' ] ?? null,
				'site-icon': settings?.[ 'site-icon' ] ?? null,
				'default-featured-image':
					settings?.[ 'default-featured-image' ] ?? null,
				'accent-color': null, // Deprecated.
				'background-color': null, // Deprecated.
				'text-color': null, // Deprecated.
				settings: {
					color: {
						palette: {
							theme: [
								...settings?.settings?.color?.palette?.theme?.filter(
									( colorObject ) =>
										'unitone-accent' === colorObject.slug
								),
							],
						},
					},
				},
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
			'site-logo-width': undefined,
			'site-icon': undefined,
			'default-featured-image': undefined,
			'accent-color': null, // Deprecated.
			'background-color': null, // Deprecated.
			'text-color': null, // Deprecated.
			settings: {
				color: {
					palette: {
						theme: [
							...defaultSettings.settings.color.palette.theme,
						],
					},
				},
			},
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
		setDefaultFeaturedImageUrl( undefined );
		apiFetch( {
			path: '/unitone/v1/settings',
			method: 'POST',
			data: {
				'site-logo': null,
				'site-logo-width': null,
				'site-icon': null,
				'default-featured-image': null,
				'accent-color': null, // Deprecated.
				'background-color': null, // Deprecated.
				'text-color': null, // Deprecated.
				settings: {
					color: {
						palette: {
							theme: [
								// @todo 本当は他と合わせて空値を返したいが、theme.json の値（e.g. var(--unitone--color--accent）で
								// 補完されてしまうため、正しく表示されなくなってしまう。
								...defaultSettings.settings.color.palette.theme,
							],
						},
					},
				},
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
		setSiteLogoUrl( settings?.siteLogoUrl );
		setSiteIconUrl( settings?.siteIconUrl );
		setDefaultFeaturedImageUrl( settings?.defaultFeaturedImageUrl );
	}, [
		settings?.siteLogoUrl,
		settings?.siteIconUrl,
		settings?.defaultFeaturedImageUrl,
	] );

	// Set the default width to a responsible size.
	// Note that this width is also set in the attached frontend CSS file.
	const defaultWidth = 120;

	const ratio = naturalWidth / naturalHeight;
	const minWidth =
		naturalWidth < naturalHeight ? MIN_SIZE : Math.ceil( MIN_SIZE * ratio );

	const colors = useMemo(
		() =>
			settings?.palette?.map( ( palette ) =>
				palette.slug === 'theme'
					? {
							...palette,
							colors: palette.colors.filter(
								( color ) =>
									! [
										'unitone-accent',
										'unitone-background',
										'unitone-background-alt',
										'unitone-text',
										'unitone-text-alt',
										'unitone-text-black',
									].includes( color.slug )
							),
					  }
					: palette
			),
		[ settings?.palette ]
	);

	const flatPalette = useMemo(
		() => settings?.palette?.flatMap( ( palette ) => palette.colors ),
		[ settings?.palette ]
	);

	const accentColor =
		flatPalette?.find(
			( color ) =>
				color.slug ===
				settings?.settings?.color?.palette?.theme
					?.filter(
						( colorObject ) => 'unitone-accent' === colorObject.slug
					)?.[ 0 ]
					?.color?.replace( 'var:preset|color|', '' )
		)?.color ||
		settings?.settings?.color?.palette?.theme?.filter(
			( colorObject ) => 'unitone-accent' === colorObject.slug
		)?.[ 0 ]?.color ||
		defaultSettings?.settings?.color?.palette?.theme?.filter(
			( colorObject ) => 'unitone-accent' === colorObject.slug
		)?.[ 0 ]?.color;

	const backgroundColor =
		flatPalette?.find(
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
		flatPalette?.find(
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
		flatPalette?.find(
			( color ) =>
				color.slug ===
				settings?.styles?.elements?.link?.color?.text?.replace(
					'var:preset|color|',
					''
				)
		)?.color ||
		settings?.styles?.elements?.link?.color?.text ||
		// accentColor ||
		defaultSettings?.styles?.elements?.link?.color?.text;

	const linkHoverColor =
		'inherit' ===
		settings?.styles?.elements?.link?.[ ':hover' ]?.color?.text
			? undefined
			: flatPalette?.find(
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
			: flatPalette?.find(
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
			style={ {
				'--unitone--background-color': 'white',
				'--unitone--color': '#111',
			} }
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
						<div data-unitone-layout="stack">
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
																'site-logo-width':
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
															maxWidth:
																!! settings?.[
																	'site-logo-width'
																]
																	? `${ settings?.[ 'site-logo-width' ] }px`
																	: `${ defaultWidth }px`,
															height: 'auto',
														} }
														onLoad={ ( event ) => {
															setNaturalSize( {
																naturalWidth:
																	event.target
																		.naturalWidth,
																naturalHeight:
																	event.target
																		.naturalHeight,
															} );
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

							{ !! siteLogoUrl &&
								!! naturalWidth &&
								!! naturalHeight && (
									<RangeControl
										__next40pxDefaultSize
										__nextHasNoMarginBottom
										label={ __(
											'Site Logo Default Width',
											'unitone'
										) }
										help={ __(
											'If you set the width of the site logo block in the editor, that will take precedence.',
											'unitone'
										) }
										value={ parseFloat(
											settings?.[ 'site-logo-width' ] ??
												Math.min(
													defaultWidth,
													naturalWidth
												)
										) }
										onChange={ ( newSetting ) =>
											setSettings( {
												...settings,
												'site-logo-width': newSetting,
											} )
										}
										min={ minWidth }
										max={ naturalWidth }
										initialPosition={ Math.min(
											defaultWidth,
											naturalWidth
										) }
										allowReset
									/>
								) }
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
							<h3>
								{ __( 'Default Featured Image', 'unitone' ) }
							</h3>
						</div>
						<div>
							<BaseControl
								__nextHasNoMarginBottom
								id="unitone-settings-default-featured-image"
								help={ __(
									'This is the image that will be used as a fallback if no featured image is set.',
									'unitone'
								) }
							>
								<MediaUpload
									onSelect={ ( media ) => {
										setSettings( {
											...settings,
											'default-featured-image': media.id,
										} );
										setDefaultFeaturedImageUrl( media.url );
									} }
									type="image"
									value={
										settings?.[ 'default-featured-image' ]
									}
									render={ ( { open } ) => {
										if ( defaultFeaturedImageUrl ) {
											return (
												<div data-unitone-layout="cluster -gap:-1 -align-items:center">
													<Button
														variant="secondary"
														onClick={ () => {
															setSettings( {
																...settings,
																'default-featured-image':
																	null,
															} );
															setDefaultFeaturedImageUrl(
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
														src={
															defaultFeaturedImageUrl
														}
														alt={ __(
															'Default Featured Image',
															'unitone'
														) }
														style={ {
															maxWidth: '480px',
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
										'--unitone--min-half-leading': String(
											settings?.[ 'min-half-leading' ]
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
											colorValue: accentColor,
											onColorChange: ( newSetting ) => {
												setSettings( {
													...settings,
													settings: {
														...settings?.settings,
														color: {
															...settings
																?.settings
																?.color,
															palette: {
																...settings
																	?.settings
																	?.color
																	?.palette,
																theme: [
																	...settings?.settings?.color?.palette?.theme?.map(
																		(
																			colorObject
																		) => {
																			if (
																				'unitone-accent' ===
																				colorObject.slug
																			) {
																				colorObject.color =
																					newSetting;
																			}
																			return colorObject;
																		}
																	),
																],
															},
														},
													},
												} );
											},
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
									colors={ colors }
								/>
							</ItemGroup>
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
