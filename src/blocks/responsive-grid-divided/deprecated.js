import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import metadata from './block.json';

const deprecatedAttributes = {
	...metadata.attributes,
	unitone: {
		type: 'object',
		...metadata.attributes.unitone,
	},
};

export default [
	{
		attributes: {
			...deprecatedAttributes,
			columnMinWidth: {
				type: 'string',
				default: '',
			},
		},

		supports: {
			...metadata.supports,
		},

		save( { attributes } ) {
			const { tagName, columnMinWidth } = attributes;

			const TagName = tagName;

			return (
				<TagName
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-unitone-layout': 'responsive-grid',
							style: {
								'--unitone--column-min-width':
									columnMinWidth || undefined,
							},
						} )
					) }
				/>
			);
		},
	},
];
