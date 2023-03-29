import classnames from 'classnames/dedupe';

import { hasBlockSupport } from '@wordpress/blocks';
import { SelectControl } from '@wordpress/components';

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
];

export function hasOverflowValue( props ) {
	return props.attributes?.unitone?.overflow !== undefined;
}

export function resetOverflow( { attributes = {}, setAttributes } ) {
	delete attributes?.unitone?.overflow;
	const newUnitone = { ...attributes?.unitone };

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsOverflowDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'unitone.overflow' );
}

export function OverflowEdit( props ) {
	const {
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

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
					delete newUnitone.overflow;
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
