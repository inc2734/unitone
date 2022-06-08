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
			const { contentWidth, contentMaxWidth } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-layout': 'both-sides__content',
							style: {
								'--content-width': contentWidth || undefined,
								'--content-max-width':
									contentMaxWidth || undefined,
							},
						} )
					) }
				/>
			);
		},
	},
];
