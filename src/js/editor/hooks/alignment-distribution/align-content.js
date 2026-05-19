import clsx from 'clsx';

import {
	ToolbarDropdownMenu,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';

import { justifySpaceBetweenVertical } from '@wordpress/icons';
import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { alignBottom, alignCenter, alignTop, alignStretch } from '../icons';
import { cleanEmptyObject, normalizeForToggleGroupControl } from '../utils';

const alignContentOptions = [
	{
		value: 'start',
		icon: alignTop,
		label: __( 'Align content top', 'unitone' ),
	},
	{
		value: 'center',
		icon: alignCenter,
		label: __( 'Align content center', 'unitone' ),
	},
	{
		value: 'end',
		icon: alignBottom,
		label: __( 'Align content bottom', 'unitone' ),
	},
	{
		value: 'space-between',
		icon: justifySpaceBetweenVertical,
		label: __( 'Align content space-between', 'unitone' ),
	},
	{
		value: 'space-around',
		icon: justifySpaceBetweenVertical,
		label: __( 'Align content space-around', 'unitone' ),
	},
	{
		value: 'space-evenly',
		icon: justifySpaceBetweenVertical,
		label: __( 'Align content space-evenly', 'unitone' ),
	},
	{
		value: 'stretch',
		icon: alignStretch,
		label: __( 'Stretch to fill', 'unitone' ),
	},
];

function getDefaultValue( { name } ) {
	return wp.data.select( blocksStore ).getBlockType( name )?.attributes
		?.unitone?.default?.alignContent;
}

function useDefaultValue( { name } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.alignContent;
	}, [] );

	return defaultValue;
}

export function hasAlignContentValue( { name, attributes: { unitone } } ) {
	const defaultValue = getDefaultValue( { name } );

	return (
		defaultValue !== unitone?.alignContent &&
		undefined !== unitone?.alignContent
	);
}

export function resetAlignContentFilter() {
	return {
		alignContent: undefined,
	};
}

export function resetAlignContent( {
	attributes: { unitone },
	setAttributes,
} ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetAlignContentFilter() )
		),
	} );
}

export function isAlignContentSupportDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.alignContent' );
}

export function AlignContentToolbar( {
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useDefaultValue( { name } );

	return (
		<ToolbarDropdownMenu
			label={ __( 'Align content', 'unitone' ) }
			icon={
				alignContentOptions.filter(
					( option ) =>
						option.value ===
						( unitone?.alignContent ?? defaultValue )
				)?.[ 0 ]?.icon ?? alignContentOptions[ 0 ]?.icon
			}
			controls={ alignContentOptions.map( ( option ) => ( {
				...option,
				title: option.label,
				isActive:
					option.value === ( unitone?.alignContent ?? defaultValue ),
				onClick: () => {
					setAttributes( {
						unitone: cleanEmptyObject( {
							...unitone,
							alignContent:
								option.value !== unitone?.alignContent
									? option.value
									: undefined,
						} ),
					} );
				},
			} ) ) }
		/>
	);
}

export function getAlignContentEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Align content', 'unitone' );
	const defaultCode = <code>align-content</code>;

	if ( ! __withCode ) {
		return __unstableUnitoneSupports?.alignContent?.label || defaultLabel;
	}

	return (
		<>
			{ __unstableUnitoneSupports?.alignContent?.label || defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.alignContent?.code || defaultCode }
		</>
	);
}

export function AlignContentEdit( {
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
					unitone?.alignContent ?? defaultValue
				) }
				isDeselectable={ ! defaultValue }
				onChange={ ( newValue ) => {
					const normalizedNewValue =
						normalizeForToggleGroupControl( newValue );
					const normalizedCurrentValue =
						normalizeForToggleGroupControl( unitone?.alignContent );

					setAttributes( {
						unitone: cleanEmptyObject( {
							...unitone,
							alignContent:
								normalizedCurrentValue !== normalizedNewValue
									? normalizedNewValue
									: undefined,
						} ),
					} );
				} }
			>
				{ alignContentOptions.map(
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

export function withAlignContentBlockProps( settings ) {
	const { attributes, name } = settings;

	if ( isAlignContentSupportDisabled( { name } ) ) {
		return settings;
	}

	const defaultValue = getDefaultValue( { name } );
	const newAlignContent =
		attributes?.unitone?.alignContent ?? defaultValue ?? '';

	if ( '' === newAlignContent ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				`-align-content:${ newAlignContent }`
			),
		},
	};
}
