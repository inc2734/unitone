import { __ } from '@wordpress/i18n';

export const DIALOG_CONTENT_TEMPLATE = [
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

export default [
	{
		name: 'dialog-button',
		title: __( 'Dialog (Button)', 'unitone' ),
		isDefault: true,
		isActive: [ 'variation' ],
		scope: [ 'block', 'inserter' ],
		attributes: {
			variation: 'dialog-button',
		},
		innerBlocks: [
			[
				'unitone/dialog-trigger',
				{ lock: { move: true, remove: true } },
				[
					[
						'core/buttons',
						{ lock: { move: true, remove: true } },
						[
							[
								'core/button',
								{
									text: __( 'Open dialog', 'unitone' ),
									tagName: 'button',
								},
							],
						],
					],
				],
			],
			...DIALOG_CONTENT_TEMPLATE,
		],
	},
	{
		name: 'dialog-box',
		title: __( 'Dialog (Box)', 'unitone' ),
		isDefault: false,
		isActive: [ 'variation' ],
		scope: [ 'block', 'inserter' ],
		attributes: {
			variation: 'dialog-box',
		},
		innerBlocks: [
			[
				'unitone/dialog-trigger',
				{ lock: { move: true, remove: true } },
				[
					[
						'unitone/decorator',
						{
							tagName: 'button',
							lock: { move: true, remove: true },
						},
						[
							[
								'core/paragraph',
								{
									content: __( 'Open dialog', 'unitone' ),
								},
							],
						],
					],
				],
			],
			...DIALOG_CONTENT_TEMPLATE,
		],
	},
];
