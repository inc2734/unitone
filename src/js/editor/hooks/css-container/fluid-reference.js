import clsx from 'clsx';

import { hasBlockSupport } from '@wordpress/blocks';
import { ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { HelpContainer } from '../components';
import { cleanEmptyObject, normalizeForToggleControl } from '../utils';

export function isFluidReferenceDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.fluidReference' );
}

export function resetFluidReferenceFilter() {
	return {
		fluidReference: undefined,
	};
}

export function getFluidReferenceEditLabel() {
	return __(
		'Base fluid scaling on ancestor container context (deprecated)',
		'unitone'
	);
}

export function FluidReferenceEdit( {
	attributes: { unitone },
	setAttributes,
} ) {
	const help = __(
		'For new settings, set an ancestor block’s container type to inline-size and enable “Base descendant blocks’ responsive behavior on container width”.',
		'unitone'
	);

	return (
		<HelpContainer help={ help } layout="horizontal">
			<ToggleControl
				__nextHasNoMarginBottom
				label={ getFluidReferenceEditLabel() }
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
		</HelpContainer>
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
