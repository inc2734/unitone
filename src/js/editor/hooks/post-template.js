import { addFilter } from '@wordpress/hooks';

function addPostTemplateBlockGap( settings, name ) {
	if ( 'core/post-template' !== name ) {
		return settings;
	}

	return {
		...settings,
		...{
			supports: {
				...settings.supports,
				...{
					unitone: {
						gap: true,
					},
				},
			},
		},
	};
}

addFilter(
	'blocks.registerBlockType',
	'unitone/post-template/gap',
	addPostTemplateBlockGap
);
