import { createBlock } from '@wordpress/blocks';

export default {
	from: [
		{
			type: 'block',
			blocks: [ 'unitone/stack' ],
			transform: ( attributes, innerBlocks ) => {
				const newInnerBlocks = innerBlocks.map( ( innerBlock ) => {
					return createBlock( 'unitone/stack-divided-content', {}, [
						innerBlock,
					] );
				} );

				if ( 1 > newInnerBlocks.length ) {
					newInnerBlocks.push(
						createBlock( 'unitone/stack-divided-content', {}, [] )
					);
				}

				return createBlock(
					'unitone/stack-divided',
					{
						...attributes,
						unitone: {
							...attributes?.unitone,
							dividerType: 'stripe',
						},
					},
					newInnerBlocks
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
					return createBlock( 'unitone/stack-divided-content', {}, [
						createBlock(
							block.name,
							block.attributes,
							block.innerBlocks
						),
					] );
				} );

				return createBlock(
					'unitone/stack-divided',
					{
						unitone: {
							dividerType: 'stripe',
						},
					},
					groupInnerBlocks
				);
			},
		},
	],
	ungroup: ( attributes, innerBlocks ) =>
		innerBlocks.flatMap( ( innerBlock ) => innerBlock ),
};
