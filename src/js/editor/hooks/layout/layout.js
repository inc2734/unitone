/*
 * @see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/dimensions.js
 */

import fastDeepEqual from 'fast-deep-equal/es6';

import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { BlockControls, InspectorControls } from '@wordpress/block-editor';
import { memo, useCallback } from '@wordpress/element';
import { sprintf, __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

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
	useAlignItemsBlockProps,
	useJustifyContentBlockProps,
	useJustifyContentColumnBlockProps,
	useBlockAlignBlockProps,
	useFlexBasisBlockProps,
	useFlexGrowBlockProps,
	useFlexShrinkBlockProps,
	useMaxWidthBlockProps,
	useMaxHeightBlockProps,
	useMinHeightBlockProps,
	useAutoRepeatBlockProps,
	useAlignSelfBlockProps,
	useJustifySelfBlockProps,
	useGridColumnBlockProps,
	useGridRowBlockProps,
};

function LayoutPanelPure( {
	clientId,
	name,
	unitone,
	__unstableUnitoneSupports,
	setAttributes,
} ) {
	const props = {
		clientId,
		name,
		unitone,
		__unstableUnitoneSupports,
		setAttributes,
	};

	const resetAll = useCallback( ( filters ) => {
		const newUnitone = filters.reduce(
			( accumulator, filter ) =>
				filter( { unitone: accumulator } )?.unitone,
			unitone
		);

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	}, [] );

	const isJustifyContentDisabled = useIsJustifyContentDisabled( { name } );
	const isJustifyContentColumnDisabled = useIsJustifyContentColumnDisabled( {
		name,
	} );
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
		isAlignItemsDisabled &&
		isBlockAlignDisabled &&
		isFlexBasisDisabled &&
		isFlexGrowDisabled &&
		isFlexShrinkDisabled &&
		isMaxWidthDisabled &&
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
				! isAlignItemsDisabled ||
				! isBlockAlignDisabled ||
				! isFlexBasisDisabled ||
				! isFlexGrowDisabled ||
				! isFlexShrinkDisabled ||
				! isMaxWidthDisabled ||
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
								resetAllFilter={ resetJustifyContentFilter }
								isShownByDefault
								panelId={ clientId }
							>
								<JustifyContentEdit
									{ ...props }
									label={
										<>
											{ getJustifyContentEditLabel( {
												...props,
											} ) }
											&nbsp;:&nbsp;
											<code>justify-content</code>
										</>
									}
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
								resetAllFilter={
									resetJustifyContentColumnFilter
								}
								isShownByDefault
								panelId={ clientId }
							>
								<JustifyContentColumnEdit
									{ ...props }
									label={
										<>
											{ getJustifyContentColumnEditLabel(
												{ ...props }
											) }
											&nbsp;:&nbsp;
											<code>justify-content</code>
										</>
									}
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
								resetAllFilter={ resetAlignItemsFilter }
								isShownByDefault
								panelId={ clientId }
							>
								<AlignItemsEdit
									{ ...props }
									label={
										<>
											{ getAlignItemsEditLabel( {
												...props,
											} ) }
											&nbsp;:&nbsp;
											<code>align-items</code>
										</>
									}
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
								resetAllFilter={ resetBlockAlignFilter }
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
								resetAllFilter={ resetFlexGrowFilter }
								isShownByDefault
								panelId={ clientId }
							>
								<FlexGrowEdit
									{ ...props }
									label={
										<>
											{ getFlexGrowEditLabel( {
												...props,
											} ) }
											&nbsp;:&nbsp;
											<code>flex-grow</code>
										</>
									}
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
								resetAllFilter={ resetFlexShrinkFilter }
								isShownByDefault
								panelId={ clientId }
							>
								<FlexShrinkEdit
									{ ...props }
									label={
										<>
											{ getFlexShrinkEditLabel( {
												...props,
											} ) }
											&nbsp;:&nbsp;
											<code>flex-shrink</code>
										</>
									}
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
								resetAllFilter={ resetFlexBasisFilter }
								isShownByDefault
								panelId={ clientId }
							>
								<FlexBasisEdit
									{ ...props }
									label={
										<>
											{ getFlexBasisEditLabel( {
												...props,
											} ) }
											&nbsp;:&nbsp;<code>flex-basis</code>
										</>
									}
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
								resetAllFilter={ resetMaxWidthFilter }
								isShownByDefault
								panelId={ clientId }
							>
								<MaxWidthEdit
									{ ...props }
									label={
										<>
											{ getMaxWidthEditLabel( {
												...props,
											} ) }
											&nbsp;:&nbsp;
											<code>max-width</code>
										</>
									}
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
								resetAllFilter={ resetMaxHeightFilter }
								isShownByDefault
								panelId={ clientId }
							>
								<MaxHeightEdit
									{ ...props }
									label={
										<>
											{ getMaxHeightEditLabel( {
												...props,
											} ) }
											&nbsp;:&nbsp;
											<code>max-height</code>
										</>
									}
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
								resetAllFilter={ resetMinHeightFilter }
								isShownByDefault
								panelId={ clientId }
							>
								<MinHeightEdit
									{ ...props }
									label={
										<>
											{ getMinHeightEditLabel( {
												...props,
											} ) }
											&nbsp;:&nbsp;
											<code>min-height</code>
										</>
									}
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
								resetAllFilter={ resetAutoRepeatFilter }
								isShownByDefault
								panelId={ clientId }
							>
								<AutoRepeatEdit
									{ ...props }
									label={
										<>
											{ getAutoRepeatEditLabel( {
												...props,
											} ) }
											&nbsp;:&nbsp;
											<code>auto-repeat</code>
										</>
									}
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
								resetAllFilter={ resetJustifySelfFilter }
								isShownByDefault
								panelId={ clientId }
							>
								<JustifySelfEdit
									{ ...props }
									label={
										<>
											{ getJustifySelfEditLabel( {
												...props,
											} ) }
											&nbsp;:&nbsp;
											<code>justify-self</code>
										</>
									}
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
								resetAllFilter={ resetAlignSelfFilter }
								isShownByDefault
								panelId={ clientId }
							>
								<AlignSelfEdit
									{ ...props }
									label={
										<>
											{ getAlignSelfEditLabel( {
												...props,
											} ) }
											&nbsp;:&nbsp;
											<code>align-self</code>
										</>
									}
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
								resetAllFilter={ resetGridColumnFilter }
								isShownByDefault
								panelId={ clientId }
							>
								<GridColumnEdit
									{ ...props }
									label={
										<>
											{ getGridColumnEditLabel( {
												...props,
											} ) }
											&nbsp;:&nbsp;
											<code>grid-column</code>
										</>
									}
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
								resetAllFilter={ resetGridRowFilter }
								isShownByDefault
								panelId={ clientId }
							>
								<GridRowEdit
									{ ...props }
									label={
										<>
											{ getGridRowEditLabel( {
												...props,
											} ) }
											&nbsp;:&nbsp;
											<code>grid-row</code>
										</>
									}
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
