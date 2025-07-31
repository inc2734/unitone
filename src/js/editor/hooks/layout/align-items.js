import clsx from 'clsx';

import {
	ToolbarDropdownMenu,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';
import { alignBottom, alignCenter, alignTop, alignStretch } from '../icons';

const alignItemsOptions = [
	{
		value: 'start',
		icon: alignTop,
		label: __( 'Align items top', 'unitone' ),
	},
	{
		value: 'center',
		icon: alignCenter,
		label: __( 'Align items center', 'unitone' ),
	},
	{
		value: 'end',
		icon: alignBottom,
		label: __( 'Align items bottom', 'unitone' ),
	},
	{
		value: 'stretch',
		icon: alignStretch,
		label: __( 'Stretch to fill', 'unitone' ),
	},
];

export function hasAlignItemsValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.alignItems;

	return (
		defaultValue !== unitone?.alignItems &&
		undefined !== unitone?.alignItems
	);
}

export function resetAlignItemsFilter() {
	return {
		alignItems: undefined,
	};
}

export function resetAlignItems( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetAlignItemsFilter() )
		),
	} );
}

export function isAlignItemsSupportDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.alignItems' );
}

export function AlignItemsToolbar( {
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.alignItems;
	}, [] );

	return (
		<ToolbarDropdownMenu
			label={ __( 'Align items', 'unitone' ) }
			icon={
				alignItemsOptions.filter(
					( option ) =>
						option.value === ( unitone?.alignItems ?? defaultValue )
				)?.[ 0 ]?.icon ?? alignItemsOptions[ 0 ]?.icon
			}
			controls={ alignItemsOptions.map( ( option ) => ( {
				...option,
				title: option.label,
				isActive:
					option.value === ( unitone?.alignItems ?? defaultValue ),
				onClick: () => {
					const newUnitone = {
						...unitone,
						alignItems:
							option.value !== unitone?.alignItems
								? option.value
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

export function getAlignItemsEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Align items', 'unitone' );
	const defaultCode = <code>align-items</code>;

	if ( ! __withCode ) {
		return __unstableUnitoneSupports?.alignItems?.label || defaultLabel;
	}

	return (
		<>
			{ __unstableUnitoneSupports?.alignItems?.label || defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.alignItems?.code || defaultCode }
		</>
	);
}

export function AlignItemsEdit( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.alignItems;
	}, [] );

	return (
		<fieldset className="block-editor-hooks__flex-layout-justification-controls unitone-dimension-control">
			<ToggleGroupControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ label }
				value={ unitone?.alignItems ?? defaultValue }
				isDeselectable={ ! defaultValue }
				onChange={ ( newValue ) => {
					const newUnitone = {
						...unitone,
						alignItems:
							unitone?.alignItems !== newValue
								? newValue
								: undefined,
					};

					setAttributes( {
						unitone: cleanEmptyObject( newUnitone ),
					} );
				} }
			>
				{ alignItemsOptions.map(
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

export function withAlignItemsBlockProps( settings ) {
	const { attributes, name } = settings;

	if ( ! hasBlockSupport( name, 'unitone.alignItems' ) ) {
		return settings;
	}

	const newAlignItems = attributes?.unitone?.alignItems;

	if ( null == newAlignItems ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				`-align-items:${ newAlignItems }`
			),
		},
	};
}
