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
						maxWidth: 'var(--wp--style--global--content-size)',
						maxHeight: '80vh',
						padding: '1s',
						overflow: 'auto',
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
