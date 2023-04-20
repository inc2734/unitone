import classnames from 'classnames';

import { hasBlockSupport } from '@wordpress/blocks';
import { SelectControl } from '@wordpress/components';

const mixBlendModeOptions = [
	{
		label: '',
		value: '',
	},
	{
		label: 'normal',
		value: 'normal',
	},
	{
		label: 'multiply',
		value: 'multiply',
	},
	{
		label: 'screen',
		value: 'screen',
	},
	{
		label: 'overlay',
		value: 'overlay',
	},
	{
		label: 'darken',
		value: 'darken',
	},
	{
		label: 'lighten',
		value: 'lighten',
	},
	{
		label: 'color-dodge',
		value: 'color-dodge',
	},
	{
		label: 'color-burn',
		value: 'color-burn',
	},
	{
		label: 'hard-light',
		value: 'hard-light',
	},
	{
		label: 'soft-light',
		value: 'soft-light',
	},
	{
		label: 'difference',
		value: 'difference',
	},
	{
		label: 'exclusion',
		value: 'exclusion',
	},
	{
		label: 'hue',
		value: 'hue',
	},
	{
		label: 'saturation',
		value: 'saturation',
	},
	{
		label: 'color',
		value: 'color',
	},
	{
		label: 'luminosity',
		value: 'luminosity',
	},
];

export function hasMixBlendModeValue( props ) {
	return props.attributes?.unitone?.mixBlendMode !== undefined;
}

export function resetMixBlendMode( { attributes = {}, setAttributes } ) {
	delete attributes?.unitone?.mixBlendMode;
	const newUnitone = { ...attributes?.unitone };

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsMixBlendModeDisabled( {
	name: blockName,
	attributes: { __unstableUnitoneSupports },
} = {} ) {
	return (
		! hasBlockSupport( blockName, 'unitone.mixBlendMode' ) &&
		! __unstableUnitoneSupports?.mixBlendMode
	);
}

export function MixBlendModeEdit( props ) {
	const {
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

	return (
		<SelectControl
			label={ label }
			options={ mixBlendModeOptions }
			value={ unitone?.mixBlendMode }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					mixBlendMode: newAttribute || undefined,
				};
				if ( null == newUnitone.mixBlendMode ) {
					delete newUnitone.mixBlendMode;
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

export function saveMixBlendModeProp( extraProps, blockType, attributes ) {
	if (
		! hasBlockSupport( blockType, 'unitone.mixBlendMode' ) &&
		! attributes?.__unstableUnitoneSupports?.mixBlendMode
	) {
		delete attributes?.unitone?.mixBlendMode;
		if (
			!! attributes?.unitone &&
			! Object.keys( attributes?.unitone ).length
		) {
			delete attributes?.unitone;
		}
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.mixBlendMode ) {
		return extraProps;
	}

	extraProps[ 'data-unitone-layout' ] = classnames(
		extraProps[ 'data-unitone-layout' ],
		`-mix-blend-mode:${ attributes.unitone?.mixBlendMode }`
	);

	return extraProps;
}

export function editMixBlendModeProp( settings ) {
	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveMixBlendModeProp( props, settings, attributes );
	};

	return settings;
}
