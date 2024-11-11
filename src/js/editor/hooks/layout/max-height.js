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

export function getMaxHeightEditLabel( { __unstableUnitoneSupports } ) {
	return (
		__unstableUnitoneSupports?.maxHeight?.label ||
		__( 'Max height', 'unitone' )
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

export function saveMaxHeightProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.maxHeight' ) ) {
		const { __unstableUnitoneSupports } = attributes;

		if ( ! __unstableUnitoneSupports?.maxHeight ) {
			return extraProps;
		}
	}

	if ( null == attributes?.unitone?.maxHeight ) {
		return extraProps;
	}

	// Deprecation.
	// Blocks with data-layout have no prefix in the CSS custom property.
	if ( !! extraProps?.[ 'data-layout' ] ) {
		extraProps.style = {
			...extraProps.style,
			'--max-height': attributes?.unitone?.maxHeight,
		};
		return extraProps;
	}

	extraProps.style = {
		...extraProps.style,
		'--unitone--max-height': attributes?.unitone?.maxHeight,
	};

	return extraProps;
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

	const newMaxHeightProp = useMemo( () => {
		return saveMaxHeightProp( wrapperProps, name, {
			__unstableUnitoneSupports,
			unitone: {
				maxHeight: attributes?.unitone?.maxHeight ?? defaultValue,
			},
		} );
	}, [ JSON.stringify( attributes?.unitone ) ] );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...newMaxHeightProp,
		},
	};
}
