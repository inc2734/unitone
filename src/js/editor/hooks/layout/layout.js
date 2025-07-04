/*
 * @see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/dimensions.js
 */

import fastDeepEqual from 'fast-deep-equal/es6';

import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { BlockControls, InspectorControls } from '@wordpress/block-editor';
import { compose } from '@wordpress/compose';
import { memo } from '@wordpress/element';
import { sprintf, __ } from '@wordpress/i18n';

import { cleanEmptyObject, useToolsPanelDropdownMenuProps } from '../utils';

import {
	isJustifyContentSupportDisabled,
	hasJustifyContentValue,
	resetJustifyContentFilter,
	resetJustifyContent,
	JustifyContentToolbar,
	getJustifyContentEditLabel,
	JustifyContentEdit,
	withJustifyContentBlockProps,
} from './justify-content';

import {
	isJustifyItemsSupportDisabled,
	hasJustifyItemsValue,
	resetJustifyItemsFilter,
	resetJustifyItems,
	JustifyItemsToolbar,
	getJustifyItemsEditLabel,
	JustifyItemsEdit,
	withJustifyItemsBlockProps,
} from './justify-items';

import {
	isJustifyContentColumnSupportDisabled,
	hasJustifyContentColumnValue,
	resetJustifyContentColumnFilter,
	resetJustifyContentColumn,
	JustifyContentColumnToolbar,
	getJustifyContentColumnEditLabel,
	JustifyContentColumnEdit,
	withJustifyContentColumnBlockProps,
} from './justify-content-column';

import {
	isAlignContentSupportDisabled,
	hasAlignContentValue,
	resetAlignContentFilter,
	resetAlignContent,
	AlignContentToolbar,
	getAlignContentEditLabel,
	AlignContentEdit,
	withAlignContentBlockProps,
} from './align-content';

import {
	isAlignItemsSupportDisabled,
	hasAlignItemsValue,
	resetAlignItemsFilter,
	resetAlignItems,
	AlignItemsToolbar,
	getAlignItemsEditLabel,
	AlignItemsEdit,
	withAlignItemsBlockProps,
} from './align-items';

import {
	isBlockAlignSupportDisabled,
	hasBlockAlignValue,
	resetBlockAlignFilter,
	resetBlockAlign,
	BlockAlignToolbar,
	getBlockAlignEditLabel,
	BlockAlignEdit,
	withBlockAlignBlockProps,
} from './block-align';

import {
	isFlexBasisSupportDisabled,
	hasFlexBasisValue,
	resetFlexBasisFilter,
	resetFlexBasis,
	getFlexBasisEditLabel,
	FlexBasisEdit,
	withFlexBasisBlockProps,
} from './flex-basis';

import {
	isFlexGrowSupportDisabled,
	hasFlexGrowValue,
	resetFlexGrowFilter,
	resetFlexGrow,
	getFlexGrowEditLabel,
	FlexGrowEdit,
	withFlexGrowBlockProps,
} from './flex-grow';

import {
	isFlexShrinkSupportDisabled,
	hasFlexShrinkValue,
	resetFlexShrinkFilter,
	resetFlexShrink,
	getFlexShrinkEditLabel,
	FlexShrinkEdit,
	withFlexShrinkBlockProps,
} from './flex-shrink';

import {
	isMaxWidthSupportDisabled,
	hasMaxWidthValue,
	resetMaxWidthFilter,
	resetMaxWidth,
	getMaxWidthEditLabel,
	MaxWidthEdit,
	withMaxWidthBlockProps,
} from './max-width';

import {
	isMinWidthSupportDisabled,
	hasMinWidthValue,
	resetMinWidthFilter,
	resetMinWidth,
	getMinWidthEditLabel,
	MinWidthEdit,
	withMinWidthBlockProps,
} from './min-width';

import {
	isMaxHeightSupportDisabled,
	hasMaxHeightValue,
	resetMaxHeightFilter,
	resetMaxHeight,
	getMaxHeightEditLabel,
	MaxHeightEdit,
	withMaxHeightBlockProps,
} from './max-height';

import {
	isMinHeightSupportDisabled,
	hasMinHeightValue,
	resetMinHeightFilter,
	resetMinHeight,
	getMinHeightEditLabel,
	MinHeightEdit,
	withMinHeightBlockProps,
} from './min-height';

import {
	isAutoRepeatSupportDisabled,
	hasAutoRepeatValue,
	resetAutoRepeatFilter,
	resetAutoRepeat,
	getAutoRepeatEditLabel,
	AutoRepeatEdit,
	withAutoRepeatBlockProps,
} from './auto-repeat';

import {
	isAlignSelfSupportDisabled,
	hasAlignSelfValue,
	resetAlignSelfFilter,
	resetAlignSelf,
	AlignSelfToolbar,
	getAlignSelfEditLabel,
	AlignSelfEdit,
	withAlignSelfBlockProps,
} from './align-self';

import {
	isJustifySelfSupportDisabled,
	hasJustifySelfValue,
	resetJustifySelfFilter,
	resetJustifySelf,
	JustifySelfToolbar,
	getJustifySelfEditLabel,
	JustifySelfEdit,
	withJustifySelfBlockProps,
} from './justify-self';

