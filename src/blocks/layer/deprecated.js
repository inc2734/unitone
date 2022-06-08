import classnames from 'classnames';

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
			const { alignSelf, justifySelf, gridColumn, gridRow } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-layout': classnames( 'layers__layer', {
								[ `-align-self:${ alignSelf }` ]: !! alignSelf,
								[ `-justify-self:${ justifySelf }` ]: !! justifySelf,
							} ),
							style: {
								'--grid-column': gridColumn || undefined,
								'--grid-row': gridRow || undefined,
							},
						} )
					) }
				/>
			);
		},
	},
];
