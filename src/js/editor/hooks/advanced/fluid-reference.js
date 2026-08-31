import clsx from 'clsx';

import { hasBlockSupport } from '@wordpress/blocks';
import { ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject, normalizeForToggleControl } from '../utils';

export function isFluidReferenceDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.fluidReference' );
}

export function resetFluidReferenceFilter() {
	return {
		fluidReference: undefined,
	};
}

export function FluidReferenceEdit( {
	attributes: { unitone },
	setAttributes,
} ) {
	return (
		<ToggleControl
			__nextHasNoMarginBottom
			label={ __(
				'Base fluid scaling on ancestor container',
				'unitone'
			) }
			checked={ normalizeForToggleControl( unitone?.fluidReference ) }
			onChange={ ( value ) =>
				setAttributes( {
					unitone: cleanEmptyObject( {
						...unitone,
						fluidReference:
							normalizeForToggleControl( value ) || undefined,
					} ),
				} )
			}
		/>
	);
}

export function withFluidReferenceBlockProps( settings ) {
	const { attributes, name } = settings;

	if ( isFluidReferenceDisabled( { name } ) ) {
		return settings;
	}

	const fluidReferenceLayout = clsx(
		settings.wrapperProps?.[ 'data-unitone-layout' ],
		{
			'-fluid-reference:cqw': !! attributes?.unitone?.fluidReference,
		}
	);

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': fluidReferenceLayout || undefined,
		},
	};
}
