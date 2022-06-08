import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import icon from '../icon';
import edit from './edit';
import save from './save';
import transforms from './transforms';
import deprecated from './deprecated';

registerBlockType( 'unitone/frame', {
	icon: {
		src: icon,
	},
	edit,
	save,
	transforms,
	deprecated,
	variations: [
		{
			name: 'framed-image',
			title: __( 'Framed image', 'unitone' ),
			isDefault: true,
			scope: [ 'inserter' ],
			innerBlocks: [
				[
					'core/image',
					{
						id: 1,
						url: `${ unitone.url }/dist/img/stocksnap_lgg8nat9jy.jpg`,
					},
				],
			],
		},
		{
			name: 'framed-video',
			title: __( 'Framed video', 'unitone' ),
			scope: [ 'inserter' ],
			innerBlocks: [
				[
					'core/video',
					{
						id: 1,
						src: `${ unitone.url }/dist/img/sample.mp4`,
					},
				],
			],
		},
	],
} );
