import clsx from 'clsx';

import { hasBlockSupport } from '@wordpress/blocks';
import { ToggleControl } from '@wordpress/components';

import { cleanEmptyObject } from '../utils';

export function hasTextOverflowValue( { attributes: { unitone } } ) {
	return unitone?.textOverflow !== undefined;
}

export function resetTextOverflowFilter() {
	return {
		textOverflow: undefined,
	};
}

export function resetTextOverflow( {
	attributes: { unitone },
	setAttributes,
} ) {
	setAttributes( {
		unitone: cleanEmptyObject( {
			...unitone,
			...resetTextOverflowFilter(),
		} ),
	} );
}

export function isTextOverflowSupportDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.textOverflow' );
}

export function isTextOverflowActive( { name, attributes } ) {
	return (
		! isTextOverflowSupportDisabled( { name } ) &&
		'ellipsis' === attributes?.unitone?.textOverflow
	);
}

export function TextOverflowEdit( {
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	return (
		<ToggleControl
			__nextHasNoMarginBottom
			label={ label }
			checked={ 'ellipsis' === unitone?.textOverflow }
			onChange={ ( newValue ) => {
				setAttributes( {
					unitone: cleanEmptyObject( {
						...unitone,
						textOverflow: newValue ? 'ellipsis' : undefined,
					} ),
				} );
			} }
		/>
	);
}

export function withTextOverflowBlockProps( settings ) {
	// Match the frontend even while selected so enabling the setting has visible feedback.
	if ( ! isTextOverflowActive( settings ) ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				'-text-overflow:ellipsis'
			),
		},
	};
}
