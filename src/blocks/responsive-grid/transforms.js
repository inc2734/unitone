import { createBlock } from '@wordpress/blocks';

export default {
	from: [
		{
			type: 'block',
			blocks: [ 'unitone/responsive-grid-divided' ],
			transform: ( attributes, innerBlocks ) => {
				return createBlock(
					'unitone/responsive-grid',
					{
						...attributes,
						unitone: {
							...attributes.unitone,
							dividerType: undefined,
							divider: undefined,
							dividerColor: undefined,
						},
					},
					innerBlocks
						.map( ( innerBlock ) => innerBlock.innerBlocks )
						.flat()
				);
			},
		},
		{
			type: 'block',
			blocks: [ 'unitone/grid-divided' ],
			transform: ( attributes, innerBlocks ) => {
				return createBlock(
					'unitone/responsive-grid',
					{
						...attributes,
						unitone: {
							...attributes.unitone,
							dividerType: undefined,
							divider: undefined,
							dividerColor: undefined,
						},
					},
					innerBlocks
						.map( ( innerBlock ) => innerBlock.innerBlocks )
						.flat()
				);
			},
		},
		{
			type: 'block',
			blocks: [ 'unitone/grid' ],
			transform: ( attributes, innerBlocks ) => {
				return createBlock(
					'unitone/responsive-grid',
					attributes,
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

				return createBlock(
					'unitone/responsive-grid',
					{},
					groupInnerBlocks
				);
			},
		},
	],
	ungroup: ( attributes, innerBlocks ) =>
		innerBlocks.flatMap( ( innerBlock ) => innerBlock ),
};
