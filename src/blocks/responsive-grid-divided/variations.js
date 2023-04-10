import { __ } from '@wordpress/i18n';

export default [
	{
		name: 'responsive-grid-divided-stripe',
		title: __( 'Responsive grid (Divider: stripe)', 'unitone' ),
		isDefault: true,
		attributes: { unitone: { dividerType: 'stripe' } },
		scope: [ 'inserter' ],
		innerBlocks: [
			[ 'unitone/responsive-grid-divided-content' ],
			[ 'unitone/responsive-grid-divided-content' ],
		],
	},
	{
		name: 'responsive-grid-divided-underline',
		title: __( 'Responsive grid (Divider: underline)', 'unitone' ),
		isDefault: false,
		attributes: { unitone: { dividerType: 'underline' } },
		scope: [ 'inserter' ],
		innerBlocks: [
			[ 'unitone/responsive-grid-divided-content' ],
			[ 'unitone/responsive-grid-divided-content' ],
		],
	},
	{
		name: 'responsive-grid-divided-bordered',
		title: __( 'Responsive grid (Divider: bordered)', 'unitone' ),
		isDefault: false,
		attributes: { unitone: { dividerType: 'bordered' } },
		scope: [ 'inserter' ],
		innerBlocks: [
			[ 'unitone/responsive-grid-divided-content' ],
			[ 'unitone/responsive-grid-divided-content' ],
		],
	},
];
