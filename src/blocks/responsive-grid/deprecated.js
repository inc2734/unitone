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
			const { columnMinWidth } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-unitone-layout': classnames(
								'responsive-grid',
								{
									[ `-gap:${ attributes?.unitone?.gap }` ]:
										null != attributes?.unitone?.gap,
									[ `-auto-repeat:${ attributes?.unitone?.autoRepeat }` ]:
										null != attributes?.unitone?.autoRepeat,
								}
							),
							style: {
								'--unitone--column-min-width':
									columnMinWidth || undefined,
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
			const { columnMinWidth } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-layout': 'responsive-grid',
							style: {
								'--column-min-width':
									columnMinWidth || undefined,
							},
						} )
					) }
				/>
			);
		},
	},
];
