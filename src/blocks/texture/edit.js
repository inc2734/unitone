import clsx from 'clsx';

import {
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

import {
	SelectControl,
	RangeControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';

export default function ( { attributes, setAttributes, clientId } ) {
	const { type, color, customColor, gap, size, templateLock } = attributes;

	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const colors = colorGradientSettings.colors.flatMap(
		( palette ) => palette.colors
	);

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		style: {
			'--unitone--texture-color': !! color
				? `var(--wp--preset--color--${ color })`
				: customColor,
			'--unitone--texture-gap': !! gap ? `${ gap }px` : undefined,
			'--unitone--texture-size': !! size ? `${ size }px` : undefined,
		},
	} );
	blockProps[ 'data-unitone-layout' ] = clsx(
		'texture',
		blockProps[ 'data-unitone-layout' ],
		{
			[ `-texture:${ type }` ]: !! type,
		}
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock,
		renderAppender: hasInnerBlocks
			? undefined
			: InnerBlocks.ButtonBlockAppender,
	} );

	return (
		<>
			<InspectorControls>
				<ToolsPanel label={ __( 'Settings', 'unitone' ) }>
					<ToolsPanelItem
						hasValue={ () =>
							type !== metadata.attributes.type.default
						}
						isShownByDefault
						label={ __( 'Type', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								type: metadata.attributes.type.default,
							} )
						}
					>
						<SelectControl
							__nextHasNoMarginBottom
							label={ __( 'Type', 'unitone' ) }
							options={ [
								{
									label: __( 'Dots', 'unitone' ),
									value: 'dots',
								},
								{
									label: __( 'Offset dots', 'unitone' ),
									value: 'offset-dots',
								},
								{
									label: __( 'Grid', 'unitone' ),
									value: 'grid',
								},
								{
									label: __( 'Horizontal stripe', 'unitone' ),
									value: 'horizontal-stripe',
								},
								{
									label: __( 'Vertical stripe', 'unitone' ),
									value: 'vertical-stripe',
								},
								{
									label: __( 'Checker pattern', 'unitone' ),
									value: 'checker-pattern',
								},
								{
									label: __( 'Graph paper', 'unitone' ),
									value: 'graph-paper',
								},
								{
									label: __( 'Slash', 'unitone' ),
									value: 'slash',
								},
								{
									label: __( 'Backslash', 'unitone' ),
									value: 'backslash',
								},
							] }
							value={ type }
							onChange={ ( newAttribute ) =>
								setAttributes( { type: newAttribute } )
							}
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							color !== metadata.attributes.color.default
						}
						isShownByDefault
						label={ __( 'Color', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								color: metadata.attributes.color.default,
							} )
						}
					>
						<ColorGradientSettingsDropdown
							style={ { marginTop: 0 } }
							__experimentalIsRenderedInSidebar
							settings={ [
								{
									label: __( 'Color', 'unitone' ),
									colorValue: customColor,
									onColorChange: ( newAttribute ) => {
										const colorObject = colors.filter(
											( c ) => newAttribute === c.color
										)?.[ 0 ];
										const newColor = colorObject?.slug;
										const newCustomColor =
											colorObject?.color || newAttribute;

										setAttributes( {
											color: newColor,
											customColor: newCustomColor,
										} );
									},
									enableAlpha: true,
									clearable: true,
								},
							] }
							{ ...colorGradientSettings }
							gradients={ [] }
							disableCustomGradients
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							gap !== metadata.attributes.gap.default
						}
						isShownByDefault
						label={ __( 'Gap', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								gap: metadata.attributes.gap.default,
							} )
						}
					>
						<RangeControl
							__nextHasNoMarginBottom
							label={ __( 'Gap', 'unitone' ) }
							value={ gap }
							onChange={ ( newAttribute ) =>
								setAttributes( {
									gap: newAttribute,
								} )
							}
							min={ 1 }
							max={ 150 }
							step={ 1 }
						/>
					</ToolsPanelItem>

					{ 'checker-pattern' !== type && (
						<ToolsPanelItem
							hasValue={ () =>
								size !== metadata.attributes.size.default
							}
							isShownByDefault
							label={ __( 'Size', 'unitone' ) }
							onDeselect={ () =>
								setAttributes( {
									size: metadata.attributes.size.default,
								} )
							}
						>
							<RangeControl
								__nextHasNoMarginBottom
								label={ __( 'Size', 'unitone' ) }
								value={ size }
								onChange={ ( newAttribute ) =>
									setAttributes( {
										size: newAttribute,
									} )
								}
								min={ 1 }
								max={ 10 }
								step={ 1 }
							/>
						</ToolsPanelItem>
					) }
				</ToolsPanel>
			</InspectorControls>

			<div { ...innerBlocksProps } />
		</>
	);
}
