/*
 * @see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/dimensions.js
 */

import fastDeepEqual from 'fast-deep-equal/es6';

import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { BlockControls, InspectorControls } from '@wordpress/block-editor';
import { memo } from '@wordpress/element';
import { sprintf, __ } from '@wordpress/i18n';

import { cleanEmptyObject, useToolsPanelDropdownMenuProps } from '../utils';

import {
	useIsJustifyContentDisabled,
	hasJustifyContentValue,
	resetJustifyContentFilter,
	resetJustifyContent,
	JustifyContentToolbar,
	getJustifyContentEditLabel,
	JustifyContentEdit,
	useJustifyContentBlockProps,
} from './justify-content';

import {
	useIsJustifyItemsDisabled,
	hasJustifyItemsValue,
	resetJustifyItemsFilter,
	resetJustifyItems,
	JustifyItemsToolbar,
	getJustifyItemsEditLabel,
	JustifyItemsEdit,
	useJustifyItemsBlockProps,
} from './justify-items';

import {
	useIsJustifyContentColumnDisabled,
	hasJustifyContentColumnValue,
	resetJustifyContentColumnFilter,
	resetJustifyContentColumn,
	JustifyContentColumnToolbar,
	getJustifyContentColumnEditLabel,
	JustifyContentColumnEdit,
	useJustifyContentColumnBlockProps,
} from './justify-content-column';

import {
	useIsAlignContentDisabled,
	hasAlignContentValue,
	resetAlignContentFilter,
	resetAlignContent,
	AlignContentToolbar,
	getAlignContentEditLabel,
	AlignContentEdit,
	useAlignContentBlockProps,
} from './align-content';

import {
	useIsAlignItemsDisabled,
	hasAlignItemsValue,
	resetAlignItemsFilter,
	resetAlignItems,
	AlignItemsToolbar,
	getAlignItemsEditLabel,
	AlignItemsEdit,
	useAlignItemsBlockProps,
} from './align-items';

import {
	useIsBlockAlignDisabled,
	hasBlockAlignValue,
	resetBlockAlignFilter,
	resetBlockAlign,
	BlockAlignToolbar,
	getBlockAlignEditLabel,
	BlockAlignEdit,
	useBlockAlignBlockProps,
} from './block-align';

import {
	useIsFlexBasisDisabled,
	hasFlexBasisValue,
	resetFlexBasisFilter,
	resetFlexBasis,
	getFlexBasisEditLabel,
	FlexBasisEdit,
	useFlexBasisBlockProps,
} from './flex-basis';

import {
	useIsFlexGrowDisabled,
	hasFlexGrowValue,
	resetFlexGrowFilter,
	resetFlexGrow,
	getFlexGrowEditLabel,
	FlexGrowEdit,
	useFlexGrowBlockProps,
} from './flex-grow';

import {
	useIsFlexShrinkDisabled,
	hasFlexShrinkValue,
	resetFlexShrinkFilter,
	resetFlexShrink,
	getFlexShrinkEditLabel,
	FlexShrinkEdit,
	useFlexShrinkBlockProps,
} from './flex-shrink';

import {
	useIsMaxWidthDisabled,
	hasMaxWidthValue,
	resetMaxWidthFilter,
	resetMaxWidth,
	getMaxWidthEditLabel,
	MaxWidthEdit,
	useMaxWidthBlockProps,
} from './max-width';

import {
	useIsMinWidthDisabled,
	hasMinWidthValue,
	resetMinWidthFilter,
	resetMinWidth,
	getMinWidthEditLabel,
	MinWidthEdit,
	useMinWidthBlockProps,
} from './min-width';

import {
	useIsMaxHeightDisabled,
	hasMaxHeightValue,
	resetMaxHeightFilter,
	resetMaxHeight,
	getMaxHeightEditLabel,
	MaxHeightEdit,
	useMaxHeightBlockProps,
} from './max-height';

