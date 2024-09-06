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
			const { center, column, unitone } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-unitone-layout': clsx( 'text', {
								'-center': center,
								'-column': column,
								'-gap': null != unitone?.gap,
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

		save( { attributes } ) {
			const { center, column } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-unitone-layout': clsx( 'text', {
								'-center': center,
								'-column': column,
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

		save( { attributes } ) {
			const { center, column } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-unitone-layout': clsx( 'text', {
								'-center': center,
								'-column': column,
								[ `-gap:${ attributes?.unitone?.gap }` ]:
									null != attributes?.unitone?.gap,
							} ),
							style: {
								'--unitone--max-width':
									attributes?.unitone?.maxWidth,
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
		},

		supports: {
			...metadata.supports,
		},

		save( { attributes } ) {
			const { center } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-layout': clsx( 'text', {
								'-center': center,
							} ),
						} )
					) }
				/>
			);
		},
	},
];
