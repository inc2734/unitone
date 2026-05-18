import deepmerge from 'deepmerge';

import { store as blocksStore } from '@wordpress/blocks';
import { SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

function getDefaultValue( { name } ) {
	return wp.data.select( blocksStore ).getBlockType( name )?.attributes
		?.unitone?.default?.sectionDivider?.top?.type;
}

function useDefaultValue( { name } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.sectionDivider?.top?.type;
	}, [] );

	return defaultValue;
}

export function hasSectionDividerTopTypeValue( {
	name,
	attributes: { unitone },
} ) {
	const defaultValue = getDefaultValue( { name } );

	return (
		defaultValue !== unitone?.sectionDivider?.top?.type &&
		undefined !== unitone?.sectionDivider?.top?.type
	);
}

export function resetSectionDividerTopTypeFilter() {
	return {
		sectionDivider: {
			top: {
				type: undefined,
			},
		},
	};
}

export function resetSectionDividerTopType( {
	attributes: { unitone },
	setAttributes,
} ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			deepmerge( unitone, resetSectionDividerTopTypeFilter() )
		),
	} );
}

export function SectionDividerTopTypeEdit( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useDefaultValue( { name } );

	const value = unitone?.sectionDivider?.top?.type ?? defaultValue ?? '';

	return (
		<SelectControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ label }
			help={
				!! value &&
				__(
					'Background color or background image must be set.',
					'unitone'
				)
			}
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
			] }
			value={ value }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					sectionDivider: {
						...unitone?.sectionDivider,
						top: {
							...unitone?.sectionDivider?.top,
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
