import clsx from 'clsx';

import { InspectorControls, useBlockProps } from '@wordpress/block-editor';

import {
	SelectControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';

import { __ } from '@wordpress/i18n';

import {
	normalizeForSelectControl,
	normalizeForToggleGroupControl,
	normalizeForUnitControl,
	useToolsPanelDropdownMenuProps,
} from '../../js/editor/hooks/utils';

import metadata from './block.json';

export default function ( { attributes, setAttributes } ) {
	const { type, direction, size } = attributes;

	const blockProps = useBlockProps( {
		'data-unitone-layout': 'divider-wrapper',
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
							options={ [
								{
									label: __( 'Solid', 'unitone' ),
									value: 'solid',
								},
								{
									label: __( 'Dashed', 'unitone' ),
									value: 'dashed',
								},
								{
									label: __( 'Dotted', 'unitone' ),
									value: 'dotted',
								},
								{
									label: __( 'Slash', 'unitone' ),
									value: 'slash',
								},
								{
									label: __( 'Stripe', 'unitone' ),
									value: 'stripe',
								},
							] }
							value={ normalizeForSelectControl( type ) }
							onChange={ ( newAttribute ) =>
								setAttributes( {
									type: normalizeForSelectControl(
										newAttribute
									),
								} )
							}
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							direction !== metadata.attributes.direction.default
						}
						isShownByDefault
						label={ __( 'Direction', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								direction:
									metadata.attributes.direction.default,
							} )
						}
					>
						<ToggleGroupControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							isBlock
							label={ __( 'Direction', 'unitone' ) }
							value={ normalizeForToggleGroupControl(
								direction
							) }
							onChange={ ( newAttribute ) =>
								setAttributes( {
									direction:
										normalizeForToggleGroupControl(
											newAttribute
										),
								} )
							}
						>
							<ToggleGroupControlOption
								label={ __( 'Horizontal', 'unitone' ) }
								value="horizontal"
							/>
							<ToggleGroupControlOption
								label={ __( 'Vertical', 'unitone' ) }
								value="vertical"
							/>
						</ToggleGroupControl>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () => !! size }
						isShownByDefault
						label={ __( 'Size', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								size: metadata.attributes.size.default,
							} )
						}
					>
						<UnitControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Size', 'unitone' ) }
							value={ normalizeForUnitControl( size ) }
							onChange={ ( newAttribute ) =>
								setAttributes( {
									size: normalizeForUnitControl(
										newAttribute
									),
								} )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<div { ...blockProps }>
				<div
					data-unitone-layout={ clsx(
						'divider',
						type && `-type:${ type }`,
						direction && `-direction:${ direction }`
					) }
					style={ { '--unitone--divider-size': size || undefined } }
				/>
			</div>
		</>
	);
}
