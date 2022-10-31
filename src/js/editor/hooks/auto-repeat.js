import classnames from 'classnames/dedupe';

import { SelectControl } from '@wordpress/components';
import { getBlockSupport, hasBlockSupport } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from './utils';

const autoRepeatOptions = [
	{
		label: '',
		value: '',
	},
	{
		label: __( 'auto-fill', 'unitone' ),
		value: 'auto-fill',
	},
	{
		label: __( 'auto-fit', 'unitone' ),
		value: 'auto-fit',
	},
];

export function useIsAutoRepeatDisabled( { name: blockName } = {} ) {
	return ! getBlockSupport( blockName, 'unitone.autoRepeat' );
}

export function hasAutoRepeatValue( props ) {
	return (
		props.attributes?.unitone?.autoRepeat !== undefined &&
		props.attributes?.unitone?.autoRepeat !== ''
	);
}

export function resetAutoRepeat( { attributes = {}, setAttributes } ) {
	const { unitone } = attributes;

	setAttributes( {
		unitone: cleanEmptyObject( {
			...unitone,
			AutoRepeat: undefined,
		} ),
	} );
}

export const resetAutoRepeatFilter = ( newAttributes ) => ( {
	...newAttributes,
	unitone: cleanEmptyObject( {
		...newAttributes?.unitone,
		AutoRepeat: undefined,
	} ),
} );

export function AutoRepeatEdit( props ) {
	const {
		attributes: { unitone },
		setAttributes,
	} = props;

	return (
		<SelectControl
			label={
				<>
					{ __( 'Auto repeat', 'unitone' ) } :{ ' ' }
					<code>auto-repeat</code>
				</>
			}
			value={ unitone?.autoRepeat || '' }
			options={ autoRepeatOptions }
			onChange={ ( newValue ) => {
				const newUnitone = cleanEmptyObject( {
					...unitone,
					autoRepeat: newValue,
				} );

				setAttributes( {
					unitone: newUnitone,
				} );
			} }
		/>
	);
}

export function saveAutoRepeatProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.autoRepeat' ) ) {
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.autoRepeat ) {
		return extraProps;
	}

	extraProps[ 'data-unitone-layout' ] = classnames(
		extraProps[ 'data-unitone-layout' ],
		`-auto-repeat:${ attributes.unitone?.autoRepeat }`
	);

	return extraProps;
}

export function editAutoRepeatProp( settings ) {
	if ( ! hasBlockSupport( settings, 'unitone.autoRepeat' ) ) {
		return settings;
	}

	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveAutoRepeatProp( props, settings, attributes );
	};

	return settings;
}
