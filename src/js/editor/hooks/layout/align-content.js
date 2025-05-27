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
import { cleanEmptyObject } from '../utils';

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

export function hasAlignContentValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.alignContent;

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

export function useIsAlignContentDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.alignContent' );
}

export function AlignContentToolbar( {
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.alignContent;
	}, [] );

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
					const newUnitone = {
						...unitone,
						alignContent:
							option.value !== unitone?.alignContent
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
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.alignContent;
	}, [] );

	return (
		<fieldset className="block-editor-hooks__flex-layout-justification-controls">
			<ToggleGroupControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ label }
				value={ unitone?.alignContent ?? defaultValue }
				isDeselectable={ ! defaultValue }
				onChange={ ( newValue ) => {
					const newUnitone = {
						...unitone,
						alignContent:
							unitone?.alignContent !== newValue
								? newValue
								: undefined,
					};

					setAttributes( {
						unitone: cleanEmptyObject( newUnitone ),
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

export function useAlignContentBlockProps( settings ) {
	const { attributes, name } = settings;

	if ( ! hasBlockSupport( name, 'unitone.alignContent' ) ) {
		return settings;
	}

	const newAlignContent = attributes?.unitone?.alignContent;

	if ( null == newAlignContent ) {
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
