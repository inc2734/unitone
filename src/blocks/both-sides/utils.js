import metadata from './block.json';

export const applyBothSidesChildStyles = ( attributes, parentBlock ) => {
	if ( metadata.name !== parentBlock?.name ) {
		return attributes;
	}

	const DEFAULT_VALUES = {
		flexBasis: 'fit-content',
	};

	return {
		...attributes,
		__unstableUnitoneSupports: {
			...attributes?.__unstableUnitoneSupports,
			flexBasis: {
				default: DEFAULT_VALUES.flexBasis,
			},
		},
	};
};
