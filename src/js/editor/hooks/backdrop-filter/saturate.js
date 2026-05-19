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
		?.unitone?.default?.backdropFilter?.saturate;
}

function useDefaultValue( { name } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.backdropFilter?.saturate;
	}, [] );

	return defaultValue;
}

export function hasSaturateValue( { name, attributes: { unitone } } ) {
	const defaultValue = getDefaultValue( { name } );

	return (
		defaultValue !== unitone?.backdropFilter?.saturate &&
		undefined !== unitone?.backdropFilter?.saturate
	);
}

export function resetSaturateFilter() {
	return {
		backdropFilter: {
			saturate: undefined,
		},
	};
}

export function resetSaturate( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			deepmerge( unitone, resetSaturateFilter() )
		),
	} );
}

export function getSaturateEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Saturate', 'unitone' );
	const defaultCode = <code>backdrop-filter:saturate</code>;

	if ( ! __withCode ) {
		return (
			__unstableUnitoneSupports?.backdropFilter?.saturate?.label ||
			defaultLabel
		);
	}

	return (
		<>
			{ __unstableUnitoneSupports?.backdropFilter?.saturate?.label ||
				defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.backdropFilter?.saturate?.code ||
				defaultCode }
		</>
	);
}

export function isSaturateDisabled( { name } = {} ) {
	const support = getBlockSupport( name, 'unitone.backdropFilter' );

	return (
		! hasBlockSupport( name, 'unitone.backdropFilter.saturate' ) &&
		true !== support &&
		( ! support ||
			'object' !== typeof support ||
			false === support?.saturate )
	);
}

export function SaturateEdit( {
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
				unitone?.backdropFilter?.saturate ?? defaultValue ?? 100
			) }
			onChange={ ( newAttribute ) => {
				const normalizedNewValue =
					normalizeForRangeControl( newAttribute );

				setAttributes( {
					unitone: cleanEmptyObject( {
						...unitone,
						backdropFilter: {
							...unitone?.backdropFilter,
							saturate: normalizedNewValue,
						},
					} ),
				} );
			} }
			min={ 0 }
			max={ 200 }
			step={ 1 }
		/>
	);
}
