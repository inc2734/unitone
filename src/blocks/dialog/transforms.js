/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/block-library/src/group/transforms.js
 */

import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
} from '@wordpress/blocks';

import { DIALOG_CONTENT_TEMPLATE } from './variations';

export default {
	from: [
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ '*' ],
			__experimentalConvert( blocks ) {
				// Clone the Blocks to be Grouped.
				// Failing to create new block references causes the original blocks
				// to be replaced in the switchToBlockType call thereby meaning they
				// are removed both from their original location and within the
				// new group block.
				const triggerInnerBlocks = blocks.map( ( block ) =>
					createBlock(
						block.name,
						block.attributes,
						block.innerBlocks
					)
				);

				return createBlock(
					'unitone/dialog',
					{
						variation: 'dialog-box',
					},
					[
						createBlock(
							'unitone/dialog-trigger',
							{ lock: { move: true, remove: true } },
							[
								createBlock(
									'unitone/decorator',
									{
										tagName: 'button',
										lock: { move: true, remove: true },
									},
									triggerInnerBlocks
								),
							]
						),
						...createBlocksFromInnerBlocksTemplate(
							DIALOG_CONTENT_TEMPLATE
						),
					]
				);
			},
		},
	],
	ungroup: ( attributes, innerBlocks ) =>
		innerBlocks.flatMap( ( innerBlock ) =>
			innerBlock.innerBlocks.flatMap( ( block ) =>
				'unitone/decorator' === block.name
					? block.innerBlocks
					: [ block ]
			)
		),
};
