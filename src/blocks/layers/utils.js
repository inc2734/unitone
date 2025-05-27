import metadata from './block.json';

export const applyLayersChildStyles = ( attributes, parentBlock ) => {
	if ( metadata.name !== parentBlock?.name ) {
		return attributes;
	}

	const DEFAULT_VALUES = {
		alignSelf: 'stretch',
		justifySelf: 'stretch',
		gridColumn: '1 / -1',
		gridRow: '1 / -1',
	};

	return {
		...attributes,
		__unstableUnitoneSupports: {
			...attributes?.__unstableUnitoneSupports,
			alignSelf: {
				default: DEFAULT_VALUES.alignSelf,
			},
			justifySelf: {
				default: DEFAULT_VALUES.justifySelf,
			},
			gridColumn: {
				default: DEFAULT_VALUES.gridColumn,
			},
			gridRow: {
				default: DEFAULT_VALUES.gridRow,
			},
			maxWidth: true,
			minHeight: true,
			mixBlendMode: true,
		},
	};
};
