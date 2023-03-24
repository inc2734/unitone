/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/block-library/src/group/transforms.js
 */

import { createBlock } from '@wordpress/blocks';

export default {
	from: [
		{
			type: 'block',
			isMultiBlock: false,
			blocks: [ 'core/image', 'core/video' ],
			__experimentalConvert( block ) {
				const newAttributes = { ...block.attributes };
				delete newAttributes?.align;

				const groupInnerBlocks = [
					createBlock( block.name, newAttributes, block.innerBlocks ),
				];

				return createBlock( 'unitone/frame', {}, groupInnerBlocks );
			},
		},
	],
	to: [
		{
			type: 'block',
			blocks: [ '*' ],
			transform: ( attributes, innerBlocks ) =>
				innerBlocks.flatMap( ( innerBlock ) => innerBlock ),
		},
	],
};
