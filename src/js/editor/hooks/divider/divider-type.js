import classnames from 'classnames/dedupe';

import { SelectControl } from '@wordpress/components';
import {
	getBlockSupport,
	hasBlockSupport,
	store as blocksStore,
} from '@wordpress/blocks';

import { useSelect } from '@wordpress/data';
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
	return (
		! hasBlockSupport( blockName, 'unitone.divider' ) &&
		! getBlockSupport( blockName, 'unitone.dividerType' )
	);
}

export function hasDividerTypeValue( props ) {
	const { name, attributes } = props;

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.dividerType;

	return null != defaultValue
		? attributes?.unitone?.dividerType !== defaultValue
		: attributes?.unitone?.dividerType !== undefined;
}

export function resetDividerType( props ) {
	const { name, attributes, setAttributes } = props;

	delete attributes?.unitone?.dividerType;
	const newUnitone = { ...attributes?.unitone };

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.dividerType;

	if ( null != defaultValue ) {
		newUnitone.dividerType = defaultValue;
	}

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function getDividerTypeEditLabel( props ) {
	const {
		attributes: { __unstableUnitoneSupports },
	} = props;

	return (
		__unstableUnitoneSupports?.dividerType?.label || __( 'Type', 'unitone' )
	);
}

export function DividerTypeEdit( props ) {
	const {
		name,
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.dividerType;
	}, [] );

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
					if ( null == defaultValue ) {
						delete newUnitone.dividerType;
					} else {
						newUnitone.dividerType = '';
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
