import clsx from 'clsx';

import {
	ToolbarDropdownMenu,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';

import {
	justifyLeft,
	justifyCenter,
	justifyRight,
	justifyStretch,
} from '@wordpress/icons';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';
import { physicalToLogical, logicalToPhysical } from '../../../helper';

const justifyItemsOptions = [
	{
		value: 'top',
		icon: justifyLeft,
		label: __( 'Justify items top', 'unitone' ),
	},
	{
		value: 'center',
		icon: justifyCenter,
		label: __( 'Justify items center', 'unitone' ),
	},
	{
		value: 'bottom',
		icon: justifyRight,
		label: __( 'Justify items bottom', 'unitone' ),
	},
	{
		value: 'stretch',
		icon: justifyStretch,
		label: __( 'Stretch to fill', 'unitone' ),
	},
];

export function hasJustifyItemsValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.justifyItems;

	return (
		defaultValue !== unitone?.justifyItems &&
		undefined !== unitone?.justifyItems
	);
}

function resetJustifyItemsFilter( attributes ) {
	if ( null != attributes?.unitone?.justifyItems ) {
		attributes.unitone.justifyItems = undefined;
	}

	return attributes;
}

export function resetJustifyItems( {
	attributes: { unitone },
	setAttributes,
} ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetJustifyItemsFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsJustifyItemsDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.justifyItems' );
}

export function JustifyItemsToolbar( {
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.justifyItems;
	}, [] );

	return (
		<ToolbarDropdownMenu
			label={ __( 'Justify items', 'unitone' ) }
			icon={
				justifyItemsOptions.filter(
					( option ) =>
						option.value ===
						logicalToPhysical(
							unitone?.justifyItems ?? defaultValue
						)
				)?.[ 0 ]?.icon ?? justifyItemsOptions[ 0 ]?.icon
			}
			controls={ justifyItemsOptions.map( ( option ) => ( {
				...option,
				title: option.label,
				isActive:
					option.value ===
					logicalToPhysical( unitone?.justifyItems ?? defaultValue ),
				onClick: () => {
					const newUnitone = {
						...unitone,
						justifyItems:
							option.value !==
							logicalToPhysical(
								unitone?.justifyItems ?? defaultValue
							)
								? physicalToLogical( option.value || undefined )
								: undefined,
					};

					setAttributes( {
						unitone: cleanEmptyObject( newUnitone ),
					} );
				},
			} ) ) }
		/>
	);
}

export function getJustifyItemsEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Justify items', 'unitone' );
	const defaultCode = <code>justify-items</code>;

	if ( ! __withCode ) {
		return __unstableUnitoneSupports?.justifyItems?.label || defaultLabel;
	}

	return (
		<>
			{ __unstableUnitoneSupports?.justifyItems?.label || defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.justifyItems?.code || defaultCode }
		</>
	);
}

export function JustifyItemsEdit( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.justifyItems;
	}, [] );

	return (
		<fieldset className="block-editor-hooks__flex-layout-justification-controls">
			<ToggleGroupControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ label }
				value={ logicalToPhysical(
					unitone?.justifyItems ?? defaultValue,
					'vertical'
				) }
				isDeselectable={ ! defaultValue }
				onChange={ ( newValue ) => {
					const newUnitone = {
						...unitone,
						justifyItems:
							logicalToPhysical(
								unitone?.justifyItems,
								'vertical'
							) !== newValue
								? physicalToLogical( newValue )
								: undefined,
					};

					setAttributes( {
						unitone: cleanEmptyObject( newUnitone ),
					} );
				} }
			>
				{ justifyItemsOptions.map(
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

export function useJustifyItemsBlockProps( settings ) {
	const { attributes, name } = settings;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.justifyItems;
		},
		[ name ]
	);

	if ( ! hasBlockSupport( name, 'unitone.justifyItems' ) ) {
		return settings;
	}

	const newJustifyItems = attributes?.unitone?.justifyItems ?? defaultValue;

	if ( null == newJustifyItems ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				`-justify-items:${ newJustifyItems }`
			),
		},
	};
}
