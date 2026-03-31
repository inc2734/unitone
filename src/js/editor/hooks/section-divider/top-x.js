import deepmerge from 'deepmerge';

import { store as blocksStore } from '@wordpress/blocks';
import { RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

import { cleanEmptyObject } from '../utils';

function getDefaultValue( { name } ) {
	return wp.data.select( blocksStore ).getBlockType( name )?.attributes
		?.unitone?.default?.sectionDivider?.top?.x;
}

function useDefaultValue( { name } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.sectionDivider?.top?.x;
	}, [] );

	return defaultValue;
}

export function hasSectionDividerTopXValue( {
	name,
	attributes: { unitone },
} ) {
	const defaultValue = getDefaultValue( { name } );

	return (
		defaultValue !== unitone?.sectionDivider?.top?.x &&
		undefined !== unitone?.sectionDivider?.top?.x
	);
}

export function resetSectionDividerTopXFilter() {
	return {
		sectionDivider: {
			top: {
				x: undefined,
			},
		},
	};
}

export function resetSectionDividerTopX( {
	attributes: { unitone },
	setAttributes,
} ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			deepmerge( unitone, resetSectionDividerTopXFilter() )
		),
	} );
}

export function SectionDividerTopXEdit( {
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
				unitone?.sectionDivider?.top?.x ?? defaultValue
			) }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					sectionDivider: {
						...unitone?.sectionDivider,
						top: {
							...unitone?.sectionDivider?.top,
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
