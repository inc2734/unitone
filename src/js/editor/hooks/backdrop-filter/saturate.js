import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

export function hasSaturateValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.backdropFilter?.saturate;

	return (
		defaultValue !== unitone?.backdropFilter?.saturate &&
		undefined !== unitone?.backdropFilter?.saturate
	);
}

export function resetSaturateFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			backdropFilter: {
				...attributes?.unitone?.backdropFilter,
				saturate: undefined,
			},
		},
	};
}

export function resetSaturate( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetSaturateFilter( { unitone } )?.unitone
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

export function useIsSaturateDisabled( { name } = {} ) {
	return (
		! hasBlockSupport( name, 'unitone.backdropFilter' ) &&
		! hasBlockSupport( name, 'unitone.backdropFilter.saturate' )
	);
}

export function SaturateEdit( {
	label,
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.backdropFilter?.saturate;
	}, [] );

	return (
		<RangeControl
			__nextHasNoMarginBottom
			label={ label }
			value={ parseInt(
				unitone?.backdropFilter?.saturate ?? defaultValue ?? 100
			) }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					backdropFilter: {
						...unitone?.backdropFilter,
						saturate: newAttribute,
					},
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
			min={ 0 }
			max={ 200 }
			step={ 1 }
		/>
	);
}

export function useSaturateBlockProps( settings ) {
	const { attributes, name } = settings;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.backdropFilter?.saturate;
		},
		[ name ]
	);

	if (
		! hasBlockSupport( name, 'unitone.backdropFilter' ) &&
		! hasBlockSupport( name, 'unitone.backdropFilter.saturate' )
	) {
		return settings;
	}

	const newSaturate =
		attributes?.unitone?.backdropFilter?.saturate ?? defaultValue;

	if ( null == newSaturate ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			style: {
				...settings.wrapperProps?.style,
				'--unitone--backdrop-filter-saturate': `${ newSaturate }%`,
			},
		},
	};
}
