import { store as blocksStore } from '@wordpress/blocks';
import { RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

import { cleanEmptyObject } from '../utils';

export function hasSectionDividerBottomTrimValue( {
	name,
	attributes: { unitone },
} ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.sectionDivider?.bottom?.trim;

	return (
		defaultValue !== unitone?.sectionDivider?.bottom?.trim &&
		undefined !== unitone?.sectionDivider?.bottom?.trim
	);
}

function resetSectionDividerBottomTrimFilter( attributes ) {
	if ( null != attributes?.unitone?.sectionDivider?.bottom?.trim ) {
		attributes.unitone.sectionDivider.bottom.trim = undefined;
	}

	return attributes;
}

export function resetSectionDividerBottomTrim( {
	attributes: { unitone },
	setAttributes,
} ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetSectionDividerBottomTrimFilter( { unitone } )?.unitone
		),
	} );
}

export function SectionDividerBottomTrimEdit( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.sectionDivider?.bottom?.trim;
	}, [] );

	return (
		<RangeControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ label }
			value={ parseInt(
				unitone?.sectionDivider?.bottom?.trim ?? defaultValue
			) }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					sectionDivider: {
						...unitone?.sectionDivider,
						bottom: {
							...unitone?.sectionDivider?.bottom,
							trim: newAttribute,
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
