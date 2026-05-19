import deepmerge from 'deepmerge';

import { store as blocksStore } from '@wordpress/blocks';
import { RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

import { cleanEmptyObject, normalizeForRangeControl } from '../utils';

function getDefaultValue( { name } ) {
	return wp.data.select( blocksStore ).getBlockType( name )?.attributes
		?.unitone?.default?.sectionDivider?.bottom?.size;
}

function useDefaultValue( { name } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.sectionDivider?.bottom?.size;
	}, [] );

	return defaultValue;
}

export function hasSectionDividerBottomSizeValue( {
	name,
	attributes: { unitone },
} ) {
	const defaultValue = getDefaultValue( { name } );

	return (
		defaultValue !== unitone?.sectionDivider?.bottom?.size &&
		undefined !== unitone?.sectionDivider?.bottom?.size
	);
}

export function resetSectionDividerBottomSizeFilter() {
	return {
		sectionDivider: {
			bottom: {
				size: undefined,
			},
		},
	};
}

export function resetSectionDividerBottomSize( {
	attributes: { unitone },
	setAttributes,
} ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			deepmerge( unitone, resetSectionDividerBottomSizeFilter() )
		),
	} );
}

export function SectionDividerBottomSizeEdit( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useDefaultValue( { name } );

	return (
		<RangeControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ label }
			value={ normalizeForRangeControl(
				unitone?.sectionDivider?.bottom?.size ?? defaultValue
			) }
			onChange={ ( newAttribute ) => {
				const normalizedNewValue =
					normalizeForRangeControl( newAttribute );

				setAttributes( {
					unitone: cleanEmptyObject( {
						...unitone,
						sectionDivider: {
							...unitone?.sectionDivider,
							bottom: {
								...unitone?.sectionDivider?.bottom,
								size: normalizedNewValue,
							},
						},
					} ),
				} );
			} }
			min={ 0 }
			step={ 1 }
			max={ 100 }
		/>
	);
}
