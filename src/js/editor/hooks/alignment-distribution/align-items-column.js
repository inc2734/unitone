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

import { cleanEmptyObject, normalizeForToggleGroupControl } from '../utils';

const alignItemsColumnOptions = [
	{
		value: 'start',
		icon: justifyLeft,
		label: __( 'Justify items left', 'unitone' ),
	},
	{
		value: 'center',
		icon: justifyCenter,
		label: __( 'Justify items center', 'unitone' ),
	},
	{
		value: 'end',
		icon: justifyRight,
		label: __( 'Justify items right', 'unitone' ),
	},
	{
		value: 'stretch',
		icon: justifyStretch,
		label: __( 'Stretch to fill', 'unitone' ),
	},
];

function getDefaultValue( { name } ) {
	return wp.data.select( blocksStore ).getBlockType( name )?.attributes
		?.unitone?.default?.alignItems;
}

function useDefaultValue( { name } ) {
	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.alignItems;
		},
		[ name ]
	);

	return defaultValue;
}

export function hasAlignItemsColumnValue( { name, attributes: { unitone } } ) {
	const defaultValue = getDefaultValue( { name } );

	return (
		defaultValue !== unitone?.alignItems &&
		undefined !== unitone?.alignItems
	);
}

export function resetAlignItemsColumnFilter() {
	return {
		alignItems: undefined,
	};
}

export function resetAlignItemsColumn( {
	attributes: { unitone },
	setAttributes,
} ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetAlignItemsColumnFilter() )
		),
	} );
}

export function isAlignItemsColumnSupportDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.alignItemsColumn' );
}

export function AlignItemsColumnToolbar( {
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useDefaultValue( { name } );

	return (
		<ToolbarDropdownMenu
			label={ __( 'Justify content', 'unitone' ) }
			icon={
				alignItemsColumnOptions.filter(
					( option ) =>
						option.value === ( unitone?.alignItems ?? defaultValue )
				)?.[ 0 ]?.icon ?? alignItemsColumnOptions[ 0 ]?.icon
			}
			controls={ alignItemsColumnOptions.map( ( option ) => ( {
				...option,
				title: option.label,
				isActive:
					option.value === ( unitone?.alignItems ?? defaultValue ),
				onClick: () => {
					setAttributes( {
						unitone: cleanEmptyObject( {
							...unitone,
							alignItems:
								option.value !== unitone?.alignItems
									? option.value
									: undefined,
						} ),
					} );
				},
			} ) ) }
		/>
	);
}

export function getAlignItemsColumnEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Justify content', 'unitone' );
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

export function AlignItemsColumnEdit( {
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
					unitone?.alignItems ?? defaultValue
				) }
				isDeselectable={ ! defaultValue }
				onChange={ ( newValue ) => {
					const normalizedNewValue =
						normalizeForToggleGroupControl( newValue );
					const normalizedCurrentValue =
						normalizeForToggleGroupControl( unitone?.alignItems );

					setAttributes( {
						unitone: cleanEmptyObject( {
							...unitone,
							alignItems:
								normalizedCurrentValue !== normalizedNewValue
									? normalizedNewValue
									: undefined,
						} ),
					} );
				} }
			>
				{ alignItemsColumnOptions.map(
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

export function withAlignItemsColumnBlockProps( settings ) {
	const { attributes, name } = settings;

	if ( isAlignItemsColumnSupportDisabled( { name } ) ) {
		return settings;
	}

	const defaultValue = getDefaultValue( { name } );
	const newAlignItems = attributes?.unitone?.alignItems ?? defaultValue ?? '';

	if ( '' === newAlignItems ) {
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
