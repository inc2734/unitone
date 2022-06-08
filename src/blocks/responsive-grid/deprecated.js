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
			const { columnMinWidth } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-layout': 'responsive-grid',
							style: {
								'--column-min-width':
									columnMinWidth || undefined,
							},
						} )
					) }
				/>
			);
		},
	},
];
