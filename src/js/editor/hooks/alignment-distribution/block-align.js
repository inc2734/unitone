import clsx from 'clsx';

import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';

import {
	justifyLeft,
	justifyCenter,
	justifyRight,
	justifyStretch,
} from '@wordpress/icons';

import { BlockAlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject, normalizeForToggleGroupControl } from '../utils';
import { physicalToLogical, logicalToPhysical } from '../../../utils/direction';

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
	{
		value: 'none',
		icon: justifyStretch,
		label: __( 'None', 'unitone' ),
	},
];

function getDefaultValue( { name } ) {
	return wp.data.select( blocksStore ).getBlockType( name )?.attributes
		?.unitone?.default?.blockAlign;
}

function useDefaultValue( { name } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.blockAlign;
	}, [] );

	return defaultValue;
}

export function hasBlockAlignValue( { name, attributes: { unitone } } ) {
	const defaultValue = getDefaultValue( { name } );

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

export function isBlockAlignSupportDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.blockAlign' );
}

export function BlockAlignToolbar( {
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useDefaultValue( { name } );

	return (
		<BlockControls group="block">
			<BlockAlignmentToolbar
				controls={ blockAlignOptions.map( ( option ) => option.value ) }
				value={ logicalToPhysical(
					unitone?.blockAlign ?? defaultValue
				) }
				onChange={ ( newAttribute ) => {
					setAttributes( {
						unitone: cleanEmptyObject( {
							...unitone,
							blockAlign: physicalToLogical(
								newAttribute || 'none'
							),
						} ),
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
	const defaultValue = useDefaultValue( { name } );

	return (
		<fieldset className="block-editor-hooks__flex-layout-justification-controls unitone-dimension-control">
			<ToggleGroupControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ label }
				value={ normalizeForToggleGroupControl(
					logicalToPhysical( unitone?.blockAlign ?? defaultValue )
				) }
				onChange={ ( value ) => {
					const normalizedNewValue = normalizeForToggleGroupControl(
						physicalToLogical( value )
					);
					const normalizedCurrentValue =
						normalizeForToggleGroupControl(
							logicalToPhysical( unitone?.blockAlign )
						);

					setAttributes( {
						unitone: cleanEmptyObject( {
							...unitone,
							blockAlign:
								normalizedCurrentValue !== normalizedNewValue
									? normalizedNewValue
									: undefined,
						} ),
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

export function withBlockAlignBlockProps( settings ) {
	const { attributes, name } = settings;

	if ( isBlockAlignSupportDisabled( { name } ) ) {
		return settings;
	}

	const defaultValue = getDefaultValue( { name } );
	const newBlockAlign = attributes?.unitone?.blockAlign ?? defaultValue ?? '';

	if ( '' === newBlockAlign || 'none' === newBlockAlign ) {
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
