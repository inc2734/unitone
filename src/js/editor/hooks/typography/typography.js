/**
 * https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/typography.js
 */

import fastDeepEqual from 'fast-deep-equal/es6';

import { InspectorControls } from '@wordpress/block-editor';
import { __experimentalToolsPanelItem as ToolsPanelItem } from '@wordpress/components';
import { memo } from '@wordpress/element';
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

import './fluid-font-size-magnification';

import {
	useIsBackgroundClipDisabled,
	getBackgroundClipEditLabel,
	hasBackgroundClipValue,
	resetBackgroundClip,
	BackgroundClipEdit,
	useBackgroundClipBlockProps,
} from './background-clip';

export {
	useAutoPhraseBlockProps,
	useFluidTypographyBlockProps,
	useHalfLeadingBlockProps,
	useBackgroundClipBlockProps,
};

function TypographyPanelPure( props ) {
	const { clientId, name, attributes } = props;

	const isAutoPhraseDisabled = useIsAutoPhraseDisabled( { name } );
	const isFluidTypographyDisabled = useIsFluidTypographyDisabled( { name } );
	const isHalfLeadingDisabled = useIsHalfLeadingDisabled( { name } );
	const isBackgroundClipDisabled = useIsBackgroundClipDisabled( { name } );

	if (
		isAutoPhraseDisabled &&
		isFluidTypographyDisabled &&
		isHalfLeadingDisabled &&
		isBackgroundClipDisabled
	) {
		return null;
	}

	return (
		<>
			<InspectorControls group="typography">
				{ ! isHalfLeadingDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasHalfLeadingValue( { ...props } ) }
						label={ __( 'Half leading', 'unitone' ) }
						onDeselect={ () => resetHalfLeading( { ...props } ) }
						resetAllFilter={ () =>
							resetHalfLeading( { ...props } )
						}
						isShownByDefault
						panelId={ clientId }
					>
						<HalfLeadingEdit
							{ ...props }
							label={ __( 'Half leading', 'unitone' ) }
							help={
								! attributes?.unitone?.fluidTypography &&
								null != attributes?.style?.typography?.fontSize
									? __(
											"If custom font sizes are enabled and fluid typography isn't enabled, it is recommended that half-reading be specified.",
											'unitone'
									  )
									: undefined
							}
						/>
					</ToolsPanelItem>
				) }

				{ ! isFluidTypographyDisabled && (
					<ToolsPanelItem
						hasValue={ () =>
							hasFluidTypographyValue( { ...props } )
						}
						label={ __( 'Fluid typography', 'unitone' ) }
						onDeselect={ () =>
							resetFluidTypography( { ...props } )
						}
						resetAllFilter={ () =>
							resetFluidTypography( { ...props } )
						}
						isShownByDefault
						panelId={ clientId }
					>
						<FluidTypographyEdit
							{ ...props }
							label={ __( 'Fluid typography', 'unitone' ) }
						/>
					</ToolsPanelItem>
				) }

				{ ! isAutoPhraseDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasAutoPhraseValue( { ...props } ) }
						label={ __( 'Auto line breaks', 'unitone' ) }
						onDeselect={ () => resetAutoPhrase( { ...props } ) }
						resetAllFilter={ () => resetAutoPhrase( { ...props } ) }
						isShownByDefault
						panelId={ clientId }
					>
						<AutoPhraseEdit
							{ ...props }
							label={ __( 'Auto line breaks', 'unitone' ) }
						/>
					</ToolsPanelItem>
				) }

				{ ! isBackgroundClipDisabled && (
					<ToolsPanelItem
						hasValue={ () =>
							hasBackgroundClipValue( { ...props } )
						}
						label={ getBackgroundClipEditLabel( { ...props } ) }
						onDeselect={ () => resetBackgroundClip( { ...props } ) }
						resetAllFilter={ () =>
							resetBackgroundClip( { ...props } )
						}
						isShownByDefault
						panelId={ clientId }
					>
						<BackgroundClipEdit
							{ ...props }
							label={ getBackgroundClipEditLabel( {
								...props,
								__withCode: true,
							} ) }
							help={ __(
								'This can be set when a background image or background gradient is set for this block.',
								'unitone'
							) }
						/>
					</ToolsPanelItem>
				) }
			</InspectorControls>
		</>
	);
}

export const TypographyPanel = memo(
	TypographyPanelPure,
	( oldProps, newProps ) => fastDeepEqual( oldProps, newProps )
);
