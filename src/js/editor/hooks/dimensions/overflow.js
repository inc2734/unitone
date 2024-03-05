import classnames from 'classnames/dedupe';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

const overflowOptions = [
	{ label: '', value: '' },
	{
		label: 'visible',
		value: 'visible',
	},
	{
		label: 'hidden',
		value: 'hidden',
	},
	{
		label: 'scroll',
		value: 'scroll',
	},
	{
		label: 'auto',
		value: 'auto',
	},
	{
		label: 'clip',
		value: 'clip',
	},
];

export function hasOverflowValue( props ) {
	const { name, attributes } = props;

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.overflow;

	return null != defaultValue
		? attributes?.unitone?.overflow !== defaultValue
		: attributes?.unitone?.overflow !== undefined;
}

export function resetOverflow( props ) {
	const { name, attributes, setAttributes } = props;

	delete attributes?.unitone?.overflow;
	const newUnitone = { ...attributes?.unitone };

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.overflow;

	if ( null != defaultValue ) {
		newUnitone.overflow = defaultValue;
	}

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsOverflowDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'unitone.overflow' );
}

export function getOverflowEditLabel( props ) {
	const {
		attributes: { __unstableUnitoneSupports },
	} = props;

	return (
		__unstableUnitoneSupports?.overflow?.label ||
		__( 'Overflow', 'unitone' )
	);
}

export function OverflowEdit( props ) {
	const {
		name,
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.overflow;
	}, [] );

	return (
		<SelectControl
			label={ label }
			options={ overflowOptions }
			value={ unitone?.overflow || '' }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					overflow: newValue || undefined,
				};
				if ( null == newUnitone.overflow ) {
					if ( null == defaultValue ) {
						delete newUnitone.overflow;
					} else {
						newUnitone.overflow = '';
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

export function saveOverflowProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.overflow' ) ) {
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.overflow ) {
		return extraProps;
	}

	extraProps[ 'data-unitone-layout' ] = classnames(
		extraProps[ 'data-unitone-layout' ],
		`-overflow:${ attributes.unitone?.overflow }`
	);

	return extraProps;
}

export function editOverflowProp( settings ) {
	if ( ! hasBlockSupport( settings, 'unitone.overflow' ) ) {
		return settings;
	}

	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveOverflowProp( props, settings, attributes );
	};
	return settings;
}
