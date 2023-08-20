import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

export function hasFlexBasisValue( props ) {
	const { name, attributes } = props;

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.flexBasis;

	return null != defaultValue
		? attributes?.unitone?.flexBasis !== defaultValue
		: attributes?.unitone?.flexBasis !== undefined;
}

export function resetFlexBasis( props ) {
	const { name, attributes, setAttributes } = props;

	delete attributes?.unitone?.flexBasis;
	const newUnitone = { ...attributes?.unitone };

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.flexBasis;

	if ( null != defaultValue ) {
		newUnitone.flexBasis = defaultValue;
	}

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsFlexBasisDisabled( {
	name: blockName,
	attributes: { __unstableUnitoneSupports },
} = {} ) {
	return (
		! hasBlockSupport( blockName, 'unitone.flexBasis' ) &&
		! __unstableUnitoneSupports?.flexBasis
	);
}

export function FlexBasisEdit( props ) {
	const {
		name,
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.flexBasis;
	}, [] );

	return (
		<TextControl
			label={ label }
			value={ unitone?.flexBasis || '' }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					flexBasis: newValue || undefined,
				};
				if ( null == newUnitone.flexBasis ) {
					if ( null == defaultValue ) {
						delete newUnitone.flexBasis;
					} else {
						newUnitone.flexBasis = '';
					}
				}

				setAttributes( {
					unitone: !! Object.keys( newUnitone ).length
						? newUnitone
						: undefined,
				} );
			} }
		/>
	);
}

export function saveFlexBasisProp( extraProps, blockType, attributes ) {
	if (
		! hasBlockSupport( blockType, 'unitone.flexBasis' ) &&
		! attributes?.__unstableUnitoneSupports?.flexBasis
	) {
		delete attributes?.unitone?.flexBasis;
		if (
			!! attributes?.unitone &&
			! Object.keys( attributes?.unitone ).length
		) {
			delete attributes?.unitone;
		}
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.flexBasis ) {
		return extraProps;
	}

	extraProps.style = {
		...extraProps.style,
		'--unitone--flex-basis': attributes?.unitone?.flexBasis,
	};

	return extraProps;
}

export function editFlexBasisProp( settings ) {
	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveFlexBasisProp( props, settings, attributes );
	};

	return settings;
}
