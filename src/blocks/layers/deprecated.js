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
			const { cover, fill, blur, portrait } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							style: {
								'--unitone--blur': !! blur
									? `${ blur }px`
									: undefined,
							},
							'data-unitone-layout': clsx( 'layers', {
								'-cover': cover,
								'-fill': fill,
								'-blur': !! blur,
								'-portrait': portrait,
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
			const { cover } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-unitone-layout': clsx( 'layers', {
								'-cover': cover,
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
			const { cover } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-unitone-layout': clsx( 'layers', {
								'-cover': cover,
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
		},

		supports: {
			...metadata.supports,
		},

		save( { attributes } ) {
			const { cover } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-layout': clsx( 'layers', {
								'-cover': cover,
							} ),
						} )
					) }
				/>
			);
		},
	},
];
