import clsx from 'clsx';

import {
	withColors,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

import { hasBlockSupport } from '@wordpress/blocks';
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
	return ! hasBlockSupport( name, 'color' );
}

export function isHoverGradientSupportDisabled( { name } ) {
	return ! hasBlockSupport( name, 'color.gradients' );
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

	if (
		isHoverBackgroundColorSupportDisabled( { name } ) &&
		isHoverGradientSupportDisabled( { name } )
	) {
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
