/*
 *@see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/dimensions.js
 */

import fastDeepEqual from 'fast-deep-equal/es6';

import { InspectorControls } from '@wordpress/block-editor';
import { __experimentalToolsPanelItem as ToolsPanelItem } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { resetUnitoneWithBlockAttributes } from '../utils';

import {
	isPaddingSupportDisabled,
	hasPaddingValue,
	resetPaddingFilter,
	resetPadding,
	getPaddingEditLabel,
	PaddingEdit,
	withPaddingBlockProps,
} from './padding';

import {
	isGuttersSupportDisabled,
	hasGuttersValue,
	resetGuttersFilter,
	resetGutters,
	getGuttersEditLabel,
	GuttersEdit,
	withGuttersBlockProps,
} from './gutters';

import {
	isGapSupportDisabled,
	hasGapValue,
	resetGapFilter,
	resetGap,
	getGapEditLabel,
	GapEdit,
	withGapBlockProps,
} from './gap';

import {
	isStairsSupportDisabled,
	hasStairsValue,
	hasStairsUpValue,
	resetStairsFilter,
	resetStairs,
	resetStairsUpFilter,
	resetStairsUp,
	getStairsEditLabel,
	StairsEdit,
	getStairsUpEditLabel,
	StairsUpEdit,
	withStairsBlockProps,
} from './stairs';

import {
	isNegativeSupportDisabled,
	hasNegativeValue,
	resetNegativeFilter,
	resetNegative,
	getNegativeEditLabel,
	NegativeEdit,
	withNegativeBlockProps,
} from './negative';

import {
	isOverflowSupportDisabled,
	hasOverflowValue,
	resetOverflowFilter,
	resetOverflow,
	getOverflowEditLabel,
	OverflowEdit,
	withOverflowBlockProps,
} from './overflow';

import {
	isOpacitySupportDisabled,
	hasOpacityValue,
	resetOpacityFilter,
	resetOpacity,
	OpacityEdit,
	withOpacityBlockProps,
} from './opacity';

export const withDimensionsBlockProps = compose(
	withGapBlockProps,
	withGuttersBlockProps,
	withNegativeBlockProps,
	withOpacityBlockProps,
	withOverflowBlockProps,
	withPaddingBlockProps,
	withStairsBlockProps
);

