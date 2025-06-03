import { desktop, mobile } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

export default [
	{
		name: 'desktop',
		title: __( 'Desktoop', 'unitone' ),
		icon: {
			src: desktop,
		},
		scope: [ 'block' ],
		attributes: {
			viewport: 'desktop',
		},
		isActive: ( blockAttributes, variationAttributes ) =>
			blockAttributes.viewport === variationAttributes.viewport,
	},
	{
		name: 'mobile',
		title: __( 'Mobile', 'unitone' ),
		icon: {
			src: mobile,
		},
		scope: [ 'block' ],
		attributes: {
			viewport: 'mobile',
		},
		isActive: ( blockAttributes, variationAttributes ) =>
			blockAttributes.viewport === variationAttributes.viewport,
	},
];
