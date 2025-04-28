import { __ } from '@wordpress/i18n';

export default [
	{
		name: 'stack-hgroup',
		title: __( 'hgroup', 'unitone' ),
		attributes: {
			tagName: 'hgroup',
			unitone: { gap: '0' },
		},
		isActive: [ 'tagName' ],
		innerBlocks: [
			[ 'core/heading', { fontSize: 'unitone-2xl' } ],
			[ 'core/paragraph', { fontSize: 'unitone-s' } ],
		],
	},
];