export const resetDimensions = ( props ) => {
	const filters = [
		[ isPaddingSupportDisabled, resetPaddingFilter ],
		[ isGuttersSupportDisabled, resetGuttersFilter ],
		[ isGapSupportDisabled, resetGapFilter ],
		[ isStairsSupportDisabled, resetStairsFilter ],
		[ isNegativeSupportDisabled, resetNegativeFilter ],
		[ isOpacitySupportDisabled, resetOpacityFilter ],
		[ isOverflowSupportDisabled, resetOverflowFilter ],
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

function DimensionsPanelPure( props ) {
	const { name, attributes, clientId, className } = props;

	const isPaddingDisabled = isPaddingSupportDisabled( { name } );
	const isGuttersDisabled = isGuttersSupportDisabled( { name } );
	const isGapDisabled = isGapSupportDisabled( { name, className } );
	const isStairsDisabled = isStairsSupportDisabled( { name } );
	const isNegativeDisabled = isNegativeSupportDisabled( { name } );
	const isOpacityDisabled = isOpacitySupportDisabled( { name } );
	const isOverflowDisabled = isOverflowSupportDisabled( { name } );

	if (
		isPaddingDisabled &&
		isGuttersDisabled &&
		isGapDisabled &&
		isStairsDisabled &&
		isNegativeDisabled &&
		isOpacityDisabled &&
		isOverflowDisabled
	) {
		return null;
	}

	return (
		<>
			<InspectorControls
				group="dimensions"
				resetAllFilter={ ( blockAttributes ) => ( {
					...blockAttributes,
					unitone: resetUnitoneWithBlockAttributes( {
						unitone: attributes?.unitone,
						blockAttributes,
						resetFilters: [
							resetPaddingFilter(),
							resetGuttersFilter(),
							resetGapFilter(),
							resetStairsFilter(),
							resetStairsUpFilter(),
							resetNegativeFilter(),
							resetOpacityFilter(),
							resetOverflowFilter(),
						],
					} ),
				} ) }
			>
				{ ! isPaddingDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasPaddingValue( { ...props } ) }
						label={ getPaddingEditLabel( { ...props } ) }
						onDeselect={ () => resetPadding( { ...props } ) }
						isShownByDefault
						panelId={ clientId }
					>
						<PaddingEdit
							{ ...props }
							label={ getPaddingEditLabel( {
								...props,
								__withCode: true,
							} ) }
						/>
					</ToolsPanelItem>
				) }

				{ ! isGuttersDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasGuttersValue( { ...props } ) }
						label={ getGuttersEditLabel( { ...props } ) }
						onDeselect={ () => resetGutters( { ...props } ) }
						isShownByDefault
						panelId={ clientId }
					>
						<GuttersEdit
							{ ...props }
							label={ getGuttersEditLabel( {
								...props,
								__withCode: true,
							} ) }
						/>
					</ToolsPanelItem>
				) }

				{ ! isGapDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasGapValue( { ...props } ) }
						label={ getGapEditLabel( { ...props } ) }
						onDeselect={ () => resetGap( { ...props } ) }
						isShownByDefault
						panelId={ clientId }
					>
						<GapEdit
							{ ...props }
							label={ getGapEditLabel( {
								...props,
								__withCode: true,
							} ) }
						/>
					</ToolsPanelItem>
				) }

				{ ! isStairsDisabled && (
					<>
						<ToolsPanelItem
							hasValue={ () => hasStairsValue( { ...props } ) }
							label={ getStairsEditLabel( { ...props } ) }
							onDeselect={ () => resetStairs( { ...props } ) }
							isShownByDefault
							panelId={ clientId }
						>
							<StairsEdit
								{ ...props }
								label={ getStairsEditLabel( {
									...props,
								} ) }
							/>
						</ToolsPanelItem>

						{ hasStairsValue( { ...props } ) && (
							<ToolsPanelItem
								hasValue={ () =>
									hasStairsUpValue( { ...props } )
								}
								label={ getStairsUpEditLabel( {
									...props,
								} ) }
								onDeselect={ () =>
									resetStairsUp( { ...props } )
								}
								isShownByDefault
								panelId={ clientId }
							>
								<StairsUpEdit
									{ ...props }
									label={ getStairsUpEditLabel( {
										...props,
									} ) }
								/>
							</ToolsPanelItem>
						) }
					</>
				) }

				{ ! isNegativeDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasNegativeValue( { ...props } ) }
						label={ getNegativeEditLabel( { ...props } ) }
						onDeselect={ () => resetNegative( { ...props } ) }
						isShownByDefault
						panelId={ clientId }
					>
						<NegativeEdit
							{ ...props }
							label={ getNegativeEditLabel( {
								...props,
							} ) }
						/>
					</ToolsPanelItem>
				) }

				{ ! isOpacityDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasOpacityValue( { ...props } ) }
						label={ __( 'Opacity', 'unitone' ) }
						onDeselect={ () => resetOpacity( { ...props } ) }
						isShownByDefault
						panelId={ clientId }
					>
						<div className="unitone-opacity-control">
							<OpacityEdit { ...props } />
						</div>
					</ToolsPanelItem>
				) }

				{ ! isOverflowDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasOverflowValue( { ...props } ) }
						label={ getOverflowEditLabel( { ...props } ) }
						onDeselect={ () => resetOverflow( { ...props } ) }
						isShownByDefault
						panelId={ clientId }
					>
						<OverflowEdit
							{ ...props }
							label={ getOverflowEditLabel( {
								...props,
								__withCode: true,
							} ) }
						/>
					</ToolsPanelItem>
				) }
			</InspectorControls>
		</>
	);
}

export const DimensionsPanel = memo(
	DimensionsPanelPure,
	( oldProps, newProps ) => fastDeepEqual( oldProps, newProps )
);
