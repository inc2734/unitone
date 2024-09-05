import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
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

export function getMinHeightEditLabel( { __unstableUnitoneSupports } ) {
	return (
		__unstableUnitoneSupports?.minHeight?.label ||
		__( 'Min height', 'unitone' )
	);
}

export function MinHeightEdit( { name, label, unitone, setAttributes } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.minHeight;
	}, [] );

	return (
		<TextControl
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

export function saveMinHeightProp( extraProps, blockType, attributes ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( blockType )
		?.attributes?.unitone?.default?.minHeight;

	if ( ! hasBlockSupport( blockType, 'unitone.minHeight' ) ) {
		const { __unstableUnitoneSupports } = attributes;

		if ( ! __unstableUnitoneSupports?.minHeight ) {
			return extraProps;
		}
	}

	if ( null == attributes?.unitone?.minHeight ) {
		if ( null == defaultValue ) {
			return extraProps;
		}

		attributes = {
			...attributes,
			unitone: {
				...attributes?.unitone,
				minHeight: defaultValue,
			},
		};
	}

	// Deprecation.
	// Blocks with data-layout have no prefix in the CSS custom property.
	if ( !! extraProps?.[ 'data-layout' ] ) {
		extraProps.style = {
			...extraProps.style,
			'--min-height': attributes?.unitone?.minHeight,
		};
		return extraProps;
	}

	extraProps.style = {
		...extraProps.style,
		'--unitone--min-height': attributes?.unitone?.minHeight,
	};

	return extraProps;
}

export function useMinHeightBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...saveMinHeightProp( wrapperProps, name, attributes ),
		},
	};
}
