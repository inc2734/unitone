import clsx from 'clsx';

import {
	ButtonBlockAppender,
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	store as blockEditorStore,
	withColors,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
	__experimentalUnitControl as UnitControl,
	__experimentalUseCustomUnits as useCustomUnits,
} from '@wordpress/components';

import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, memo, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { useToolsPanelDropdownMenuProps } from '../../js/editor/hooks/utils';

import iconDotMain from './icons/dot-main';
import iconDotSubMain from './icons/dot-sub-main';
import iconSubDotMain from './icons/sub-dot-main';

import metadata from './block.json';

const MemoizedButtonBlockAppender = memo( ButtonBlockAppender );

function Edit( {
	attributes,
	setAttributes,
	clientId,
	dotColor,
	setDotColor,
	lineColor,
	setLineColor,
} ) {
	const {
		rows,
		columnLayout,
		dotSize,
		lineWidth,
		allowedBlocks,
		templateLock,
	} = attributes;

	const innerBlocks = useSelect(
		( select ) =>
			select( blockEditorStore ).getBlock( clientId )?.innerBlocks,
		[ clientId ]
	);
	const innerBlocksLength = innerBlocks?.length;
	const hasInnerBlocks = !! innerBlocksLength;

	useEffect( () => {
		setAttributes( { rows: String( innerBlocksLength ) } );
	}, [ innerBlocksLength ] );

	const { updateBlockAttributes } = useDispatch( blockEditorStore );

	useEffect( () => {
		innerBlocks.forEach( ( rowBlock ) => {
			if ( !! rowBlock.innerBlocks[ 0 ]?.clientId ) {
				updateBlockAttributes( rowBlock.innerBlocks[ 0 ].clientId, {
					nonentity: 'dot-main' === columnLayout,
				} );
			}
		} );
	}, [ columnLayout ] );

	const blockProps = useBlockProps( {
		className: clsx( 'unitone-timeline-dots', {
			[ `unitone-timeline-dots--column-layout:${ columnLayout }` ]:
				!! columnLayout,
		} ),
		style: {
			'--unitone--timeline-dots-rows': rows,
			'--unitone--dot-size': dotSize || undefined,
			'--unitone--line-width': lineWidth || undefined,
			'--unitone--dot-color': dotColor?.slug
				? `var(--wp--preset--color--${ dotColor?.slug } )`
				: dotColor?.color,
			'--unitone--line-color': lineColor?.slug
				? `var(--wp--preset--color--${ lineColor?.slug } )`
				: lineColor?.color,
		},
	} );

	const renderAppender = useCallback(
		() => <MemoizedButtonBlockAppender rootClientId={ clientId } />,
		[ clientId ]
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock,
		allowedBlocks,
		renderAppender: hasInnerBlocks ? undefined : renderAppender,
		template: [
			[
				'unitone/timeline-dots-row',
				{},
				[
					[ 'unitone/timeline-dots-column', { type: 'aside' } ],
					[ 'unitone/timeline-dots-column', { type: 'main' } ],
				],
			],
		],
	} );

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const units = useCustomUnits( {
		availableUnits: [ 'px', 'em', 'rem' ],
	} );

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings', 'unitone' ) }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						hasValue={ () =>
							columnLayout !==
							metadata.attributes.columnLayout.default
						}
						isShownByDefault
						label={ __( 'Column layout', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								columnLayout:
									metadata.attributes.columnLayout.default,
							} )
						}
					>
						<ToggleGroupControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Column layout', 'unitone' ) }
							value={ columnLayout }
							isBlock
							onChange={ ( value ) =>
								setAttributes( { columnLayout: value } )
							}
						>
							<ToggleGroupControlOptionIcon
								value="dot-sub-main"
								label={ __( 'Dot - Sub - Main', 'unitone' ) }
								icon={ iconDotSubMain }
							/>
							<ToggleGroupControlOptionIcon
								value="sub-dot-main"
								label={ __( 'Sub - Dot - Main', 'unitone' ) }
								icon={ iconSubDotMain }
							/>
							<ToggleGroupControlOptionIcon
								value="dot-main"
								label={ __( 'Dot - Main', 'unitone' ) }
								icon={ iconDotMain }
							/>
						</ToggleGroupControl>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							dotSize !== metadata.attributes.dotSize.default
						}
						isShownByDefault
						label={ __( 'Dot size', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								dotSize: metadata.attributes.dotSize.default,
							} )
						}
					>
						<UnitControl
							__next40pxDefaultSize
							label={ __( 'Dot size', 'unitone' ) }
							value={ dotSize || '' }
							units={ units }
							onChange={ ( value ) =>
								setAttributes( {
									dotSize: value,
								} )
							}
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							lineWidth !== metadata.attributes.lineWidth.default
						}
						isShownByDefault
						label={ __( 'Line width', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								lineWidth:
									metadata.attributes.lineWidth.default,
							} )
						}
					>
						<UnitControl
							__next40pxDefaultSize
							label={ __( 'Line width', 'unitone' ) }
							value={ lineWidth || '' }
							units={ units }
							onChange={ ( value ) =>
								setAttributes( {
									lineWidth: value,
								} )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<InspectorControls group="color">
				<ColorGradientSettingsDropdown
					__experimentalIsRenderedInSidebar
					settings={ [
						{
							label: __( 'Dot color', 'unitone' ),
							colorValue: dotColor.color,
							onColorChange: setDotColor,
							clearable: true,
						},
						{
							label: __( 'Line color', 'unitone' ),
							colorValue: lineColor.color,
							onColorChange: setLineColor,
							clearable: true,
						},
					] }
					panelId={ clientId }
					{ ...useMultipleOriginColorsAndGradients() }
					gradients={ [] }
					disableCustomGradients
				/>
			</InspectorControls>

			<div { ...innerBlocksProps } />
		</>
	);
}

export default withColors( {
	dotColor: 'background-color',
	lineColor: 'background-color',
} )( Edit );
