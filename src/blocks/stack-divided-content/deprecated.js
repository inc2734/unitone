import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import metadata from './block.json';

export default [
	{
		attributes: {
			...metadata.attributes,
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
