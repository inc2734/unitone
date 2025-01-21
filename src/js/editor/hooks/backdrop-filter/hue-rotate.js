import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
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

export function resetHueRotateFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			backdropFilter: {
				...attributes?.unitone?.backdropFilter,
				hueRotate: undefined,
			},
		},
	};
}

export function resetHueRotate( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetHueRotateFilter( { unitone } )?.unitone
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

export function useIsHueRotateDisabled( { name } = {} ) {
	return (
		! hasBlockSupport( name, 'unitone.backdropFilter' ) &&
		! hasBlockSupport( name, 'unitone.backdropFilter.hueRotate' )
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

export function useHueRotateBlockProps( settings ) {
	const { attributes, name } = settings;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.backdropFilter?.hueRotate;
		},
		[ name ]
	);

	if (
		! hasBlockSupport( name, 'unitone.backdropFilter' ) &&
		! hasBlockSupport( name, 'unitone.backdropFilter.hueRotate' )
	) {
		return settings;
	}

	const newHueRotate =
		attributes?.unitone?.backdropFilter?.hueRotate ?? defaultValue;

	if ( null == newHueRotate ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			style: {
				...settings.wrapperProps?.style,
				'--unitone--backdrop-filter-hue-rotate': `${ newHueRotate }deg`,
			},
		},
	};
}
