import {
	getBlockSupport,
	hasBlockSupport,
	store as blocksStore,
} from '@wordpress/blocks';

import { RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

export function hasBrightnessValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.backdropFilter?.brightness;

	return (
		defaultValue !== unitone?.backdropFilter?.brightness &&
		undefined !== unitone?.backdropFilter?.brightness
	);
}

export function resetBrightnessFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			backdropFilter: {
				...attributes?.unitone?.backdropFilter,
				brightness: undefined,
			},
		},
	};
}

export function resetBrightness( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetBrightnessFilter( { unitone } )?.unitone
		),
	} );
}

export function getBrightnessEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Brightness', 'unitone' );
	const defaultCode = <code>backdrop-filter:brightness</code>;

	if ( ! __withCode ) {
		return (
			__unstableUnitoneSupports?.backdropFilter?.brightness?.label ||
			defaultLabel
		);
	}

	return (
		<>
			{ __unstableUnitoneSupports?.backdropFilter?.brightness?.label ||
				defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.backdropFilter?.brightness?.code ||
				defaultCode }
		</>
	);
}

export function useIsBrightnessDisabled( { name } = {} ) {
	return (
		! hasBlockSupport( name, 'unitone.backdropFilter.brightness' ) &&
		true !== getBlockSupport( name, 'unitone.backdropFilter' )
	);
}

export function BrightnessEdit( {
	label,
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.backdropFilter?.brightness;
	}, [] );

	return (
		<RangeControl
			__nextHasNoMarginBottom
			label={ label }
			value={ parseInt(
				unitone?.backdropFilter?.brightness ?? defaultValue ?? 100
			) }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					backdropFilter: {
						...unitone?.backdropFilter,
						brightness: newAttribute,
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

export function useBrightnessBlockProps( settings ) {
	const { attributes, name } = settings;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.backdropFilter?.brightness;
		},
		[ name ]
	);

	if (
		! hasBlockSupport( name, 'unitone.backdropFilter.brightness' ) &&
		true !== getBlockSupport( name, 'unitone.backdropFilter' )
	) {
		return settings;
	}

	const newBrightness =
		attributes?.unitone?.backdropFilter?.brightness ?? defaultValue;

	if ( null == newBrightness ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			style: {
				...settings.wrapperProps?.style,
				'--unitone--backdrop-filter-brightness': `${ newBrightness }%`,
			},
		},
	};
}
