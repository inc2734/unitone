import clsx from 'clsx';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject, normalizeForSelectControl } from '../utils';

const autoRepeatOptions = [
	{
		label: __( 'Default', 'unitone' ),
		value: '',
	},
	{
		label: '',
		value: undefined,
		disabled: true,
	},
	{
		label: __( 'auto-fill', 'unitone' ),
		value: 'auto-fill',
	},
	{
		label: __( 'auto-fit', 'unitone' ),
		value: 'auto-fit',
	},
];

function getDefaultValue( { name } ) {
	return wp.data.select( blocksStore ).getBlockType( name )?.attributes
		?.unitone?.default?.autoRepeat;
}

function useDefaultValue( { name } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.autoRepeat;
	}, [] );

	return defaultValue;
}

export function isAutoRepeatSupportDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.autoRepeat' );
}

export function hasAutoRepeatValue( { name, attributes: { unitone } } ) {
	const defaultValue = getDefaultValue( { name } );

	return (
		defaultValue !== unitone?.autoRepeat &&
		undefined !== unitone?.autoRepeat
	);
}

export function resetAutoRepeatFilter() {
	return {
		autoRepeat: undefined,
	};
}

export function resetAutoRepeat( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetAutoRepeatFilter() )
		),
	} );
}

export function getAutoRepeatEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Auto repeat', 'unitone' );
	const defaultCode = <code>auto-repeat</code>;

	if ( ! __withCode ) {
		return __unstableUnitoneSupports?.autoRepeat?.label || defaultLabel;
	}

	return (
		<>
			{ __unstableUnitoneSupports?.autoRepeat?.label || defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.autoRepeat?.code || defaultCode }
		</>
	);
}

export function AutoRepeatEdit( {
	label,
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useDefaultValue( { name } );

	return (
		<SelectControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ label }
			value={ normalizeForSelectControl(
				unitone?.autoRepeat ?? defaultValue
			) }
			options={ autoRepeatOptions }
			onChange={ ( newValue ) => {
				const normalizedNewValue =
					normalizeForSelectControl( newValue );

				setAttributes( {
					unitone: cleanEmptyObject( {
						...unitone,
						autoRepeat: normalizedNewValue || undefined,
					} ),
				} );
			} }
		/>
	);
}

export function withAutoRepeatBlockProps( settings ) {
	const { attributes, name } = settings;

	if ( isAutoRepeatSupportDisabled( { name } ) ) {
		return settings;
	}

	const defaultValue = getDefaultValue( { name } );
	const newAutoRepeat = attributes?.unitone?.autoRepeat ?? defaultValue ?? '';

	if ( '' === newAutoRepeat ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				`-auto-repeat:${ newAutoRepeat }`
			),
		},
	};
}
