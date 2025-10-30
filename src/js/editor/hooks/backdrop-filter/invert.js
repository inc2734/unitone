import deepmerge from 'deepmerge';

import {
	getBlockSupport,
	hasBlockSupport,
	store as blocksStore,
} from '@wordpress/blocks';

import { RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

export function hasInvertValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.backdropFilter?.invert;

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
	return (
		! hasBlockSupport( name, 'unitone.backdropFilter.invert' ) &&
		true !== getBlockSupport( name, 'unitone.backdropFilter' )
	);
}

export function InvertEdit( {
	label,
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.backdropFilter?.invert;
	}, [] );

	return (
		<RangeControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ label }
			value={ parseInt(
				unitone?.backdropFilter?.invert ?? defaultValue ?? 0
			) }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					backdropFilter: {
						...unitone?.backdropFilter,
						invert: newAttribute,
					},
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
			min={ 0 }
			max={ 100 }
			step={ 1 }
		/>
	);
}
