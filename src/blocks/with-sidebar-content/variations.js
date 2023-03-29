import { __ } from '@wordpress/i18n';

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
		title: __( 'Aside', 'unitone' ),
		scope: [ 'block' ],
		attributes: {
			type: 'aside',
		},
		isActive: ( blockAttributes, variationAttributes ) =>
			blockAttributes.type === variationAttributes.type,
	},
];
