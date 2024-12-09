/**
 * https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/typography.js
 */

import fastDeepEqual from 'fast-deep-equal/es6';

import { InspectorControls } from '@wordpress/block-editor';
import { __experimentalToolsPanelItem as ToolsPanelItem } from '@wordpress/components';
import { memo, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

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

export {
	useAutoPhraseBlockProps,
	useFluidTypographyBlockProps,
	useHalfLeadingBlockProps,
};

function TypographyPanelPure( props ) {
	const { clientId, name, attributes } = props;

	const resetAllFilter = useCallback( ( _attributes ) => {
		_attributes = resetAutoPhraseFilter( _attributes );
		_attributes = resetFluidTypographyFilter( _attributes );
		_attributes = resetHalfLeadingFilter( _attributes );

		return _attributes;
	}, [] );

	const isAutoPhraseDisabled = useIsAutoPhraseDisabled( { name } );
	const isFluidTypographyDisabled = useIsFluidTypographyDisabled( {
		name,
		fontSize: attributes?.style?.typography?.fontSize,
	} );
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
								null != attributes?.style?.typography?.fontSize
									? __(
											'When custom font sizes are enabled, it is recommended that half-reading be specified since line heights are not automatically optimized.',
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
