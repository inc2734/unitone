/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/block-library/src/group/transforms.js
 */

import { createBlock } from '@wordpress/blocks';

export default {
	from: [
		{
			type: 'block',
			blocks: [ 'unitone/stack-divided' ],
			transform: ( attributes, innerBlocks ) => {
				delete attributes?.unitone?.dividerType;
				delete attributes?.unitone?.divider;
				delete attributes?.unitone?.dividerColor;

				return createBlock(
					'unitone/stack',
					attributes,
					innerBlocks
						.map( ( innerBlock ) => innerBlock.innerBlocks )
						.flat()
				);
			},
		},
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ '*' ],
			__experimentalConvert( blocks ) {
				// Clone the Blocks to be Grouped
				// Failing to create new block references causes the original blocks
				// to be replaced in the switchToBlockType call thereby meaning they
				// are removed both from their original location and within the
				// new group block.
				const groupInnerBlocks = blocks.map( ( block ) => {
					return createBlock(
						block.name,
						block.attributes,
						block.innerBlocks
					);
				} );

				return createBlock( 'unitone/stack', {}, groupInnerBlocks );
			},
		},
	],
	ungroup: ( attributes, innerBlocks ) =>
		innerBlocks.flatMap( ( innerBlock ) => innerBlock ),
};
