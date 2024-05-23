import { createBlock } from '@wordpress/blocks';

export default {
	from: [
		{
			type: 'block',
			blocks: [ 'unitone/responsive-grid' ],
			transform: ( attributes, innerBlocks ) => {
				const newInnerBlocks = innerBlocks.map( ( innerBlock ) => {
					return createBlock(
						'unitone/responsive-grid-divided-content',
						{},
						[ innerBlock ]
					);
				} );

				if ( 1 > newInnerBlocks.length ) {
					newInnerBlocks.push(
						createBlock(
							'unitone/responsive-grid-divided-content',
							{},
							[]
						)
					);
				}

				return createBlock(
					'unitone/responsive-grid-divided',
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
			blocks: [ 'unitone/grid' ],
			transform: ( attributes, innerBlocks ) => {
				const newInnerBlocks = innerBlocks.map( ( innerBlock ) => {
					return createBlock(
						'unitone/responsive-grid-divided-content',
						{},
						[ innerBlock ]
					);
				} );

				if ( 1 > newInnerBlocks.length ) {
					newInnerBlocks.push(
						createBlock(
							'unitone/responsive-grid-divided-content',
							{},
							[]
						)
					);
				}

				return createBlock(
					'unitone/responsive-grid-divided',
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
			blocks: [ 'unitone/cluster-divided' ],
			transform: ( attributes, innerBlocks ) => {
				return createBlock(
					'unitone/responsive-grid-divided',
					{ ...attributes },
					innerBlocks.map( ( innerBlock ) => {
						return createBlock(
							'unitone/responsive-grid-divided-content',
							{ ...innerBlock.attributes },
							[ ...innerBlock.innerBlocks ]
						);
					} )
				);
			},
		},
		{
			type: 'block',
			blocks: [ 'unitone/stack-divided' ],
			transform: ( attributes, innerBlocks ) => {
				return createBlock(
					'unitone/responsive-grid-divided',
					{ ...attributes },
					innerBlocks.map( ( innerBlock ) => {
						return createBlock(
							'unitone/responsive-grid-divided-content',
							{ ...innerBlock.attributes },
							[ ...innerBlock.innerBlocks ]
						);
					} )
				);
			},
		},
		{
			type: 'block',
			blocks: [ 'unitone/flex-divided' ],
			transform: ( attributes, innerBlocks ) => {
				return createBlock(
					'unitone/responsive-grid-divided',
					{ ...attributes },
					innerBlocks.map( ( innerBlock ) => {
						return createBlock(
							'unitone/responsive-grid-divided-content',
							{ ...innerBlock.attributes },
							[ ...innerBlock.innerBlocks ]
						);
					} )
				);
			},
		},
		{
			type: 'block',
			blocks: [ 'unitone/grid-divided' ],
			transform: ( attributes, innerBlocks ) => {
				return createBlock(
					'unitone/responsive-grid-divided',
					{ ...attributes },
					innerBlocks.map( ( innerBlock ) => {
						return createBlock(
							'unitone/responsive-grid-divided-content',
							{ ...innerBlock.attributes },
							[ ...innerBlock.innerBlocks ]
						);
					} )
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
						'unitone/responsive-grid-divided-content',
						{},
						[
							createBlock(
								block.name,
								block.attributes,
								block.innerBlocks
							),
						]
					);
				} );

				return createBlock(
					'unitone/responsive-grid-divided',
					{
						unitone: {
							dividerType: 'bordered',
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
