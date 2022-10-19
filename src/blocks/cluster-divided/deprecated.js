import classnames from 'classnames';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import metadata from './block.json';

export default [
	{
		attributes: {
			divider: {
				type: 'string',
			},
		},

		supports: {
			...metadata.supports,
		},

		migrate( { divider, unitone } ) {
			return {
				unitone: {
					...unitone,
					dividerType: divider,
				},
			};
		},

		save( { attributes } ) {
			const { divider } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-unitone-layout': classnames( 'cluster', {
								[ `-divider:${ divider }` ]: !! divider,
							} ),
						} )
					) }
				/>
			);
		},
	},
];
