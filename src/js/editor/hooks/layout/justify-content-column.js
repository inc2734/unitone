import clsx from 'clsx';

import {
	ToolbarDropdownMenu,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import {
	alignBottom,
	alignCenter,
	alignTop,
	alignSpaceBetween,
} from '../icons';

import { cleanEmptyObject } from '../utils';

const justifyContentColumnOptions = [
	{
		value: 'start',
		icon: alignTop,
		label: __( 'Justify items top', 'unitone' ),
	},
	{
		value: 'center',
		icon: alignCenter,
		label: __( 'Justify items center', 'unitone' ),
	},
	{
		value: 'end',
		icon: alignBottom,
		label: __( 'Justify items bottom', 'unitone' ),
	},
	{
		value: 'space-between',
		icon: alignSpaceBetween,
		label: __( 'Justify items space-between', 'unitone' ),
	},
];

export function hasJustifyContentColumnValue( {
	name,
	attributes: { unitone },
} ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.justifyContent;

	return (
		defaultValue !== unitone?.justifyContent &&
		undefined !== unitone?.justifyContent
	);
}

function resetJustifyContentColumnFilter( attributes ) {
	if ( null != attributes?.unitone?.justifyContent ) {
		attributes.unitone.justifyContent = undefined;
	}

	return attributes;
}

export function resetJustifyContentColumn( {
	attributes: { unitone },
	setAttributes,
} ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetJustifyContentColumnFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsJustifyContentColumnDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.justifyContentColumn' );
}

export function JustifyContentColumnToolbar( {
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.justifyContent;
	}, [] );

	return (
		<ToolbarDropdownMenu
			label={ __( 'Align items', 'unitone' ) }
			icon={
				justifyContentColumnOptions.filter(
					( option ) =>
						option.value === unitone?.justifyContent ?? defaultValue
				)?.[ 0 ]?.icon ?? justifyContentColumnOptions[ 0 ]?.icon
			}
			controls={ justifyContentColumnOptions.map( ( option ) => ( {
				...option,
				title: option.label,
				isActive:
					option.value === unitone?.justifyContent ?? defaultValue,
				onClick: () => {
					const newUnitone = {
						...unitone,
						justifyContent:
							option.value !== unitone?.justifyContent ??
							defaultValue
								? option.value || undefined
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

export function getJustifyContentColumnEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Align items', 'unitone' );
	const defaultCode = <code>justify-content</code>;

	if ( ! __withCode ) {
		return __unstableUnitoneSupports?.justifyContent?.label || defaultLabel;
	}

	return (
		<>
			{ __unstableUnitoneSupports?.justifyContent?.label || defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.justifyContent?.code || defaultCode }
		</>
	);
}

export function JustifyContentColumnEdit( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.justifyContent;
	}, [] );

	return (
		<fieldset className="block-editor-hooks__flex-layout-justification-controls">
			<ToggleGroupControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ label }
				value={ unitone?.justifyContent ?? defaultValue }
				onChange={ ( newValue ) => {
					const newUnitone = {
						...unitone,
						justifyContent:
							unitone?.justifyContent !== newValue
								? newValue
								: undefined,
					};

					setAttributes( {
						unitone: cleanEmptyObject( newUnitone ),
					} );
				} }
			>
				{ justifyContentColumnOptions.map(
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

export function useJustifyContentColumnBlockProps( settings ) {
	const { attributes, name } = settings;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.justifyContent;
		},
		[ name ]
	);

	if ( ! hasBlockSupport( name, 'unitone.justifyContentColumn' ) ) {
		return settings;
	}

	const newJustifyContentColumn =
		attributes?.unitone?.justifyContent ?? defaultValue;

	if ( null == newJustifyContentColumn ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				`-justify-content:${ newJustifyContentColumn }`
			),
		},
	};
}
