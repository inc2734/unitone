import clsx from 'clsx';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
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

export function useIsAutoRepeatDisabled( { name } ) {
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

export function resetAutoRepeatFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			autoRepeat: undefined,
		},
	};
}

export function resetAutoRepeat( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetAutoRepeatFilter( { unitone } )?.unitone
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

export function AutoRepeatEdit( { name, label, unitone, setAttributes } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.autoRepeat;
	}, [] );

	return (
		<SelectControl
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

function useBlockProps( extraProps, blockType, attributes ) {
	const unitoneLayout = useMemo( () => {
		if ( ! hasBlockSupport( blockType, 'unitone.autoRepeat' ) ) {
			return extraProps?.[ 'data-unitone-layout' ];
		}

		if ( null == attributes?.unitone?.autoRepeat ) {
			return extraProps?.[ 'data-unitone-layout' ];
		}

		return clsx(
			extraProps?.[ 'data-unitone-layout' ],
			`-auto-repeat:${ attributes.unitone?.autoRepeat }`
		);
	}, [
		blockType,
		extraProps?.[ 'data-unitone-layout' ],
		attributes?.unitone?.autoRepeat,
	] );

	return {
		...extraProps,
		'data-unitone-layout': unitoneLayout,
	};
}

export function useAutoRepeatBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.autoRepeat;
		},
		[ name ]
	);

	const newAutoRepeatProp = useBlockProps( wrapperProps, name, {
		unitone: {
			autoRepeat: attributes?.unitone?.autoRepeat ?? defaultValue,
		},
	} );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...newAutoRepeatProp,
		},
	};
}
