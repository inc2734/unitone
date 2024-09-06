import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import metadata from './block.json';

export default [
	{
		attributes: {
			...metadata.attributes,
			itemWidth: {
				type: 'string',
				default: '',
			},
		},

		supports: {
			...metadata.supports,
		},

		save( { attributes } ) {
			const { height, itemWidth, noBar } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							style: {
								'--unitone--height': height || undefined,
								'--unitone--item-width': itemWidth || undefined,
							},
							'data-unitone-layout': clsx( 'reel', {
								'-no-bar': noBar,
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
			itemWidth: {
				type: 'string',
				default: '',
			},
		},

		supports: {
			...metadata.supports,
		},

		save( { attributes } ) {
			const { height, itemWidth, noBar } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							style: {
								'--unitone--height': height || undefined,
								'--unitone--item-width': itemWidth || undefined,
							},
							'data-unitone-layout': clsx( 'reel', {
								'-no-bar': noBar,
								[ `-gap:${ attributes?.unitone?.gap }` ]:
									null != attributes?.unitone?.gap,
							} ),
						} )
					) }
				/>
			);
		},
	},
];
