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
		attributes: {
			...deprecatedAttributes,
		},

		supports: {
			...metadata.supports,
		},

		save( { attributes } ) {
			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-unitone-layout': clsx( 'container', {
								[ `-align:${ attributes?.unitone?.blockAlign }` ]:
									null != attributes?.unitone?.blockAlign,
								[ `-gutters:${ attributes?.unitone?.gutters }` ]:
									null != attributes?.unitone?.gutters,
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
			...deprecatedAttributes,
		},

		supports: {
			...metadata.supports,
		},

		save() {
			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-layout': 'container',
						} )
					) }
				/>
			);
		},
	},
];
