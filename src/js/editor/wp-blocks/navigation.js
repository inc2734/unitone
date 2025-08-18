import clsx from 'clsx';

import {
	InspectorControls,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

import {
	Button,
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalVStack as VStack,
} from '@wordpress/components';

import { createHigherOrderComponent } from '@wordpress/compose';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';
import { edit } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import {
	cleanEmptyObject,
	useToolsPanelDropdownMenuProps,
} from '../hooks/utils';

const useBlockProps = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const { attributes, name, wrapperProps } = props;

		if ( 'core/navigation' !== name ) {
			return <BlockListBlock { ...props } />;
		}

		const hamburgerButtonColor = !! attributes?.unitone
			?.hamburgerButtonColor
			? `var(--wp--preset--color--${ attributes?.unitone?.hamburgerButtonColor })`
			: attributes?.unitone?.hamburgerButtonCustomColor;
		const hamburgerButtonBackgroundColor = !! attributes?.unitone
			?.hamburgerButtonBackgroundColor
			? `var(--wp--preset--color--${ attributes?.unitone?.hamburgerButtonBackgroundColor })`
			: attributes?.unitone?.hamburgerButtonCustomBackgroundColor;

		const overlayMenuColor = !! attributes?.unitone?.overlayMenuColor
			? `var(--wp--preset--color--${ attributes?.unitone?.overlayMenuColor })`
			: attributes?.unitone?.overlayMenuCustomColor;
		const overlayMenuBackgroundColor = !! attributes?.unitone
			?.overlayMenuBackgroundColor
			? `var(--wp--preset--color--${ attributes?.unitone?.overlayMenuBackgroundColor })`
			: attributes?.unitone?.overlayMenuCustomBackgroundColor;

		props = {
			...props,
			wrapperProps: {
				...wrapperProps,
				className: clsx( wrapperProps?.className, {
					'has-hamburger-button-color': !! hamburgerButtonColor,
					'has-hamburger-button-background-color':
						!! hamburgerButtonBackgroundColor,
					'has-overlay-menu-color': !! overlayMenuColor,
					'has-overlay-menu-background-color':
						!! overlayMenuBackgroundColor,
				} ),
				style: {
					...wrapperProps?.style,
					'--unitone--hamburger-button-color': hamburgerButtonColor,
					'--unitone--hamburger-button-background-color':
						hamburgerButtonBackgroundColor,
					'--unitone--overlay-menu-color': overlayMenuColor,
					'--unitone--overlay-menu-background-color':
						overlayMenuBackgroundColor,
					'--unitone--help-text': !! attributes?.unitone
						?.replaceOverlayMenu
						? `"${ __(
								'The template part overlay-menu is used as an overlay menu.',
								'unitone'
						  ) }"`
						: undefined,
				},
			},
		};

		return <BlockListBlock { ...props } />;
	};
}, 'useBlockProps' );

addFilter(
	'editor.BlockListBlock',
	'unitone/navigation/useBlockProps',
	useBlockProps
);

const EditButton = () => {
	const { siteUrl, currentTheme } = useSelect( ( select ) => {
		const { getSite, getCurrentTheme } = select( coreStore );

		return {
			siteUrl: getSite()?.url,
			currentTheme: getCurrentTheme()?.stylesheet,
		};
	}, [] );

	const slug = 'overlay-menu';

	return (
		<Button
			variant="secondary"
			icon={ edit }
			href={ `${ siteUrl }/wp-admin/site-editor.php?p=%2Fwp_template_part%2F${
				currentTheme || ''
			}%2F%2F${ slug }&canvas=edit` }
			target="_blank"
		>
			{ __( 'Edit template', 'unitone' ) }
		</Button>
	);
};

