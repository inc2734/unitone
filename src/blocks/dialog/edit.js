import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import metadata from './block.json';

const TEMPLATE = [
	[
		'unitone/dialog-trigger',
		{ lock: { move: true, remove: true } },
		[
			[
				'core/buttons',
				{},
				[
					[
						'core/button',
						{
							text: 'Open dialog',
							tagName: 'button',
						},
					],
				],
			],
		],
	],
	[
		'unitone/dialog-content',
		{ lock: { move: true, remove: true } },
		[
			[
				'unitone/decorator',
				{
					backgroundColor: 'unitone-background',
					textColor: 'unitone-text',
					unitone: {
						padding: '1s',
					},
				},
			],
		],
	],
];

export default function ( { attributes } ) {
	const { templateLock } = attributes;

	const blockProps = useBlockProps();
	blockProps[ 'data-unitone-layout' ] = clsx(
		'dialog',
		blockProps[ 'data-unitone-layout' ]
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: metadata.allowedBlocks,
		templateLock,
		template: TEMPLATE,
		renderAppender: false,
	} );

	return <div { ...innerBlocksProps } />;
}
