import { addFilter } from '@wordpress/hooks';

function addButtonBlockPadding( settings, name ) {
	if ( 'core/button' !== name ) {
		return settings;
	}

	return {
		...settings,
		...{
			supports: {
				...settings.supports,
				...{
					unitone: {
						padding: true,
					},
				},
			},
		},
	};
}

addFilter(
	'blocks.registerBlockType',
	'unitone/button/padding',
	addButtonBlockPadding
);
