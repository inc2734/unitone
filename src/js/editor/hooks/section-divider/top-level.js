import deepmerge from 'deepmerge';

import { store as blocksStore } from '@wordpress/blocks';
import { RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

import { cleanEmptyObject } from '../utils';

function getDefaultValue( { name } ) {
	return wp.data.select( blocksStore ).getBlockType( name )?.attributes
		?.unitone?.default?.sectionDivider?.top?.level;
}

function useDefaultValue( { name } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.sectionDivider?.top?.level;
	}, [] );

	return defaultValue;
}

export function hasSectionDividerTopLevelValue( {
	name,
	attributes: { unitone },
} ) {
	const defaultValue = getDefaultValue( { name } );

	return (
		defaultValue !== unitone?.sectionDivider?.top?.level &&
		undefined !== unitone?.sectionDivider?.top?.level
	);
}

export function resetSectionDividerTopLevelFilter() {
	return {
		sectionDivider: {
			top: {
				level: undefined,
			},
		},
	};
}

export function resetSectionDividerTopLevel( {
	attributes: { unitone },
	setAttributes,
} ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			deepmerge( unitone, resetSectionDividerTopLevelFilter() )
		),
	} );
}

export function SectionDividerTopLevelEdit( {
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
			value={ parseInt(
				unitone?.sectionDivider?.top?.level ?? defaultValue
			) }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					sectionDivider: {
						...unitone?.sectionDivider,
						top: {
							...unitone?.sectionDivider?.top,
							level: newAttribute,
						},
					},
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
			min={ -100 }
			step={ 1 }
			max={ 100 }
		/>
	);
}
