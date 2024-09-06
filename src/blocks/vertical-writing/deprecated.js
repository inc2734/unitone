import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import metadata from './block.json';

export default [
	{
		attributes: {
			...metadata.attributes,
			textOrientation: {
				type: 'string',
				default: '',
			},
		},

		supports: {
			...metadata.supports,
		},

		save( { attributes } ) {
			const { textOrientation, switchWritingMode } = attributes;

			return (
				<div
					{ ...useBlockProps.save( {
						'data-unitone-layout': 'vertical-writing-wrapper',
					} ) }
				>
					<div
						{ ...useInnerBlocksProps.save( {
							'data-unitone-layout': clsx( 'vertical-writing', {
								[ `-text-orientation:${ textOrientation }` ]:
									!! textOrientation,
								'-switch': switchWritingMode,
							} ),
						} ) }
					/>
				</div>
			);
		},
	},
];
