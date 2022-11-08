import classnames from 'classnames/dedupe';

import { hasBlockSupport } from '@wordpress/blocks';
import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from './utils';

export function hasOverflowValue( props ) {
	return props.attributes?.unitone?.overflow !== undefined;
}

export function resetOverflow( { attributes = {}, setAttributes } ) {
	const { unitone } = attributes;

	setAttributes( {
		unitone: cleanEmptyObject( {
			...unitone,
			overflow: undefined,
		} ),
	} );
}

export function useIsOverflowDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'unitone.overflow' );
}

export function OverflowEdit( props ) {
	const {
		attributes: { unitone },
		setAttributes,
	} = props;

	return (
		<SelectControl
			label={
				<>
					{ __( 'Overflow', 'unitone' ) } :<code>overflow</code>
				</>
			}
			options={ [
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
			] }
			value={ unitone?.overflow }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					overflow: newValue,
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
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
