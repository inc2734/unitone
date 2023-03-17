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
			const { fill, position } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-unitone-layout': classnames(
								'cover__content',
								{
									'-fill': fill,
									[ `-valign:${ position }` ]:
										null != position,
									[ `-position:${ attributes?.unitone?.position?.position }` ]:
										null !=
										attributes?.unitone?.position?.position,
								}
							),
							style: {
								'--unitone--top':
									attributes?.unitone?.position?.top,
								'--unitone--right':
									attributes?.unitone?.position?.right,
								'--unitone--bottom':
									attributes?.unitone?.position?.bottom,
								'--unitone--left':
									attributes?.unitone?.position?.left,
								'--unitone--z-index':
									attributes?.unitone?.position?.zIndex,
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
			const { position } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-layout': classnames( 'cover__content', {
								[ `-position:${ position }` ]: !! position,
							} ),
						} )
					) }
				/>
			);
		},
	},
];
