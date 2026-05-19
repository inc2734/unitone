import deepmerge from 'deepmerge';

import { store as blocksStore } from '@wordpress/blocks';
import { SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';

import { cleanEmptyObject, normalizeForSelectControl } from '../utils';

function getDefaultValue( { name } ) {
	return wp.data.select( blocksStore ).getBlockType( name )?.attributes
		?.unitone?.default?.sectionDivider?.bottom?.type;
}

function useDefaultValue( { name } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.sectionDivider?.bottom?.type;
	}, [] );

	return defaultValue;
}

export function hasSectionDividerBottomTypeValue( {
	name,
	attributes: { unitone },
} ) {
	const defaultValue = getDefaultValue( { name } );

	return (
		defaultValue !== unitone?.sectionDivider?.bottom?.type &&
		undefined !== unitone?.sectionDivider?.bottom?.type
	);
}

export function resetSectionDividerBottomTypeFilter() {
	return {
		sectionDivider: {
			bottom: {
				type: undefined,
			},
		},
	};
}

export function resetSectionDividerBottomType( {
	attributes: { unitone },
	setAttributes,
} ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			deepmerge( unitone, resetSectionDividerBottomTypeFilter() )
		),
	} );
}

export function SectionDividerBottomTypeEdit( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useDefaultValue( { name } );

	const value = unitone?.sectionDivider?.bottom?.type ?? defaultValue ?? '';
	const isBottomExpand = isSectionDividerBottomExpand( {
		attributes: { unitone: { ...unitone } },
	} );

	const help = isBottomExpand
		? sprintf(
				// translators: %1$s: Overlap the previous block, %2$s: Level, %3$s: Amount of content trimming
				__(
					'If “%1$s” is enabled in the next block, the balance can be aligned by setting the “%2$s” and “%3$s” to the same values as in the next block.',
					'unitone'
				),
				__( 'Overlap the previous block', 'unitone' ),
				__( 'Level', 'unitone' ),
				__( 'Amount of content trimming', 'unitone' )
		  )
		: __( 'Background color or background image must be set.', 'unitone' );

	return (
		<SelectControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ label }
			help={ !! value && help }
			options={ [
				{ label: __( 'None', 'unitone' ), value: '' },
				{
					label: __( 'Triangle', 'unitone' ),
					value: 'triangle',
				},
				{
					label: __( 'Curve', 'unitone' ),
					value: 'curve',
				},
				{
					label: __( 'Wave', 'unitone' ),
					value: 'wave',
				},
				{
					label: __( 'Scattering Wave', 'unitone' ),
					value: 'scattering-wave',
				},
				{
					label: __( 'Expand space', 'unitone' ),
					value: 'expand',
				},
			] }
			value={ normalizeForSelectControl( value ) }
			onChange={ ( newAttribute ) => {
				const normalizedNewValue =
					normalizeForSelectControl( newAttribute );

				setAttributes( {
					unitone: cleanEmptyObject( {
						...unitone,
						sectionDivider: {
							...unitone?.sectionDivider,
							bottom: {
								...unitone?.sectionDivider?.bottom,
								type: normalizedNewValue || undefined,
							},
						},
					} ),
				} );
			} }
		/>
	);
}

export function isSectionDividerBottomExpand( { attributes: { unitone } } ) {
	return 'expand' === unitone?.sectionDivider?.bottom?.type;
}
