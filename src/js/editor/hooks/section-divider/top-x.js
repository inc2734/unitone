import { store as blocksStore } from '@wordpress/blocks';
import { RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

import { cleanEmptyObject } from '../utils';

export function hasSectionDividerTopXValue( {
	name,
	attributes: { unitone },
} ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.sectionDivider?.top?.x;

	return (
		defaultValue !== unitone?.sectionDivider?.top?.x &&
		undefined !== unitone?.sectionDivider?.top?.x
	);
}

export function resetSectionDividerTopXFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			sectionDivider: {
				...attributes?.unitone?.sectionDivider,
				top: {
					...attributes?.unitone?.sectionDivider?.top,
					x: undefined,
				},
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
			resetSectionDividerTopXFilter( { unitone } )?.unitone
		),
	} );
}

export function SectionDividerTopXEdit( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.sectionDivider?.top?.x;
	}, [] );

	return (
		<RangeControl
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
