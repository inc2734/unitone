import {
	Notice,
	FontSizePicker,
	RangeControl,
	SelectControl,
	TextControl,
} from '@wordpress/components';

import { useEffect, useState } from '@wordpress/element';
import { sprintf, __ } from '@wordpress/i18n';

import apiFetch from '@wordpress/api-fetch';

import { ResetButton, SaveButton } from '../components/buttons';
import { useMigrationFontFamily } from './hooks/useMigrationFontFamily';

import {
	getFontSizeByUnitoneScale,
	getFontSizeCssVarSlug,
	getFontSizePresetSlugFromValue,
	getFontSizePresetValue,
	getRootFontSize,
	getUnitoneFontSizeScale,
	getUnitoneFontSizeTokenSlug,
} from '../../../../../../src/js/utils/font-size';

import { withMinDelay } from '../utils/utils';

const HEADING_FONT_SIZE_CONTROLS = [
	{
		heading: 'h1',
		settingKey: 'h1-size',
		label: __( 'Size of h1', 'unitone' ),
	},
	{
		heading: 'h2',
		settingKey: 'h2-size',
		label: __( 'Size of h2', 'unitone' ),
	},
	{
		heading: 'h3',
		settingKey: 'h3-size',
		label: __( 'Size of h3', 'unitone' ),
	},
	{
		heading: 'h4',
		settingKey: 'h4-size',
		label: __( 'Size of h4', 'unitone' ),
	},
	{
		heading: 'h5',
		settingKey: 'h5-size',
		label: __( 'Size of h5', 'unitone' ),
	},
	{
		heading: 'h6',
		settingKey: 'h6-size',
		label: __( 'Size of h6', 'unitone' ),
	},
];

const isEmptyHeadingFontSizeSetting = ( value ) =>
	null == value || '' === value || false === value;

const getPreviewFontSize = ( fontSize ) =>
	'string' === typeof fontSize
		? fontSize.replace( /([+-]?(?:\d+\.?\d*|\.\d+))rem\b/gi, '$1em' )
		: fontSize;

const getPreviewUnitoneFontSize = ( scale ) =>
	0 === scale
		? 'calc(1 * 1em)'
		: `calc(calc(var(--unitone--harmonic-sequence-base) / (var(--unitone--harmonic-sequence-base) - (${ scale }))) * 1em)`;

const getPreviewFontSizePresetStyles = ( fontSizes ) =>
	fontSizes?.reduce( ( styles, fontSize ) => {
		const slug = getFontSizeCssVarSlug( fontSize?.slug );
		if ( ! slug ) {
			return styles;
		}

		const scale = getUnitoneFontSizeScale( fontSize );
		const tokenSlug = getUnitoneFontSizeTokenSlug( fontSize );
		if ( Number.isFinite( scale ) && tokenSlug ) {
			styles[ `--unitone--font-size-${ tokenSlug }` ] =
				getPreviewUnitoneFontSize( scale );
		}

		const size = getPreviewFontSize( fontSize?.size );
		if ( null == size || '' === size ) {
			return styles;
		}

		styles[ `--wp--preset--font-size--${ slug }` ] = size;

		if ( slug !== fontSize.slug ) {
			styles[ `--wp--preset--font-size--${ fontSize.slug }` ] = size;
		}

		return styles;
	}, {} ) ?? {};

const getFontSizeBySlug = ( settings, slug ) =>
	slug
		? settings?.fontSizes?.find(
				( fontSize ) =>
					slug === fontSize.slug ||
					slug === getFontSizeCssVarSlug( fontSize.slug )
		  )
		: undefined;

const getHeadingFontSize = ( settings, defaultSettings, settingKey ) => {
	const setting = ! isEmptyHeadingFontSizeSetting( settings?.[ settingKey ] )
		? settings?.[ settingKey ]
		: defaultSettings?.[ settingKey ];

	if ( isEmptyHeadingFontSizeSetting( setting ) ) {
		return undefined;
	}

	if (
		'' !== String( setting ).trim() &&
		! Number.isNaN( Number( setting ) )
	) {
		return getFontSizeByUnitoneScale( settings?.fontSizes, setting );
	}

	const presetSlug = getFontSizePresetSlugFromValue( setting );
	return getFontSizeBySlug( settings, presetSlug );
};

const getHeadingPreviewStyle = ( settings, defaultSettings, settingKey ) => {
	const fontSize = getHeadingFontSize(
		settings,
		defaultSettings,
		settingKey
	);
	const slug = getFontSizeCssVarSlug( fontSize?.slug );

	return {
		fontSize: slug
			? `var(--wp--preset--font-size--${ slug })`
			: getPreviewFontSize( fontSize?.size ),
		fontWeight: 'bold',
	};
};

