import clsx from 'clsx';

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
			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-unitone-layout': clsx( 'both-sides', {
								[ `-align-items:${ attributes?.unitone?.alignItems }` ]:
									null != attributes?.unitone?.alignItems,
								[ `-gap:${ attributes?.unitone?.gap }` ]:
									null != attributes?.unitone?.gap,
							} ),
						} )
					) }
				/>
			);
		},
	},
	{
		attributes: {
			...metadata.attributes,
		},

		supports: {
			...metadata.supports,
		},

		save() {
			<div
				{ ...useInnerBlocksProps.save(
					useBlockProps.save( {
						'data-layout': clsx( 'both-sides' ),
					} )
				) }
			/>;
		},
	},
];
