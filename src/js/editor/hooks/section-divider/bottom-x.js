import deepmerge from 'deepmerge';

import { store as blocksStore } from '@wordpress/blocks';
import { RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

import { cleanEmptyObject } from '../utils';

function getDefaultValue( { name } ) {
	return wp.data.select( blocksStore ).getBlockType( name )?.attributes
		?.unitone?.default?.sectionDivider?.bottom?.x;
}

function useDefaultValue( { name } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.sectionDivider?.bottom?.x;
	}, [] );

	return defaultValue;
}

export function hasSectionDividerBottomXValue( {
	name,
	attributes: { unitone },
} ) {
	const defaultValue = getDefaultValue( { name } );

	return (
		defaultValue !== unitone?.sectionDivider?.bottom?.x &&
		undefined !== unitone?.sectionDivider?.bottom?.x
	);
}

export function resetSectionDividerBottomXFilter() {
	return {
		sectionDivider: {
			bottom: {
				x: undefined,
			},
		},
	};
}

export function resetSectionDividerBottomX( {
	attributes: { unitone },
	setAttributes,
} ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			deepmerge( unitone, resetSectionDividerBottomXFilter() )
		),
	} );
}

export function SectionDividerBottomXEdit( {
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
				unitone?.sectionDivider?.bottom?.x ?? defaultValue
			) }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					sectionDivider: {
						...unitone?.sectionDivider,
						bottom: {
							...unitone?.sectionDivider?.bottom,
							x: newAttribute,
						},
					},
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
			min={ 0 }
			step={ 1 }
			max={ 100 }
		/>
	);
}