import {
	useIsMinHeightDisabled,
	hasMinHeightValue,
	resetMinHeightFilter,
	resetMinHeight,
	getMinHeightEditLabel,
	MinHeightEdit,
	useMinHeightBlockProps,
} from './min-height';

import {
	useIsAutoRepeatDisabled,
	hasAutoRepeatValue,
	resetAutoRepeatFilter,
	resetAutoRepeat,
	getAutoRepeatEditLabel,
	AutoRepeatEdit,
	useAutoRepeatBlockProps,
} from './auto-repeat';

import {
	useIsAlignSelfDisabled,
	hasAlignSelfValue,
	resetAlignSelfFilter,
	resetAlignSelf,
	AlignSelfToolbar,
	getAlignSelfEditLabel,
	AlignSelfEdit,
	useAlignSelfBlockProps,
} from './align-self';

import {
	useIsJustifySelfDisabled,
	hasJustifySelfValue,
	resetJustifySelfFilter,
	resetJustifySelf,
	JustifySelfToolbar,
	getJustifySelfEditLabel,
	JustifySelfEdit,
	useJustifySelfBlockProps,
} from './justify-self';

import {
	useIsGridColumnDisabled,
	hasGridColumnValue,
	resetGridColumnFilter,
	resetGridColumn,
	getGridColumnEditLabel,
	GridColumnEdit,
	useGridColumnBlockProps,
} from './grid-column';

import {
	useIsGridRowDisabled,
	hasGridRowValue,
	resetGridRowFilter,
	resetGridRow,
	getGridRowEditLabel,
	GridRowEdit,
	useGridRowBlockProps,
} from './grid-row';

export {
	useAlignContentBlockProps,
	useAlignItemsBlockProps,
	useJustifyContentBlockProps,
	useJustifyContentColumnBlockProps,
	useJustifyItemsBlockProps,
	useBlockAlignBlockProps,
	useFlexBasisBlockProps,
	useFlexGrowBlockProps,
	useFlexShrinkBlockProps,
	useMaxWidthBlockProps,
	useMinWidthBlockProps,
	useMaxHeightBlockProps,
	useMinHeightBlockProps,
	useAutoRepeatBlockProps,
	useAlignSelfBlockProps,
	useJustifySelfBlockProps,
	useGridColumnBlockProps,
	useGridRowBlockProps,
};

