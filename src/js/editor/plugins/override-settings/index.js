import {
	RangeControl,
	__experimentalVStack as VStack,
} from '@wordpress/components';

import {
	PluginDocumentSettingPanel,
	store as editorStore,
} from '@wordpress/editor';

import { __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients } from '@wordpress/block-editor';
import { useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useMemo, useEffect, useRef } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';
import { __ } from '@wordpress/i18n';

import ColorGradientSettingsDropdown from '../../../../../App/Controller/Manager/src/js/color-gradient-settings-dropdown';
import { FontFamilyControl, UnitControl } from './components';

const applyNewSetting = ( root, property, newValue ) => {
	if ( null == newValue ) {
		root?.style.removeProperty( property );
	} else {
		root?.style.setProperty( property, newValue );
	}
};

const applyStyles = ( root, styles ) => {
	Object.entries( styles ).forEach( ( [ property, value ] ) => {
		applyNewSetting( root, property, value );
	} );
};

const tryDetectInnerRoot = ( outerDocument ) => {
	const iframe = outerDocument.querySelector(
		'iframe[name="editor-canvas"]'
	);
	if ( iframe?.contentDocument?.documentElement ) {
		return iframe.contentDocument.documentElement;
	}

	const nonIframeCanvas = outerDocument.querySelector(
		'.editor-styles-wrapper'
	);
	if ( nonIframeCanvas ) {
		return nonIframeCanvas;
	}

	return null;
};

