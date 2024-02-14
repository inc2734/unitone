import classnames from 'classnames';

import { hasBlockSupport } from '@wordpress/blocks';
import { ToggleControl } from '@wordpress/components';

export function hasFluidTypographyValue( props ) {
	return props.attributes?.unitone?.fluidTypography !== undefined;
}

export function resetFluidTypography( { attributes = {}, setAttributes } ) {
	delete attributes?.unitone?.fluidTypography;
	const newUnitone = { ...attributes?.unitone };

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsFluidTypographyDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'unitone.fluidTypography' );
}

export function FluidTypographyEdit( props ) {
	const {
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

	return (
		<ToggleControl
			label={ label }
			checked={ !! unitone?.fluidTypography }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					fluidTypography: newValue || undefined,
				};
				if ( null == newUnitone.fluidTypography ) {
					delete newUnitone.fluidTypography;
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

export function saveFluidTypographyProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.fluidTypography' ) ) {
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.fluidTypography ) {
		return extraProps;
	}

	extraProps[ 'data-unitone-layout' ] = classnames(
		extraProps[ 'data-unitone-layout' ],
		'-fluid-typography'
	);

	return extraProps;
}

export function editFluidTypographyProp( settings ) {
	if ( ! hasBlockSupport( settings, 'unitone.fluidTypography' ) ) {
		return settings;
	}

	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveFluidTypographyProp( props, settings, attributes );
	};

	return settings;
}
