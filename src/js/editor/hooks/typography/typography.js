/**
 * https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/typography.js
 */

import fastDeepEqual from 'fast-deep-equal/es6';

import { InspectorControls } from '@wordpress/block-editor';
import { compose } from '@wordpress/compose';
import { __experimentalToolsPanelItem as ToolsPanelItem } from '@wordpress/components';
import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

import {
	isAutoPhraseSupportDisabled,
	hasAutoPhraseValue,
	resetAutoPhraseFilter,
	resetAutoPhrase,
	AutoPhraseEdit,
	withAutoPhraseBlockProps,
} from './auto-phrase';

import {
	isFluidTypographySupportDisabled,
	hasFluidTypographyValue,
	resetFluidTypographyFilter,
	resetFluidTypography,
	FluidTypographyEdit,
	withFluidTypographyBlockProps,
} from './fluid-typography';

import {
	isFluidTypographyMinLengthSupportDisabled,
	hasFluidTypographyMinLengthValue,
	resetFluidTypographyMinLengthFilter,
	resetFluidTypographyMinLength,
	FluidTypographyMinLengthEdit,
	withFluidTypographyMinLengthBlockProps,
} from './fluid-typography-min-length';

import {
	isHalfLeadingSupportDisabled,
	hasHalfLeadingValue,
	resetHalfLeadingFilter,
	resetHalfLeading,
	HalfLeadingEdit,
	withHalfLeadingBlockProps,
} from './half-leading';

import {
	isBackgroundClipSupportDisabled,
	getBackgroundClipEditLabel,
	hasBackgroundClipValue,
	resetBackgroundClipFilter,
	resetBackgroundClip,
	BackgroundClipEdit,
	withBackgroundClipBlockProps,
} from './background-clip';

import {
	isLinkDecorationSupportDisabled,
	getLinkDecorationEditLabel,
	hasLinkDecorationValue,
	resetLinkDecorationFilter,
	resetLinkDecoration,
	LinkDecorationEdit,
	withLinkDecorationBlockProps,
} from './link-decoration';

export const withTypographyBlockProps = compose(
	withAutoPhraseBlockProps,
	withFluidTypographyBlockProps,
	withFluidTypographyMinLengthBlockProps,
	withHalfLeadingBlockProps,
	withBackgroundClipBlockProps,
	withLinkDecorationBlockProps
);

export const resetTypography = ( props ) => {
	const filters = [
		[ isAutoPhraseSupportDisabled, resetAutoPhraseFilter ],
		[ isFluidTypographySupportDisabled, resetFluidTypographyFilter ],
		[
			isFluidTypographyMinLengthSupportDisabled,
			resetFluidTypographyMinLengthFilter,
		],
		[ isHalfLeadingSupportDisabled, resetHalfLeadingFilter ],
		[ isBackgroundClipSupportDisabled, resetBackgroundClipFilter ],
		[ isLinkDecorationSupportDisabled, resetLinkDecorationFilter ],
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

function TypographyPanelPure( props ) {
	const { name, attributes, setAttributes, clientId } = props;

	const isAutoPhraseDisabled = isAutoPhraseSupportDisabled( { name } );
	const isFluidTypographyDisabled = isFluidTypographySupportDisabled( {
		name,
	} );
	const isFluidTypographyMinLengthDisabled =
		isFluidTypographyMinLengthSupportDisabled( {
			name,
		} );
	const isHalfLeadingDisabled = isHalfLeadingSupportDisabled( { name } );
	const isBackgroundClipDisabled = isBackgroundClipSupportDisabled( {
		name,
	} );
	const isLinkDecorationDisabled = isLinkDecorationSupportDisabled( {
		name,
	} );

	if (
		isAutoPhraseDisabled &&
		isFluidTypographyDisabled &&
		isFluidTypographyMinLengthDisabled &&
		isHalfLeadingDisabled &&
		isBackgroundClipDisabled &&
		isLinkDecorationDisabled
	) {
		return null;
	}

	return (
		<>
			<InspectorControls
				group="typography"
				resetAllFilter={ () => {
					setAttributes( {
						unitone: cleanEmptyObject(
							Object.assign(
								{ ...attributes?.unitone },
								resetAutoPhraseFilter(),
								resetFluidTypographyFilter(),
								resetFluidTypographyMinLengthFilter(),
								resetHalfLeadingFilter(),
								resetBackgroundClipFilter(),
								resetLinkDecorationFilter()
							)
						),
					} );
				} }
			>
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

				{ ! isFluidTypographyMinLengthDisabled && (
					<ToolsPanelItem
						hasValue={ () =>
							hasFluidTypographyMinLengthValue( { ...props } )
						}
						label={ __( 'Minimum font size', 'unitone' ) }
						onDeselect={ () =>
							resetFluidTypographyMinLength( { ...props } )
						}
						isShownByDefault
						panelId={ clientId }
					>
						<FluidTypographyMinLengthEdit
							{ ...props }
							label={ __( 'Minimum font size', 'unitone' ) }
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

				{ ! isBackgroundClipDisabled && (
					<ToolsPanelItem
						hasValue={ () =>
							hasBackgroundClipValue( { ...props } )
						}
						label={ getBackgroundClipEditLabel( { ...props } ) }
						onDeselect={ () => resetBackgroundClip( { ...props } ) }
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

				{ ! isLinkDecorationDisabled && (
					<ToolsPanelItem
						hasValue={ () =>
							hasLinkDecorationValue( { ...props } )
						}
						label={ getLinkDecorationEditLabel( { ...props } ) }
						onDeselect={ () => resetLinkDecoration( { ...props } ) }
						isShownByDefault={ false }
						panelId={ clientId }
					>
						<LinkDecorationEdit
							{ ...props }
							label={ getLinkDecorationEditLabel( {
								...props,
							} ) }
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