import {
	isGridColumnSupportDisabled,
	hasGridColumnValue,
	resetGridColumnFilter,
	resetGridColumn,
	getGridColumnEditLabel,
	GridColumnEdit,
	withGridColumnBlockProps,
} from './grid-column';

import {
	isGridRowSupportDisabled,
	hasGridRowValue,
	resetGridRowFilter,
	resetGridRow,
	getGridRowEditLabel,
	GridRowEdit,
	withGridRowBlockProps,
} from './grid-row';

export const withLayoutBlockProps = compose(
	withAlignContentBlockProps,
	withAlignItemsBlockProps,
	withAlignSelfBlockProps,
	withAutoRepeatBlockProps,
	withBlockAlignBlockProps,
	withFlexBasisBlockProps,
	withFlexGrowBlockProps,
	withFlexShrinkBlockProps,
	withGridColumnBlockProps,
	withGridRowBlockProps,
	withJustifyContentBlockProps,
	withJustifyContentColumnBlockProps,
	withJustifyItemsBlockProps,
	withJustifySelfBlockProps,
	withMaxHeightBlockProps,
	withMaxWidthBlockProps,
	withMinHeightBlockProps,
	withMinWidthBlockProps
);

export const resetLayout = ( props ) => {
	const filters = [
		[ isJustifyContentSupportDisabled, resetJustifyContentFilter ],
		[
			isJustifyContentColumnSupportDisabled,
			resetJustifyContentColumnFilter,
		],
		[ isJustifyItemsSupportDisabled, resetJustifyItemsFilter ],
		[ isAlignContentSupportDisabled, resetAlignContentFilter ],
		[ isAlignItemsSupportDisabled, resetAlignItemsFilter ],
		[ isBlockAlignSupportDisabled, resetBlockAlignFilter ],
		[ isFlexBasisSupportDisabled, resetFlexBasisFilter ],
		[ isFlexGrowSupportDisabled, resetFlexGrowFilter ],
		[ isFlexShrinkSupportDisabled, resetFlexShrinkFilter ],
		[ isMaxWidthSupportDisabled, resetMaxWidthFilter ],
		[ isMinWidthSupportDisabled, resetMinWidthFilter ],
		[ isMaxHeightSupportDisabled, resetMaxHeightFilter ],
		[ isMinHeightSupportDisabled, resetMinHeightFilter ],
		[ isAutoRepeatSupportDisabled, resetAutoRepeatFilter ],
		[ isAlignSelfSupportDisabled, resetAlignSelfFilter ],
		[ isJustifySelfSupportDisabled, resetJustifySelfFilter ],
		[ isGridColumnSupportDisabled, resetGridColumnFilter ],
		[ isGridRowSupportDisabled, resetGridRowFilter ],
	];

	const unitone = filters.reduce(
		( accumulator, [ isDisabled, resetFilter ] ) => {
			return isDisabled( { ...props } )
				? { ...accumulator, ...resetFilter() }
				: accumulator;
		},
		{ ...props.attributes?.unitone }
	);

	return { ...props, attributes: { ...props.attributes, unitone } };
};

function LayoutPanelPure( props ) {
	const { name, attributes, setAttributes, clientId } = props;

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

	const isJustifyContentDisabled = isJustifyContentSupportDisabled( {
		name,
	} );
	const isJustifyContentColumnDisabled =
		isJustifyContentColumnSupportDisabled( {
			name,
		} );
	const isJustifyItemsDisabled = isJustifyItemsSupportDisabled( { name } );
	const isAlignContentDisabled = isAlignContentSupportDisabled( { name } );
	const isAlignItemsDisabled = isAlignItemsSupportDisabled( { name } );
	const isBlockAlignDisabled = isBlockAlignSupportDisabled( { name } );
	const isFlexBasisDisabled = isFlexBasisSupportDisabled( {
		name,
		attributes,
	} );
	const isFlexGrowDisabled = isFlexGrowSupportDisabled( {
		name,
		attributes,
	} );
	const isFlexShrinkDisabled = isFlexShrinkSupportDisabled( {
		name,
		attributes,
	} );
	const isMaxWidthDisabled = isMaxWidthSupportDisabled( {
		name,
		attributes,
	} );
	const isMinWidthDisabled = isMinWidthSupportDisabled( {
		name,
		attributes,
	} );
	const isMaxHeightDisabled = isMaxHeightSupportDisabled( {
		name,
		attributes,
	} );
	const isMinHeightDisabled = isMinHeightSupportDisabled( {
		name,
		attributes,
	} );
	const isAutoRepeatDisabled = isAutoRepeatSupportDisabled( { name } );
	const isAlignSelfDisabled = isAlignSelfSupportDisabled( {
		name,
		attributes,
	} );
	const isJustifySelfDisabled = isJustifySelfSupportDisabled( {
		name,
		attributes,
	} );
	const isGridColumnDisabled = isGridColumnSupportDisabled( {
		name,
		attributes,
	} );
	const isGridRowDisabled = isGridRowSupportDisabled( { name, attributes } );

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
