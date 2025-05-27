import metadata from './block.json';

export const applyFlexDividedChildStyles = ( attributes, parentBlock ) => {
	if ( metadata.name !== parentBlock?.name ) {
		return attributes;
	}

	const DEFAULT_VALUES = {
		flexGrow: '0',
		flexShrink: '1',
		flexBasis: 'auto',
	};

	return {
		...attributes,
		__unstableUnitoneSupports: {
			...attributes?.__unstableUnitoneSupports,
			flexGrow: {
				default: DEFAULT_VALUES.flexGrow,
			},
			flexShrink: {
				default: DEFAULT_VALUES.flexShrink,
			},
			flexBasis: {
				default: DEFAULT_VALUES.flexBasis,
			},
		},
	};
};
