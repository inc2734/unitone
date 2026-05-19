import deepmerge from 'deepmerge';

import {
	getBlockSupport,
	hasBlockSupport,
	store as blocksStore,
} from '@wordpress/blocks';

import { RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject, normalizeForRangeControl } from '../utils';

function getDefaultValue( { name } ) {
	return wp.data.select( blocksStore ).getBlockType( name )?.attributes
		?.unitone?.default?.backdropFilter?.invert;
}

function useDefaultValue( { name } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.backdropFilter?.invert;
	}, [] );

	return defaultValue;
}

export function hasInvertValue( { name, attributes: { unitone } } ) {
	const defaultValue = getDefaultValue( { name } );

	return (
		defaultValue !== unitone?.backdropFilter?.invert &&
		undefined !== unitone?.backdropFilter?.invert
	);
}

export function resetInvertFilter() {
	return {
		backdropFilter: {
			invert: undefined,
		},
	};
}

export function resetInvert( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject( deepmerge( unitone, resetInvertFilter() ) ),
	} );
}

export function getInvertEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Invert', 'unitone' );
	const defaultCode = <code>backdrop-filter:invert</code>;

	if ( ! __withCode ) {
		return (
			__unstableUnitoneSupports?.backdropFilter?.invert?.label ||
			defaultLabel
		);
	}

	return (
		<>
			{ __unstableUnitoneSupports?.backdropFilter?.invert?.label ||
				defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.backdropFilter?.invert?.code ||
				defaultCode }
		</>
	);
}

export function isInvertDisabled( { name } = {} ) {
	const support = getBlockSupport( name, 'unitone.backdropFilter' );

	return (
		! hasBlockSupport( name, 'unitone.backdropFilter.invert' ) &&
		true !== support &&
		( ! support ||
			'object' !== typeof support ||
			false === support?.invert )
	);
}

export function InvertEdit( {
	label,
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useDefaultValue( { name } );

	return (
		<RangeControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ label }
			value={ normalizeForRangeControl(
				unitone?.backdropFilter?.invert ?? defaultValue ?? 0
			) }
			onChange={ ( newAttribute ) => {
				const normalizedNewValue =
					normalizeForRangeControl( newAttribute );

				setAttributes( {
					unitone: cleanEmptyObject( {
						...unitone,
						backdropFilter: {
							...unitone?.backdropFilter,
							invert: normalizedNewValue,
						},
					} ),
				} );
			} }
			min={ 0 }
			max={ 100 }
			step={ 1 }
		/>
	);
}
