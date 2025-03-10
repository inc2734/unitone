import { __, _x } from '@wordpress/i18n';

export default [
	{
		name: 'main',
		title: __( 'Main', 'unitone' ),
		scope: [ 'block' ],
		attributes: {
			type: 'main',
		},
		isActive: ( blockAttributes, variationAttributes ) =>
			blockAttributes.type === variationAttributes.type,
	},
	{
		name: 'aside',
		title: _x( 'Secondary', 'with-sidebar', 'unitone' ),
		scope: [ 'block' ],
		attributes: {
			type: 'aside',
		},
		isActive: ( blockAttributes, variationAttributes ) =>
			blockAttributes.type === variationAttributes.type,
	},
];
