/*
 *@see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/dimensions.js
 */

import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { memo } from '@wordpress/element';

import { BlockControls, InspectorControls } from '@wordpress/block-editor';
import { sprintf, __ } from '@wordpress/i18n';

import {
	useIsJustifyContentDisabled,
	hasJustifyContentValue,
	resetJustifyContent,
	JustifyContentToolbar,
	getJustifyContentEditLabel,
	JustifyContentEdit,
	editJustifyContentProp,
} from './justify-content';

import {
	useIsJustifyContentColumnDisabled,
	hasJustifyContentColumnValue,
	resetJustifyContentColumn,
	JustifyContentColumnToolbar,
	getJustifyContentColumnEditLabel,
	JustifyContentColumnEdit,
	editJustifyContentColumnProp,
} from './justify-content-column';

import {
	useIsAlignItemsDisabled,
	hasAlignItemsValue,
	resetAlignItems,
	AlignItemsToolbar,
	getAlignItemsEditLabel,
	AlignItemsEdit,
	editAlignItemsProp,
} from './align-items';

import {
	useIsBlockAlignDisabled,
	hasBlockAlignValue,
	resetBlockAlign,
	BlockAlignToolbar,
	getBlockAlignEditLabel,
	BlockAlignEdit,
	editBlockAlignProp,
} from './block-align';

import {
	useIsFlexBasisDisabled,
	hasFlexBasisValue,
	resetFlexBasis,
	getFlexBasisEditLabel,
	FlexBasisEdit,
	editFlexBasisProp,
} from './flex-basis';

import {
	useIsFlexGrowDisabled,
	hasFlexGrowValue,
	resetFlexGrow,
	getFlexGrowEditLabel,
	FlexGrowEdit,
	editFlexGrowProp,
} from './flex-grow';

import {
	useIsFlexShrinkDisabled,
	hasFlexShrinkValue,
	resetFlexShrink,
	getFlexShrinkEditLabel,
	FlexShrinkEdit,
	editFlexShrinkProp,
} from './flex-shrink';

import {
	useIsMaxWidthDisabled,
	hasMaxWidthValue,
	resetMaxWidth,
	getMaxWidthEditLabel,
	MaxWidthEdit,
	editMaxWidthProp,
} from './max-width';

import {
	useIsMaxHeightDisabled,
	hasMaxHeightValue,
	resetMaxHeight,
	getMaxHeightEditLabel,
	MaxHeightEdit,
	editMaxHeightProp,
} from './max-height';

import {
	useIsMinHeightDisabled,
	hasMinHeightValue,
	resetMinHeight,
	getMinHeightEditLabel,
	MinHeightEdit,
	editMinHeightProp,
} from './min-height';

import {
	useIsAutoRepeatDisabled,
	hasAutoRepeatValue,
	resetAutoRepeat,
	getAutoRepeatEditLabel,
	AutoRepeatEdit,
	editAutoRepeatProp,
} from './auto-repeat';

import {
	useIsAlignSelfDisabled,
	hasAlignSelfValue,
	resetAlignSelf,
	AlignSelfToolbar,
	getAlignSelfEditLabel,
	AlignSelfEdit,
	editAlignSelfProp,
} from './align-self';

import {
	useIsJustifySelfDisabled,
	hasJustifySelfValue,
	resetJustifySelf,
	JustifySelfToolbar,
	getJustifySelfEditLabel,
	JustifySelfEdit,
	editJustifySelfProp,
} from './justify-self';

import {
	useIsGridColumnDisabled,
	hasGridColumnValue,
	resetGridColumn,
	getGridColumnEditLabel,
	GridColumnEdit,
	editGridColumnProp,
} from './grid-column';

import {
	useIsGridRowDisabled,
	hasGridRowValue,
	resetGridRow,
	getGridRowEditLabel,
	GridRowEdit,
	editGridRowProp,
} from './grid-row';

export {
	editAlignItemsProp,
	editJustifyContentProp,
	editJustifyContentColumnProp,
	editBlockAlignProp,
	editFlexBasisProp,
	editFlexGrowProp,
	editFlexShrinkProp,
	editMaxWidthProp,
	editMaxHeightProp,
	editMinHeightProp,
	editAutoRepeatProp,
	editAlignSelfProp,
	editJustifySelfProp,
	editGridColumnProp,
	editGridRowProp,
};

function LayoutPanelPure( props ) {
	const isJustifyContentDisabled = useIsJustifyContentDisabled( props );
	const isJustifyContentColumnDisabled =
		useIsJustifyContentColumnDisabled( props );
	const isAlignItemsDisabled = useIsAlignItemsDisabled( props );
	const isBlockAlignDisabled = useIsBlockAlignDisabled( props );
	const isFlexBasisDisabled = useIsFlexBasisDisabled( props );
	const isFlexGrowDisabled = useIsFlexGrowDisabled( props );
	const isFlexShrinkDisabled = useIsFlexShrinkDisabled( props );
	const isMaxWidthDisabled = useIsMaxWidthDisabled( props );
	const isMaxHeightDisabled = useIsMaxHeightDisabled( props );
	const isMinHeightDisabled = useIsMinHeightDisabled( props );
	const isAutoRepeatDisabled = useIsAutoRepeatDisabled( props );
	const isAlignSelfDisabled = useIsAlignSelfDisabled( props );
	const isJustifySelfDisabled = useIsJustifySelfDisabled( props );
	const isGridColumnDisabled = useIsGridColumnDisabled( props );
	const isGridRowDisabled = useIsGridRowDisabled( props );

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
					<ToolsPanel label={ __( 'Layout', 'unitone' ) }>
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
								isShownByDefault
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
								isShownByDefault
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
								isShownByDefault
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
								isShownByDefault
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
								isShownByDefault
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
								isShownByDefault
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
								isShownByDefault
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
								isShownByDefault
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
								isShownByDefault
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
								resetAllFilter={ () =>
									resetJustifySelf( { ...props } )
								}
								isShownByDefault={ true }
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
								resetAllFilter={ () =>
									resetAlignSelf( { ...props } )
								}
								isShownByDefault
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
								resetAllFilter={ () =>
									resetGridColumn( { ...props } )
								}
								isShownByDefault={ true }
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
								resetAllFilter={ () =>
									resetGridRow( { ...props } )
								}
								isShownByDefault={ true }
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

export const LayoutPanel = memo( LayoutPanelPure, ( prevProps, nextProps ) => {
	return (
		prevProps.name === nextProps.name &&
		prevProps.attributes === nextProps.attributes
	);
} );
