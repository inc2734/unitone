import clsx from 'clsx';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

const autoRepeatOptions = [
	{
		label: '',
		value: '',
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

export function isAutoRepeatSupportDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.autoRepeat' );
}

export function hasAutoRepeatValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.autoRepeat;

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
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.autoRepeat;
	}, [] );

	return (
		<SelectControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ label }
			value={ unitone?.autoRepeat ?? defaultValue ?? '' }
			options={ autoRepeatOptions }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					autoRepeat: newValue || undefined,
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

export function withAutoRepeatBlockProps( settings ) {
	const { attributes, name } = settings;

	if ( ! hasBlockSupport( name, 'unitone.autoRepeat' ) ) {
		return settings;
	}

	const newAutoRepeat = attributes?.unitone?.autoRepeat;

	if ( null == newAutoRepeat ) {
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
