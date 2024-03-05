import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

export function hasMaxHeightValue( props ) {
	const { name, attributes } = props;

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.maxHeight;

	return null != defaultValue
		? attributes?.unitone?.maxHeight !== defaultValue
		: attributes?.unitone?.maxHeight !== undefined;
}

export function resetMaxHeight( props ) {
	const { name, attributes, setAttributes } = props;

	delete attributes?.unitone?.maxHeight;
	const newUnitone = { ...attributes?.unitone };

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.maxHeight;

	if ( null != defaultValue ) {
		newUnitone.maxHeight = defaultValue;
	}

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsMaxHeightDisabled( {
	name: blockName,
	attributes: { __unstableUnitoneSupports },
} = {} ) {
	return (
		! hasBlockSupport( blockName, 'unitone.maxHeight' ) &&
		! __unstableUnitoneSupports?.maxHeight
	);
}

export function getMaxHeightEditLabel( props ) {
	const {
		attributes: { __unstableUnitoneSupports },
	} = props;

	return (
		__unstableUnitoneSupports?.maxHeight?.label ||
		__( 'Max height', 'unitone' )
	);
}

export function MaxHeightEdit( props ) {
	const {
		name,
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.maxHeight;
	}, [] );

	return (
		<TextControl
			label={ label }
			value={ unitone?.maxHeight || '' }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					maxHeight: newValue || undefined,
				};
				if ( null == newUnitone.maxHeight ) {
					if ( null == defaultValue ) {
						delete newUnitone.maxHeight;
					} else {
						newUnitone.maxHeight = '';
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

export function saveMaxHeightProp( extraProps, blockType, attributes ) {
	if (
		! hasBlockSupport( blockType, 'unitone.maxHeight' ) &&
		! attributes?.__unstableUnitoneSupports?.maxHeight
	) {
		delete attributes?.unitone?.maxHeight;
		if (
			!! attributes?.unitone &&
			! Object.keys( attributes?.unitone ).length
		) {
			delete attributes?.unitone;
		}
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.maxHeight ) {
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

export function editMaxHeightProp( settings ) {
	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveMaxHeightProp( props, settings, attributes );
	};

	return settings;
}
