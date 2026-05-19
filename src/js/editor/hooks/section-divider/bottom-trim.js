import deepmerge from 'deepmerge';

import { store as blocksStore } from '@wordpress/blocks';
import { RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

import { cleanEmptyObject, normalizeForRangeControl } from '../utils';

function getDefaultValue( { name } ) {
	return wp.data.select( blocksStore ).getBlockType( name )?.attributes
		?.unitone?.default?.sectionDivider?.bottom?.trim;
}

function useDefaultValue( { name } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.sectionDivider?.bottom?.trim;
	}, [] );

	return defaultValue;
}

export function hasSectionDividerBottomTrimValue( {
	name,
	attributes: { unitone },
} ) {
	const defaultValue = getDefaultValue( { name } );

	return (
		defaultValue !== unitone?.sectionDivider?.bottom?.trim &&
		undefined !== unitone?.sectionDivider?.bottom?.trim
	);
}

export function resetSectionDividerBottomTrimFilter() {
	return {
		sectionDivider: {
			bottom: {
				trim: undefined,
			},
		},
	};
}

export function resetSectionDividerBottomTrim( {
	attributes: { unitone },
	setAttributes,
} ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			deepmerge( unitone, resetSectionDividerBottomTrimFilter() )
		),
	} );
}

export function SectionDividerBottomTrimEdit( {
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
				unitone?.sectionDivider?.bottom?.trim ?? defaultValue
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
								trim: normalizedNewValue,
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
