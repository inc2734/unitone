import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { cleanEmptyObject } from '../utils';

export function hasMinHeightValue( { name, unitone } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.minHeight;

	return (
		defaultValue !== unitone?.minHeight && undefined !== unitone?.minHeight
	);
}

export function resetMinHeightFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			minHeight: undefined,
		},
	};
}

export function resetMinHeight( { unitone, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetMinHeightFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsMinHeightDisabled( { name, __unstableUnitoneSupports } ) {
	return (
		! hasBlockSupport( name, 'unitone.minHeight' ) &&
		! __unstableUnitoneSupports?.minHeight
	);
}

export function getMinHeightEditLabel( {
	__unstableUnitoneSupports,
	__withCode = false,
} ) {
	const defaultLabel = __( 'Min height', 'unitone' );
	const defaultCode = <code>min-height</code>;

	if ( ! __withCode ) {
		return __unstableUnitoneSupports?.minHeight?.label || defaultLabel;
	}

	return (
		<>
			{ __unstableUnitoneSupports?.minHeight?.label || defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.minHeight?.code || defaultCode }
		</>
	);
}

export function MinHeightEdit( { name, label, unitone, setAttributes } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.minHeight;
	}, [] );

	return (
		<TextControl
			__nextHasNoMarginBottom
			label={ label }
			value={ unitone?.minHeight ?? defaultValue ?? '' }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					minHeight: newValue || undefined,
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
		if ( ! hasBlockSupport( blockType, 'unitone.minHeight' ) ) {
			if ( ! attributes?.__unstableUnitoneSupports?.minHeight ) {
				return extraProps?.style;
			}
		}

		if ( null == attributes?.unitone?.minHeight ) {
			return extraProps?.style;
		}

		// Deprecation.
		// Blocks with data-layout have no prefix in the CSS custom property.
		if ( !! extraProps?.[ 'data-layout' ] ) {
			extraProps.style = {
				...extraProps.style,
				'--min-height': attributes?.unitone?.minHeight,
			};
			return extraProps?.style;
		}

		return {
			...extraProps?.style,
			'--unitone--min-height': attributes?.unitone?.minHeight,
		};
	}, [
		blockType,
		attributes?.__unstableUnitoneSupports?.minHeight,
		attributes?.unitone?.minHeight,
		extraProps?.style,
		extraProps?.[ 'data-layout' ],
	] );

	return {
		...extraProps,
		style,
	};
}

export function useMinHeightBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;
	const { __unstableUnitoneSupports } = attributes;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.minHeight;
		},
		[ name ]
	);

	const newMinHeightProp = useBlockProps( wrapperProps, name, {
		__unstableUnitoneSupports,
		unitone: {
			minHeight: attributes?.unitone?.minHeight ?? defaultValue,
		},
	} );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...newMinHeightProp,
		},
	};
}
