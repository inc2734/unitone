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
