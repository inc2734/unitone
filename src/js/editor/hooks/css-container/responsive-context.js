import clsx from 'clsx';

import { hasBlockSupport } from '@wordpress/blocks';
import { ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { HelpContainer } from '../components';
import { cleanEmptyObject, normalizeForToggleControl } from '../utils';
import { isContainerTypeDisabled } from './container-type';

export function isResponsiveContextDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.responsiveContext' );
}

export function resetResponsiveContextFilter() {
	return { responsiveContext: undefined };
}

export function getResponsiveContextEditLabel() {
	return __(
		'Base descendant blocks’ responsive behavior on container width',
		'unitone'
	);
}

export function ResponsiveContextEdit( {
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const disabled =
		isContainerTypeDisabled( { name } ) ||
		'inline-size' !== unitone?.containerType;

	const help = __(
		'Base descendant blocks’ fluid sizes (text, spacing, and more) and block-specific responsive CSS on container width. This can be enabled when this block’s container type is inline-size.',
		'unitone'
	);

	return (
		<HelpContainer help={ help } layout="horizontal">
			<ToggleControl
				__nextHasNoMarginBottom
				label={ getResponsiveContextEditLabel() }
				disabled={ disabled }
				checked={ ! disabled && true === unitone?.responsiveContext }
				onChange={ ( value ) => {
					if ( disabled ) {
						return;
					}

					setAttributes( {
						unitone: cleanEmptyObject( {
							...unitone,
							responsiveContext:
								normalizeForToggleControl( value ) || undefined,
						} ),
					} );
				} }
			/>
		</HelpContainer>
	);
}

export function withResponsiveContextBlockProps( settings ) {
	const { attributes, name } = settings;

	if (
		isResponsiveContextDisabled( { name } ) ||
		isContainerTypeDisabled( { name } )
	) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout':
				clsx( settings.wrapperProps?.[ 'data-unitone-layout' ], {
					'-responsive-context:container':
						'inline-size' === attributes?.unitone?.containerType &&
						true === attributes?.unitone?.responsiveContext,
				} ) || undefined,
		},
	};
}
