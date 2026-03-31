import { __ } from '@wordpress/i18n';

const defaultInnerBlocks = [
	[
		'unitone/with-sidebar-content',
		{ type: 'main', lock: { move: true, remove: true } },
	],
	[
		'unitone/with-sidebar-content',
		{ type: 'aside', lock: { move: true, remove: true } },
	],
];

export default [
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
		isActive: ( blockAttributes, variationAttributes ) =>
			!! blockAttributes?.unitone?.dividerType &&
			!! variationAttributes?.unitone?.dividerType &&
			blockAttributes.unitone.dividerType ===
				variationAttributes.unitone.dividerType,
		scope: [ 'inserter' ],
		innerBlocks: defaultInnerBlocks,
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
		isActive: ( blockAttributes, variationAttributes ) =>
			!! blockAttributes?.unitone?.dividerType &&
			!! variationAttributes?.unitone?.dividerType &&
			blockAttributes.unitone.dividerType ===
				variationAttributes.unitone.dividerType,
		scope: [ 'inserter' ],
		innerBlocks: defaultInnerBlocks,
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
		isActive: ( blockAttributes, variationAttributes ) =>
			!! blockAttributes?.unitone?.dividerType &&
			!! variationAttributes?.unitone?.dividerType &&
			blockAttributes.unitone.dividerType ===
				variationAttributes.unitone.dividerType,
		scope: [ 'inserter' ],
		innerBlocks: defaultInnerBlocks,
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
		isActive: ( blockAttributes, variationAttributes ) =>
			!! blockAttributes?.unitone?.dividerType &&
			!! variationAttributes?.unitone?.dividerType &&
			blockAttributes.unitone.dividerType ===
				variationAttributes.unitone.dividerType,
		scope: [ 'inserter' ],
		innerBlocks: defaultInnerBlocks,
	},
];
