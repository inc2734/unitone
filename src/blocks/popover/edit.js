import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';

const TEMPLATE = [
	[
		'unitone/popover-trigger',
		{ lock: { move: true, remove: true } },
		[
			[
				'core/buttons',
				{},
				[
					[
						'core/button',
						{
							text: __( 'Open popover', 'unitone' ),
							tagName: 'button',
						},
					],
				],
			],
		],
	],
	[
		'unitone/popover-content',
		{ lock: { move: true, remove: true } },
		[ [ 'unitone/popover-dialog', {}, [ [ 'core/paragraph' ] ] ] ],
	],
];

export default function ( { attributes } ) {
	const { templateLock } = attributes;

	const blockProps = useBlockProps();
	blockProps[ 'data-unitone-layout' ] = clsx(
		'popover',
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
