/*
 *@see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/dimensions.js
 */

import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { BlockControls, InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

import {
	useIsJustifyContentDisabled,
	hasJustifyContentValue,
	resetJustifyContent,
	JustifyContentToolbar,
	JustifyContentEdit,
	editJustifyContentProp,
} from './justify-content';

import {
	useIsJustifyContentColumnDisabled,
	hasJustifyContentColumnValue,
	resetJustifyContentColumn,
	JustifyContentColumnToolbar,
	JustifyContentColumnEdit,
	editJustifyContentColumnProp,
} from './justify-content-column';

import {
	useIsAlignItemsDisabled,
	hasAlignItemsValue,
	resetAlignItems,
	AlignItemsToolbar,
	AlignItemsEdit,
	editAlignItemsProp,
} from './align-items';

import {
	useIsBlockAlignDisabled,
	hasBlockAlignValue,
	resetBlockAlign,
	BlockAlignToolbar,
	BlockAlignEdit,
	editBlockAlignProp,
} from './block-align';

import {
	useIsFlexBasisDisabled,
	hasFlexBasisValue,
	resetFlexBasis,
	FlexBasisEdit,
	editFlexBasisProp,
} from './flex-basis';

import {
	useIsMaxWidthDisabled,
	hasMaxWidthValue,
	resetMaxWidth,
	MaxWidthEdit,
	editMaxWidthProp,
} from './max-width';

import {
	useIsMaxHeightDisabled,
	hasMaxHeightValue,
	resetMaxHeight,
	MaxHeightEdit,
	editMaxHeightProp,
} from './max-height';

import {
	useIsMinHeightDisabled,
	hasMinHeightValue,
	resetMinHeight,
	MinHeightEdit,
	editMinHeightProp,
} from './min-height';

import {
	useIsAutoRepeatDisabled,
	hasAutoRepeatValue,
	resetAutoRepeat,
	AutoRepeatEdit,
	editAutoRepeatProp,
} from './auto-repeat';

export {
	editAlignItemsProp,
	editJustifyContentProp,
	editJustifyContentColumnProp,
	editBlockAlignProp,
	editFlexBasisProp,
	editMaxWidthProp,
	editMaxHeightProp,
	editMinHeightProp,
	editAutoRepeatProp,
};

export function LayoutPanel( props ) {
	const isJustifyContentDisabled = useIsJustifyContentDisabled( props );
	const isJustifyContentColumnDisabled =
		useIsJustifyContentColumnDisabled( props );
	const isAlignItemsDisabled = useIsAlignItemsDisabled( props );
	const isBlockAlignDisabled = useIsBlockAlignDisabled( props );
	const isFlexBasisDisabled = useIsFlexBasisDisabled( props );
	const isMaxWidthDisabled = useIsMaxWidthDisabled( props );
	const isMaxHeightDisabled = useIsMaxHeightDisabled( props );
	const isMinHeightDisabled = useIsMinHeightDisabled( props );
	const isAutoRepeatDisabled = useIsAutoRepeatDisabled( props );

	if (
		isJustifyContentDisabled &&
		isJustifyContentColumnDisabled &&
		isAlignItemsDisabled &&
		isBlockAlignDisabled &&
		isFlexBasisDisabled &&
		isMaxWidthDisabled &&
		isMaxHeightDisabled &&
		isMinHeightDisabled &&
		isAutoRepeatDisabled
	) {
		return null;
	}
	return (
		<>
			{ ( ! isJustifyContentDisabled ||
				! isJustifyContentColumnDisabled ||
				! isAlignItemsDisabled ||
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
				! isMaxWidthDisabled ||
				! isMaxHeightDisabled ||
				! isMinHeightDisabled ||
				! isAutoRepeatDisabled ) && (
				<InspectorControls>
					<ToolsPanel label={ __( 'Layout', 'unitone' ) }>
						{ ! isJustifyContentDisabled && (
							<ToolsPanelItem
								hasValue={ () =>
									hasJustifyContentValue( props )
								}
								label={ __( 'Justify content', 'unitone' ) }
								onDeselect={ () =>
									resetJustifyContent( props )
								}
								isShownByDefault
							>
								<JustifyContentEdit
									{ ...props }
									label={
										<>
											{ __(
												'Justify content',
												'unitone'
											) }
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
									hasJustifyContentColumnValue( props )
								}
								label={ __( 'Align items', 'unitone' ) }
								onDeselect={ () =>
									resetJustifyContentColumn( props )
								}
								isShownByDefault
							>
								<JustifyContentColumnEdit
									{ ...props }
									label={
										<>
											{ __( 'Align items', 'unitone' ) }
											&nbsp;:&nbsp;
											<code>justify-content</code>
										</>
									}
								/>
							</ToolsPanelItem>
						) }

						{ ! isAlignItemsDisabled && (
							<ToolsPanelItem
								hasValue={ () => hasAlignItemsValue( props ) }
								label={ __( 'Align items', 'unitone' ) }
								onDeselect={ () => resetAlignItems( props ) }
								isShownByDefault
							>
								<AlignItemsEdit
									{ ...props }
									label={
										<>
											{ __( 'Align items', 'unitone' ) }
											&nbsp;:&nbsp;
											<code>align-items</code>
										</>
									}
								/>
							</ToolsPanelItem>
						) }

						{ ! isBlockAlignDisabled && (
							<ToolsPanelItem
								hasValue={ () => hasBlockAlignValue( props ) }
								label={ __( 'Block alignment', 'unitone' ) }
								onDeselect={ () => resetBlockAlign( props ) }
								isShownByDefault
							>
								<BlockAlignEdit
									{ ...props }
									label={ __( 'Block alignment', 'unitone' ) }
								/>
							</ToolsPanelItem>
						) }

						{ ! isFlexBasisDisabled && (
							<ToolsPanelItem
								hasValue={ () => hasFlexBasisValue( props ) }
								label={ __( 'Recommended width', 'unitone' ) }
								onDeselect={ () => resetFlexBasis( props ) }
								isShownByDefault
							>
								<FlexBasisEdit
									{ ...props }
									label={
										<>
											{ __(
												'Recommended width',
												'unitone'
											) }
											&nbsp;:&nbsp;<code>flex-basis</code>
										</>
									}
								/>
							</ToolsPanelItem>
						) }

						{ ! isMaxWidthDisabled && (
							<ToolsPanelItem
								hasValue={ () => hasMaxWidthValue( props ) }
								label={ __( 'Max width', 'unitone' ) }
								onDeselect={ () => resetMaxWidth( props ) }
								isShownByDefault
							>
								<MaxWidthEdit
									{ ...props }
									label={
										<>
											{ __( 'Max width', 'unitone' ) }
											&nbsp;:&nbsp;<code>max-width</code>
										</>
									}
								/>
							</ToolsPanelItem>
						) }

						{ ! isMaxHeightDisabled && (
							<ToolsPanelItem
								hasValue={ () => hasMaxHeightValue( props ) }
								label={ __( 'Max height', 'unitone' ) }
								onDeselect={ () => resetMaxHeight( props ) }
								isShownByDefault
							>
								<MaxHeightEdit
									{ ...props }
									label={
										<>
											{ __( 'Max height', 'unitone' ) }
											&nbsp;:&nbsp;<code>max-height</code>
										</>
									}
								/>
							</ToolsPanelItem>
						) }

						{ ! isMinHeightDisabled && (
							<ToolsPanelItem
								hasValue={ () => hasMinHeightValue( props ) }
								label={ __( 'Min height', 'unitone' ) }
								onDeselect={ () => resetMinHeight( props ) }
								isShownByDefault
							>
								<MinHeightEdit
									{ ...props }
									label={
										<>
											{ __( 'Min height', 'unitone' ) }
											&nbsp;:&nbsp;<code>min-height</code>
										</>
									}
								/>
							</ToolsPanelItem>
						) }

						{ ! isAutoRepeatDisabled && (
							<ToolsPanelItem
								hasValue={ () => hasAutoRepeatValue( props ) }
								label={ __( 'Auto repeat', 'unitone' ) }
								onDeselect={ () => resetAutoRepeat( props ) }
								isShownByDefault
							>
								<AutoRepeatEdit
									{ ...props }
									label={
										<>
											{ __( 'Auto repeat', 'unitone' ) }
											&nbsp;:&nbsp;
											<code>auto-repeat</code>
										</>
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
