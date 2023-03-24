import classnames from 'classnames/dedupe';

import { SelectControl } from '@wordpress/components';
import { hasBlockSupport } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

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
	return ! hasBlockSupport( blockName, 'unitone.autoRepeat' );
}

export function hasAutoRepeatValue( props ) {
	return (
		props.attributes?.unitone?.autoRepeat !== undefined &&
		props.attributes?.unitone?.autoRepeat !== ''
	);
}

export function resetAutoRepeat( { attributes = {}, setAttributes } ) {
	delete attributes?.unitone?.autoRepeat;
	const newUnitone = { ...attributes?.unitone };

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function AutoRepeatEdit( props ) {
	const {
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

	return (
		<SelectControl
			label={ label }
			value={ unitone?.autoRepeat || '' }
			options={ autoRepeatOptions }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					autoRepeat: newValue || undefined,
				};
				if ( null == newUnitone.autoRepeat ) {
					delete newUnitone.autoRepeat;
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
