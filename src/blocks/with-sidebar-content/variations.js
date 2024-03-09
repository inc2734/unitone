import { __ } from '@wordpress/i18n';

import { iconMain, iconAside } from './icon';

export default [
	{
		name: 'main',
		title: __( 'Main', 'unitone' ),
		icon: {
			src: iconMain,
		},
		scope: [ 'block' ],
		attributes: {
			type: 'main',
		},
		isActive: ( blockAttributes, variationAttributes ) =>
			blockAttributes.type === variationAttributes.type,
	},
	{
		name: 'aside',
		title: __( 'Sidebar', 'unitone' ),
		icon: {
			src: iconAside,
		},
		scope: [ 'block' ],
		attributes: {
			type: 'aside',
		},
		isActive: ( blockAttributes, variationAttributes ) =>
			blockAttributes.type === variationAttributes.type,
	},
];
