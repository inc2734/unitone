import clsx from 'clsx';

import { useMemo } from '@wordpress/element';
import { hasBlockSupport } from '@wordpress/blocks';
import { ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

export function hasFluidTypographyValue( { attributes: { unitone } } ) {
	return unitone?.fluidTypography !== undefined;
}

export function resetFluidTypographyFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			fluidTypography: undefined,
		},
	};
}

export function resetFluidTypography( {
	attributes: { unitone },
	setAttributes,
} ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetFluidTypographyFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsFluidTypographyDisabled( { name } ) {
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
			checked={ attributes?.unitone?.fluidTypography }
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

function useBlockProps( extraProps, blockType, attributes ) {
	const unitoneLayout = useMemo( () => {
		if ( ! hasBlockSupport( blockType, 'unitone.fluidTypography' ) ) {
			return extraProps?.[ 'data-unitone-layout' ];
		}

		if ( null == attributes?.unitone?.fluidTypography ) {
			return extraProps?.[ 'data-unitone-layout' ];
		}

		return clsx(
			extraProps?.[ 'data-unitone-layout' ],
			'-fluid-typography'
		);
	}, [
		blockType,
		extraProps?.[ 'data-unitone-layout' ],
		attributes?.unitone?.fluidTypography,
		attributes?.style?.typography?.fontSize,
	] );

	return {
		...extraProps,
		'data-unitone-layout': unitoneLayout,
	};
}

export function useFluidTypographyBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	const newFluidTypographyProp = useBlockProps( wrapperProps, name, {
		style: {
			typography: {
				fontSize: attributes?.style?.typography?.fontSize,
			},
		},
		unitone: {
			fluidTypography: attributes?.unitone?.fluidTypography,
		},
	} );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...newFluidTypographyProp,
		},
	};
}

export function getFontSizeStatus( customFontSize ) {
	const fluidFontSizeUnits = [ 'vw', 'vh' ];

	const enabled = null != customFontSize;
	const fluid = fluidFontSizeUnits.some( ( unit ) =>
		customFontSize?.match( new RegExp( `${ unit }$` ) )
	);
	const fixed = enabled && ! fluid;

	return { enabled, fluid, fixed };
}
