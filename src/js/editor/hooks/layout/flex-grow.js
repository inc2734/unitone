import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

export function hasFlexGrowValue( props ) {
	const { name, attributes } = props;

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.flexGrow;

	return null != defaultValue
		? attributes?.unitone?.flexGrow !== defaultValue
		: attributes?.unitone?.flexGrow !== undefined;
}

export function resetFlexGrow( props ) {
	const { name, attributes, setAttributes } = props;

	delete attributes?.unitone?.flexGrow;
	const newUnitone = { ...attributes?.unitone };

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.flexGrow;

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

export function FlexGrowEdit( props ) {
	const {
		name,
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.flexGrow;
	}, [] );

	return (
		<RangeControl
			label={ label }
			value={
				null != unitone?.flexGrow ? parseInt( unitone?.flexGrow ) : ''
			}
			allowReset={ true }
			onChange={ ( newValue ) => {
				if ( 'undefined' !== typeof newValue ) {
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
	if (
		! hasBlockSupport( blockType, 'unitone.flexGrow' ) &&
		! attributes?.__unstableUnitoneSupports?.flexGrow
	) {
		delete attributes?.unitone?.flexGrow;
		if (
			!! attributes?.unitone &&
			! Object.keys( attributes?.unitone ).length
		) {
			delete attributes?.unitone;
		}
		return extraProps;
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

export function editFlexGrowProp( settings ) {
	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveFlexGrowProp( props, settings, attributes );
	};

	return settings;
}
