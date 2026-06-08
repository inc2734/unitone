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
							'data-unitone-layout': clsx( 'stack', {
								[ `-gap:${ attributes?.unitone?.gap }` ]:
									null != attributes?.unitone?.gap,
								'-negative':
									null != attributes?.unitone?.negative,
							} ),
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
							'data-layout': 'stack',
						} )
					) }
				/>
			);
		},
	},
];
