import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

export function hasFlexShrinkValue( props ) {
	const { name, attributes } = props;

	const defaultValue =
		null != attributes?.__unstableUnitoneSupports?.flexShrink?.default
			? attributes?.__unstableUnitoneSupports?.flexShrink?.default
			: wp.data.select( blocksStore ).getBlockType( name )?.attributes
					?.unitone?.default?.flexShrink;

	return null != defaultValue
		? attributes?.unitone?.flexShrink !== defaultValue
		: attributes?.unitone?.flexShrink !== undefined;
}

export function resetFlexShrink( props ) {
	const { name, attributes, setAttributes } = props;

	delete attributes?.unitone?.flexShrink;
	const newUnitone = { ...attributes?.unitone };

	const defaultValue =
		null != attributes?.__unstableUnitoneSupports?.flexShrink?.default
			? attributes?.__unstableUnitoneSupports?.flexShrink?.default
			: wp.data.select( blocksStore ).getBlockType( name )?.attributes
					?.unitone?.default?.flexShrink;

	if ( null != defaultValue ) {
		newUnitone.flexShrink = defaultValue;
	}

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsFlexShrinkDisabled( {
	name: blockName,
	attributes: { __unstableUnitoneSupports },
} = {} ) {
	return (
		! hasBlockSupport( blockName, 'unitone.flexShrink' ) &&
		! __unstableUnitoneSupports?.flexShrink
	);
}

export function FlexShrinkEdit( props ) {
	const {
		name,
		label,
		attributes: { unitone, __unstableUnitoneSupports },
		setAttributes,
	} = props;

	let defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.flexShrink;
	}, [] );
	if ( null != __unstableUnitoneSupports?.flexShrink?.default ) {
		defaultValue = __unstableUnitoneSupports?.flexShrink?.default;
	}

	return (
		<RangeControl
			label={ label }
			value={
				null != unitone?.flexShrink && '' !== unitone?.flexShrink
					? parseInt( unitone?.flexShrink )
					: ''
			}
			allowReset={ true }
			onChange={ ( newValue ) => {
				if ( null !== newValue ) {
					// RangeControl returns Int, SelectControl returns String.
					// So cast Int all values.
					newValue = String( newValue );
				}

				const newUnitone = {
					...unitone,
					flexShrink: newValue || undefined,
				};
				if ( null == newUnitone.flexShrink ) {
					if ( null == defaultValue ) {
						delete newUnitone.flexShrink;
					} else {
						newUnitone.flexShrink = '';
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

export function saveFlexShrinkProp( extraProps, blockType, attributes ) {
	if (
		! hasBlockSupport( blockType, 'unitone.flexShrink' ) &&
		! attributes?.__unstableUnitoneSupports?.flexShrink
	) {
		delete attributes?.unitone?.flexShrink;
		if (
			!! attributes?.unitone &&
			! Object.keys( attributes?.unitone ).length
		) {
			delete attributes?.unitone;
		}
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.flexShrink ) {
		return extraProps;
	}

	extraProps.style = {
		...extraProps.style,
		'--unitone--flex-shrink': attributes?.unitone?.flexShrink,
	};

	return extraProps;
}

export function editFlexShrinkProp( settings ) {
	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveFlexShrinkProp( props, settings, attributes );
	};

	return settings;
}
