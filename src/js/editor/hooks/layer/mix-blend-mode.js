import classnames from 'classnames';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

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
	const { name, attributes } = props;

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.mixBlendMode;

	return null != defaultValue
		? attributes?.unitone?.mixBlendMode !== defaultValue
		: attributes?.unitone?.mixBlendMode !== undefined;
}

export function resetMixBlendMode( props ) {
	const { name, attributes, setAttributes } = props;

	delete attributes?.unitone?.mixBlendMode;
	const newUnitone = { ...attributes?.unitone };

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.mixBlendMode;

	if ( null != defaultValue ) {
		newUnitone.mixBlendMode = defaultValue;
	}

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
		name,
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.mixBlendMode;
	}, [] );

	return (
		<SelectControl
			label={ label }
			help={ __(
				'Apply to the block with the upper overlap order.',
				'unitone'
			) }
			options={ mixBlendModeOptions }
			value={ unitone?.mixBlendMode }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					mixBlendMode: newAttribute || undefined,
				};
				if ( null == newUnitone.mixBlendMode ) {
					if ( null == defaultValue ) {
						delete newUnitone.mixBlendMode;
					} else {
						newUnitone.mixBlendMode = '';
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
