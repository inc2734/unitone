import { __ } from '@wordpress/i18n';

export default [
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
		example: {
			innerBlocks: [
				{
					name: 'core/image',
					attributes: {
						id: 1,
						url: `${ unitone.url }/dist/img/stocksnap_lgg8nat9jy.jpg`,
					},
				},
			],
		},
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
		example: {
			innerBlocks: [
				{
					name: 'core/video',
					attributes: {
						id: 1,
						src: `${ unitone.url }/dist/img/sample.mp4`,
					},
				},
			],
		},
	},
];
