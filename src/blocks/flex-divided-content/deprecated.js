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
			const { tagName, verticalAlignment } = attributes;

			const TagName = tagName;

			return (
				<TagName
					{ ...useBlockProps.save( {
						className: 'unitone-flex__content',
						style: {
							'--unitone--align-items': verticalAlignment,
						},
					} ) }
				>
					<div
						{ ...useInnerBlocksProps.save( {
							className: 'unitone-flex__content__content',
						} ) }
					/>
				</TagName>
			);
		},
	},
];
