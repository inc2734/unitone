import clsx from 'clsx';

import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';

import { BlockAlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { justifyLeft, justifyCenter, justifyRight } from '@wordpress/icons';

import { cleanEmptyObject } from '../utils';
import { physicalToLogical, logicalToPhysical } from '../../../helper';

const blockAlignOptions = [
	{
		value: 'left',
		icon: justifyLeft,
		label: __( 'Left', 'unitone' ),
	},
	{
		value: 'center',
		icon: justifyCenter,
		label: __( 'Center', 'unitone' ),
	},
	{
		value: 'right',
		icon: justifyRight,
		label: __( 'Right', 'unitone' ),
	},
];

export function hasBlockAlignValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.blockAlign;

	return (
		defaultValue !== unitone?.blockAlign &&
		undefined !== unitone?.blockAlign
	);
}

export function resetBlockAlignFilter() {
	return {
		blockAlign: undefined,
	};
}

export function resetBlockAlign( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetBlockAlignFilter() )
		),
	} );
}

export function useIsBlockAlignDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.blockAlign' );
}

export function BlockAlignToolbar( {
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.blockAlign;
	}, [] );

	return (
		<BlockControls group="block">
			<BlockAlignmentToolbar
				controls={ blockAlignOptions.map( ( option ) => option.value ) }
				value={ logicalToPhysical(
					unitone?.blockAlign ?? defaultValue
				) }
				onChange={ ( newAttribute ) => {
					const newUnitone = {
						...unitone,
						blockAlign: physicalToLogical(
							newAttribute || undefined
						),
					};

					setAttributes( {
						unitone: cleanEmptyObject( newUnitone ),
					} );
				} }
			/>
		</BlockControls>
	);
}

export function getBlockAlignEditLabel( {
	attributes: { __unstableUnitoneSupports },
} ) {
	return (
		__unstableUnitoneSupports?.blockAlign?.label ||
		__( 'Block alignment', 'unitone' )
	);
}

export function BlockAlignEdit( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.blockAlign;
	}, [] );

	return (
		<fieldset className="block-editor-hooks__flex-layout-justification-controls">
			<ToggleGroupControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ label }
				value={ logicalToPhysical(
					unitone?.blockAlign ?? defaultValue
				) }
				onChange={ ( value ) => {
					const newUnitone = {
						...unitone,
						blockAlign:
							logicalToPhysical( unitone?.blockAlign ) !== value
								? physicalToLogical( value )
								: undefined,
					};

					setAttributes( {
						unitone: cleanEmptyObject( newUnitone ),
					} );
				} }
			>
				{ blockAlignOptions.map(
					( { value, icon, label: iconLabel } ) => (
						<ToggleGroupControlOptionIcon
							key={ value }
							icon={ icon }
							label={ iconLabel }
							value={ value }
						/>
					)
				) }
			</ToggleGroupControl>
		</fieldset>
	);
}

export function useBlockAlignBlockProps( settings ) {
	const { attributes, name } = settings;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.blockAlign;
		},
		[ name ]
	);

	if ( ! hasBlockSupport( name, 'unitone.blockAlign' ) ) {
		return settings;
	}

	const newBlockAlign = attributes?.unitone?.blockAlign ?? defaultValue;

	if ( null == newBlockAlign ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				`-align:${ newBlockAlign }`
			),
		},
	};
}
