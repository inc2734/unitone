import { __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { hasBlockSupport } from '@wordpress/blocks';

import { cleanEmptyObject, normalizeForUnitControl } from '../utils';

export function hasFluidTypographyMinLengthValue( {
	attributes: { unitone },
} ) {
	return unitone?.fluidTypographyMinLength !== undefined;
}

export function resetFluidTypographyMinLengthFilter() {
	return {
		fluidTypographyMinLength: undefined,
	};
}

export function resetFluidTypographyMinLength( {
	attributes: { unitone },
	setAttributes,
} ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign(
				{ ...unitone },
				resetFluidTypographyMinLengthFilter()
			)
		),
	} );
}

export function isFluidTypographyMinLengthSupportDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.fluidTypography' );
}

export function FluidTypographyMinLengthEdit( {
	label,
	attributes,
	setAttributes,
} ) {
	return (
		<UnitControl
			__next40pxDefaultSize
			label={ label }
			value={ normalizeForUnitControl(
				attributes?.unitone?.fluidTypographyMinLength
			) }
			style={ { width: '100%' } }
			onChange={ ( newValue ) => {
				const normalizedNewValue = normalizeForUnitControl( newValue );

				setAttributes( {
					unitone: cleanEmptyObject( {
						...attributes?.unitone,
						fluidTypographyMinLength:
							normalizedNewValue || undefined,
					} ),
				} );
			} }
		/>
	);
}

export function withFluidTypographyMinLengthBlockProps( settings ) {
	const { attributes, name } = settings;

	if ( isFluidTypographyMinLengthSupportDisabled( { name } ) ) {
		return settings;
	}

	const fluidTypography = attributes?.unitone?.fluidTypography;
	const newFluidTypographyMinLength =
		attributes?.unitone?.fluidTypographyMinLength;

	if ( null == fluidTypography || null == newFluidTypographyMinLength ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			style: {
				...settings.wrapperProps?.style,
				'--unitone--fluid-typography-min-length':
					newFluidTypographyMinLength,
			},
		},
	};
}
