import { _x } from '@wordpress/i18n';

export default [
	{
		name: 'cover-content-top',
		title: _x( 'Top', 'cover', 'unitone' ),
		isDefault: false,
		scope: [ 'block' ],
		attributes: { position: 'top' },
		isActive: [ 'position' ],
	},
	{
		name: 'cover-content-center',
		title: _x( 'Center', 'cover', 'unitone' ),
		isDefault: true,
		scope: [ 'block' ],
		attributes: { position: 'center' },
		isActive: [ 'position' ],
	},
	{
		name: 'cover-content-bottom',
		title: _x( 'Bottom', 'cover', 'unitone' ),
		isDefault: false,
		scope: [ 'block' ],
		attributes: { position: 'bottom' },
		isActive: [ 'position' ],
	},
];
