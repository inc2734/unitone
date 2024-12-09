import clsx from 'clsx';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

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

export function hasMixBlendModeValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.mixBlendMode;

	return (
		defaultValue !== unitone?.mixBlendMode &&
		undefined !== unitone?.mixBlendMode
	);
}

export function resetMixBlendModeFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			mixBlendMode: undefined,
		},
	};
}

export function resetMixBlendMode( {
	attributes: { unitone },
	setAttributes,
} ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetMixBlendModeFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsMixBlendModeDisabled( {
	name,
	attributes: { __unstableUnitoneSupports },
} = {} ) {
	return (
		! hasBlockSupport( name, 'unitone.mixBlendMode' ) &&
		! __unstableUnitoneSupports?.mixBlendMode
	);
}

export function MixBlendModeEdit( {
	label,
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.mixBlendMode;
	}, [] );

	return (
		<SelectControl
			__nextHasNoMarginBottom
			label={ label }
			help={ __(
				'Apply to the block with the upper overlap order.',
				'unitone'
			) }
			options={ mixBlendModeOptions }
			value={ unitone?.mixBlendMode ?? defaultValue ?? '' }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					mixBlendMode: newAttribute || undefined,
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

function useBlockProps( extraProps, blockType, attributes ) {
	const unitoneLayout = useMemo( () => {
		if ( ! hasBlockSupport( blockType, 'unitone.mixBlendMode' ) ) {
			if ( ! attributes?.__unstableUnitoneSupports?.mixBlendMode ) {
				return extraProps?.[ 'data-unitone-layout' ];
			}
		}

		if ( null == attributes?.unitone?.mixBlendMode ) {
			return extraProps?.[ 'data-unitone-layout' ];
		}

		return clsx(
			extraProps?.[ 'data-unitone-layout' ],
			`-mix-blend-mode:${ attributes.unitone?.mixBlendMode }`
		);
	}, [
		blockType,
		attributes?.__unstableUnitoneSupports?.mixBlendMode,
		attributes?.unitone?.mixBlendMode,
		extraProps?.[ 'data-unitone-layout' ],
	] );

	return {
		...extraProps,
		'data-unitone-layout': unitoneLayout,
	};
}

export function useMixBlendModeBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;
	const { __unstableUnitoneSupports } = attributes;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.mixBlendMode;
		},
		[ name ]
	);

	const newMixBlendModeProp = useBlockProps( wrapperProps, name, {
		__unstableUnitoneSupports,
		unitone: {
			mixBlendMode: attributes?.unitone?.mixBlendMode ?? defaultValue,
		},
	} );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...newMixBlendModeProp,
		},
	};
}
