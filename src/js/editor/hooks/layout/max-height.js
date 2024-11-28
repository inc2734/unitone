import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { cleanEmptyObject } from '../utils';

export function hasMaxHeightValue( { name, unitone } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.maxHeight;

	return (
		defaultValue !== unitone?.maxHeight && undefined !== unitone?.maxHeight
	);
}

export function resetMaxHeightFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			maxHeight: undefined,
		},
	};
}

export function resetMaxHeight( { unitone, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetMaxHeightFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsMaxHeightDisabled( { name, __unstableUnitoneSupports } ) {
	return (
		! hasBlockSupport( name, 'unitone.maxHeight' ) &&
		! __unstableUnitoneSupports?.maxHeight
	);
}

export function getMaxHeightEditLabel( {
	__unstableUnitoneSupports,
	__withCode = false,
} ) {
	const defaultLabel = __( 'Max height', 'unitone' );
	const defaultCode = <code>max-height</code>;

	if ( ! __withCode ) {
		return __unstableUnitoneSupports?.maxHeight?.label || defaultLabel;
	}

	return (
		<>
			{ __unstableUnitoneSupports?.maxHeight?.label || defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.maxHeight?.code || defaultCode }
		</>
	);
}

export function MaxHeightEdit( { name, label, unitone, setAttributes } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.maxHeight;
	}, [] );

	return (
		<TextControl
			__nextHasNoMarginBottom
			label={ label }
			value={ unitone?.maxHeight ?? defaultValue ?? '' }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					maxHeight: newValue || undefined,
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

function useBlockProps( extraProps, blockType, attributes ) {
	const style = useMemo( () => {
		if ( ! hasBlockSupport( blockType, 'unitone.maxHeight' ) ) {
			if ( ! attributes?.__unstableUnitoneSupports?.maxHeight ) {
				return extraProps?.style;
			}
		}

		if ( null == attributes?.unitone?.maxHeight ) {
			return extraProps?.style;
		}

		// Deprecation.
		// Blocks with data-layout have no prefix in the CSS custom property.
		if ( !! extraProps?.[ 'data-layout' ] ) {
			extraProps.style = {
				...extraProps.style,
				'--max-height': attributes?.unitone?.maxHeight,
			};
			return extraProps?.style;
		}

		return {
			...extraProps?.style,
			'--unitone--max-height': attributes?.unitone?.maxHeight,
		};
	}, [
		blockType,
		attributes?.__unstableUnitoneSupports?.maxHeight,
		attributes?.unitone?.maxHeight,
		extraProps?.style,
		extraProps?.[ 'data-layout' ],
	] );

	return {
		...extraProps,
		style,
	};
}

export function useMaxHeightBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;
	const { __unstableUnitoneSupports } = attributes;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.maxHeight;
		},
		[ name ]
	);

	const newMaxHeightProp = useBlockProps( wrapperProps, name, {
		__unstableUnitoneSupports,
		unitone: {
			maxHeight: attributes?.unitone?.maxHeight ?? defaultValue,
		},
	} );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...newMaxHeightProp,
		},
	};
}
