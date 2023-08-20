import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

export function hasMaxWidthValue( props ) {
	const { name, attributes } = props;

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.maxWidth;

	return null != defaultValue
		? attributes?.unitone?.maxWidth !== defaultValue
		: attributes?.unitone?.maxWidth !== undefined;
}

export function resetMaxWidth( props ) {
	const { name, attributes, setAttributes } = props;

	delete attributes?.unitone?.maxWidth;
	const newUnitone = { ...attributes?.unitone };

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.maxWidth;

	if ( null != defaultValue ) {
		newUnitone.maxWidth = defaultValue;
	}

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsMaxWidthDisabled( {
	name: blockName,
	attributes: { __unstableUnitoneSupports },
} = {} ) {
	return (
		! hasBlockSupport( blockName, 'unitone.maxWidth' ) &&
		! __unstableUnitoneSupports?.maxWidth
	);
}

export function MaxWidthEdit( props ) {
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
			value={ unitone?.maxWidth || '' }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					maxWidth: newValue || undefined,
				};
				if ( null == newUnitone.maxWidth ) {
					if ( null == defaultValue ) {
						delete newUnitone.maxWidth;
					} else {
						newUnitone.maxWidth = '';
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

export function saveMaxWidthProp( extraProps, blockType, attributes ) {
	if (
		! hasBlockSupport( blockType, 'unitone.maxWidth' ) &&
		! attributes?.__unstableUnitoneSupports?.maxWidth
	) {
		delete attributes?.unitone?.maxWidth;
		if (
			!! attributes?.unitone &&
			! Object.keys( attributes?.unitone ).length
		) {
			delete attributes?.unitone;
		}
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.maxWidth ) {
		return extraProps;
	}

	// Deprecation.
	// Blocks with data-layout have no prefix in the CSS custom property.
	if ( !! extraProps?.[ 'data-layout' ] ) {
		extraProps.style = {
			...extraProps.style,
			'--max-width': attributes?.unitone?.maxWidth,
		};
		return extraProps;
	}

	extraProps.style = {
		...extraProps.style,
		'--unitone--max-width': attributes?.unitone?.maxWidth,
	};

	return extraProps;
}

export function editMaxWidthProp( settings ) {
	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveMaxWidthProp( props, settings, attributes );
	};

	return settings;
}
