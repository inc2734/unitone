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

export function hasHueRotateValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.backdropFilter?.hueRotate;

	return (
		defaultValue !== unitone?.backdropFilter?.hueRotate &&
		undefined !== unitone?.backdropFilter?.hueRotate
	);
}

export function resetHueRotateFilter() {
	return {
		backdropFilter: {
			hueRotate: undefined,
		},
	};
}

export function resetHueRotate( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			deepmerge( unitone, resetHueRotateFilter() )
		),
	} );
}

export function getHueRotateEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Hue Rotate', 'unitone' );
	const defaultCode = <code>backdrop-filter:hue-rotate</code>;

	if ( ! __withCode ) {
		return (
			__unstableUnitoneSupports?.backdropFilter?.hueRotate?.label ||
			defaultLabel
		);
	}

	return (
		<>
			{ __unstableUnitoneSupports?.backdropFilter?.hueRotate?.label ||
				defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.backdropFilter?.hueRotate?.code ||
				defaultCode }
		</>
	);
}

export function isHueRotateDisabled( { name } = {} ) {
	return (
		! hasBlockSupport( name, 'unitone.backdropFilter.hueRotate' ) &&
		true !== getBlockSupport( name, 'unitone.backdropFilter' )
	);
}

export function HueRotateEdit( {
	label,
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.backdropFilter?.hueRotate;
	}, [] );

	return (
		<RangeControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ label }
			value={ parseInt(
				unitone?.backdropFilter?.hueRotate ?? defaultValue ?? 0
			) }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					backdropFilter: {
						...unitone?.backdropFilter,
						hueRotate: newAttribute,
					},
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
			min={ 0 }
			max={ 360 }
			step={ 1 }
		/>
	);
}
