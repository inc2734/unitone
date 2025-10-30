import clsx from 'clsx';

import {
	withColors,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

import { hasBlockSupport } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

export function resetHoverBorderColorFilter() {
	return {
		hoverBorderColor: undefined,
		customHoverBorderColor: undefined,
	};
}

export function isHoverBorderColorSupportDisabled( { name } ) {
	return ! hasBlockSupport( name, '__experimentalBorder.color' );
}

export function HoverBorderColorEditPure( {
	clientId,
	hoverBorderColor,
	setHoverBorderColor,
} ) {
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	return (
		<ColorGradientSettingsDropdown
			__experimentalIsRenderedInSidebar
			settings={ [
				{
					label: __( '[:hover] Border', 'unitone' ),
					colorValue: hoverBorderColor?.color,
					onColorChange: setHoverBorderColor,
					resetAllFilter: () => ( {
						...resetHoverBorderColorFilter(),
					} ),
					enableAlpha: true,
					clearable: true,
				},
			] }
			panelId={ clientId }
			{ ...colorGradientSettings }
		/>
	);
}

export const HoverBorderColorEdit = withColors( {
	hoverBorderColor: 'border-color',
} )( HoverBorderColorEditPure );

export function withHoverBorderColorBlockProps( settings ) {
	const { name, attributes } = settings;
	const { hoverBorderColor, customHoverBorderColor } = attributes;

	// @todo
	// const blockType = wp.data.select( blocksStore ).getBlockType( name );
	// const hasAttributes =
	// 	!! blockType?.attributes?.hoverBorderColor &&
	// 	!! blockType?.attributes?.customHoverBorderColor;
	// if ( ! hasAttributes ) {
	// 	return settings;
	// }

	if ( isHoverBorderColorSupportDisabled( { name } ) ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			className: clsx( settings.wrapperProps?.className, {
				'has-border-color-hover':
					!! hoverBorderColor || !! customHoverBorderColor,
			} ),
			style: {
				...settings.wrapperProps.style,
				'--unitone--border-color--hover': !! hoverBorderColor
					? `var(--wp--preset--color--${ hoverBorderColor })`
					: customHoverBorderColor,
			},
		},
	};
}
