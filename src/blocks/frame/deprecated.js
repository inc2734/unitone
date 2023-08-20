import classnames from 'classnames';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import metadata from './block.json';

export default [
	{
		attributes: {
			...metadata.attributes,
			ratio: {
				type: 'string',
				default: '',
			},
		},

		supports: {
			...metadata.supports,
		},

		save( { attributes } ) {
			const { ratio, switchRatio } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-unitone-layout': classnames( 'frame', {
								'-switch': switchRatio,
							} ),
							style: {
								'--unitone--ratio': ratio || undefined,
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
			ratio: {
				type: 'string',
				default: '',
			},
		},

		supports: {
			...metadata.supports,
		},

		save( { attributes } ) {
			const { ratio, switchRatio } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-layout': classnames( 'frame', {
								'-switch': switchRatio,
							} ),
							style: {
								'--ratio': ratio || undefined,
							},
						} )
					) }
				/>
			);
		},
	},
];
