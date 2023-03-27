import { __ } from '@wordpress/i18n';

export default [
	{
		name: 'cover-content-top',
		title: __( 'Cover content (Top)', 'unitone' ),
		isDefault: false,
		scope: [ 'block' ],
		attributes: { position: 'top' },
	},
	{
		name: 'cover-content-center',
		title: __( 'Cover content (Center)', 'unitone' ),
		isDefault: true,
		scope: [ 'block' ],
		attributes: { position: 'center' },
	},
	{
		name: 'cover-content-bottom',
		title: __( 'Cover content (Bottom)', 'unitone' ),
		isDefault: false,
		scope: [ 'block' ],
		attributes: { position: 'bottom' },
	},
];
