import clsx from 'clsx';

import { hasBlockSupport } from '@wordpress/blocks';
import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject, normalizeForSelectControl } from '../utils';

const textWrapOptions = [
	{ label: __( 'Default', 'unitone' ), value: '' },
	{ label: 'wrap', value: 'wrap' },
	{ label: 'nowrap', value: 'nowrap' },
	{ label: 'balance', value: 'balance' },
	{ label: 'pretty', value: 'pretty' },
];

export function hasTextWrapValue( { attributes: { unitone } } ) {
	return unitone?.textWrap !== undefined;
}

export function resetTextWrapFilter() {
	return {
		textWrap: undefined,
	};
}

export function resetTextWrap( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetTextWrapFilter() )
		),
	} );
}

export function isTextWrapSupportDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.textWrap' );
}

export function getTextWrapEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Text Wrapping', 'unitone' );
	const defaultCode = <code className="unitone-label-code">text-wrap</code>;

	if ( ! __withCode ) {
		return __unstableUnitoneSupports?.textWrap?.label || defaultLabel;
	}

	return (
		<>
			{ __unstableUnitoneSupports?.textWrap?.label || defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.textWrap?.code || defaultCode }
		</>
	);
}

export function TextWrapEdit( {
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	return (
		<SelectControl
			__nextHasNoMarginBottom
			label={ label }
			options={ textWrapOptions }
			value={ normalizeForSelectControl( unitone?.textWrap ) }
			onChange={ ( newValue ) => {
				const normalizedNewValue =
					normalizeForSelectControl( newValue );

				setAttributes( {
					unitone: cleanEmptyObject( {
						...unitone,
						textWrap: normalizedNewValue || undefined,
					} ),
				} );
			} }
		/>
	);
}

export function withTextWrapBlockProps( settings ) {
	const { attributes, name } = settings;

	if ( isTextWrapSupportDisabled( { name } ) ) {
		return settings;
	}

	const newTextWrap = attributes?.unitone?.textWrap;

	if ( null == newTextWrap || '' === newTextWrap ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				`-text-wrap:${ newTextWrap }`
			),
		},
	};
}
