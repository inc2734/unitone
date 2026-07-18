import clsx from 'clsx';

import { hasBlockSupport } from '@wordpress/blocks';
import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

export function isContainerTypeDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.containerType' );
}

export function resetContainerTypeFilter() {
	return {
		containerType: undefined,
	};
}

export function ContainerTypeEdit( {
	attributes: { unitone },
	setAttributes,
} ) {
	return (
		<SelectControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={
				<>
					{ __( 'Container type', 'unitone' ) }
					&nbsp;:&nbsp;
					<code className="unitone-label-code">container-type</code>
				</>
			}
			value={ unitone?.containerType || '' }
			options={ [
				{
					label: __( 'None', 'unitone' ),
					value: '',
				},
				{
					label: 'inline-size',
					value: 'inline-size',
				},
			] }
			onChange={ ( value ) =>
				setAttributes( {
					unitone: cleanEmptyObject( {
						...unitone,
						containerType: value || undefined,
					} ),
				} )
			}
		/>
	);
}

export function withContainerTypeBlockProps( settings ) {
	const { attributes, name } = settings;

	if ( isContainerTypeDisabled( { name } ) ) {
		return settings;
	}

	const containerTypeLayout = clsx(
		settings.wrapperProps?.[ 'data-unitone-layout' ],
		{
			[ `-container-type:${ attributes?.unitone?.containerType }` ]:
				!! attributes?.unitone?.containerType,
		}
	);

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': containerTypeLayout || undefined,
		},
	};
}
