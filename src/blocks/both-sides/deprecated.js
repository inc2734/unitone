import classnames from 'classnames';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import metadata from './block.json';

export default [
	{
		supports: {
			...metadata.supports,
		},

		save() {
			<div
				{ ...useInnerBlocksProps.save(
					useBlockProps.save( {
						'data-layout': classnames( 'both-sides' ),
					} )
				) }
			/>;
		},
	},
];
