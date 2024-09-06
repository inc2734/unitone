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
							'data-unitone-layout': clsx( 'gutters', {
								[ `-padding:${ attributes?.unitone?.padding }` ]:
									null != attributes?.unitone?.padding,
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
			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-layout': 'gutters',
						} )
					) }
				/>
			);
		},
	},
];
