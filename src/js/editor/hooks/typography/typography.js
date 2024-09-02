/**
 * https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/typography.js
 */

import { InspectorControls } from '@wordpress/block-editor';
import { __experimentalToolsPanelItem as ToolsPanelItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import {
	useIsAutoPhraseDisabled,
	hasAutoPhraseValue,
	resetAutoPhrase,
	AutoPhraseEdit,
	useAutoPhraseBlockProps,
} from './auto-phrase';

import {
	useIsFluidTypographyDisabled,
	hasFluidTypographyValue,
	resetFluidTypography,
	FluidTypographyEdit,
	useFluidTypographyBlockProps,
} from './fluid-typography';

import {
	useIsHalfLeadingDisabled,
	hasHalfLeadingValue,
	resetHalfLeading,
	HalfLeadingEdit,
	useHalfLeadingBlockProps,
} from './half-leading';

export {
	useAutoPhraseBlockProps,
	useFluidTypographyBlockProps,
	useHalfLeadingBlockProps,
};

export function TypographyPanel( props ) {
	const isAutoPhraseDisabled = useIsAutoPhraseDisabled( props );
	const isFluidTypographyDisabled = useIsFluidTypographyDisabled( props );
	const isHalfLeadingDisabled = useIsHalfLeadingDisabled( props );

	if (
		isAutoPhraseDisabled &&
		isFluidTypographyDisabled &&
		isHalfLeadingDisabled
	) {
		return null;
	}

	return (
		<>
			<InspectorControls group="typography">
				{ ! isFluidTypographyDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasFluidTypographyValue( props ) }
						label={ __( 'Fluid typography', 'unitone' ) }
						onDeselect={ () => resetFluidTypography( props ) }
						isShownByDefault
						resetAllFilter={ () => resetFluidTypography( props ) }
						panelId={ props.clientId }
					>
						<FluidTypographyEdit
							{ ...props }
							label={ __( 'Fluid typography', 'unitone' ) }
						/>
					</ToolsPanelItem>
				) }

				{ ! isHalfLeadingDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasHalfLeadingValue( props ) }
						label={ __( 'Half leading', 'unitone' ) }
						onDeselect={ () => resetHalfLeading( props ) }
						isShownByDefault
						resetAllFilter={ () => resetHalfLeading( props ) }
						panelId={ props.clientId }
					>
						<HalfLeadingEdit
							{ ...props }
							label={ __( 'Half leading', 'unitone' ) }
						/>
					</ToolsPanelItem>
				) }

				{ ! isAutoPhraseDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasAutoPhraseValue( props ) }
						label={ __( 'Auto line breaks', 'unitone' ) }
						onDeselect={ () => resetAutoPhrase( props ) }
						isShownByDefault
						resetAllFilter={ () => resetAutoPhrase( props ) }
						panelId={ props.clientId }
					>
						<AutoPhraseEdit
							{ ...props }
							label={ __( 'Auto line breaks', 'unitone' ) }
						/>
					</ToolsPanelItem>
				) }
			</InspectorControls>
		</>
	);
}
