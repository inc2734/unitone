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
	savePaddingProp,
	editPaddingProp,
} from './padding';

import {
	useIsGuttersDisabled,
	hasGuttersValue,
	resetGutters,
	GuttersEdit,
	saveGuttersProp,
	editGuttersProp,
} from './gutters';

import {
	useIsGapDisabled,
	hasGapValue,
	resetGap,
	GapEdit,
	saveGapProp,
	editGapProp,
} from './gap';

import {
	useIsNegativeDisabled,
	hasNegativeValue,
	resetNegative,
	NegativeEdit,
	saveNegativeProp,
	editNegativeProp,
} from './negative';

export {
	savePaddingProp,
	editPaddingProp,
	saveGuttersProp,
	editGuttersProp,
	saveGapProp,
	editGapProp,
	saveNegativeProp,
	editNegativeProp,
};

export function DimensionsPanel( props ) {
	const isPaddingDisabled = useIsPaddingDisabled( props );
	const isGuttersDisabled = useIsGuttersDisabled( props );
	const isGapDisabled = useIsGapDisabled( props );
	const isNegativeDisabled = useIsNegativeDisabled( props );

	if (
		isPaddingDisabled &&
		isGuttersDisabled &&
		isGapDisabled &&
		isNegativeDisabled
	) {
		return null;
	}

	const createResetAllFilter = ( attribute ) => ( newAttributes ) => ( {
		...newAttributes,
		unitone: {
			...newAttributes.unitone,
			[ attribute ]: undefined,
		},
	} );

	return (
		<>
			<InspectorControls __experimentalGroup="dimensions">
				{ ! isPaddingDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasPaddingValue( props ) }
						label={ __( 'Padding', 'unitone' ) }
						onDeselect={ () => resetPadding( props ) }
						resetAllFilter={ createResetAllFilter( 'padding' ) }
						isShownByDefault={ true }
						panelId={ props.clientId }
					>
						<PaddingEdit { ...props } />
					</ToolsPanelItem>
				) }

				{ ! isGuttersDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasGuttersValue( props ) }
						label={ __( 'Gutters', 'unitone' ) }
						onDeselect={ () => resetGutters( props ) }
						resetAllFilter={ createResetAllFilter( 'gutters' ) }
						isShownByDefault={ true }
						panelId={ props.clientId }
					>
						<GuttersEdit { ...props } />
					</ToolsPanelItem>
				) }

				{ ! isGapDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasGapValue( props ) }
						label={ __( 'Gap', 'unitone' ) }
						onDeselect={ () => resetGap( props ) }
						resetAllFilter={ createResetAllFilter( 'gap' ) }
						isShownByDefault={ true }
						panelId={ props.clientId }
					>
						<GapEdit { ...props } />
					</ToolsPanelItem>
				) }

				{ ! isNegativeDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasNegativeValue( props ) }
						label={ __( 'Using negative margin', 'unitone' ) }
						onDeselect={ () => resetNegative( props ) }
						resetAllFilter={ createResetAllFilter( 'negative' ) }
						isShownByDefault={ true }
						panelId={ props.clientId }
					>
						<NegativeEdit { ...props } />
					</ToolsPanelItem>
				) }
			</InspectorControls>
		</>
	);
}
