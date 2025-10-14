import clsx from 'clsx';

import {
	InspectorControls,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import {
	TextControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import {
	cleanEmptyObject,
	useToolsPanelDropdownMenuProps,
} from '../hooks/utils';

const useBlockProps = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const { attributes, name, wrapperProps } = props;

		const headerSectionColor = !! attributes?.unitone?.headerSectionColor
			? `var(--wp--preset--color--${ attributes?.unitone?.headerSectionColor })`
			: attributes?.unitone?.headerSectionCustomColor;
		const headerSectionBackgroundColor = !! attributes?.unitone
			?.headerSectionBackgroundColor
			? `var(--wp--preset--color--${ attributes?.unitone?.headerSectionBackgroundColor })`
			: attributes?.unitone?.headerSectionCustomBackgroundColor;

		const footerSectionColor = !! attributes?.unitone?.footerSectionColor
			? `var(--wp--preset--color--${ attributes?.unitone?.footerSectionColor })`
			: attributes?.unitone?.footerSectionCustomColor;
		const footerSectionBackgroundColor = !! attributes?.unitone
			?.footerSectionBackgroundColor
			? `var(--wp--preset--color--${ attributes?.unitone?.footerSectionBackgroundColor })`
			: attributes?.unitone?.footerSectionCustomBackgroundColor;

		props = {
			...props,
			wrapperProps: {
				...wrapperProps,
				className: clsx( wrapperProps?.className, {
					'has-header-section-color': !! headerSectionColor,
					'has-header-section-background-color':
						!! headerSectionBackgroundColor,
					'has-footer-section-color': !! footerSectionColor,
					'has-footer-section-background-color':
						!! footerSectionBackgroundColor,
				} ),
				style: {
					...wrapperProps?.style,
					'--unitone--cell-min-width': hasBlockSupport(
						name,
						'unitone.cellMinWidth'
					)
						? attributes?.unitone?.cellMinWidth || undefined
						: undefined,
					'--unitone--header-section-color': headerSectionColor,
					'--unitone--header-section-background-color':
						headerSectionBackgroundColor,
					'--unitone--footer-section-color': footerSectionColor,
					'--unitone--footer-section-background-color':
						footerSectionBackgroundColor,
				},
			},
		};

		return <BlockListBlock { ...props } />;
	};
}, 'useBlockProps' );

addFilter(
	'editor.BlockListBlock',
	'unitone/table/useBlockProps',
	useBlockProps
);

const ColorInspectorControls = ( { attributes, setAttributes, clientId } ) => {
	const { unitone = {} } = attributes;

	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const colors = colorGradientSettings.colors.flatMap(
		( palette ) => palette.colors
	);

	return (
		<>
			<InspectorControls group="color">
				<ColorGradientSettingsDropdown
					__experimentalIsRenderedInSidebar
					settings={ [
						{
							label: __( 'Header section text', 'unitone' ),
							colorValue: unitone?.headerSectionCustomColor,
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
										headerSectionColor: newColor,
										headerSectionCustomColor:
											newCustomColor,
									} ),
								} );
							},
							resetAllFilter: () => {
								setAttributes( {
									unitone: cleanEmptyObject(
										Object.assign( unitone, {
											headerSectionColor: undefined,
											headerSectionCustomColor: undefined,
										} )
									),
								} );
							},
							clearable: true,
						},
						{
							label: __( 'Header section background', 'unitone' ),
							colorValue:
								unitone?.headerSectionCustomBackgroundColor,
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
										headerSectionBackgroundColor: newColor,
										headerSectionCustomBackgroundColor:
											newCustomColor,
									} ),
								} );
							},
							resetAllFilter: () => {
								setAttributes( {
									unitone: cleanEmptyObject(
										Object.assign( unitone, {
											headerSectionBackgroundColor:
												undefined,
											headerSectionCustomBackgroundColor:
												undefined,
										} )
									),
								} );
							},
							clearable: true,
						},
						{
							label: __( 'Footer section text', 'unitone' ),
							colorValue: unitone?.footerSectionCustomColor,
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
										footerSectionColor: newColor,
										footerSectionCustomColor:
											newCustomColor,
									} ),
								} );
							},
							resetAllFilter: () => {
								setAttributes( {
									unitone: cleanEmptyObject(
										Object.assign( unitone, {
											footerSectionColor: undefined,
											footerSectionCustomColor: undefined,
										} )
									),
								} );
							},
							clearable: true,
						},
						{
							label: __( 'Footer section background', 'unitone' ),
							colorValue:
								unitone?.footerSectionCustomBackgroundColor,
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
										footerSectionBackgroundColor: newColor,
										footerSectionCustomBackgroundColor:
											newCustomColor,
									} ),
								} );
							},
							resetAllFilter: () => {
								setAttributes( {
									unitone: cleanEmptyObject(
										Object.assign( unitone, {
											footerSectionBackgroundColor:
												undefined,
											footerSectionCustomBackgroundColor:
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
		</>
	);
};

const withInspectorControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const dropdownMenuProps = useToolsPanelDropdownMenuProps();

		if ( ! props.isSelected || 'core/table' !== props.name ) {
			return <BlockEdit { ...props } />;
		}

		const defaultValue = wp.data
			.select( blocksStore )
			.getBlockType( props.name ).blockType?.attributes?.unitone
			?.cellMinWidth?.default;

		return (
			<>
				<BlockEdit { ...props } />

				<InspectorControls>
					<ToolsPanel
						label={ __( 'unitone', 'unitone' ) }
						dropdownMenuProps={ dropdownMenuProps }
					>
						<ToolsPanelItem
							hasValue={ () =>
								props.attributes?.unitone?.cellMinWidth !==
								defaultValue
							}
							label={ __( 'Cell Min Width', 'unitone' ) }
							onDeselect={ () => {
								props.setAttributes( {
									unitone: cleanEmptyObject( {
										...props.attributes?.unitone,
										cellMinWidth: defaultValue,
									} ),
								} );
							} }
							isShownByDefault
						>
							<TextControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Cell Min Width', 'unitone' ) }
								value={
									props.attributes?.unitone?.cellMinWidth ||
									''
								}
								onChange={ ( newValue ) => {
									props.setAttributes( {
										unitone: cleanEmptyObject( {
											...props.attributes?.unitone,
											cellMinWidth:
												newValue ?? defaultValue,
										} ),
									} );
								} }
							/>
						</ToolsPanelItem>
					</ToolsPanel>
				</InspectorControls>

				<ColorInspectorControls { ...props } />
			</>
		);
	};
}, 'withInspectorControls' );

addFilter(
	'editor.BlockEdit',
	'unitone/core/table/with-inspector-controls',
	withInspectorControls
);
