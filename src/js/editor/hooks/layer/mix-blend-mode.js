import clsx from 'clsx';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
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

function getDefaultValue( { name, __unstableUnitoneSupports } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.mixBlendMode;
	const unstableDefaultValue =
		__unstableUnitoneSupports?.mixBlendMode?.default;
	return unstableDefaultValue ?? defaultValue;
}

function useDefaultValue( { name, __unstableUnitoneSupports } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.mixBlendMode;
	}, [] );
	const unstableDefaultValue =
		__unstableUnitoneSupports?.mixBlendMode?.default;
	return unstableDefaultValue ?? defaultValue;
}

export function hasMixBlendModeValue( {
	name,
	attributes: { unitone, __unstableUnitoneSupports },
} ) {
	const defaultValue = getDefaultValue( { name, __unstableUnitoneSupports } );

	return (
		defaultValue !== unitone?.mixBlendMode &&
		undefined !== unitone?.mixBlendMode
	);
}

export function resetMixBlendModeFilter() {
	return {
		mixBlendMode: undefined,
	};
}

export function resetMixBlendMode( {
	attributes: { unitone },
	setAttributes,
} ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetMixBlendModeFilter() )
		),
	} );
}

export function isMixBlendModeSupportDisabled( {
	name,
	attributes: { __unstableUnitoneSupports },
} ) {
	return (
		! hasBlockSupport( name, 'unitone.mixBlendMode' ) &&
		! __unstableUnitoneSupports?.mixBlendMode
	);
}

export function MixBlendModeEdit( {
	label,
	name,
	attributes: { unitone, __unstableUnitoneSupports },
	setAttributes,
} ) {
	const defaultValue = useDefaultValue( { name, __unstableUnitoneSupports } );

	return (
		<SelectControl
			__next40pxDefaultSize
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

export function withMixBlendModeBlockProps( settings ) {
	const { attributes, name } = settings;
	const { __unstableUnitoneSupports } = attributes;

	if (
		isMixBlendModeSupportDisabled( {
			name,
			attributes: { __unstableUnitoneSupports },
		} )
	) {
		return settings;
	}

	const defaultValue = getDefaultValue( { name, __unstableUnitoneSupports } );
	const newMixBlendMode =
		attributes?.unitone?.mixBlendMode ?? defaultValue ?? '';

	if ( '' === newMixBlendMode ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				`-mix-blend-mode:${ newMixBlendMode }`
			),
		},
	};
}
