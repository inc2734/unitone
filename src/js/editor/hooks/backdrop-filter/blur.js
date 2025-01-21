import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

export function hasBlurValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.backdropFilter?.blur;

	return (
		defaultValue !== unitone?.backdropFilter?.blur &&
		undefined !== unitone?.backdropFilter?.blur
	);
}

export function resetBlurFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			backdropFilter: {
				...attributes?.unitone?.backdropFilter,
				blur: undefined,
			},
		},
	};
}

export function resetBlur( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject( resetBlurFilter( { unitone } )?.unitone ),
	} );
}

export function getBlurEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Blur', 'unitone' );
	const defaultCode = <code>backdrop-filter:blur</code>;

	if ( ! __withCode ) {
		return (
			__unstableUnitoneSupports?.backdropFilter?.blur?.label ||
			defaultLabel
		);
	}

	return (
		<>
			{ __unstableUnitoneSupports?.backdropFilter?.blur?.label ||
				defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.backdropFilter?.blur?.code ||
				defaultCode }
		</>
	);
}

export function useIsBlurDisabled( { name } = {} ) {
	return (
		! hasBlockSupport( name, 'unitone.backdropFilter' ) &&
		! hasBlockSupport( name, 'unitone.backdropFilter.blur' )
	);
}

export function BlurEdit( {
	label,
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.backdropFilter?.blur;
	}, [] );

	return (
		<RangeControl
			__nextHasNoMarginBottom
			label={ label }
			value={ parseInt(
				unitone?.backdropFilter?.blur ?? defaultValue ?? 0
			) }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					backdropFilter: {
						...unitone?.backdropFilter,
						blur: newAttribute,
					},
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
			min={ 0 }
			max={ 30 }
			step={ 1 }
		/>
	);
}

export function useBlurBlockProps( settings ) {
	const { attributes, name } = settings;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.backdropFilter?.blur;
		},
		[ name ]
	);

	if (
		! hasBlockSupport( name, 'unitone.backdropFilter' ) &&
		! hasBlockSupport( name, 'unitone.backdropFilter.blur' )
	) {
		return settings;
	}

	const newBlur = attributes?.unitone?.backdropFilter?.blur ?? defaultValue;

	if ( null == newBlur ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			style: {
				...settings.wrapperProps?.style,
				'--unitone--backdrop-filter-blur': `${ newBlur }px`,
			},
		},
	};
}