function LayoutPanelPure( props ) {
	const { name, attributes, setAttributes, clientId } = props;
	const { __unstableUnitoneSupports } = attributes;

	const resetAll = () => {
		setAttributes( {
			unitone: cleanEmptyObject(
				Object.assign(
					{ ...attributes?.unitone },
					resetJustifyContentFilter(),
					resetJustifyContentColumnFilter(),
					resetJustifyItemsFilter(),
					resetAlignContentFilter(),
					resetAlignItemsFilter(),
					resetBlockAlignFilter(),
					resetFlexBasisFilter(),
					resetFlexGrowFilter(),
					resetFlexShrinkFilter(),
					resetMaxWidthFilter(),
					resetMinWidthFilter(),
					resetMaxHeightFilter(),
					resetMinHeightFilter(),
					resetAutoRepeatFilter(),
					resetAlignSelfFilter(),
					resetJustifySelfFilter(),
					resetGridColumnFilter(),
					resetGridRowFilter()
				)
			),
		} );
	};

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const isJustifyContentDisabled = useIsJustifyContentDisabled( { name } );
	const isJustifyContentColumnDisabled = useIsJustifyContentColumnDisabled( {
		name,
	} );
	const isJustifyItemsDisabled = useIsJustifyItemsDisabled( { name } );
	const isAlignContentDisabled = useIsAlignContentDisabled( { name } );
	const isAlignItemsDisabled = useIsAlignItemsDisabled( { name } );
	const isBlockAlignDisabled = useIsBlockAlignDisabled( { name } );
	const isFlexBasisDisabled = useIsFlexBasisDisabled( {
		name,
		__unstableUnitoneSupports,
	} );
	const isFlexGrowDisabled = useIsFlexGrowDisabled( {
		name,
		__unstableUnitoneSupports,
	} );
	const isFlexShrinkDisabled = useIsFlexShrinkDisabled( {
		name,
		__unstableUnitoneSupports,
	} );
	const isMaxWidthDisabled = useIsMaxWidthDisabled( {
		name,
		__unstableUnitoneSupports,
	} );
	const isMinWidthDisabled = useIsMinWidthDisabled( {
		name,
		__unstableUnitoneSupports,
	} );
	const isMaxHeightDisabled = useIsMaxHeightDisabled( {
		name,
		__unstableUnitoneSupports,
	} );
	const isMinHeightDisabled = useIsMinHeightDisabled( {
		name,
		__unstableUnitoneSupports,
	} );
	const isAutoRepeatDisabled = useIsAutoRepeatDisabled( { name } );
	const isAlignSelfDisabled = useIsAlignSelfDisabled( {
		name,
		__unstableUnitoneSupports,
	} );
	const isJustifySelfDisabled = useIsJustifySelfDisabled( {
		name,
		__unstableUnitoneSupports,
	} );
	const isGridColumnDisabled = useIsGridColumnDisabled( {
		name,
		__unstableUnitoneSupports,
	} );
	const isGridRowDisabled = useIsGridRowDisabled( {
		name,
		__unstableUnitoneSupports,
	} );

	if (
		isJustifyContentDisabled &&
		isJustifyContentColumnDisabled &&
		isJustifyItemsDisabled &&
		isAlignContentDisabled &&
		isAlignItemsDisabled &&
		isBlockAlignDisabled &&
		isFlexBasisDisabled &&
		isFlexGrowDisabled &&
		isFlexShrinkDisabled &&
		isMaxWidthDisabled &&
		isMinWidthDisabled &&
		isMaxHeightDisabled &&
		isMinHeightDisabled &&
		isAutoRepeatDisabled &&
		isAlignSelfDisabled &&
		isJustifySelfDisabled &&
		isGridColumnDisabled &&
		isGridRowDisabled
	) {
		return null;
	}

	return (
		<>
			{ ( ! isJustifyContentDisabled ||
				! isJustifyContentColumnDisabled ||
				! isJustifyItemsDisabled ||
				! isAlignContentDisabled ||
				! isAlignItemsDisabled ||
				! isJustifySelfDisabled ||
				! isAlignSelfDisabled ||
				! isBlockAlignDisabled ) && (
				<BlockControls group="block">
					{ ! isJustifyContentDisabled && (
						<JustifyContentToolbar { ...props } />
					) }
					{ ! isJustifyContentColumnDisabled && (
						<JustifyContentColumnToolbar { ...props } />
					) }
					{ ! isJustifyItemsDisabled && (
						<JustifyItemsToolbar { ...props } />
					) }
					{ ! isAlignContentDisabled && (
						<AlignContentToolbar { ...props } />
					) }
					{ ! isAlignItemsDisabled && (
						<AlignItemsToolbar { ...props } />
					) }
					{ ! isJustifySelfDisabled && (
						<JustifySelfToolbar { ...props } />
					) }
					{ ! isAlignSelfDisabled && (
						<AlignSelfToolbar { ...props } />
					) }
					{ ! isBlockAlignDisabled && (
						<BlockAlignToolbar { ...props } />
					) }
				</BlockControls>
			) }

			{ ( ! isJustifyContentDisabled ||
				! isJustifyContentColumnDisabled ||
				! isJustifyItemsDisabled ||
				! isAlignContentDisabled ||
				! isAlignItemsDisabled ||
				! isBlockAlignDisabled ||
				! isFlexBasisDisabled ||
				! isFlexGrowDisabled ||
				! isFlexShrinkDisabled ||
				! isMaxWidthDisabled ||
				! isMinWidthDisabled ||
				! isMaxHeightDisabled ||
				! isMinHeightDisabled ||
				! isAutoRepeatDisabled ||
				! isAutoRepeatDisabled ||
				! isAlignSelfDisabled ||
				! isJustifySelfDisabled ||
				! isGridColumnDisabled ||
				! isGridRowDisabled ) && (
				<InspectorControls>
					<ToolsPanel
						label={ __( 'Layout', 'unitone' ) }
						resetAll={ resetAll }
						panelId={ clientId }
						dropdownMenuProps={ dropdownMenuProps }
					>
						{ ! isJustifyContentDisabled && (
							<ToolsPanelItem
								hasValue={ () =>
									hasJustifyContentValue( { ...props } )
								}
								label={ getJustifyContentEditLabel( {
									...props,
								} ) }
								onDeselect={ () =>
									resetJustifyContent( { ...props } )
								}
								isShownByDefault
								panelId={ clientId }
							>
								<JustifyContentEdit
									{ ...props }
									label={ getJustifyContentEditLabel( {
										...props,
										__withCode: true,
									} ) }
								/>
							</ToolsPanelItem>
						) }
						{ ! isJustifyContentColumnDisabled && (
							<ToolsPanelItem
								hasValue={ () =>
									hasJustifyContentColumnValue( { ...props } )
								}
								label={ getJustifyContentColumnEditLabel( {
									...props,
								} ) }
								onDeselect={ () =>
									resetJustifyContentColumn( { ...props } )
								}
								isShownByDefault
								panelId={ clientId }
							>
								<JustifyContentColumnEdit
									{ ...props }
									label={ getJustifyContentColumnEditLabel( {
										...props,
										__withCode: true,
									} ) }
								/>
							</ToolsPanelItem>
						) }
						{ ! isJustifyItemsDisabled && (
							<ToolsPanelItem
								hasValue={ () =>
									hasJustifyItemsValue( { ...props } )
								}
								label={ getJustifyItemsEditLabel( {
									...props,
								} ) }
								onDeselect={ () =>
									resetJustifyItems( { ...props } )
								}
								isShownByDefault
								panelId={ clientId }
							>
								<JustifyItemsEdit
									{ ...props }
									label={ getJustifyItemsEditLabel( {
										...props,
										__withCode: true,
									} ) }
								/>
							</ToolsPanelItem>
						) }
						{ ! isAlignContentDisabled && (
							<ToolsPanelItem
								hasValue={ () =>
									hasAlignContentValue( { ...props } )
								}
								label={ getAlignContentEditLabel( {
									...props,
								} ) }
								onDeselect={ () =>
									resetAlignContent( { ...props } )
								}
								isShownByDefault
								panelId={ clientId }
							>
								<AlignContentEdit
									{ ...props }
									label={ getAlignContentEditLabel( {
										...props,
										__withCode: true,
									} ) }
								/>
							</ToolsPanelItem>
						) }
						{ ! isAlignItemsDisabled && (
							<ToolsPanelItem
								hasValue={ () =>
									hasAlignItemsValue( { ...props } )
								}
								label={ getAlignItemsEditLabel( { ...props } ) }
								onDeselect={ () =>
									resetAlignItems( { ...props } )
								}
								isShownByDefault
								panelId={ clientId }
							>
								<AlignItemsEdit
									{ ...props }
									label={ getAlignItemsEditLabel( {
										...props,
										__withCode: true,
									} ) }
								/>
							</ToolsPanelItem>
						) }
						{ ! isBlockAlignDisabled && (
							<ToolsPanelItem
								hasValue={ () =>
									hasBlockAlignValue( { ...props } )
								}
								label={ getBlockAlignEditLabel( { ...props } ) }
								onDeselect={ () =>
									resetBlockAlign( { ...props } )
								}
								isShownByDefault
								panelId={ clientId }
							>
								<BlockAlignEdit
									{ ...props }
									label={ getBlockAlignEditLabel( {
										...props,
									} ) }
								/>
							</ToolsPanelItem>
						) }
						{ ! isFlexGrowDisabled && (
							<ToolsPanelItem
								hasValue={ () =>
									hasFlexGrowValue( { ...props } )
								}
								label={ getFlexGrowEditLabel( { ...props } ) }
								onDeselect={ () =>
									resetFlexGrow( { ...props } )
								}
								isShownByDefault
								panelId={ clientId }
							>
								<FlexGrowEdit
									{ ...props }
									label={ getFlexGrowEditLabel( {
										...props,
										__withCode: true,
									} ) }
								/>
							</ToolsPanelItem>
						) }
						{ ! isFlexShrinkDisabled && (
							<ToolsPanelItem
								hasValue={ () =>
									hasFlexShrinkValue( { ...props } )
								}
								label={ getFlexShrinkEditLabel( { ...props } ) }
								onDeselect={ () =>
									resetFlexShrink( { ...props } )
								}
								isShownByDefault
								panelId={ clientId }
							>
								<FlexShrinkEdit
									{ ...props }
									label={ getFlexShrinkEditLabel( {
										...props,
										__withCode: true,
									} ) }
								/>
							</ToolsPanelItem>
						) }
						{ ! isFlexBasisDisabled && (
							<ToolsPanelItem
								hasValue={ () =>
									hasFlexBasisValue( { ...props } )
								}
								label={ getFlexBasisEditLabel( { ...props } ) }
								onDeselect={ () =>
									resetFlexBasis( { ...props } )
								}
								isShownByDefault
								panelId={ clientId }
							>
								<FlexBasisEdit
									{ ...props }
									label={ getFlexBasisEditLabel( {
										...props,
										__withCode: true,
									} ) }
								/>
							</ToolsPanelItem>
						) }
						{ ! isMaxWidthDisabled && (
							<ToolsPanelItem
								hasValue={ () =>
									hasMaxWidthValue( { ...props } )
								}
								label={ getMaxWidthEditLabel( { ...props } ) }
								onDeselect={ () =>
									resetMaxWidth( { ...props } )
								}
								isShownByDefault
								panelId={ clientId }
							>
								<MaxWidthEdit
									{ ...props }
									label={ getMaxWidthEditLabel( {
										...props,
										__withCode: true,
									} ) }
								/>
							</ToolsPanelItem>
						) }
						{ ! isMinWidthDisabled && (
							<ToolsPanelItem
								hasValue={ () =>
									hasMinWidthValue( { ...props } )
								}
								label={ getMinWidthEditLabel( { ...props } ) }
								onDeselect={ () =>
									resetMinWidth( { ...props } )
								}
								isShownByDefault
								panelId={ clientId }
							>
								<MinWidthEdit
									{ ...props }
									label={ getMinWidthEditLabel( {
										...props,
										__withCode: true,
									} ) }
								/>
							</ToolsPanelItem>
						) }
						{ ! isMaxHeightDisabled && (
							<ToolsPanelItem
								hasValue={ () =>
									hasMaxHeightValue( { ...props } )
								}
								label={ getMaxHeightEditLabel( { ...props } ) }
								onDeselect={ () =>
									resetMaxHeight( { ...props } )
								}
								isShownByDefault
								panelId={ clientId }
							>
								<MaxHeightEdit
									{ ...props }
									label={ getMaxHeightEditLabel( {
										...props,
										__withCode: true,
									} ) }
								/>
							</ToolsPanelItem>
						) }
						{ ! isMinHeightDisabled && (
							<ToolsPanelItem
								hasValue={ () =>
									hasMinHeightValue( { ...props } )
								}
								label={ getMinHeightEditLabel( { ...props } ) }
								onDeselect={ () =>
									resetMinHeight( { ...props } )
								}
								isShownByDefault
								panelId={ clientId }
							>
								<MinHeightEdit
									{ ...props }
									label={ getMinHeightEditLabel( {
										...props,
										__withCode: true,
									} ) }
								/>
							</ToolsPanelItem>
						) }
						{ ! isAutoRepeatDisabled && (
							<ToolsPanelItem
								hasValue={ () =>
									hasAutoRepeatValue( { ...props } )
								}
								label={ getAutoRepeatEditLabel( { ...props } ) }
								onDeselect={ () =>
									resetAutoRepeat( { ...props } )
								}
								isShownByDefault
								panelId={ clientId }
							>
								<AutoRepeatEdit
									{ ...props }
									label={ getAutoRepeatEditLabel( {
										...props,
										__withCode: true,
									} ) }
								/>
							</ToolsPanelItem>
						) }
						{ ! isJustifySelfDisabled && (
							<ToolsPanelItem
								hasValue={ () =>
									hasJustifySelfValue( { ...props } )
								}
								label={ getJustifySelfEditLabel( {
									...props,
								} ) }
								onDeselect={ () =>
									resetJustifySelf( { ...props } )
								}
								isShownByDefault
								panelId={ clientId }
							>
								<JustifySelfEdit
									{ ...props }
									label={ getJustifySelfEditLabel( {
										...props,
										__withCode: true,
									} ) }
								/>
							</ToolsPanelItem>
						) }
						{ ! isAlignSelfDisabled && (
							<ToolsPanelItem
								hasValue={ () =>
									hasAlignSelfValue( { ...props } )
								}
								label={ getAlignSelfEditLabel( { ...props } ) }
								onDeselect={ () =>
									resetAlignSelf( { ...props } )
								}
								isShownByDefault
								panelId={ clientId }
							>
								<AlignSelfEdit
									{ ...props }
									label={ getAlignSelfEditLabel( {
										...props,
										__withCode: true,
									} ) }
								/>
							</ToolsPanelItem>
						) }
						{ ! isGridColumnDisabled && (
							<ToolsPanelItem
								hasValue={ () =>
									hasGridColumnValue( { ...props } )
								}
								label={ getGridColumnEditLabel( { ...props } ) }
								onDeselect={ () =>
									resetGridColumn( { ...props } )
								}
								isShownByDefault
								panelId={ clientId }
							>
								<GridColumnEdit
									{ ...props }
									label={ getGridColumnEditLabel( {
										...props,
										__withCode: true,
									} ) }
									help={
										<span
											dangerouslySetInnerHTML={ {
												__html: sprintf(
													// translators: %1$s: <code>, %2$s: </code>
													__(
														'For example, enter %1$s1 / -2%2$s (fill from the first grid line to the second-to-last grid line).',
														'unitone'
													),
													'<code>',
													'</code>'
												),
											} }
										/>
									}
								/>
							</ToolsPanelItem>
						) }
						{ ! isGridRowDisabled && (
							<ToolsPanelItem
								hasValue={ () =>
									hasGridRowValue( { ...props } )
								}
								label={ getGridRowEditLabel( { ...props } ) }
								onDeselect={ () =>
									resetGridRow( { ...props } )
								}
								isShownByDefault
								panelId={ clientId }
							>
								<GridRowEdit
									{ ...props }
									label={ getGridRowEditLabel( {
										...props,
										__withCode: true,
									} ) }
									help={
										<span
											dangerouslySetInnerHTML={ {
												__html: sprintf(
													// translators: %1$s: <code>, %2$s: </code>
													__(
														'For example, enter %1$s1 / -2%2$s (fill from the first grid line to the second-to-last grid line).',
														'unitone'
													),
													'<code>',
													'</code>'
												),
											} }
										/>
									}
								/>
							</ToolsPanelItem>
						) }
					</ToolsPanel>
				</InspectorControls>
			) }
		</>
	);
}

export const LayoutPanel = memo( LayoutPanelPure, ( oldProps, newProps ) =>
	fastDeepEqual( oldProps, newProps )
);
