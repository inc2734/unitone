import clsx from 'clsx';

import {
	ButtonBlockAppender,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
	__experimentalBorderRadiusControl as BorderRadiusControl,
} from '@wordpress/block-editor';

import {
	SelectControl,
	RangeControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { memo, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import {
	normalizeForRangeControl,
	normalizeForSelectControl,
	normalizeForUnitControl,
	useToolsPanelDropdownMenuProps,
} from '../../js/editor/hooks/utils';

import metadata from './block.json';
import {
	getTextureStyle,
	getTextureTypeDefaultAttributes,
	isTextureSettingEnabled,
	typeOptions,
} from './utils';

const MemoizedButtonBlockAppender = memo( ButtonBlockAppender );

export default function ( { attributes, setAttributes, clientId } ) {
	const {
		type,
		color,
		customColor,
		gap,
		size,
		shapeSize,
		offset,
		radius,
		templateLock,
	} = attributes;

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
		style: getTextureStyle( {
			type,
			color,
			customColor,
			gap,
			size,
			shapeSize,
			offset,
			radius,
		} ),
	} );
	blockProps[ 'data-unitone-layout' ] = clsx(
		'texture',
		blockProps[ 'data-unitone-layout' ],
		{
			[ `-texture:${ type }` ]: !! type,
		}
	);

	const renderAppender = useCallback(
		() => <MemoizedButtonBlockAppender rootClientId={ clientId } />,
		[ clientId ]
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock,
		renderAppender: hasInnerBlocks ? undefined : renderAppender,
	} );

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();
	const defaultType = metadata.attributes.type.default;
	const defaultTypeDefaultAttributes =
		getTextureTypeDefaultAttributes( defaultType );
	const currentTypeDefaultAttributes =
		getTextureTypeDefaultAttributes( type );

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings', 'unitone' ) }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						hasValue={ () =>
							type !== metadata.attributes.type.default
						}
						isShownByDefault
						label={ __( 'Type', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								type: defaultType,
								...defaultTypeDefaultAttributes,
							} )
						}
					>
						<SelectControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Type', 'unitone' ) }
							options={ [ ...typeOptions ].map( ( o ) => ( {
								label: o.label,
								value: o.value,
							} ) ) }
							value={ normalizeForSelectControl( type ) }
							onChange={ ( newAttribute ) => {
								const newType =
									normalizeForSelectControl( newAttribute );

								setAttributes( {
									type: newType,
									...getTextureTypeDefaultAttributes(
										newType
									),
								} );
							} }
						/>
					</ToolsPanelItem>

					{ isTextureSettingEnabled( type, 'color' ) && (
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
												( c ) =>
													newAttribute === c.color
											)?.[ 0 ];
											const newColor = colorObject?.slug;
											const newCustomColor =
												colorObject?.color ||
												newAttribute;

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
					) }

					{ isTextureSettingEnabled( type, 'gap' ) && (
						<ToolsPanelItem
							hasValue={ () =>
								gap !== currentTypeDefaultAttributes.gap
							}
							isShownByDefault
							label={ __( 'Gap', 'unitone' ) }
							onDeselect={ () =>
								setAttributes( {
									gap: currentTypeDefaultAttributes.gap,
								} )
							}
						>
							<RangeControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Gap', 'unitone' ) }
								value={ normalizeForRangeControl( gap ) }
								onChange={ ( newAttribute ) =>
									setAttributes( {
										gap: normalizeForRangeControl(
											newAttribute
										),
									} )
								}
								min={ 1 }
								max={ 500 }
								step={ 1 }
							/>
						</ToolsPanelItem>
					) }

					{ isTextureSettingEnabled( type, 'size' ) && (
						<ToolsPanelItem
							hasValue={ () =>
								size !== currentTypeDefaultAttributes.size
							}
							isShownByDefault
							label={ __( 'Size', 'unitone' ) }
							onDeselect={ () =>
								setAttributes( {
									size: currentTypeDefaultAttributes.size,
								} )
							}
						>
							<RangeControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Size', 'unitone' ) }
								value={ normalizeForRangeControl( size ) }
								onChange={ ( newAttribute ) =>
									setAttributes( {
										size: normalizeForRangeControl(
											newAttribute
										),
									} )
								}
								min={ 1 }
								max={ 500 }
								step={ 1 }
							/>
						</ToolsPanelItem>
					) }

					{ isTextureSettingEnabled( type, 'shapeSize' ) && (
						<ToolsPanelItem
							hasValue={ () =>
								JSON.stringify( shapeSize ) !==
								JSON.stringify(
									currentTypeDefaultAttributes.shapeSize
								)
							}
							isShownByDefault
							label={ __( 'Size', 'unitone' ) }
							onDeselect={ () =>
								setAttributes( {
									shapeSize: {
										...currentTypeDefaultAttributes.shapeSize,
									},
								} )
							}
						>
							<div style={ { display: 'grid', gap: '13px' } }>
								<UnitControl
									__next40pxDefaultSize
									label={ __( 'Top size', 'unitone' ) }
									min={ 0 }
									value={ normalizeForUnitControl(
										shapeSize?.top
									) }
									onChange={ ( value ) =>
										setAttributes( {
											shapeSize: {
												...shapeSize,
												top: normalizeForUnitControl(
													value
												),
											},
										} )
									}
								/>

								<UnitControl
									__next40pxDefaultSize
									label={ __( 'Bottom size', 'unitone' ) }
									min={ 0 }
									value={ normalizeForUnitControl(
										shapeSize?.bottom
									) }
									onChange={ ( value ) =>
										setAttributes( {
											shapeSize: {
												...shapeSize,
												bottom: normalizeForUnitControl(
													value
												),
											},
										} )
									}
								/>
							</div>
						</ToolsPanelItem>
					) }

					{ isTextureSettingEnabled( type, 'offset' ) && (
						<ToolsPanelItem
							hasValue={ () =>
								JSON.stringify( offset ) !==
								JSON.stringify(
									currentTypeDefaultAttributes.offset
								)
							}
							isShownByDefault
							label={ __( 'Offset', 'unitone' ) }
							onDeselect={ () =>
								setAttributes( {
									offset: {
										...currentTypeDefaultAttributes.offset,
									},
								} )
							}
						>
							<div style={ { display: 'grid', gap: '13px' } }>
								<UnitControl
									__next40pxDefaultSize
									label={ __(
										'Distance from top',
										'unitone'
									) }
									min={ 0 }
									value={ normalizeForUnitControl(
										offset?.top
									) }
									onChange={ ( value ) =>
										setAttributes( {
											offset: {
												...offset,
												top: normalizeForUnitControl(
													value
												),
											},
										} )
									}
								/>

								<UnitControl
									__next40pxDefaultSize
									label={ __(
										'Distance from right',
										'unitone'
									) }
									min={ 0 }
									value={ normalizeForUnitControl(
										offset?.right
									) }
									onChange={ ( value ) =>
										setAttributes( {
											offset: {
												...offset,
												right: normalizeForUnitControl(
													value
												),
											},
										} )
									}
								/>

								<UnitControl
									__next40pxDefaultSize
									label={ __(
										'Distance from bottom',
										'unitone'
									) }
									min={ 0 }
									value={ normalizeForUnitControl(
										offset?.bottom
									) }
									onChange={ ( value ) =>
										setAttributes( {
											offset: {
												...offset,
												bottom: normalizeForUnitControl(
													value
												),
											},
										} )
									}
								/>

								<UnitControl
									__next40pxDefaultSize
									label={ __(
										'Distance from left',
										'unitone'
									) }
									min={ 0 }
									value={ normalizeForUnitControl(
										offset?.left
									) }
									onChange={ ( value ) =>
										setAttributes( {
											offset: {
												...offset,
												left: normalizeForUnitControl(
													value
												),
											},
										} )
									}
								/>
							</div>
						</ToolsPanelItem>
					) }

					{ isTextureSettingEnabled( type, 'radius' ) && (
						<ToolsPanelItem
							hasValue={ () =>
								JSON.stringify( radius ) !==
								JSON.stringify(
									currentTypeDefaultAttributes.radius
								)
							}
							isShownByDefault
							label={ __( 'Border radius', 'unitone' ) }
							onDeselect={ () =>
								setAttributes( {
									radius: {
										...currentTypeDefaultAttributes.radius,
									},
								} )
							}
						>
							<BorderRadiusControl
								values={ radius }
								onChange={ ( newAttribute ) =>
									setAttributes( {
										radius: newAttribute,
									} )
								}
							/>
						</ToolsPanelItem>
					) }
				</ToolsPanel>
			</InspectorControls>

			<div { ...innerBlocksProps } />
		</>
	);
}