const NavigationInspectorControls = ( {
	attributes,
	setAttributes,
	clientId,
} ) => {
	const { unitone = {} } = attributes;

	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const colors = colorGradientSettings.colors.flatMap(
		( palette ) => palette.colors
	);

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const resetAll = () => {
		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				replaceOverlayMenu: false,
			} ),
		} );
	};

	return (
		<>
			<InspectorControls group="color">
				<ColorGradientSettingsDropdown
					__experimentalIsRenderedInSidebar
					settings={ [
						{
							label: __( 'Button text', 'unitone' ),
							colorValue: unitone?.hamburgerButtonCustomColor,
							onColorChange: ( newSetting ) => {
								const colorObject = colors.filter(
									( c ) => newSetting === c.color
								)?.[ 0 ];
								const newColor = colorObject?.slug;
								const newCustomColor =
									colorObject?.color || newSetting;

								setAttributes( {
									unitone: cleanEmptyObject( {
										...unitone,
										hamburgerButtonColor: newColor,
										hamburgerButtonCustomColor:
											newCustomColor,
									} ),
								} );
							},
							resetAllFilter: () => {
								setAttributes( {
									unitone: cleanEmptyObject(
										Object.assign( unitone, {
											hamburgerButtonColor: undefined,
											hamburgerButtonCustomColor:
												undefined,
										} )
									),
								} );
							},
							clearable: true,
						},
						{
							label: __( 'Button background', 'unitone' ),
							colorValue:
								unitone?.hamburgerButtonCustomBackgroundColor,
							onColorChange: ( newSetting ) => {
								const colorObject = colors.filter(
									( c ) => newSetting === c.color
								)?.[ 0 ];
								const newColor = colorObject?.slug;
								const newCustomColor =
									colorObject?.color || newSetting;

								setAttributes( {
									unitone: cleanEmptyObject( {
										...unitone,
										hamburgerButtonBackgroundColor:
											newColor,
										hamburgerButtonCustomBackgroundColor:
											newCustomColor,
									} ),
								} );
							},
							resetAllFilter: () => {
								setAttributes( {
									unitone: cleanEmptyObject(
										Object.assign( unitone, {
											hamburgerButtonBackgroundColor:
												undefined,
											hamburgerButtonCustomBackgroundColor:
												undefined,
										} )
									),
								} );
							},
							clearable: true,
						},
						{
							label: __( 'Overlay menu text', 'unitone' ),
							colorValue: unitone?.overlayMenuCustomColor,
							onColorChange: ( newSetting ) => {
								const colorObject = colors.filter(
									( c ) => newSetting === c.color
								)?.[ 0 ];
								const newColor = colorObject?.slug;
								const newCustomColor =
									colorObject?.color || newSetting;

								setAttributes( {
									unitone: cleanEmptyObject( {
										...unitone,
										overlayMenuColor: newColor,
										overlayMenuCustomColor: newCustomColor,
									} ),
								} );
							},
							resetAllFilter: () => {
								setAttributes( {
									unitone: cleanEmptyObject(
										Object.assign( unitone, {
											overlayMenuColor: undefined,
											overlayMenuCustomColor: undefined,
										} )
									),
								} );
							},
							clearable: true,
						},
						{
							label: __( 'Overlay menu background', 'unitone' ),
							colorValue:
								unitone?.overlayMenuCustomBackgroundColor,
							onColorChange: ( newSetting ) => {
								const colorObject = colors.filter(
									( c ) => newSetting === c.color
								)?.[ 0 ];
								const newColor = colorObject?.slug;
								const newCustomColor =
									colorObject?.color || newSetting;

								setAttributes( {
									unitone: cleanEmptyObject( {
										...unitone,
										overlayMenuBackgroundColor: newColor,
										overlayMenuCustomBackgroundColor:
											newCustomColor,
									} ),
								} );
							},
							resetAllFilter: () => {
								setAttributes( {
									unitone: cleanEmptyObject(
										Object.assign( unitone, {
											overlayMenuBackgroundColor:
												undefined,
											overlayMenuCustomBackgroundColor:
												undefined,
										} )
									),
								} );
							},
							clearable: true,
						},
					] }
					{ ...colorGradientSettings }
					gradients={ [] }
					disableCustomGradients
					panelId={ clientId }
				/>
			</InspectorControls>

			<InspectorControls>
				<ToolsPanel
					label={ __( 'Overlay menu', 'unitone' ) }
					resetAll={ resetAll }
					panelId={ clientId }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						hasValue={ () => null != unitone?.replaceOverlayMenu }
						label={ __(
							'Use template parts for overlay menu',
							'unitone'
						) }
						onDeselect={ () => {
							unitone.replaceOverlayMenu = undefined;

							setAttributes( {
								unitone: cleanEmptyObject( unitone ),
							} );
						} }
						isShownByDefault
						panelId={ clientId }
						dropdownMenuProps={ dropdownMenuProps }
					>
						<VStack spacing="16px">
							<ToggleControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __(
									'Use template parts for overlay menu',
									'unitone'
								) }
								checked={
									attributes?.unitone?.replaceOverlayMenu ??
									false
								}
								onChange={ ( newSetting ) =>
									setAttributes( {
										unitone: cleanEmptyObject( {
											...unitone,
											replaceOverlayMenu: newSetting,
										} ),
									} )
								}
							/>

							{ !! unitone?.replaceOverlayMenu && (
								<div>
									<EditButton />
								</div>
							) }
						</VStack>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
		</>
	);
};

const withInspectorControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		if ( ! props.isSelected || 'core/navigation' !== props.name ) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<BlockEdit { ...props } />

				<NavigationInspectorControls { ...props } />
			</>
		);
	};
}, 'withInspectorControls' );

addFilter(
	'editor.BlockEdit',
	'unitone/core/navigation/with-inspector-controls',
	withInspectorControls,
	9
);
