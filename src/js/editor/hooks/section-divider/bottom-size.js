import { store as blocksStore } from '@wordpress/blocks';
import { RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

import { cleanEmptyObject } from '../utils';

export function hasSectionDividerBottomSizeValue( {
	name,
	attributes: { unitone },
} ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.sectionDivider?.bottom?.size;

	return (
		defaultValue !== unitone?.sectionDivider?.bottom?.size &&
		undefined !== unitone?.sectionDivider?.bottom?.size
	);
}

function resetSectionDividerBottomSizeFilter( attributes ) {
	if ( null != attributes?.unitone?.sectionDivider?.bottom?.size ) {
		attributes.unitone.sectionDivider.bottom.size = undefined;
	}

	return attributes;
}

export function resetSectionDividerBottomSize( {
	attributes: { unitone },
	setAttributes,
} ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetSectionDividerBottomSizeFilter( { unitone } )?.unitone
		),
	} );
}

export function SectionDividerBottomSizeEdit( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.sectionDivider?.bottom?.size;
	}, [] );

	return (
		<RangeControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ label }
			value={ parseInt(
				unitone?.sectionDivider?.bottom?.size ?? defaultValue
			) }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					sectionDivider: {
						...unitone?.sectionDivider,
						bottom: {
							...unitone?.sectionDivider?.bottom,
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
