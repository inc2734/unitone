import classnames from 'classnames/dedupe';

import { SelectControl } from '@wordpress/components';
import { getBlockSupport, hasBlockSupport } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

const getDividerTypeOptions = ( { name: blockName } = {} ) => {
	const options = getBlockSupport( blockName, 'unitone.dividerType' );

	const list = [
		{
			label: '',
			value: '',
		},
		{
			label: __( 'Stripe', 'unitone' ),
			value: 'stripe',
		},
		{
			label: __( 'Underline', 'unitone' ),
			value: 'underline',
		},
		{
			label: __( 'Slash', 'unitone' ),
			value: 'slash',
		},
		{
			label: __( 'Bordered', 'unitone' ),
			value: 'bordered',
		},
	];

	return list.filter( ( value ) => {
		return options.includes( value.value ) || '' === value.value;
	} );
};

export function useIsDividerTypeDisabled( { name: blockName } = {} ) {
	return ! getBlockSupport( blockName, 'unitone.dividerType' );
}

export function hasDividerTypeValue( props ) {
	return (
		props.attributes?.unitone?.dividerType !== undefined &&
		props.attributes?.unitone?.dividerType !== ''
	);
}

export function resetDividerType( { attributes = {}, setAttributes } ) {
	delete attributes?.unitone?.dividerType;
	const newUnitone = { ...attributes?.unitone };

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function DividerTypeEdit( props ) {
	const {
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

	return (
		<SelectControl
			label={ label }
			value={ unitone?.dividerType || '' }
			options={ getDividerTypeOptions( props ) }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					dividerType: newValue || undefined,
				};
				if ( null == newUnitone.dividerType ) {
					delete newUnitone.dividerType;
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

export function saveDividerTypeProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.dividerType' ) ) {
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.dividerType ) {
		return extraProps;
	}

	extraProps[ 'data-unitone-layout' ] = classnames(
		extraProps[ 'data-unitone-layout' ],
		`-divider:${ attributes.unitone?.dividerType }`
	);

	return extraProps;
}

export function editDividerTypeProp( settings ) {
	if ( ! hasBlockSupport( settings, 'unitone.dividerType' ) ) {
		return settings;
	}

	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveDividerTypeProp( props, settings, attributes );
	};

	return settings;
}
