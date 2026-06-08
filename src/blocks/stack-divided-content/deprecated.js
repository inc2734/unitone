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
		},

		supports: {
			...metadata.supports,
		},

		save( { attributes } ) {
			const { tagName } = attributes;

			const TagName = tagName;

			return (
				<TagName
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-unitone-layout': 'stack__content',
						} )
					) }
				/>
			);
		},
	},
];