export default function ( { settings, defaultSettings, setSettings } ) {
	const [ settingsSaving, setSettingsSaving ] = useState( false );
	const [ baseFontSizeInput, setBaseFontSizeInput ] = useState( '' );
	const [ isBaseFontSizeInputDirty, setIsBaseFontSizeInputDirty ] =
		useState( false );
	const baseFontSize = settings?.[ 'base-font-size' ];
	const previewRootFontSize = getRootFontSize( baseFontSize );
	const previewFontSizePresetStyles = getPreviewFontSizePresetStyles(
		settings?.fontSizes
	);

	useMigrationFontFamily( settings, setSettings );

	useEffect( () => {
		if ( isBaseFontSizeInputDirty ) {
			return;
		}

		setBaseFontSizeInput( getRootFontSize( baseFontSize ) ?? '' );
	}, [ baseFontSize, isBaseFontSizeInputDirty ] );

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
					...HEADING_FONT_SIZE_CONTROLS.reduce(
						( newSettings, { settingKey } ) => ( {
							...newSettings,
							[ settingKey ]: settings?.[ settingKey ] ?? null,
						} ),
						{}
					),
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
				...settings?.styles,
				typography: {
					...settings?.styles?.typography,
					fontFamily: defaultSettings.styles.typography.fontFamily,
				},
			},
		} );
		setBaseFontSizeInput(
			getRootFontSize( defaultSettings[ 'base-font-size' ] ) ?? ''
		);
		setIsBaseFontSizeInputDirty( false );

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
								data-unitone-layout="stack -gap:-2"
								style={ {
									...previewFontSizePresetStyles,
									'--unitone--root-font-size':
										previewRootFontSize,
									fontSize: previewRootFontSize,
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
									data-unitone-layout="decorator -padding:1"
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
											style={ getHeadingPreviewStyle(
												settings,
												defaultSettings,
												'h1-size'
											) }
										>
											見出し1
										</div>
										<div
											style={ getHeadingPreviewStyle(
												settings,
												defaultSettings,
												'h2-size'
											) }
										>
											見出し2
										</div>
										<div
											style={ getHeadingPreviewStyle(
												settings,
												defaultSettings,
												'h3-size'
											) }
										>
											見出し3
										</div>
										<div
											style={ getHeadingPreviewStyle(
												settings,
												defaultSettings,
												'h4-size'
											) }
										>
											見出し4
										</div>
										<div
											style={ getHeadingPreviewStyle(
												settings,
												defaultSettings,
												'h5-size'
											) }
										>
											見出し5
										</div>
										<div
											style={ getHeadingPreviewStyle(
												settings,
												defaultSettings,
												'h6-size'
											) }
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

							<TextControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Base Font Size', 'unitone' ) }
								value={ baseFontSizeInput }
								onChange={ ( newSetting ) => {
									setBaseFontSizeInput( newSetting );
									setIsBaseFontSizeInputDirty( true );

									setSettings( {
										...settings,
										'base-font-size':
											'' !== newSetting.trim()
												? newSetting.trim()
												: null,
									} );
								} }
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
								min={ -0.1 }
								step={ 0.05 }
								max={
									parseFloat(
										settings?.[ 'half-leading' ] ?? 0
									) / 2
								}
							/>

							{ HEADING_FONT_SIZE_CONTROLS.map(
								( { heading, settingKey, label } ) => (
									<div
										key={ heading }
										data-unitone-layout="with-sidebar -sidebar:left"
									>
										<div>{ label }</div>
										<div>
											<FontSizePicker
												__next40pxDefaultSize
												disableCustomFontSizes
												fontSizes={
													settings?.fontSizes
												}
												value={
													getHeadingFontSize(
														settings,
														defaultSettings,
														settingKey
													)?.slug
												}
												valueMode="slug"
												onChange={ (
													newSetting,
													fontSize
												) => {
													const newFontSize =
														fontSize ??
														getFontSizeBySlug(
															settings,
															newSetting
														);
													const unitoneScale =
														getUnitoneFontSizeScale(
															newFontSize
														);
													let newHeadingFontSizeSetting =
														null;

													if ( newSetting ) {
														newHeadingFontSizeSetting =
															Number.isFinite(
																unitoneScale
															)
																? unitoneScale
																: getFontSizePresetValue(
																		newFontSize
																  );
													}

													setSettings( {
														...settings,
														[ settingKey ]:
															newHeadingFontSizeSetting,
													} );
												} }
											/>
										</div>
									</div>
								)
							) }

							<Notice status="warning" isDismissible={ false }>
								<span
									dangerouslySetInnerHTML={ {
										__html: sprintf(
											// translators: %1$s: <code>, %2$s: </code>
											__(
												'The header size setting described above applies directly beneath inner blocks use content width (%1$s.is-layout-constrained%2$s), text blocks, and vertical writing blocks.',
												'unitone'
											),
											'<code>',
											'</code>'
										),
									} }
								/>
							</Notice>
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
