import { store as blocksStore } from '@wordpress/blocks';
import { RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

import { cleanEmptyObject } from '../utils';

export function hasSectionDividerTopLevelValue( {
	name,
	attributes: { unitone },
} ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.sectionDivider?.top?.level;

	return (
		defaultValue !== unitone?.sectionDivider?.top?.level &&
		undefined !== unitone?.sectionDivider?.top?.level
	);
}

export function resetSectionDividerTopLevelFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			sectionDivider: {
				...attributes?.unitone?.sectionDivider,
				top: {
					...attributes?.unitone?.sectionDivider?.top,
					level: undefined,
				},
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
			resetSectionDividerTopLevelFilter( { unitone } )?.unitone
		),
	} );
}

export function SectionDividerTopLevelEdit( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.sectionDivider?.top?.level;
	}, [] );

	return (
		<RangeControl
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
			min={ 0 }
			step={ 1 }
			max={ 100 }
		/>
	);
}
