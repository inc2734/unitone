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

import { useToolsPanelDropdownMenuProps } from '../../js/editor/hooks/utils';

import metadata from './block.json';

const MemoizedButtonBlockAppender = memo( ButtonBlockAppender );

const typeOptions = [
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
		settings: {
			size: false,
		},
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
	{
		label: __( 'Wave', 'unitone' ),
		value: 'wave',
		settings: {
			gap: false,
			radius: false,
		},
	},
	{
		label: __( 'Solid color', 'unitone' ),
		value: 'solid-color',
		settings: {
			gap: false,
			size: false,
		},
	},
];

export default function ( { attributes, setAttributes, clientId } ) {
	const {
		type,
		color,
		customColor,
		gap,
		size,
		offset,
		radius,
		templateLock,
	} = attributes;

	const selectedTypeSettings =
		typeOptions.find( ( option ) => option.value === type )?.settings || {};
	const isSettingEnabled = ( settingKey ) =>
		selectedTypeSettings[ settingKey ] !== false;

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
			'--unitone--texture-top':
				!! offset?.top && 0 < parseInt( offset?.top )
					? offset?.top
					: undefined,
			'--unitone--texture-right':
				!! offset?.right && 0 < parseInt( offset?.right )
					? offset?.right
					: undefined,
			'--unitone--texture-bottom':
				!! offset?.bottom && 0 < parseInt( offset?.bottom )
					? offset?.bottom
					: undefined,
			'--unitone--texture-left':
				!! offset?.left && 0 < parseInt( offset?.left )
					? offset?.left
					: undefined,
			'--unitone--texture-border-top-left-radius':
				!! radius?.topLeft && 0 < parseInt( radius?.topLeft )
					? radius?.topLeft
					: undefined,
			'--unitone--texture-border-top-right-radius':
				!! radius?.topRight && 0 < parseInt( radius?.topRight )
					? radius?.topRight
					: undefined,
			'--unitone--texture-border-bottom-right-radius':
				!! radius?.bottomRight && 0 < parseInt( radius?.bottomRight )
					? radius?.bottomRight
					: undefined,
			'--unitone--texture-border-bottom-left-radius':
				!! radius?.bottomLeft && 0 < parseInt( radius?.bottomLeft )
					? radius?.bottomLeft
					: undefined,
		},
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
								type: metadata.attributes.type.default,
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
							value={ type }
							onChange={ ( newAttribute ) =>
								setAttributes( { type: newAttribute } )
							}
						/>
					</ToolsPanelItem>

					{ isSettingEnabled( 'color' ) && (
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

					{ isSettingEnabled( 'gap' ) && (
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
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Gap', 'unitone' ) }
								value={ gap }
								onChange={ ( newAttribute ) =>
									setAttributes( {
										gap: newAttribute,
									} )
								}
								min={ 1 }
								max={ 500 }
								step={ 1 }
							/>
						</ToolsPanelItem>
					) }

					{ isSettingEnabled( 'size' ) && (
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
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Size', 'unitone' ) }
								value={ size }
								onChange={ ( newAttribute ) =>
									setAttributes( {
										size: newAttribute,
									} )
								}
								min={ 1 }
								max={ 500 }
								step={ 1 }
							/>
						</ToolsPanelItem>
					) }

					{ isSettingEnabled( 'offset' ) && (
						<ToolsPanelItem
							hasValue={ () =>
								JSON.stringify( offset ) !==
								JSON.stringify(
									metadata.attributes.offset.default
								)
							}
							isShownByDefault
							label={ __( 'Offset', 'unitone' ) }
							onDeselect={ () =>
								setAttributes( {
									offset: {
										...metadata.attributes.offset.default,
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
									value={ offset?.top }
									onChange={ ( value ) =>
										setAttributes( {
											offset: {
												...offset,
												top: value,
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
									value={ offset?.right }
									onChange={ ( value ) =>
										setAttributes( {
											offset: {
												...offset,
												right: value,
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
									value={ offset?.bottom }
									onChange={ ( value ) =>
										setAttributes( {
											offset: {
												...offset,
												bottom: value,
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
									value={ offset?.left }
									onChange={ ( value ) =>
										setAttributes( {
											offset: {
												...offset,
												left: value,
											},
										} )
									}
								/>
							</div>
						</ToolsPanelItem>
					) }

					{ isSettingEnabled( 'radius' ) && (
						<ToolsPanelItem
							hasValue={ () =>
								JSON.stringify( radius ) !==
								JSON.stringify(
									metadata.attributes.radius.default
								)
							}
							isShownByDefault
							label={ __( 'Border radius', 'unitone' ) }
							onDeselect={ () =>
								setAttributes( {
									radius: {
										...metadata.attributes.radius.default,
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
