/**
 * https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/typography.js
 */

import { InspectorControls } from '@wordpress/block-editor';
import { __experimentalToolsPanelItem as ToolsPanelItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import {
	useIsFluidTypographyDisabled,
	hasFluidTypographyValue,
	resetFluidTypography,
	FluidTypographyEdit,
	saveFluidTypographyProp,
	editFluidTypographyProp,
} from './fluid-typography';

export { saveFluidTypographyProp, editFluidTypographyProp };

export function TypographyPanel( props ) {
	const isFluidTypographyDisabled = useIsFluidTypographyDisabled( props );

	if ( isFluidTypographyDisabled ) {
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
			{ ! isFluidTypographyDisabled && (
				<InspectorControls __experimentalGroup="typography">
					{ ! isFluidTypographyDisabled && (
						<ToolsPanelItem
							hasValue={ () => hasFluidTypographyValue( props ) }
							label={ __( 'Fluid typography', 'unitone' ) }
							onDeselect={ () => resetFluidTypography( props ) }
							isShownByDefault={ false }
							resetAllFilter={ createResetAllFilter(
								'fluidTypograpy'
							) }
							panelId={ props.clientId }
						>
							<FluidTypographyEdit { ...props } />
						</ToolsPanelItem>
					) }
				</InspectorControls>
			) }
		</>
	);
}
