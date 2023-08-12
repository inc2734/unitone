import classnames from 'classnames';

import { hasBlockSupport } from '@wordpress/blocks';
import { SelectControl } from '@wordpress/components';

const alignSelfOptions = [
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

export function hasAlignSelfValue( props ) {
	return props.attributes?.unitone?.alignSelf !== undefined;
}

export function resetAlignSelf( { attributes = {}, setAttributes } ) {
	delete attributes?.unitone?.alignSelf;
	const newUnitone = { ...attributes?.unitone };

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsAlignSelfDisabled( {
	name: blockName,
	attributes: { __unstableUnitoneSupports },
} = {} ) {
	return (
		! hasBlockSupport( blockName, 'unitone.alignSelf' ) &&
		! __unstableUnitoneSupports?.alignSelf
	);
}

export function AlignSelfEdit( props ) {
	const {
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

	return (
		<SelectControl
			label={ label }
			options={ alignSelfOptions }
			value={ unitone?.alignSelf }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					alignSelf: newAttribute || undefined,
				};
				if ( null == newUnitone.alignSelf ) {
					delete newUnitone.alignSelf;
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

export function saveAlignSelfProp( extraProps, blockType, attributes ) {
	if (
		! hasBlockSupport( blockType, 'unitone.alignSelf' ) &&
		! attributes?.__unstableUnitoneSupports?.alignSelf
	) {
		delete attributes?.unitone?.alignSelf;
		if (
			!! attributes?.unitone &&
			! Object.keys( attributes?.unitone ).length
		) {
			delete attributes?.unitone;
		}
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.alignSelf ) {
		return extraProps;
	}

	extraProps[ 'data-unitone-layout' ] = classnames(
		extraProps[ 'data-unitone-layout' ],
		`-align-self:${ attributes.unitone?.alignSelf }`
	);

	return extraProps;
}

export function editAlignSelfProp( settings ) {
	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveAlignSelfProp( props, settings, attributes );
	};

	return settings;
}
