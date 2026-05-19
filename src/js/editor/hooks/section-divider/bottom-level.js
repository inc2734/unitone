import deepmerge from 'deepmerge';

import { store as blocksStore } from '@wordpress/blocks';
import { RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

import { cleanEmptyObject, normalizeForRangeControl } from '../utils';

function getDefaultValue( { name } ) {
	return wp.data.select( blocksStore ).getBlockType( name )?.attributes
		?.unitone?.default?.sectionDivider?.bottom?.level;
}

function useDefaultValue( { name } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.sectionDivider?.bottom?.level;
	}, [] );

	return defaultValue;
}

export function hasSectionDividerBottomLevelValue( {
	name,
	attributes: { unitone },
} ) {
	const defaultValue = getDefaultValue( { name } );

	return (
		defaultValue !== unitone?.sectionDivider?.bottom?.level &&
		undefined !== unitone?.sectionDivider?.bottom?.level
	);
}

export function resetSectionDividerBottomLevelFilter() {
	return {
		sectionDivider: {
			bottom: {
				level: undefined,
			},
		},
	};
}

export function resetSectionDividerBottomLevel( {
	attributes: { unitone },
	setAttributes,
} ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			deepmerge( unitone, resetSectionDividerBottomLevelFilter() )
		),
	} );
}

export function SectionDividerBottomLevelEdit( {
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
				unitone?.sectionDivider?.bottom?.level ?? defaultValue
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
								level: normalizedNewValue,
							},
						},
					} ),
				} );
			} }
			min={ -100 }
			step={ 1 }
			max={ 100 }
		/>
	);
}
