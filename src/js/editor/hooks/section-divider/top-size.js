import { store as blocksStore } from '@wordpress/blocks';
import { RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

import { cleanEmptyObject } from '../utils';

export function hasSectionDividerTopSizeValue( {
	name,
	attributes: { unitone },
} ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.sectionDivider?.top?.size;

	return (
		defaultValue !== unitone?.sectionDivider?.top?.size &&
		undefined !== unitone?.sectionDivider?.top?.size
	);
}

function resetSectionDividerTopSizeFilter( attributes ) {
	if ( null != attributes?.unitone?.sectionDivider?.top?.size ) {
		attributes.unitone.sectionDivider.top.size = undefined;
	}

	return attributes;
}

export function resetSectionDividerTopSize( {
	attributes: { unitone },
	setAttributes,
} ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetSectionDividerTopSizeFilter( { unitone } )?.unitone
		),
	} );
}

export function SectionDividerTopSizeEdit( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.sectionDivider?.top?.size;
	}, [] );

	return (
		<RangeControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ label }
			value={ parseInt(
				unitone?.sectionDivider?.top?.size ?? defaultValue
			) }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					sectionDivider: {
						...unitone?.sectionDivider,
						top: {
							...unitone?.sectionDivider?.top,
							size: newAttribute,
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
