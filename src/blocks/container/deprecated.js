import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import metadata from './block.json';

export default [
	{
		supports: {
			...metadata.supports,
		},

		save() {
			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-layout': 'container',
						} )
					) }
				/>
			);
		},
	},
];
