import {
	FontSizePicker,
	RangeControl,
	SelectControl,
} from '@wordpress/components';

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import apiFetch from '@wordpress/api-fetch';

import { ResetButton, SaveButton } from '../components/buttons';
import { useMigrationFontFamily } from './hooks/useMigrationFontFamily';
import { withMinDelay } from '../utils/utils';

export default function ( { settings, defaultSettings, setSettings } ) {
	const [ settingsSaving, setSettingsSaving ] = useState( false );

	useMigrationFontFamily( settings, setSettings );

	const saveSettings = () => {
		setSettingsSaving( 'save' );

		withMinDelay(
			apiFetch( {
				path: '/unitone/v1/settings',
				method: 'POST',
				data: {
					'base-font-size': settings?.[ 'base-font-size' ] ?? null,
					'half-leading': settings?.[ 'half-leading' ] ?? null,
					'min-half-leading':
						settings?.[ 'min-half-leading' ] ?? null,
					'h1-size': settings?.[ 'h1-size' ] ?? null,
					'h2-size': settings?.[ 'h2-size' ] ?? null,
					'h3-size': settings?.[ 'h3-size' ] ?? null,
					'h4-size': settings?.[ 'h4-size' ] ?? null,
					'h5-size': settings?.[ 'h5-size' ] ?? null,
					'h6-size': settings?.[ 'h6-size' ] ?? null,
					styles: {
						typography: {
							fontFamily:
								settings?.styles?.typography?.fontFamily ??
								null,
						},
					},
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
			'base-font-size': defaultSettings[ 'base-font-size' ],
			'half-leading': defaultSettings[ 'half-leading' ],
			'min-half-leading': defaultSettings[ 'min-half-leading' ],
			'h1-size': defaultSettings[ 'h1-size' ],
			'h2-size': defaultSettings[ 'h2-size' ],
			'h3-size': defaultSettings[ 'h3-size' ],
			'h4-size': defaultSettings[ 'h4-size' ],
			'h5-size': defaultSettings[ 'h5-size' ],
			'h6-size': defaultSettings[ 'h6-size' ],
			styles: {
				typography: {
					fontFamily: defaultSettings.styles.typography.fontFamily,
				},
			},
		} );

		withMinDelay(
			apiFetch( {
				path: '/unitone/v1/settings',
				method: 'POST',
				data: {
					'base-font-size': null,
					'half-leading': null,
					'min-half-leading': null,
					'h1-size': null,
					'h2-size': null,
					'h3-size': null,
					'h4-size': null,
					'h5-size': null,
					'h6-size': null,
					styles: {
						typography: {
							fontFamily: null,
						},
					},
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
										<div
											data-unitone-layout="-typography:em"
											style={ {
												'--unitone--font-size':
													settings?.[ 'h1-size' ],
												fontWeight: 'bold',
											} }
										>
											見出し1
										</div>
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
											波が静かに寄せては返し、砂を優しく撫でる。遠くの水平線に白い帆が浮かび、ゆっくりと進んでいく。潮の香りが漂い、カモメの声が響く。空は澄み渡り、風が心地よく頬を撫でていた。
										</div>
									</div>
								</div>
							</div>
						</div>
						<div data-unitone-layout="stack">
							<SelectControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Font', 'unitone' ) }
								value={ settings?.styles?.typography?.fontFamily?.replace(
									'var:preset|font-family|',
									''
								) }
								options={ settings?.fontFamilies?.map(
									( fontFamily ) => ( {
										label: fontFamily.name,
										value: fontFamily.slug,
									} )
								) }
								onChange={ ( newSetting ) =>
									setSettings( {
										...settings,
										styles: {
											...settings?.styles,
											typography: {
												...settings?.styles?.typography,
												fontFamily: `var:preset|font-family|${ newSetting }`,
											},
										},
									} )
								}
							/>

							<RangeControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
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
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={
									<>
										{ __( 'Half Leading', 'unitone' ) }
										&nbsp;(
										<code
											style={ {
												fontSize: 'inherit',
												textTransform: 'lowercase',
											} }
										>
											line-height:&nbsp;
											{ 1 +
												parseFloat(
													settings?.[ 'half-leading' ]
												) *
													2 }
										</code>
										)
									</>
								}
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
								max={ 1 }
							/>

							<RangeControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={
									<>
										{ __(
											'Minimum half Leading',
											'unitone'
										) }
										&nbsp;(
										<code
											style={ {
												fontSize: 'inherit',
												textTransform: 'lowercase',
											} }
										>
											line-height:&nbsp;
											{ 1 +
												parseFloat(
													settings?.[
														'min-half-leading'
													]
												) *
													2 }
										</code>
										)
									</>
								}
								value={ parseFloat(
									settings?.[ 'min-half-leading' ]
								) }
								onChange={ ( newSetting ) =>
									setSettings( {
										...settings,
										'min-half-leading': newSetting,
									} )
								}
								min={ 0.0 }
								step={ 0.05 }
								max={
									parseFloat(
										settings?.[ 'half-leading' ] ?? 0
									) / 2
								}
							/>

							<div data-unitone-layout="with-sidebar -sidebar:left">
								<div>{ __( 'Size of h1', 'unitone' ) }</div>
								<div>
									<FontSizePicker
										__next40pxDefaultSize
										disableCustomFontSizes
										fontSizes={ settings?.fontSizes }
										value={
											settings?.fontSizes?.find(
												( fontSize ) =>
													String(
														settings?.[ 'h1-size' ]
													) ===
													String( fontSize.slug )
											)?.size
										}
										onChange={ ( newSetting, fontSizes ) =>
											setSettings( {
												...settings,
												'h1-size':
													!! newSetting &&
													parseInt( fontSizes.slug ),
											} )
										}
									/>
								</div>
							</div>

							<div data-unitone-layout="with-sidebar -sidebar:left">
								<div>{ __( 'Size of h2', 'unitone' ) }</div>
								<div>
									<FontSizePicker
										__next40pxDefaultSize
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
										__next40pxDefaultSize
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
										__next40pxDefaultSize
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
										__next40pxDefaultSize
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
										__next40pxDefaultSize
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
	);
}
