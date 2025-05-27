import metadata from './block.json';

export const applyGridDividedChildStyles = ( attributes, parentBlock ) => {
	if ( metadata.name !== parentBlock?.name ) {
		return attributes;
	}

	const DEFAULT_VALUES = {
		alignSelf: {
			lg: 'stretch',
		},
		justifySelf: {
			lg: 'stretch',
		},
	};

	return {
		...attributes,
		__unstableUnitoneSupports: {
			...attributes?.__unstableUnitoneSupports,
			alignSelf: {
				responsive: true,
				default: DEFAULT_VALUES.alignSelf,
			},
			justifySelf: {
				responsive: true,
				default: DEFAULT_VALUES.justifySelf,
			},
		},
	};
};
