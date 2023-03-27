import { __ } from '@wordpress/i18n';

export default [
	{
		name: 'stack-divided-stripe',
		title: __( 'Stack (Divider: stripe)', 'unitone' ),
		isDefault: true,
		attributes: { unitone: { dividerType: 'stripe' } },
		scope: [ 'inserter' ],
		innerBlocks: [
			[ 'unitone/stack-divided-content' ],
			[ 'unitone/stack-divided-content' ],
		],
	},
	{
		name: 'stack-divided-underline',
		title: __( 'Stack (Divider: underline)', 'unitone' ),
		isDefault: false,
		attributes: { unitone: { dividerType: 'underline' } },
		scope: [ 'inserter' ],
		innerBlocks: [
			[ 'unitone/stack-divided-content' ],
			[ 'unitone/stack-divided-content' ],
		],
	},
	{
		name: 'stack-divided-bordered',
		title: __( 'Stack (Divider: bordered)', 'unitone' ),
		isDefault: false,
		attributes: { unitone: { dividerType: 'bordered' } },
		scope: [ 'inserter' ],
		innerBlocks: [
			[ 'unitone/stack-divided-content' ],
			[ 'unitone/stack-divided-content' ],
		],
	},
];
