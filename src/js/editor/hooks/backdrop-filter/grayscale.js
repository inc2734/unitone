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

export function hasGrayscaleValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.backdropFilter?.grayscale;

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
	const defaultCode = <code>backdrop-filter:grayscale</code>;

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
	return (
		! hasBlockSupport( name, 'unitone.backdropFilter.grayscale' ) &&
		true !== getBlockSupport( name, 'unitone.backdropFilter' )
	);
}

export function GrayscaleEdit( {
	label,
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.backdropFilter?.grayscale;
	}, [] );

	return (
		<RangeControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ label }
			value={ parseInt(
				unitone?.backdropFilter?.grayscale ?? defaultValue ?? 0
			) }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					backdropFilter: {
						...unitone?.backdropFilter,
						grayscale: newAttribute,
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
