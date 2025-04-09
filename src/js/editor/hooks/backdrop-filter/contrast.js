import {
	getBlockSupport,
	hasBlockSupport,
	store as blocksStore,
} from '@wordpress/blocks';

import { RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

export function hasContrastValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.backdropFilter?.contrast;

	return (
		defaultValue !== unitone?.backdropFilter?.contrast &&
		undefined !== unitone?.backdropFilter?.contrast
	);
}

export function resetContrastFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			backdropFilter: {
				...attributes?.unitone?.backdropFilter,
				contrast: undefined,
			},
		},
	};
}

export function resetContrast( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetContrastFilter( { unitone } )?.unitone
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

export function useIsContrastDisabled( { name } = {} ) {
	return (
		! hasBlockSupport( name, 'unitone.backdropFilter.contrast' ) &&
		true !== getBlockSupport( name, 'unitone.backdropFilter' )
	);
}

export function ContrastEdit( {
	label,
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.backdropFilter?.contrast;
	}, [] );

	return (
		<RangeControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ label }
			value={ parseInt(
				unitone?.backdropFilter?.contrast ?? defaultValue ?? 100
			) }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					backdropFilter: {
						...unitone?.backdropFilter,
						contrast: newAttribute,
					},
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
			min={ 50 }
			max={ 150 }
			step={ 1 }
		/>
	);
}
