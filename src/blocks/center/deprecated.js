import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import metadata from './block.json';

export default [
	{
		attributes: {
			...metadata.attributes,
			intrinsic: {
				type: 'boolean',
				default: true,
			},
		},

		supports: {
			...metadata.supports,
		},

		save( { attributes } ) {
			const { intrinsic, withText } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-unitone-layout': clsx( 'center', {
								'-intrinsic': intrinsic,
								'-with-text': withText,
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
			const { withText } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-unitone-layout': clsx( 'center', {
								'-with-text': withText,
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
			const { withText } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-layout': clsx( 'center', {
								'-with-text': withText,
							} ),
						} )
					) }
				/>
			);
		},
	},
];
