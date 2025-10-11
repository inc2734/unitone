import clsx from 'clsx';

import {
	withColors,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

export function resetHoverBackgroundColorFilter() {
	return {
		hoverBackgroundColor: undefined,
		customHoverBackgroundColor: undefined,
	};
}

export function resetHoverGradientFilter() {
	return {
		hoverGradient: undefined,
		customHoverGradient: undefined,
	};
}

export function isHoverBackgroundColorSupportDisabled( { name } ) {
	const blockType = wp.data.select( blocksStore ).getBlockType( name );
	const hasAttributes =
		!! blockType?.attributes?.hoverBackgroundColor &&
		!! blockType?.attributes?.customHoverBackgroundColor;

	return ! hasAttributes || ! hasBlockSupport( name, 'color' );
}

export function isHoverGradientSupportDisabled( { name } ) {
	const blockType = wp.data.select( blocksStore ).getBlockType( name );
	const hasAttributes =
		!! blockType?.attributes?.hoverGradient &&
		!! blockType?.attributes?.customHoverGradient;

	return ! hasAttributes || ! hasBlockSupport( name, 'color.gradients' );
}

export function HoverBackgroundColorEditPure( {
	name,
	attributes,
	setAttributes,
	clientId,
	hoverBackgroundColor,
	setHoverBackgroundColor,
} ) {
	const { hoverGradient, customHoverGradient } = attributes;
	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const isHoverGradientDisabled = isHoverGradientSupportDisabled( {
		name,
	} );

	const gradients = colorGradientSettings.gradients.flatMap(
		( palette ) => palette.gradients
	);
	const getGradientObject = ( obj ) =>
		gradients.find(
			( g ) =>
				Object.values( obj )[ 0 ] === g?.[ Object.keys( obj )[ 0 ] ]
		);

	return (
		<ColorGradientSettingsDropdown
			__experimentalIsRenderedInSidebar
			settings={ [
				{
					label: __( '[:hover] Background', 'unitone' ),
					colorValue: hoverBackgroundColor?.color,
					onColorChange: setHoverBackgroundColor,
					gradientValue:
						getGradientObject( { slug: hoverGradient } )
							?.gradient || customHoverGradient,
					onGradientChange: isHoverGradientDisabled
						? undefined
						: ( newAttribute ) => {
								const gradientObject = getGradientObject( {
									gradient: newAttribute,
								} );

								setAttributes( {
									hoverGradient: gradientObject?.slug,
									customHoverGradient: ! gradientObject
										? newAttribute
										: undefined,
								} );
						  },
					resetAllFilter: () => ( {
						...resetHoverBackgroundColorFilter(),
						...resetHoverGradientFilter(),
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

export const HoverBackgroundColorEdit = withColors( {
	hoverBackgroundColor: 'background-color',
} )( HoverBackgroundColorEditPure );

export function withHoverBackgroundColorBlockProps( settings ) {
	const { name, attributes } = settings;
	const {
		hoverBackgroundColor,
		customHoverBackgroundColor,
		hoverGradient,
		customHoverGradient,
	} = attributes;

	const blockType = wp.data.select( blocksStore ).getBlockType( name );
	const hasAttributes =
		( !! blockType?.attributes?.hoverBackgroundColor &&
			!! blockType?.attributes?.customHoverBackgroundColor ) ||
		( !! blockType?.attributes?.hoverGradient &&
			!! blockType?.attributes?.customHoverGradient );
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
				'has-background-hover':
					!! hoverBackgroundColor || !! customHoverBackgroundColor,
				'has-gradient-background-hover':
					!! hoverGradient || !! customHoverGradient,
			} ),
			style: {
				...settings.wrapperProps?.style,
				'--unitone--background-color--hover': !! hoverBackgroundColor
					? `var(--wp--preset--color--${ hoverBackgroundColor })`
					: customHoverBackgroundColor,
				'--unitone--background-image--hover': !! hoverGradient
					? `var(--wp--preset--gradient--${ hoverGradient })`
					: customHoverGradient,
			},
		},
	};
}
