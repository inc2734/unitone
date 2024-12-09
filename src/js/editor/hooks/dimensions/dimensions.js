/*
 *@see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/dimensions.js
 */

import fastDeepEqual from 'fast-deep-equal/es6';

import { InspectorControls } from '@wordpress/block-editor';
import { __experimentalToolsPanelItem as ToolsPanelItem } from '@wordpress/components';
import { memo, useCallback } from '@wordpress/element';

import {
	useIsPaddingDisabled,
	hasPaddingValue,
	resetPaddingFilter,
	resetPadding,
	getPaddingEditLabel,
	PaddingEdit,
	usePaddingBlockProps,
} from './padding';

import {
	useIsGuttersDisabled,
	hasGuttersValue,
	resetGuttersFilter,
	resetGutters,
	getGuttersEditLabel,
	GuttersEdit,
	useGuttersBlockProps,
} from './gutters';

import {
	useIsGapDisabled,
	hasGapValue,
	resetGapFilter,
	resetGap,
	getGapEditLabel,
	GapEdit,
	useGapBlockProps,
} from './gap';

import {
	useIsStairsDisabled,
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
	useStairsBlockProps,
} from './stairs';

import {
	useIsNegativeDisabled,
	hasNegativeValue,
	resetNegativeFilter,
	resetNegative,
	getNegativeEditLabel,
	NegativeEdit,
	useNegativeBlockProps,
} from './negative';

import {
	useIsOverflowDisabled,
	hasOverflowValue,
	resetOverflowFilter,
	resetOverflow,
	getOverflowEditLabel,
	OverflowEdit,
	useOverflowBlockProps,
} from './overflow';

export {
	useGapBlockProps,
	useGuttersBlockProps,
	useNegativeBlockProps,
	useOverflowBlockProps,
	usePaddingBlockProps,
	useStairsBlockProps,
};

function DimensionsPanelPure( props ) {
	const { name, clientId, className } = props;

	const resetAllFilter = useCallback( ( _attributes ) => {
		_attributes = resetPaddingFilter( _attributes );
		_attributes = resetGuttersFilter( _attributes );
		_attributes = resetGapFilter( _attributes );
		_attributes = resetStairsFilter( _attributes );
		_attributes = resetStairsUpFilter( _attributes );
		_attributes = resetNegativeFilter( _attributes );
		_attributes = resetOverflowFilter( _attributes );

		return _attributes;
	}, [] );

	const isPaddingDisabled = useIsPaddingDisabled( { name } );
	const isGuttersDisabled = useIsGuttersDisabled( { name } );
	const isGapDisabled = useIsGapDisabled( { name, className } );
	const isStairsDisabled = useIsStairsDisabled( { name } );
	const isNegativeDisabled = useIsNegativeDisabled( { name } );
	const isOverflowDisabled = useIsOverflowDisabled( { name } );

	if (
		isPaddingDisabled &&
		isGuttersDisabled &&
		isGapDisabled &&
		isStairsDisabled &&
		isNegativeDisabled &&
		isOverflowDisabled
	) {
		return null;
	}

	return (
		<>
			<InspectorControls
				group="dimensions"
				resetAllFilter={ resetAllFilter }
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
								onDeselect={ () => resetStairsUp( props ) }
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
