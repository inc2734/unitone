import clsx from 'clsx';

import {
	BaseControl,
	Button,
	SelectControl,
	TextControl,
	__experimentalHStack as HStack,
} from '@wordpress/components';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { settings as settingsIcon } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

const PRESETS = [ 'full', 'full-max', 'full-min' ];

export function hasMinHeightValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.minHeight;

	return (
		defaultValue !== unitone?.minHeight && undefined !== unitone?.minHeight
	);
}

export function resetMinHeightFilter() {
	return {
		minHeight: undefined,
	};
}

export function resetMinHeight( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetMinHeightFilter() )
		),
	} );
}

export function isMinHeightSupportDisabled( {
	name,
	attributes: { __unstableUnitoneSupports },
} ) {
	return (
		! hasBlockSupport( name, 'unitone.minHeight' ) &&
		! __unstableUnitoneSupports?.minHeight
	);
}

export function getMinHeightEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Min height', 'unitone' );
	const defaultCode = <code>min-height</code>;

	if ( ! __withCode ) {
		return __unstableUnitoneSupports?.minHeight?.label || defaultLabel;
	}

	return (
		<>
			{ __unstableUnitoneSupports?.minHeight?.label || defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.minHeight?.code || defaultCode }
		</>
	);
}

export function MinHeightEdit( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.minHeight;
	}, [] );

	const isPresetValue = PRESETS.includes( unitone?.minHeight );

	const options = [
		{
			label: __( 'Full Height', 'unitone' ),
			value: 'full',
		},
		{
			label: __( 'Full Height (>= 840px)', 'unitone' ),
			value: 'full-max',
		},
		{
			label: __( 'Full Height (<= 667px)', 'unitone' ),
			value: 'full-min',
		},
	];

	const onChangeMinHeight = ( newValue ) => {
		const newUnitone = {
			...unitone,
			minHeight: newValue || undefined,
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	return (
		<BaseControl
			__nextHasNoMarginBottom
			className="unitone-width-control"
			label={ label }
			id="unitone-min-height-control"
		>
			<HStack alignment="center">
				{ isPresetValue ? (
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						options={ options }
						value={ unitone?.minHeight ?? defaultValue ?? '' }
						onChange={ onChangeMinHeight }
					/>
				) : (
					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						id="unitone-min-height-control"
						value={ unitone?.minHeight ?? defaultValue ?? '' }
						onChange={ onChangeMinHeight }
					/>
				) }

				<Button
					label={
						! isPresetValue
							? __( 'Use size preset' )
							: __( 'Set custom size' )
					}
					icon={ settingsIcon }
					onClick={ () => {
						onChangeMinHeight( ! isPresetValue ? 'full' : '' );
					} }
					isPressed={ ! isPresetValue }
					size="small"
					iconSize={ 24 }
				/>
			</HStack>
		</BaseControl>
	);
}

export function withMinHeightBlockProps( settings ) {
	const { attributes, name } = settings;
	const { __unstableUnitoneSupports } = attributes;

	if (
		isMinHeightSupportDisabled( {
			name,
			attributes: { __unstableUnitoneSupports },
		} )
	) {
		return settings;
	}

	const newMinHeight = attributes?.unitone?.minHeight;

	if ( null == newMinHeight ) {
		return settings;
	}

	const isPresetValue = PRESETS.includes( attributes?.unitone?.minHeight );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				{
					[ `-min-height:${ newMinHeight }` ]: isPresetValue,
				}
			),
			style: {
				...settings.wrapperProps?.style,
				'--unitone--min-height': ! isPresetValue
					? newMinHeight
					: undefined,
			},
		},
	};
}
