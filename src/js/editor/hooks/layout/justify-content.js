import clsx from 'clsx';

import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';

import {
	justifyLeft,
	justifyCenter,
	justifyRight,
	justifySpaceBetween,
} from '@wordpress/icons';

import { JustifyToolbar } from '@wordpress/block-editor';
import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';
import { physicalToLogical, logicalToPhysical } from '../../../helper';

const justifyContentOptions = [
	{
		value: 'left',
		icon: justifyLeft,
		label: __( 'Justify items left', 'unitone' ),
	},
	{
		value: 'center',
		icon: justifyCenter,
		label: __( 'Justify items center', 'unitone' ),
	},
	{
		value: 'right',
		icon: justifyRight,
		label: __( 'Justify items right', 'unitone' ),
	},
	{
		value: 'space-between',
		icon: justifySpaceBetween,
		label: __( 'Justify items space-between', 'unitone' ),
	},
];

export function hasJustifyContentValue( { name, unitone } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.justifyContent;

	return (
		defaultValue !== unitone?.justifyContent &&
		undefined !== unitone?.justifyContent
	);
}

export function resetJustifyContentFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			justifyContent: undefined,
		},
	};
}

export function resetJustifyContent( { unitone, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetJustifyContentFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsJustifyContentDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.justifyContent' );
}

export function JustifyContentToolbar( { name, unitone, setAttributes } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.justifyContent;
	}, [] );

	return (
		<JustifyToolbar
			allowedControls={ justifyContentOptions.map(
				( option ) => option.value
			) }
			value={ logicalToPhysical(
				unitone?.justifyContent ?? defaultValue
			) }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					justifyContent: physicalToLogical(
						newAttribute || undefined
					),
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

export function getJustifyContentEditLabel( { __unstableUnitoneSupports } ) {
	return (
		__unstableUnitoneSupports?.justifyContent?.label ||
		__( 'Justify content', 'unitone' )
	);
}

export function JustifyContentEdit( { name, label, unitone, setAttributes } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.justifyContent;
	}, [] );

	return (
		<fieldset className="block-editor-hooks__flex-layout-justification-controls">
			<ToggleGroupControl
				__nextHasNoMarginBottom
				label={ label }
				value={ logicalToPhysical(
					unitone?.justifyContent ?? defaultValue
				) }
				onChange={ ( newValue ) => {
					const newUnitone = {
						...unitone,
						justifyContent:
							logicalToPhysical( unitone?.justifyContent ) !==
							newValue
								? physicalToLogical( newValue )
								: undefined,
					};

					setAttributes( {
						unitone: cleanEmptyObject( newUnitone ),
					} );
				} }
			>
				{ justifyContentOptions.map(
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

export function saveJustifyContentProp( extraProps, blockType, attributes ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( blockType )
		?.attributes?.unitone?.default?.justifyContent;

	if ( ! hasBlockSupport( blockType, 'unitone.justifyContent' ) ) {
		return extraProps;
	}

	if ( null == attributes?.unitone?.justifyContent ) {
		if ( null == defaultValue ) {
			return extraProps;
		}

		attributes = {
			...attributes,
			unitone: {
				...attributes?.unitone,
				justifyContent: defaultValue,
			},
		};
	}

	// Deprecation.
	if ( !! extraProps?.[ 'data-layout' ] ) {
		extraProps[ 'data-layout' ] = clsx(
			extraProps[ 'data-layout' ],
			`-justify-content:${ attributes.unitone?.justifyContent }`
		);
		return extraProps;
	}

	extraProps[ 'data-unitone-layout' ] = clsx(
		extraProps[ 'data-unitone-layout' ],
		`-justify-content:${ attributes.unitone?.justifyContent }`
	);

	return extraProps;
}

export function useJustifyContentBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...saveJustifyContentProp( wrapperProps, name, attributes ),
		},
	};
}
