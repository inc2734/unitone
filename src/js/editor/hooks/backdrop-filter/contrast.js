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
		?.unitone?.default?.backdropFilter?.contrast;
}

function useDefaultValue( { name } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.backdropFilter?.contrast;
	}, [] );

	return defaultValue;
}

export function hasContrastValue( { name, attributes: { unitone } } ) {
	const defaultValue = getDefaultValue( { name } );

	return (
		defaultValue !== unitone?.backdropFilter?.contrast &&
		undefined !== unitone?.backdropFilter?.contrast
	);
}

export function resetContrastFilter() {
	return {
		backdropFilter: {
			contrast: undefined,
		},
	};
}

export function resetContrast( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			deepmerge( unitone, resetContrastFilter() )
		),
	} );
}

export function getContrastEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Contrast', 'unitone' );
	const defaultCode = <code>backdrop-filter:contrast</code>;

	if ( ! __withCode ) {
		return (
			__unstableUnitoneSupports?.backdropFilter?.contrast?.label ||
			defaultLabel
		);
	}

	return (
		<>
			{ __unstableUnitoneSupports?.backdropFilter?.contrast?.label ||
				defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.backdropFilter?.contrast?.code ||
				defaultCode }
		</>
	);
}

export function isContrastSupportDisabled( { name } = {} ) {
	const support = getBlockSupport( name, 'unitone.backdropFilter' );

	return (
		! hasBlockSupport( name, 'unitone.backdropFilter.contrast' ) &&
		true !== support &&
		( ! support ||
			'object' !== typeof support ||
			false === support?.contrast )
	);
}

export function ContrastEdit( {
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
				unitone?.backdropFilter?.contrast ?? defaultValue ?? 100
			) }
			onChange={ ( newAttribute ) => {
				const normalizedNewValue =
					normalizeForRangeControl( newAttribute );

				setAttributes( {
					unitone: cleanEmptyObject( {
						...unitone,
						backdropFilter: {
							...unitone?.backdropFilter,
							contrast: normalizedNewValue,
						},
					} ),
				} );
			} }
			min={ 50 }
			max={ 150 }
			step={ 1 }
		/>
	);
}
