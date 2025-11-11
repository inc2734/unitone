/*
 * @see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/dimensions.js
 */

import fastDeepEqual from 'fast-deep-equal/es6';

import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { InspectorControls } from '@wordpress/block-editor';
import { compose } from '@wordpress/compose';
import { memo } from '@wordpress/element';
import { sprintf, __ } from '@wordpress/i18n';

import { cleanEmptyObject, useToolsPanelDropdownMenuProps } from '../utils';

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
	withAutoRepeatBlockProps,
	withFlexBasisBlockProps,
	withFlexGrowBlockProps,
	withFlexShrinkBlockProps,
	withGridColumnBlockProps,
	withGridRowBlockProps,
	withMaxHeightBlockProps,
	withMaxWidthBlockProps,
	withMinHeightBlockProps,
	withMinWidthBlockProps
);

export const resetLayout = ( props ) => {
	const filters = [
		[ isFlexBasisSupportDisabled, resetFlexBasisFilter ],
		[ isFlexGrowSupportDisabled, resetFlexGrowFilter ],
		[ isFlexShrinkSupportDisabled, resetFlexShrinkFilter ],
		[ isMaxWidthSupportDisabled, resetMaxWidthFilter ],
		[ isMinWidthSupportDisabled, resetMinWidthFilter ],
		[ isMaxHeightSupportDisabled, resetMaxHeightFilter ],
		[ isMinHeightSupportDisabled, resetMinHeightFilter ],
		[ isAutoRepeatSupportDisabled, resetAutoRepeatFilter ],
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
					resetFlexBasisFilter(),
					resetFlexGrowFilter(),
					resetFlexShrinkFilter(),
					resetMaxWidthFilter(),
					resetMinWidthFilter(),
					resetMaxHeightFilter(),
					resetMinHeightFilter(),
					resetAutoRepeatFilter(),
					resetGridColumnFilter(),
					resetGridRowFilter()
				)
			),
		} );
	};

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

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
	const isGridColumnDisabled = isGridColumnSupportDisabled( {
		name,
		attributes,
	} );
	const isGridRowDisabled = isGridRowSupportDisabled( { name, attributes } );

	if (
		isFlexBasisDisabled &&
		isFlexGrowDisabled &&
		isFlexShrinkDisabled &&
		isMaxWidthDisabled &&
		isMinWidthDisabled &&
		isMaxHeightDisabled &&
		isMinHeightDisabled &&
		isAutoRepeatDisabled &&
		isGridColumnDisabled &&
		isGridRowDisabled
	) {
		return null;
	}

	return (
		<>
			{ ( ! isFlexBasisDisabled ||
				! isFlexGrowDisabled ||
				! isFlexShrinkDisabled ||
				! isMaxWidthDisabled ||
				! isMinWidthDisabled ||
				! isMaxHeightDisabled ||
				! isMinHeightDisabled ||
				! isAutoRepeatDisabled ||
				! isAutoRepeatDisabled ||
				! isGridColumnDisabled ||
				! isGridRowDisabled ) && (
				<InspectorControls>
					<ToolsPanel
						label={ __( 'Layout', 'unitone' ) }
						resetAll={ resetAll }
						panelId={ clientId }
						dropdownMenuProps={ dropdownMenuProps }
					>
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
