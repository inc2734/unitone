import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

export function hasFlexGrowValue( props ) {
	const { name, attributes } = props;

	const defaultValue =
		null != attributes?.__unstableUnitoneSupports?.flexGrow?.default
			? attributes?.__unstableUnitoneSupports?.flexGrow?.default
			: wp.data.select( blocksStore ).getBlockType( name )?.attributes
					?.unitone?.default?.flexGrow;

	return null != defaultValue
		? attributes?.unitone?.flexGrow !== defaultValue
		: attributes?.unitone?.flexGrow !== undefined;
}

export function resetFlexGrow( props ) {
	const { name, attributes, setAttributes } = props;

	delete attributes?.unitone?.flexGrow;
	const newUnitone = { ...attributes?.unitone };

	const defaultValue =
		null != attributes?.__unstableUnitoneSupports?.flexGrow?.default
			? attributes?.__unstableUnitoneSupports?.flexGrow?.default
			: wp.data.select( blocksStore ).getBlockType( name )?.attributes
					?.unitone?.default?.flexGrow;

	if ( null != defaultValue ) {
		newUnitone.flexGrow = defaultValue;
	}

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsFlexGrowDisabled( {
	name: blockName,
	attributes: { __unstableUnitoneSupports },
} = {} ) {
	return (
		! hasBlockSupport( blockName, 'unitone.flexGrow' ) &&
		! __unstableUnitoneSupports?.flexGrow
	);
}

export function getFlexGrowEditLabel( props ) {
	const {
		attributes: { __unstableUnitoneSupports },
	} = props;

	return (
		__unstableUnitoneSupports?.flexGrow?.label || __( 'Fill', 'unitone' )
	);
}

export function FlexGrowEdit( props ) {
	const {
		name,
		label,
		attributes: { unitone, __unstableUnitoneSupports },
		setAttributes,
	} = props;

	let defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.flexGrow;
	}, [] );
	if ( null != __unstableUnitoneSupports?.flexGrow?.default ) {
		defaultValue = __unstableUnitoneSupports?.flexGrow?.default;
	}

	return (
		<RangeControl
			label={ label }
			value={
				null != unitone?.flexGrow && '' !== unitone?.flexGrow
					? parseInt( unitone?.flexGrow )
					: ''
			}
			allowReset={ true }
			onChange={ ( newValue ) => {
				if ( null != newValue ) {
					// RangeControl returns Int, SelectControl returns String.
					// So cast Int all values.
					newValue = String( newValue );
				}

				const newUnitone = {
					...unitone,
					flexGrow: newValue || undefined,
				};
				if ( null == newUnitone.flexGrow ) {
					if ( null == defaultValue ) {
						delete newUnitone.flexGrow;
					} else {
						newUnitone.flexGrow = '';
					}
				}

				setAttributes( {
					unitone: !! Object.keys( newUnitone ).length
						? newUnitone
						: undefined,
				} );
			} }
			min={ 0 }
			max={ 10 }
			step={ 1 }
		/>
	);
}

export function saveFlexGrowProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.flexGrow' ) ) {
		const { __unstableUnitoneSupports } = attributes;

		if ( ! __unstableUnitoneSupports?.flexGrow ) {
			delete attributes?.unitone?.flexGrow;

			if ( ! Object.keys( attributes?.unitone ?? {} ).length ) {
				delete attributes?.unitone;
			}

			return extraProps;
		}
	}

	if ( undefined === attributes?.unitone?.flexGrow ) {
		return extraProps;
	}

	extraProps.style = {
		...extraProps.style,
		'--unitone--flex-grow': attributes?.unitone?.flexGrow,
	};

	return extraProps;
}

export function useFlexGrowBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...saveFlexGrowProp( wrapperProps, name, attributes ),
		},
	};
}
