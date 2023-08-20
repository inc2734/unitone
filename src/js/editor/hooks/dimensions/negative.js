import classnames from 'classnames/dedupe';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

export function hasNegativeValue( props ) {
	const { attributes } = props;

	return !! attributes?.unitone?.negative;
}

export function resetNegative( props ) {
	const { name, attributes, setAttributes } = props;

	delete attributes?.unitone?.negative;
	const newUnitone = { ...attributes?.unitone };

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.negative;

	if ( !! defaultValue ) {
		newUnitone.negative = !! defaultValue;
	}

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsNegativeDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'unitone.negative' );
}

export function NegativeEdit( props ) {
	const {
		name,
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

	const defaultValue = useSelect( ( select ) => {
		return !! select( blocksStore ).getBlockType( name )?.attributes
			?.unitone?.default?.negative;
	}, [] );

	return (
		<ToggleControl
			label={ label }
			checked={ !! unitone?.negative }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					negative: newValue || undefined,
				};
				if ( null == newUnitone.negative ) {
					if ( ! defaultValue ) {
						delete newUnitone.negative;
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

export function saveNegativeProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.negative' ) ) {
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.negative ) {
		return extraProps;
	}

	// Deprecation.
	if ( !! extraProps?.[ 'data-layout' ] ) {
		extraProps[ 'data-layout' ] = classnames(
			extraProps[ 'data-layout' ],
			'-negative'
		);
		return extraProps;
	}

	extraProps[ 'data-unitone-layout' ] = classnames(
		extraProps[ 'data-unitone-layout' ],
		'-negative'
	);

	return extraProps;
}

export function editNegativeProp( settings ) {
	if ( ! hasBlockSupport( settings, 'unitone.negative' ) ) {
		return settings;
	}

	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveNegativeProp( props, settings, attributes );
	};

	return settings;
}
