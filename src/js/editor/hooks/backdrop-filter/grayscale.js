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
		?.unitone?.default?.backdropFilter?.grayscale;
}

function useDefaultValue( { name } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.backdropFilter?.grayscale;
	}, [] );

	return defaultValue;
}

export function hasGrayscaleValue( { name, attributes: { unitone } } ) {
	const defaultValue = getDefaultValue( { name } );

	return (
		defaultValue !== unitone?.backdropFilter?.grayscale &&
		undefined !== unitone?.backdropFilter?.grayscale
	);
}

export function resetGrayscaleFilter() {
	return {
		backdropFilter: {
			grayscale: undefined,
		},
	};
}

export function resetGrayscale( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			deepmerge( unitone, resetGrayscaleFilter() )
		),
	} );
}

export function getGrayscaleEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Grayscale', 'unitone' );
	const defaultCode = (
		<code className="unitone-label-code">backdrop-filter:grayscale</code>
	);

	if ( ! __withCode ) {
		return (
			__unstableUnitoneSupports?.backdropFilter?.grayscale?.label ||
			defaultLabel
		);
	}

	return (
		<>
			{ __unstableUnitoneSupports?.backdropFilter?.grayscale?.label ||
				defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.backdropFilter?.grayscale?.code ||
				defaultCode }
		</>
	);
}

export function isGrayscaleDisabled( { name } = {} ) {
	const support = getBlockSupport( name, 'unitone.backdropFilter' );

	return (
		! hasBlockSupport( name, 'unitone.backdropFilter.grayscale' ) &&
		true !== support &&
		( ! support ||
			'object' !== typeof support ||
			false === support?.grayscale )
	);
}

export function GrayscaleEdit( {
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
				unitone?.backdropFilter?.grayscale ?? defaultValue ?? 0
			) }
			onChange={ ( newAttribute ) => {
				const normalizedNewValue =
					normalizeForRangeControl( newAttribute );

				setAttributes( {
					unitone: cleanEmptyObject( {
						...unitone,
						backdropFilter: {
							...unitone?.backdropFilter,
							grayscale: normalizedNewValue,
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
