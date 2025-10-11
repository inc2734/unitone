import clsx from 'clsx';

import {
	withColors,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

export function resetHoverTextColorFilter() {
	return {
		hoverTextColor: undefined,
		customHoverTextColor: undefined,
	};
}

export function isHoverTextColorSupportDisabled( { name } ) {
	const blockType = wp.data.select( blocksStore ).getBlockType( name );
	const hasAttributes =
		!! blockType?.attributes?.hoverTextColor &&
		!! blockType?.attributes?.customHoverTextColor;

	return ! hasAttributes || ! hasBlockSupport( name, 'color' );
}

export function HoverTextColorEditPure( {
	clientId,
	hoverTextColor,
	setHoverTextColor,
} ) {
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	return (
		<ColorGradientSettingsDropdown
			__experimentalIsRenderedInSidebar
			settings={ [
				{
					label: __( '[:hover] Text', 'unitone' ),
					colorValue: hoverTextColor?.color,
					onColorChange: setHoverTextColor,
					resetAllFilter: () => resetHoverTextColorFilter(),
					enableAlpha: true,
					clearable: true,
				},
			] }
			panelId={ clientId }
			{ ...colorGradientSettings }
		/>
	);
}

export const HoverTextColorEdit = withColors( {
	hoverTextColor: 'color',
} )( HoverTextColorEditPure );

export function withHoverTextColorBlockProps( settings ) {
	const { name, attributes } = settings;
	const { hoverTextColor, customHoverTextColor } = attributes;

	const blockType = wp.data.select( blocksStore ).getBlockType( name );
	const hasAttributes =
		!! blockType?.attributes?.hoverTextColor &&
		!! blockType?.attributes?.customHoverTextColor;
	if ( ! hasAttributes ) {
		return settings;
	}

	if ( ! hasBlockSupport( name, 'color' ) ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			className: clsx( settings.wrapperProps?.className, {
				'has-text-color-hover':
					!! hoverTextColor || !! customHoverTextColor,
			} ),
			style: {
				...settings.wrapperProps.style,
				'--unitone--color--hover': !! hoverTextColor
					? `var(--wp--preset--color--${ hoverTextColor })`
					: customHoverTextColor,
			},
		},
	};
}
