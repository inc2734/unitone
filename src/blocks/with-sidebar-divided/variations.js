import { __ } from '@wordpress/i18n';

import layoutVariations from '../with-sidebar/variations';

export default [
	...layoutVariations,
	{
		name: 'with-sidebar-divided-stripe',
		title: __( 'With sidebar (Divider: Stripe)', 'unitone' ),
		isDefault: true,
		attributes: {
			unitone: {
				alignItems: 'stretch',
				dividerType: 'stripe',
				divider: { style: 'solid', width: '1px' },
				dividerColor: 'unitone-light-gray',
			},
		},
		scope: [ 'inserter', 'transform' ],
	},
	{
		name: 'with-sidebar-divided-divide',
		title: __( 'With sidebar (Divider: Divide)', 'unitone' ),
		isDefault: false,
		attributes: {
			unitone: {
				alignItems: 'stretch',
				dividerType: 'divide',
				divider: { style: 'solid', width: '1px' },
				dividerColor: 'unitone-light-gray',
			},
		},
		scope: [ 'inserter', 'transform' ],
	},
	{
		name: 'with-sidebar-divided-slash',
		title: __( 'With sidebar (Divider: Slash)', 'unitone' ),
		isDefault: false,
		attributes: {
			unitone: {
				alignItems: 'stretch',
				dividerType: 'slash',
				divider: { style: 'solid', width: '1px' },
				dividerColor: 'unitone-light-gray',
			},
		},
		scope: [ 'inserter', 'transform' ],
	},
	{
		name: 'with-sidebar-divided-bordered',
		title: __( 'With sidebar (Divider: Bordered)', 'unitone' ),
		isDefault: false,
		attributes: {
			unitone: {
				alignItems: 'stretch',
				dividerType: 'bordered',
				divider: { style: 'solid', width: '1px' },
				dividerColor: 'unitone-light-gray',
			},
		},
		scope: [ 'inserter', 'transform' ],
	},
];
