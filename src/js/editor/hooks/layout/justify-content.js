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
import { useMemo } from '@wordpress/element';
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

export function hasJustifyContentValue( { name, attributes: { unitone } } ) {
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

export function resetJustifyContent( {
	attributes: { unitone },
	setAttributes,
} ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetJustifyContentFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsJustifyContentDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.justifyContent' );
}

export function JustifyContentToolbar( {
	name,
	attributes: { unitone },
	setAttributes,
} ) {
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

function useBlockProps( extraProps, blockType, attributes ) {
	const unitoneLayout = useMemo( () => {
		if ( ! hasBlockSupport( blockType, 'unitone.justifyContent' ) ) {
			return extraProps?.[ 'data-unitone-layout' ];
		}

		if ( null == attributes?.unitone?.justifyContent ) {
			return extraProps?.[ 'data-unitone-layout' ];
		}

		// Deprecation.
		if ( !! extraProps?.[ 'data-layout' ] ) {
			extraProps[ 'data-layout' ] = clsx(
				extraProps[ 'data-layout' ],
				`-justify-content:${ attributes.unitone?.justifyContent }`
			);
			return extraProps?.[ 'data-unitone-layout' ];
		}

		return clsx(
			extraProps?.[ 'data-unitone-layout' ],
			`-justify-content:${ attributes.unitone?.justifyContent }`
		);
	}, [
		blockType,
		extraProps?.[ 'data-unitone-layout' ],
		extraProps?.[ 'data-layout' ],
		attributes?.unitone?.justifyContent,
	] );

	return {
		...extraProps,
		'data-unitone-layout': unitoneLayout,
	};
}

export function useJustifyContentBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.justifyContent;
		},
		[ name ]
	);

	const newJustifyContentProp = useBlockProps( wrapperProps, name, {
		unitone: {
			justifyContent: attributes?.unitone?.justifyContent ?? defaultValue,
		},
	} );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...newJustifyContentProp,
		},
	};
}
