import { __ } from '@wordpress/i18n';

import iconSubRightBottom from './icon/sub-right-bottom';
import iconSubRightTop from './icon/sub-right-top';
import iconSubLeftTop from './icon/sub-left-top';
import iconSubLeftBottom from './icon/sub-left-bottom';

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
		name: 'with-sidebar-sub-right-bottom',
		title: __( '[Sub] Right / Bottom', 'unitone' ),
		isDefault: true,
		attributes: {
			sidebar: 'right',
			revert: false,
		},
		scope: [ 'block' ],
		innerBlocks: defaultInnerBlocks,
		icon: {
			src: iconSubRightBottom,
		},
	},
	{
		name: 'with-sidebar-sub-right-top',
		title: __( '[Sub] Right / Top', 'unitone' ),
		isDefault: false,
		attributes: {
			sidebar: 'right',
			revert: true,
		},
		scope: [ 'block' ],
		innerBlocks: defaultInnerBlocks,
		icon: {
			src: iconSubRightTop,
		},
	},
	{
		name: 'with-sidebar-sub-left-top',
		title: __( '[Sub] Left / Top', 'unitone' ),
		isDefault: false,
		attributes: {
			sidebar: 'left',
			revert: false,
		},
		scope: [ 'block' ],
		innerBlocks: defaultInnerBlocks,
		icon: {
			src: iconSubLeftTop,
		},
	},
	{
		name: 'with-sidebar-sub-left-bottom',
		title: __( '[Sub] Left / Bottom', 'unitone' ),
		isDefault: false,
		attributes: {
			sidebar: 'left',
			revert: true,
		},
		scope: [ 'block' ],
		innerBlocks: defaultInnerBlocks,
		icon: {
			src: iconSubLeftBottom,
		},
	},
];
