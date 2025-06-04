import metadata from './block.json';

export const applyGridChildStyles = ( attributes, parentBlock ) => {
	if ( metadata.name !== parentBlock?.name ) {
		return attributes;
	}

	const DEFAULT_VALUES = {
		alignSelf: {
			lg: undefined,
		},
		justifySelf: {
			lg: undefined,
		},
		gridColumn: {
			lg: 'auto',
		},
		gridRow: {
			lg: 'auto',
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
			gridColumn: {
				responsive: true,
				default: DEFAULT_VALUES.gridColumn,
			},
			gridRow: {
				responsive: true,
				default: DEFAULT_VALUES.gridRow,
			},
		},
	};
};
