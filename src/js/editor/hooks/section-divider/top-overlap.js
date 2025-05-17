import deepmerge from 'deepmerge';

import { store as blocksStore } from '@wordpress/blocks';
import { ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

import { cleanEmptyObject } from '../utils';

export function hasSectionDividerTopOverlapValue( {
	name,
	attributes: { unitone },
} ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.sectionDivider?.top?.overlap;

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
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.sectionDivider?.top?.overlap;
	}, [] );

	return (
		<ToggleControl
			__nextHasNoMarginBottom
			label={ label }
			checked={
				unitone?.sectionDivider?.top?.overlap ?? defaultValue ?? false
			}
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					sectionDivider: {
						...unitone?.sectionDivider,
						top: {
							...unitone?.sectionDivider?.top,
							overlap: newAttribute,
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
