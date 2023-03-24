/*
 *@see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/dimensions.js
 */

import { InspectorControls } from '@wordpress/block-editor';
import { __experimentalToolsPanelItem as ToolsPanelItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import {
	useIsPaddingDisabled,
	hasPaddingValue,
	resetPadding,
	PaddingEdit,
	editPaddingProp,
} from './padding';

import {
	useIsGuttersDisabled,
	hasGuttersValue,
	resetGutters,
	GuttersEdit,
	editGuttersProp,
} from './gutters';

import {
	useIsGapDisabled,
	hasGapValue,
	resetGap,
	GapEdit,
	editGapProp,
} from './gap';

import {
	useIsNegativeDisabled,
	hasNegativeValue,
	resetNegative,
	NegativeEdit,
	editNegativeProp,
} from './negative';

import {
	useIsOverflowDisabled,
	hasOverflowValue,
	resetOverflow,
	OverflowEdit,
	editOverflowProp,
} from './overflow';

export {
	editPaddingProp,
	editGuttersProp,
	editGapProp,
	editNegativeProp,
	editOverflowProp,
};

export function DimensionsPanel( props ) {
	const isPaddingDisabled = useIsPaddingDisabled( props );
	const isGuttersDisabled = useIsGuttersDisabled( props );
	const isGapDisabled = useIsGapDisabled( props );
	const isNegativeDisabled = useIsNegativeDisabled( props );
	const isOverflowDisabled = useIsOverflowDisabled( props );

	if (
		isPaddingDisabled &&
		isGuttersDisabled &&
		isGapDisabled &&
		isNegativeDisabled &&
		isOverflowDisabled
	) {
		return null;
	}

	return (
		<>
			<InspectorControls __experimentalGroup="dimensions">
				{ ! isPaddingDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasPaddingValue( props ) }
						label={ __( 'Padding', 'unitone' ) }
						onDeselect={ () => resetPadding( props ) }
						resetAllFilter={ () => resetPadding( props ) }
						isShownByDefault
						panelId={ props.clientId }
					>
						<PaddingEdit
							{ ...props }
							label={
								<>
									{ __( 'Padding', 'unitone' ) }&nbsp;:&nbsp;
									<code>padding</code>
								</>
							}
						/>
					</ToolsPanelItem>
				) }

				{ ! isGuttersDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasGuttersValue( props ) }
						label={ __( 'Gutters', 'unitone' ) }
						onDeselect={ () => resetGutters( props ) }
						resetAllFilter={ () => resetGutters( props ) }
						isShownByDefault={ true }
						panelId={ props.clientId }
					>
						<GuttersEdit
							{ ...props }
							label={
								<>
									{ __( 'Gutters', 'unitone' ) }&nbsp;:&nbsp;
									<code>padding-right/left</code>
								</>
							}
						/>
					</ToolsPanelItem>
				) }

				{ ! isGapDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasGapValue( props ) }
						label={ __( 'Gap', 'unitone' ) }
						onDeselect={ () => resetGap( props ) }
						resetAllFilter={ () => resetGap( props ) }
						isShownByDefault={ true }
						panelId={ props.clientId }
					>
						<GapEdit
							{ ...props }
							label={
								<>
									{ __( 'Gap', 'unitone' ) }&nbsp;:&nbsp;
									<code>gap</code>
								</>
							}
						/>
					</ToolsPanelItem>
				) }

				{ ! isNegativeDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasNegativeValue( props ) }
						label={ __( 'Using negative margin', 'unitone' ) }
						onDeselect={ () => resetNegative( props ) }
						resetAllFilter={ () => resetNegative( props ) }
						isShownByDefault={ true }
						panelId={ props.clientId }
					>
						<NegativeEdit
							{ ...props }
							label={ __( 'Using negative margin', 'unitone' ) }
						/>
					</ToolsPanelItem>
				) }

				{ ! isOverflowDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasOverflowValue( props ) }
						label={ __( 'Overflow', 'unitone' ) }
						onDeselect={ () => resetOverflow( props ) }
						resetAllFilter={ () => resetOverflow( props ) }
						isShownByDefault={ true }
						panelId={ props.clientId }
					>
						<OverflowEdit
							{ ...props }
							label={
								<>
									{ __( 'Overflow', 'unitone' ) }&nbsp;:&nbsp;
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
