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
	justifySpaceBetween,
} from '@wordpress/icons';

import {
	getBlockSupport,
	hasBlockSupport,
	store as blocksStore,
} from '@wordpress/blocks';

import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject, normalizeForToggleGroupControl } from '../utils';

const justifyContentOptions = [
	{
		value: 'start',
		icon: justifyLeft,
		label: __( 'Justify content left', 'unitone' ),
	},
	{
		value: 'center',
		icon: justifyCenter,
		label: __( 'Justify content center', 'unitone' ),
	},
	{
		value: 'end',
		icon: justifyRight,
		label: __( 'Justify content right', 'unitone' ),
	},
	{
		value: 'space-between',
		icon: justifySpaceBetween,
		label: __( 'Justify content space-between', 'unitone' ),
	},
	{
		value: 'space-around',
		icon: justifySpaceBetween,
		label: __( 'Justify content space-around', 'unitone' ),
	},
	{
		value: 'space-evenly',
		icon: justifySpaceBetween,
		label: __( 'Justify content space-evenly', 'unitone' ),
	},
];

function getDefaultValue( { name } ) {
	return wp.data.select( blocksStore ).getBlockType( name )?.attributes
		?.unitone?.default?.justifyContent;
}

function useDefaultValue( { name } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.justifyContent;
	}, [] );

	return defaultValue;
}

export function hasJustifyContentValue( { name, attributes: { unitone } } ) {
	const defaultValue = getDefaultValue( { name } );

	return (
		defaultValue !== unitone?.justifyContent &&
		undefined !== unitone?.justifyContent
	);
}

export function resetJustifyContentFilter() {
	return {
		justifyContent: undefined,
	};
}

export function resetJustifyContent( {
	attributes: { unitone },
	setAttributes,
} ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetJustifyContentFilter() )
		),
	} );
}

export function isJustifyContentSupportDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.justifyContent' );
}

export function JustifyContentToolbar( {
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useDefaultValue( { name } );

	const support = getBlockSupport( name, 'unitone.justifyContent' );
	const filteredOptions = Array.isArray( support )
		? justifyContentOptions.filter( ( option ) =>
				support.includes( option.value )
		  )
		: justifyContentOptions;

	return (
		<ToolbarDropdownMenu
			label={ __( 'Justify content', 'unitone' ) }
			icon={
				filteredOptions.filter(
					( option ) =>
						option.value ===
						( unitone?.justifyContent ?? defaultValue )
				)?.[ 0 ]?.icon ?? filteredOptions[ 0 ]?.icon
			}
			controls={ filteredOptions.map( ( option ) => ( {
				...option,
				title: option.label,
				isActive:
					option.value ===
					( unitone?.justifyContent ?? defaultValue ),
				onClick: () => {
					setAttributes( {
						unitone: cleanEmptyObject( {
							...unitone,
							justifyContent:
								option.value !== unitone?.justifyContent
									? option.value
									: undefined,
						} ),
					} );
				},
			} ) ) }
		/>
	);
}

export function getJustifyContentEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Justify content', 'unitone' );
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

export function JustifyContentEdit( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useDefaultValue( { name } );

	const support = getBlockSupport( name, 'unitone.justifyContent' );
	const filteredOptions = Array.isArray( support )
		? justifyContentOptions.filter( ( option ) =>
				support.includes( option.value )
		  )
		: justifyContentOptions;

	return (
		<fieldset className="block-editor-hooks__flex-layout-justification-controls unitone-dimension-control">
			<ToggleGroupControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ label }
				value={ normalizeForToggleGroupControl(
					unitone?.justifyContent ?? defaultValue
				) }
				isDeselectable={ ! defaultValue }
				onChange={ ( newValue ) => {
					const normalizedNewValue =
						normalizeForToggleGroupControl( newValue );
					const normalizedCurrentValue =
						normalizeForToggleGroupControl(
							unitone?.justifyContent
						);

					setAttributes( {
						unitone: cleanEmptyObject( {
							...unitone,
							justifyContent:
								normalizedCurrentValue !== normalizedNewValue
									? normalizedNewValue
									: undefined,
						} ),
					} );
				} }
			>
				{ filteredOptions.map(
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

export function withJustifyContentBlockProps( settings ) {
	const { attributes, name } = settings;

	if ( isJustifyContentSupportDisabled( { name } ) ) {
		return settings;
	}

	const defaultValue = getDefaultValue( { name } );
	const newJustifyContent =
		attributes?.unitone?.justifyContent ?? defaultValue ?? '';

	if ( '' === newJustifyContent ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				`-justify-content:${ newJustifyContent }`
			),
		},
	};
}
