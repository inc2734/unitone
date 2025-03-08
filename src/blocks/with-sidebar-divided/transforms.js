/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/block-library/src/group/transforms.js
 */

import { createBlock } from '@wordpress/blocks';

export default {
	from: [
		{
			type: 'block',
			blocks: [ 'unitone/with-sidebar' ],
			transform: ( attributes, innerBlocks ) => {
				return createBlock(
					'unitone/with-sidebar-divided',
					{
						...attributes,
						unitone: {
							...attributes?.unitone,
							dividerType: 'stripe',
						},
					},
					innerBlocks
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

				const mainBlocks =
					1 < groupInnerBlocks.length
						? groupInnerBlocks.slice( 0, -1 )
						: [ ...groupInnerBlocks ];
				const asideBlocks =
					1 < groupInnerBlocks.length
						? groupInnerBlocks.slice( -1 )
						: [];

				return createBlock( 'unitone/with-sidebar-divided', {}, [
					createBlock(
						'unitone/with-sidebar-content',
						{ type: 'main' },
						mainBlocks
					),
					createBlock(
						'unitone/with-sidebar-content',
						{ type: 'aside' },
						asideBlocks
					),
				] );
			},
		},
	],
	ungroup: ( attributes, innerBlocks ) => {
		return innerBlocks.flatMap( ( innerBlock ) =>
			innerBlock.innerBlocks.flatMap(
				( childInnerBlock ) => childInnerBlock
			)
		);
	},
};
