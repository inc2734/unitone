import { store as blocksStore } from '@wordpress/blocks';
import { SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

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

	return (
		<SelectControl
			__nextHasNoMarginBottom
			label={ label }
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
			] }
			value={
				unitone?.sectionDivider?.bottom?.type ?? defaultValue ?? ''
			}
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
