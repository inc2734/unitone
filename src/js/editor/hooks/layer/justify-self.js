import classnames from 'classnames';

import { hasBlockSupport } from '@wordpress/blocks';
import { SelectControl } from '@wordpress/components';

const justifySelfOptions = [
	{
		label: '',
		value: '',
	},
	{
		label: 'auto',
		value: 'auto',
	},
	{
		label: 'normal',
		value: 'normal',
	},
	{
		label: 'start',
		value: 'start',
	},
	{
		label: 'center',
		value: 'center',
	},
	{
		label: 'end',
		value: 'end',
	},
	{
		label: 'stretch',
		value: 'stretch',
	},
	{
		label: 'baseline',
		value: 'baseline',
	},
];

export function hasJustifySelfValue( props ) {
	return props.attributes?.unitone?.justifySelf !== undefined;
}

export function resetJustifySelf( { attributes = {}, setAttributes } ) {
	delete attributes?.unitone?.justifySelf;
	const newUnitone = { ...attributes?.unitone };

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsJustifySelfDisabled( {
	name: blockName,
	attributes: { __unstableUnitoneSupports },
} = {} ) {
	return (
		! hasBlockSupport( blockName, 'unitone.justifySelf' ) &&
		! __unstableUnitoneSupports?.justifySelf
	);
}

export function JustifySelfEdit( props ) {
	const {
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

	return (
		<SelectControl
			label={ label }
			options={ justifySelfOptions }
			value={ unitone?.justifySelf }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					justifySelf: newAttribute || undefined,
				};
				if ( null == newUnitone.justifySelf ) {
					delete newUnitone.justifySelf;
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

export function saveJustifySelfProp( extraProps, blockType, attributes ) {
	if (
		! hasBlockSupport( blockType, 'unitone.justifySelf' ) &&
		! attributes?.__unstableUnitoneSupports?.justifySelf
	) {
		delete attributes?.unitone?.justifySelf;
		if (
			!! attributes?.unitone &&
			! Object.keys( attributes?.unitone ).length
		) {
			delete attributes?.unitone;
		}
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.justifySelf ) {
		return extraProps;
	}

	extraProps[ 'data-unitone-layout' ] = classnames(
		extraProps[ 'data-unitone-layout' ],
		`-justify-self:${ attributes.unitone?.justifySelf }`
	);

	return extraProps;
}

export function editJustifySelfProp( settings ) {
	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveJustifySelfProp( props, settings, attributes );
	};

	return settings;
}