const PageSettingsPanel = () => {
	const { postId, postType } = useSelect( ( select ) => {
		const { getCurrentPostId, getCurrentPostType } = select( editorStore );
		return {
			postId: getCurrentPostId(),
			postType: getCurrentPostType(),
		};
	}, [] );

	const [ meta, setMeta ] = useEntityProp(
		'postType',
		postType,
		'meta',
		postId
	);

	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const colors = useMemo(
		() =>
			colorGradientSettings.colors
				.flatMap( ( palette ) => palette.colors )
				.filter(
					( color ) =>
						! [ 'unitone-accent', 'unitone-background' ].includes(
							color.slug
						)
				),
		[ colorGradientSettings.colors ]
	);

	const ref = useRef( null );

	const newAccentColor =
		meta?.[ 'unitone-override-settings' ]?.[ 'accent-color' ];
	const newBackgroundColor =
		meta?.[ 'unitone-override-settings' ]?.[ 'background-color' ];
	const newTextColor =
		meta?.[ 'unitone-override-settings' ]?.[ 'text-color' ];
	const newBaseFontSize =
		meta?.[ 'unitone-override-settings' ]?.[ 'base-font-size' ];
	const newFontFamily =
		meta?.[ 'unitone-override-settings' ]?.[ 'font-family' ];
	const newHalfLeading =
		meta?.[ 'unitone-override-settings' ]?.[ 'half-leading' ];
	const newContentSize =
		meta?.[ 'unitone-override-settings' ]?.[ 'content-size' ];
	const newWideSize = meta?.[ 'unitone-override-settings' ]?.[ 'wide-size' ];

	const overrideStyles = useMemo(
		() => ( {
			'--unitone--color--accent': newAccentColor,
			'--unitone--color--background': newBackgroundColor,
			'--unitone--color--text': newTextColor,
			'--unitone--base-font-size': newBaseFontSize,
			'--unitone--font-family': !! newFontFamily
				? `var(--wp--preset--font-family--${ newFontFamily?.replace(
						'var:preset|font-family|',
						''
				  ) })`
				: undefined,
			'--unitone--half-leading': newHalfLeading,
			'--wp--style--global--content-size': newContentSize,
			'--wp--style--global--wide-size': newWideSize,
		} ),
		[
			newAccentColor,
			newBackgroundColor,
			newTextColor,
			newBaseFontSize,
			newFontFamily,
			newHalfLeading,
			newContentSize,
			newWideSize,
		]
	);

	useEffect( () => {
		if ( ! ref.current ) {
			return;
		}

		const outerDocument = ref.current.ownerDocument;

		const outerRoot = outerDocument?.documentElement;
		if ( outerRoot ) {
			applyStyles( outerRoot, overrideStyles );
		}

		const interval = setInterval( () => {
			const innerRoot = tryDetectInnerRoot( outerDocument );
			if ( innerRoot ) {
				clearInterval( interval );
				applyStyles( innerRoot, overrideStyles );
			}
		}, 250 );

		return () => {
			clearInterval( interval );
		};
	}, [ overrideStyles ] );

	return (
		! [ 'wp_template', 'wp_template_part' ].includes( postType ) && (
			<>
				<div ref={ ref }></div>
				<PluginDocumentSettingPanel
					name="unitone-page-settings-panel"
					title={ __( 'Override settings', 'unitone' ) }
					className="unitone-page-settings-panel"
				>
					<VStack spacing="16px">
						<div className="unitone-settings-colors-settigs-dropdown">
							<ColorGradientSettingsDropdown
								__experimentalIsRenderedInSidebar
								disableCustomColors={ false }
								colors={ colors }
								settings={ [
									{
										colorValue: newAccentColor,
										label: __( 'Accent color', 'unitone' ),
										onColorChange: ( newAttribute ) => {
											setMeta( {
												'unitone-override-settings': {
													...meta?.[
														'unitone-override-settings'
													],
													'accent-color':
														newAttribute,
												},
											} );
										},
										enableAlpha: true,
										clearable: true,
									},
									{
										colorValue: newBackgroundColor,
										label: __(
											'Background color',
											'unitone'
										),
										onColorChange: ( newAttribute ) => {
											setMeta( {
												'unitone-override-settings': {
													...meta?.[
														'unitone-override-settings'
													],
													'background-color':
														newAttribute,
												},
											} );
										},
										enableAlpha: true,
										clearable: true,
									},
									{
										colorValue: newTextColor,
										label: __( 'Text color', 'unitone' ),
										onColorChange: ( newAttribute ) => {
											setMeta( {
												'unitone-override-settings': {
													...meta?.[
														'unitone-override-settings'
													],
													'text-color': newAttribute,
												},
											} );
										},
										enableAlpha: true,
										clearable: true,
									},
								] }
								style={ {
									padding: 0,
								} }
							/>
						</div>

						<RangeControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Base Font Size', 'unitone' ) }
							value={
								null != newBaseFontSize
									? parseFloat( newBaseFontSize )
									: undefined
							}
							onChange={ ( newSetting ) =>
								setMeta( {
									'unitone-override-settings': {
										...meta?.[
											'unitone-override-settings'
										],
										'base-font-size':
											null != newSetting
												? parseFloat( newSetting )
												: undefined,
									},
								} )
							}
							min={ 14 }
							step={ 1 }
							max={ 18 }
							allowReset
						/>

						<RangeControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Half Leading', 'unitone' ) }
							value={
								null != newHalfLeading
									? parseFloat( newHalfLeading )
									: undefined
							}
							onChange={ ( newSetting ) =>
								setMeta( {
									'unitone-override-settings': {
										...meta?.[
											'unitone-override-settings'
										],
										'half-leading':
											null != newSetting
												? parseFloat( newSetting )
												: undefined,
									},
								} )
							}
							min={ 0.1 }
							step={ 0.1 }
							max={ 1 }
							allowReset
						/>

						<FontFamilyControl
							value={ newFontFamily?.replace(
								'var:preset|font-family|',
								''
							) }
							onChange={ ( newSetting ) =>
								setMeta( {
									'unitone-override-settings': {
										...meta?.[
											'unitone-override-settings'
										],
										'font-family': !! newSetting
											? `var:preset|font-family|${ newSetting }`
											: undefined,
									},
								} )
							}
						/>

						<UnitControl
							label={ __( 'Content Width', 'unitone' ) }
							value={ newContentSize || '' }
							onChange={ ( newSetting ) =>
								setMeta( {
									'unitone-override-settings': {
										...meta?.[
											'unitone-override-settings'
										],
										'content-size': newSetting,
									},
								} )
							}
						/>

						<UnitControl
							label={ __( 'Wide', 'unitone' ) }
							value={ newWideSize || '' }
							onChange={ ( newSetting ) =>
								setMeta( {
									'unitone-override-settings': {
										...meta?.[
											'unitone-override-settings'
										],
										'wide-size': newSetting,
									},
								} )
							}
						/>
					</VStack>
				</PluginDocumentSettingPanel>
			</>
		)
	);
};

registerPlugin( 'unitone-page-settings-plugin', {
	render: PageSettingsPanel,
} );
