import { store as blocksStore } from '@wordpress/blocks';
import { SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

export function hasSectionDividerBottomTypeValue( {
	name,
	attributes: { unitone },
} ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.sectionDivider?.bottom?.type;

	return (
		defaultValue !== unitone?.sectionDivider?.bottom?.type &&
		undefined !== unitone?.sectionDivider?.bottom?.type
	);
}

export function resetSectionDividerBottomTypeFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			sectionDivider: {
				...attributes?.unitone?.sectionDivider,
				bottom: {
					...attributes?.unitone?.sectionDivider?.bottom,
					type: undefined,
				},
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
			resetSectionDividerBottomTypeFilter( { unitone } )?.unitone
		),
	} );
}

export function SectionDividerBottomTypeEdit( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.sectionDivider?.bottom?.type;
	}, [] );

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
			__nextHasNoMarginBottom
			label={ label }
			help={ !! value && help }
			options={ [
				{ label: '', value: '' },
				{
					label: __( 'Triangle', 'unitone' ),
					value: 'triangle',
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
			value={ value }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					sectionDivider: {
						...unitone?.sectionDivider,
						bottom: {
							...unitone?.sectionDivider?.bottom,
							type: newAttribute || undefined,
						},
					},
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

export function isSectionDividerBottomExpand( { attributes: { unitone } } ) {
	return 'expand' === unitone?.sectionDivider?.bottom?.type;
}
