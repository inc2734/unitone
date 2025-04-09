import { store as blocksStore } from '@wordpress/blocks';
import { RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

import { cleanEmptyObject } from '../utils';

export function hasSectionDividerBottomXValue( {
	name,
	attributes: { unitone },
} ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.sectionDivider?.bottom?.x;

	return (
		defaultValue !== unitone?.sectionDivider?.bottom?.x &&
		undefined !== unitone?.sectionDivider?.bottom?.x
	);
}

export function resetSectionDividerBottomXFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			sectionDivider: {
				...attributes?.unitone?.sectionDivider,
				bottom: {
					...attributes?.unitone?.sectionDivider?.bottom,
					x: undefined,
				},
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
			resetSectionDividerBottomXFilter( { unitone } )?.unitone
		),
	} );
}

export function SectionDividerBottomXEdit( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.sectionDivider?.bottom?.x;
	}, [] );

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
