import clsx from 'clsx';

import { hasBlockSupport } from '@wordpress/blocks';
import { ToggleControl } from '@wordpress/components';
import { useMemo } from '@wordpress/element';

import { cleanEmptyObject } from '../utils';

export function hasFluidTypographyValue( { unitone } ) {
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

export function resetFluidTypography( { unitone, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetFluidTypographyFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsFluidTypographyDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.fluidTypography' );
}

export function FluidTypographyEdit( { label, unitone, setAttributes } ) {
	return (
		<ToggleControl
			__nextHasNoMarginBottom
			label={ label }
			checked={ !! unitone?.fluidTypography }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					fluidTypography: newValue || undefined,
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

export function saveFluidTypographyProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.fluidTypography' ) ) {
		return extraProps;
	}

	if ( null == attributes?.unitone?.fluidTypography ) {
		return extraProps;
	}

	return {
		...extraProps,
		'data-unitone-layout': clsx(
			extraProps?.[ 'data-unitone-layout' ],
			'-fluid-typography'
		),
	};
}

export function useFluidTypographyBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	const newFluidTypographyProp = useMemo( () => {
		return saveFluidTypographyProp( wrapperProps, name, {
			unitone: {
				fluidTypography:
					attributes?.unitone?.fluidTypography ?? undefined,
			},
		} );
	}, [
		JSON.stringify( attributes?.unitone ),
		attributes?.__unstableUnitoneBlockOutline,
	] );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...newFluidTypographyProp,
		},
	};
}
