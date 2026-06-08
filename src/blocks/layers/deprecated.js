import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import metadata from './block.json';

const deprecatedAttributes = {
	...metadata.attributes,
	unitone: {
		type: 'object',
		...metadata.attributes.unitone,
	},
};

export default [
	{
		attributes: deprecatedAttributes,

		supports: {
			...metadata.supports,
		},

		save( { attributes } ) {
			const { cover, fill, fixed, blur, portrait, columns, rows } =
				attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							style: {
								'--unitone--blur': !! blur
									? `${ blur }px`
									: undefined,
								'--unitone--columns':
									parseInt( columns ) !==
									metadata.attributes.columns.default
										? String( columns )
										: undefined,
								'--unitone--rows':
									parseInt( rows ) !==
									metadata.attributes.rows.default
										? String( rows )
										: undefined,
							},
							'data-unitone-layout': clsx( 'layers', {
								'-cover': cover,
								'-fill': fill,
								'-fixed': fixed,
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
		attributes: deprecatedAttributes,

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
		attributes: deprecatedAttributes,

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
		attributes: deprecatedAttributes,

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
		attributes: deprecatedAttributes,

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
