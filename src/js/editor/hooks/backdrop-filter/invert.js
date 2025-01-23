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

export function resetInvertFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			backdropFilter: {
				...attributes?.unitone?.backdropFilter,
				invert: undefined,
			},
		},
	};
}

export function resetInvert( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject( resetInvertFilter( { unitone } )?.unitone ),
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

export function useIsInvertDisabled( { name } = {} ) {
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

export function useInvertBlockProps( settings ) {
	const { attributes, name } = settings;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.backdropFilter?.invert;
		},
		[ name ]
	);

	if (
		! hasBlockSupport( name, 'unitone.backdropFilter.invert' ) &&
		true !== getBlockSupport( name, 'unitone.backdropFilter' )
	) {
		return settings;
	}

	const newInvert =
		attributes?.unitone?.backdropFilter?.invert ?? defaultValue;

	if ( null == newInvert ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			style: {
				...settings.wrapperProps?.style,
				'--unitone--backdrop-filter-invert': `${ newInvert }%`,
			},
		},
	};
}
