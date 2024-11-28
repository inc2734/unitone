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
	] );

	return {
		...extraProps,
		'data-unitone-layout': unitoneLayout,
	};
}

export function useFluidTypographyBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	const newFluidTypographyProp = useBlockProps( wrapperProps, name, {
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
