/**
 * https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/typography.js
 */

import fastDeepEqual from 'fast-deep-equal/es6';

import { InspectorControls } from '@wordpress/block-editor';
import { __experimentalToolsPanelItem as ToolsPanelItem } from '@wordpress/components';
import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

import {
	useIsAutoPhraseDisabled,
	hasAutoPhraseValue,
	resetAutoPhraseFilter,
	resetAutoPhrase,
	AutoPhraseEdit,
	useAutoPhraseBlockProps,
} from './auto-phrase';

import {
	useIsFluidTypographyDisabled,
	hasFluidTypographyValue,
	resetFluidTypographyFilter,
	resetFluidTypography,
	FluidTypographyEdit,
	useFluidTypographyBlockProps,
} from './fluid-typography';

import {
	useIsHalfLeadingDisabled,
	hasHalfLeadingValue,
	resetHalfLeadingFilter,
	resetHalfLeading,
	HalfLeadingEdit,
	useHalfLeadingBlockProps,
} from './half-leading';

import './fluid-font-size-magnification';

export {
	useAutoPhraseBlockProps,
	useFluidTypographyBlockProps,
	useHalfLeadingBlockProps,
};

function TypographyPanelPure( props ) {
	const { clientId, name, attributes } = props;

	const resetAllFilters = [
		resetAutoPhraseFilter,
		resetFluidTypographyFilter,
		resetHalfLeadingFilter,
	];

	const resetAllFilter = ( _attributes ) => {
		// Because the ToolsPanel popover display does't update when "Reset All" is clicked.
		attributes.unitone = cleanEmptyObject(
			resetAllFilters.reduce(
				( accumulator, filter ) => filter( accumulator ),
				_attributes
			)?.unitone
		);

		return {
			..._attributes,
			unitone: attributes.unitone,
		};
	};

	const isAutoPhraseDisabled = useIsAutoPhraseDisabled( { name } );
	const isFluidTypographyDisabled = useIsFluidTypographyDisabled( { name } );
	const isHalfLeadingDisabled = useIsHalfLeadingDisabled( { name } );

	if (
		isAutoPhraseDisabled &&
		isFluidTypographyDisabled &&
		isHalfLeadingDisabled
	) {
		return null;
	}

	return (
		<>
			<InspectorControls
				group="typography"
				resetAllFilter={ resetAllFilter }
			>
				{ ! isFluidTypographyDisabled && (
					<ToolsPanelItem
						hasValue={ () =>
							hasFluidTypographyValue( { ...props } )
						}
						label={ __( 'Fluid typography', 'unitone' ) }
						onDeselect={ () =>
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

				{ ! isHalfLeadingDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasHalfLeadingValue( { ...props } ) }
						label={ __( 'Half leading', 'unitone' ) }
						onDeselect={ () => resetHalfLeading( { ...props } ) }
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

				{ ! isAutoPhraseDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasAutoPhraseValue( { ...props } ) }
						label={ __( 'Auto line breaks', 'unitone' ) }
						onDeselect={ () => resetAutoPhrase( { ...props } ) }
						isShownByDefault
						panelId={ clientId }
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

export const TypographyPanel = memo(
	TypographyPanelPure,
	( oldProps, newProps ) => fastDeepEqual( oldProps, newProps )
);
