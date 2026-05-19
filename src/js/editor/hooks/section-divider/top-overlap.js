import deepmerge from 'deepmerge';

import { store as blocksStore } from '@wordpress/blocks';
import { ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

import { cleanEmptyObject, normalizeForToggleControl } from '../utils';

function getDefaultValue( { name } ) {
	return wp.data.select( blocksStore ).getBlockType( name )?.attributes
		?.unitone?.default?.sectionDivider?.top?.overlap;
}

function useDefaultValue( { name } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.sectionDivider?.top?.overlap;
	}, [] );

	return defaultValue;
}

export function hasSectionDividerTopOverlapValue( {
	name,
	attributes: { unitone },
} ) {
	const defaultValue = getDefaultValue( { name } );

	return (
		defaultValue !== unitone?.sectionDivider?.top?.overlap &&
		undefined !== unitone?.sectionDivider?.top?.overlap
	);
}

export function resetSectionDividerTopOverlapFilter() {
	return {
		sectionDivider: {
			top: {
				overlap: undefined,
			},
		},
	};
}

export function resetSectionDividerTopOverlap( {
	attributes: { unitone },
	setAttributes,
} ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			deepmerge( unitone, resetSectionDividerTopOverlapFilter() )
		),
	} );
}

export function SectionDividerTopOverlapEdit( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useDefaultValue( { name } );

	return (
		<ToggleControl
			__nextHasNoMarginBottom
			label={ label }
			checked={ normalizeForToggleControl(
				unitone?.sectionDivider?.top?.overlap ?? defaultValue
			) }
			onChange={ ( newAttribute ) => {
				const normalizedNewValue =
					normalizeForToggleControl( newAttribute );

				setAttributes( {
					unitone: cleanEmptyObject( {
						...unitone,
						sectionDivider: {
							...unitone?.sectionDivider,
							top: {
								...unitone?.sectionDivider?.top,
								overlap: normalizedNewValue,
							},
						},
					} ),
				} );
			} }
		/>
	);
}
