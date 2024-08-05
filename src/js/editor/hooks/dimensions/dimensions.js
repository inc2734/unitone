/*
 *@see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/dimensions.js
 */

import { InspectorControls } from '@wordpress/block-editor';
import { __experimentalToolsPanelItem as ToolsPanelItem } from '@wordpress/components';
import { memo } from '@wordpress/element';

import {
	useIsPaddingDisabled,
	hasPaddingValue,
	resetPadding,
	getPaddingEditLabel,
	PaddingEdit,
	editPaddingProp,
} from './padding';

import {
	useIsGuttersDisabled,
	hasGuttersValue,
	resetGutters,
	getGuttersEditLabel,
	GuttersEdit,
	editGuttersProp,
} from './gutters';

import {
	useIsGapDisabled,
	hasGapValue,
	resetGap,
	getGapEditLabel,
	GapEdit,
	editGapProp,
} from './gap';

import {
	useIsStairsDisabled,
	hasStairsValue,
	hasStairsUpValue,
	resetStairs,
	resetStairsUp,
	getStairsEditLabel,
	StairsEdit,
	getStairsUpEditLabel,
	StairsUpEdit,
	editStairsProp,
} from './stairs';

import {
	useIsNegativeDisabled,
	hasNegativeValue,
	resetNegative,
	getNegativeEditLabel,
	NegativeEdit,
	editNegativeProp,
} from './negative';

import {
	useIsOverflowDisabled,
	hasOverflowValue,
	resetOverflow,
	getOverflowEditLabel,
	OverflowEdit,
	editOverflowProp,
} from './overflow';

export {
	editPaddingProp,
	editGuttersProp,
	editGapProp,
	editStairsProp,
	editNegativeProp,
	editOverflowProp,
};

function DimensionsPanelPure( props ) {
	const isPaddingDisabled = useIsPaddingDisabled( { ...props } );
	const isGuttersDisabled = useIsGuttersDisabled( { ...props } );
	const isGapDisabled = useIsGapDisabled( { ...props } );
	const isStairsDisabled = useIsStairsDisabled( { ...props } );
	const isNegativeDisabled = useIsNegativeDisabled( { ...props } );
	const isOverflowDisabled = useIsOverflowDisabled( { ...props } );

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
			<InspectorControls group="dimensions">
				{ ! isPaddingDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasPaddingValue( { ...props } ) }
						label={ getPaddingEditLabel( { ...props } ) }
						onDeselect={ () => resetPadding( { ...props } ) }
						resetAllFilter={ () => resetPadding( { ...props } ) }
						isShownByDefault
						panelId={ props.clientId }
					>
						<PaddingEdit
							{ ...props }
							label={
								<>
									{ getPaddingEditLabel( { ...props } ) }
									&nbsp;:&nbsp;
									<code>padding</code>
								</>
							}
						/>
					</ToolsPanelItem>
				) }

				{ ! isGuttersDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasGuttersValue( { ...props } ) }
						label={ getGuttersEditLabel( { ...props } ) }
						onDeselect={ () => resetGutters( { ...props } ) }
						resetAllFilter={ () => resetGutters( { ...props } ) }
						isShownByDefault={ true }
						panelId={ props.clientId }
					>
						<GuttersEdit
							{ ...props }
							label={
								<>
									{ getGuttersEditLabel( { ...props } ) }
									&nbsp;:&nbsp;
									<code>padding-right/left</code>
								</>
							}
						/>
					</ToolsPanelItem>
				) }

				{ ! isGapDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasGapValue( { ...props } ) }
						label={ getGapEditLabel( { ...props } ) }
						onDeselect={ () => resetGap( { ...props } ) }
						resetAllFilter={ () => resetGap( { ...props } ) }
						isShownByDefault={ true }
						panelId={ props.clientId }
					>
						<GapEdit
							{ ...props }
							label={
								<>
									{ getGapEditLabel( { ...props } ) }
									&nbsp;:&nbsp;
									<code>gap</code>
								</>
							}
						/>
					</ToolsPanelItem>
				) }

				{ ! isStairsDisabled && (
					<>
						<ToolsPanelItem
							hasValue={ () => hasStairsValue( { ...props } ) }
							label={ getStairsEditLabel( { ...props } ) }
							onDeselect={ () => resetStairs( { ...props } ) }
							resetAllFilter={ () => resetStairs( { ...props } ) }
							isShownByDefault={ true }
							panelId={ props.clientId }
						>
							<StairsEdit
								{ ...props }
								label={ getStairsEditLabel( { ...props } ) }
							/>
						</ToolsPanelItem>

						{ hasStairsValue( { ...props } ) && (
							<ToolsPanelItem
								hasValue={ () =>
									hasStairsUpValue( { ...props } )
								}
								label={ getStairsUpEditLabel( { ...props } ) }
								onDeselect={ () =>
									resetStairsUp( { ...props } )
								}
								resetAllFilter={ () =>
									resetStairsUp( { ...props } )
								}
								isShownByDefault={ true }
								panelId={ props.clientId }
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
						resetAllFilter={ () => resetNegative( { ...props } ) }
						isShownByDefault={ true }
						panelId={ props.clientId }
					>
						<NegativeEdit
							{ ...props }
							label={ getNegativeEditLabel( { ...props } ) }
						/>
					</ToolsPanelItem>
				) }

				{ ! isOverflowDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasOverflowValue( { ...props } ) }
						label={ getOverflowEditLabel( { ...props } ) }
						onDeselect={ () => resetOverflow( { ...props } ) }
						resetAllFilter={ () => resetOverflow( { ...props } ) }
						isShownByDefault={ true }
						panelId={ props.clientId }
					>
						<OverflowEdit
							{ ...props }
							label={
								<>
									{ getOverflowEditLabel( { ...props } ) }
									&nbsp;:&nbsp;
									<code>overflow</code>
								</>
							}
						/>
					</ToolsPanelItem>
				) }
			</InspectorControls>
		</>
	);
}

export const DimensionsPanel = memo(
	DimensionsPanelPure,
	( prevProps, nextProps ) => {
		return (
			prevProps.name === nextProps.name &&
			prevProps.attributes === nextProps.attributes
		);
	}
);
