import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

export function hasMinHeightValue( props ) {
	const { name, attributes } = props;

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.minHeight;

	return null != defaultValue
		? attributes?.unitone?.minHeight !== defaultValue
		: attributes?.unitone?.minHeight !== undefined;
}

export function resetMinHeight( props ) {
	const { name, attributes, setAttributes } = props;

	delete attributes?.unitone?.minHeight;
	const newUnitone = { ...attributes?.unitone };

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.minHeight;

	if ( null != defaultValue ) {
		newUnitone.minHeight = defaultValue;
	}

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsMinHeightDisabled( {
	name: blockName,
	attributes: { __unstableUnitoneSupports },
} = {} ) {
	return (
		! hasBlockSupport( blockName, 'unitone.minHeight' ) &&
		! __unstableUnitoneSupports?.minHeight
	);
}

export function MinHeightEdit( props ) {
	const {
		name,
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.maxWidth;
	}, [] );

	return (
		<TextControl
			label={ label }
			value={ unitone?.minHeight || '' }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					minHeight: newValue || undefined,
				};
				if ( null == newUnitone.minHeight ) {
					if ( null == defaultValue ) {
						delete newUnitone.minHeight;
					} else {
						newUnitone.minHeight = '';
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

export function saveMinHeightProp( extraProps, blockType, attributes ) {
	if (
		! hasBlockSupport( blockType, 'unitone.minHeight' ) &&
		! attributes?.__unstableUnitoneSupports?.minHeight
	) {
		delete attributes?.unitone?.minHeight;
		if (
			!! attributes?.unitone &&
			! Object.keys( attributes?.unitone ).length
		) {
			delete attributes?.unitone;
		}
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.minHeight ) {
		return extraProps;
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

export function editMinHeightProp( settings ) {
	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveMinHeightProp( props, settings, attributes );
	};

	return settings;
}
