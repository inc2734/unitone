import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import metadata from './block.json';

export default [
	{
		attributes: {
			...metadata.attributes,
			noPadding: {
				type: 'boolean',
				default: false,
			},
		},

		supports: {
			...metadata.supports,
		},

		migrate( attributes ) {
			const { noPadding } = attributes;

			return {
				...attributes,
				unitone: {
					...attributes?.unitone,
					padding: noPadding ? '0' : undefined,
				},
			};
		},

		save( { attributes } ) {
			const { noPadding } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-unitone-layout': clsx( 'cover', {
								'-no-padding': noPadding,
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
			noPadding: {
				type: 'boolean',
				default: false,
			},
		},

		supports: {
			...metadata.supports,
		},

		save( { attributes } ) {
			const { noPadding } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-unitone-layout': clsx( 'cover', {
								'-no-padding': noPadding,
								[ `-gap:${ attributes?.unitone?.gap }` ]:
									null != attributes?.unitone?.gap,
							} ),
							style: {
								'--unitone--min-height':
									attributes?.unitone?.minHeight,
							},
						} )
					) }
				/>
			);
		},
	},
	{
		attributes: {
			...metadata.attributes,
			noPadding: {
				type: 'boolean',
				default: false,
			},
		},

		supports: {
			...metadata.supports,
		},

		save( { attributes } ) {
			const { noPadding } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-layout': clsx( 'cover', {
								'-no-padding': noPadding,
							} ),
						} )
					) }
				/>
			);
		},
	},
];
