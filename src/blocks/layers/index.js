import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import icon from '../icon';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';

registerBlockType( 'unitone/layers', {
	icon: {
		src: icon,
	},
	edit,
	save,
	deprecated,
	variations: [
		{
			name: 'background-image',
			title: __( 'Background image', 'unitone' ),
			scope: [ 'inserter' ],
			innerBlocks: [
				[
					'unitone/layer',
					{
						gridRow: '',
					},
					[
						[
							'core/image',
							{
								id: 1,
								url: `${ unitone.url }/dist/img/stocksnap_lgg8nat9jy.jpg`,
							},
						],
					],
				],
				[
					'unitone/layer',
					{
						alignSelf: 'end',
						gridRow: '',
					},
					[
						[
							'unitone/decorator',
							{ textColor: 'white', unitone: { padding: 1 } },
						],
					],
				],
			],
		},
		{
			name: 'background-framed-image',
			title: __( 'Background framed image', 'unitone' ),
			scope: [ 'inserter' ],
			innerBlocks: [
				[
					'unitone/layer',
					{
						gridRow: '',
					},
					[
						[
							'unitone/frame',
							{},
							[
								[
									'core/image',
									{
										id: 1,
										url: `${ unitone.url }/dist/img/stocksnap_lgg8nat9jy.jpg`,
									},
								],
							],
						],
					],
				],
				[
					'unitone/layer',
					{
						alignSelf: 'end',
						gridRow: '',
					},
					[
						[
							'unitone/decorator',
							{ textColor: 'white', unitone: { padding: 1 } },
						],
					],
				],
			],
		},
	],
} );
