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
		?.unitone?.default?.backdropFilter?.sepia;
}

function useDefaultValue( { name } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.backdropFilter?.sepia;
	}, [] );

	return defaultValue;
}

export function hasSepiaValue( { name, attributes: { unitone } } ) {
	const defaultValue = getDefaultValue( { name } );

	return (
		defaultValue !== unitone?.backdropFilter?.sepia &&
		undefined !== unitone?.backdropFilter?.sepia
	);
}

export function resetSepiaFilter() {
	return {
		backdropFilter: {
			sepia: undefined,
		},
	};
}

export function resetSepia( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject( deepmerge( unitone, resetSepiaFilter() ) ),
	} );
}

export function getSepiaEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Sepia', 'unitone' );
	const defaultCode = (
		<code className="unitone-label-code">backdrop-filter:sepia</code>
	);

	if ( ! __withCode ) {
		return (
			__unstableUnitoneSupports?.backdropFilter?.sepia?.label ||
			defaultLabel
		);
	}

	return (
		<>
			{ __unstableUnitoneSupports?.backdropFilter?.sepia?.label ||
				defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.backdropFilter?.sepia?.code ||
				defaultCode }
		</>
	);
}

export function isSepiaDisabled( { name } = {} ) {
	const support = getBlockSupport( name, 'unitone.backdropFilter' );

	return (
		! hasBlockSupport( name, 'unitone.backdropFilter.sepia' ) &&
		true !== support &&
		( ! support || 'object' !== typeof support || false === support?.sepia )
	);
}

export function SepiaEdit( {
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
				unitone?.backdropFilter?.sepia ?? defaultValue ?? 0
			) }
			onChange={ ( newAttribute ) => {
				const normalizedNewValue =
					normalizeForRangeControl( newAttribute );

				setAttributes( {
					unitone: cleanEmptyObject( {
						...unitone,
						backdropFilter: {
							...unitone?.backdropFilter,
							sepia: normalizedNewValue,
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
