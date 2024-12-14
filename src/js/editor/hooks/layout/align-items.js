import clsx from 'clsx';

import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';

import { BlockVerticalAlignmentToolbar } from '@wordpress/block-editor';
import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';
import { alignBottom, alignCenter, alignTop, alignStretch } from '../icons';
import { physicalToLogical, logicalToPhysical } from '../../../helper';

const alignItemsOptions = [
	{
		value: 'top',
		icon: alignTop,
		label: __( 'Align items top', 'unitone' ),
	},
	{
		value: 'center',
		icon: alignCenter,
		label: __( 'Align items center', 'unitone' ),
	},
	{
		value: 'bottom',
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

export function resetAlignItemsFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			alignItems: undefined,
		},
	};
}

export function resetAlignItems( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetAlignItemsFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsAlignItemsDisabled( { name } ) {
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
		<BlockVerticalAlignmentToolbar
			controls={ [ 'top', 'center', 'bottom', 'stretch' ] }
			value={ logicalToPhysical(
				unitone?.alignItems ?? defaultValue,
				'vertical'
			) }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					alignItems: physicalToLogical( newAttribute || undefined ),
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
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
		<fieldset className="block-editor-hooks__flex-layout-justification-controls">
			<ToggleGroupControl
				__nextHasNoMarginBottom
				label={ label }
				value={ logicalToPhysical(
					unitone?.alignItems ?? defaultValue,
					'vertical'
				) }
				onChange={ ( newValue ) => {
					const newUnitone = {
						...unitone,
						alignItems:
							logicalToPhysical(
								unitone?.alignItems,
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

export function useAlignItemsBlockProps( settings ) {
	const { attributes, name } = settings;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.alignItems;
		},
		[ name ]
	);

	if ( ! hasBlockSupport( name, 'unitone.alignItems' ) ) {
		return settings;
	}

	const newAlignItems = attributes?.unitone?.alignItems ?? defaultValue;

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
