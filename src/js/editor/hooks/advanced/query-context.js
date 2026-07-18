import clsx from 'clsx';

import { hasBlockSupport } from '@wordpress/blocks';
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';

import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

export function isQueryContextDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.queryContext' );
}

export function resetQueryContextFilter() {
	return {
		queryContext: undefined,
	};
}

export function QueryContextEdit( { attributes: { unitone }, setAttributes } ) {
	return (
		<ToggleGroupControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			isBlock
			label={ __( 'Query context', 'unitone' ) }
			value={
				'container' === unitone?.queryContext ? 'container' : 'media'
			}
			onChange={ ( value ) =>
				setAttributes( {
					unitone: cleanEmptyObject( {
						...unitone,
						queryContext:
							'container' === value ? 'container' : undefined,
					} ),
				} )
			}
		>
			<ToggleGroupControlOption label="@media" value="media" />
			<ToggleGroupControlOption label="@container" value="container" />
		</ToggleGroupControl>
	);
}

export function withQueryContextBlockProps( settings ) {
	const { attributes, name } = settings;

	if ( isQueryContextDisabled( { name } ) ) {
		return settings;
	}

	const queryContextLayout = clsx(
		settings.wrapperProps?.[ 'data-unitone-layout' ],
		{
			'@container': 'container' === attributes?.unitone?.queryContext,
		}
	);

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': queryContextLayout || undefined,
		},
	};
}
