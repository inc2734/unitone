import clsx from 'clsx';

import { hasBlockSupport } from '@wordpress/blocks';
import { ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

export function hasFluidTypographyValue( { attributes: { unitone } } ) {
	return unitone?.fluidTypography !== undefined;
}

export function resetFluidTypographyFilter() {
	return {
		fluidTypography: undefined,
	};
}

export function resetFluidTypography( {
	attributes: { unitone },
	setAttributes,
} ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetFluidTypographyFilter() )
		),
	} );
}

export function isFluidTypographySupportDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.fluidTypography' );
}

export function FluidTypographyEdit( { label, attributes, setAttributes } ) {
	const fontSizeStatus = getFontSizeStatus(
		attributes?.style?.typography?.fontSize
	);

	let help = __(
		'When enabled, font size and line-height will change fluidly with screen width.',
		'unitone'
	);
	if ( fontSizeStatus.fluid ) {
		help = __(
			'When enabled, line-height will change fluidly with screen width.',
			'unitone'
		);
	} else if ( fontSizeStatus.fixed ) {
		help = __(
			"Custom font size isn't fluid and can't be enabled.",
			'unitone'
		);
	}

	return (
		<ToggleControl
			__nextHasNoMarginBottom
			label={ label }
			help={ help }
			disabled={ fontSizeStatus.fixed }
			checked={ attributes?.unitone?.fluidTypography ?? false }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...attributes?.unitone,
					fluidTypography: newValue || undefined,
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

export function withFluidTypographyBlockProps( settings ) {
	const { attributes, name } = settings;

	if ( ! hasBlockSupport( name, 'unitone.fluidTypography' ) ) {
		return settings;
	}

	const newFluidTypography = attributes?.unitone?.fluidTypography;

	if ( null == newFluidTypography ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				'-fluid-typography'
			),
		},
	};
}

export function getFontSizeStatus( customFontSize ) {
	const fluidFontSizeUnits = [ 'vw', 'vh' ];

	const enabled = null != customFontSize;
	const fluid =
		!! customFontSize &&
		fluidFontSizeUnits.some( ( unit ) =>
			customFontSize?.toString()?.match( new RegExp( `${ unit }$` ) )
		);
	const fixed = enabled && ! fluid;

	return { enabled, fluid, fixed };
}
