import metadata from './block.json';

export const applyFlexDividedChildStyles = ( attributes, parentBlock ) => {
	if ( metadata.name !== parentBlock?.name ) {
		return attributes;
	}

	const DEFAULT_VALUES = {
		flexGrow: 0,
		flexShrink: 1,
		flexBasis: 'auto',
		alignSelf: 'stretch',
		justifySelf: 'stretch',
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
			alignSelf: {
				default: DEFAULT_VALUES.alignSelf,
			},
			justifySelf: {
				default: DEFAULT_VALUES.justifySelf,
			},
		},
	};
};
