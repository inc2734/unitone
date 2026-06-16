import { __, _x } from '@wordpress/i18n';

import iconTop from './icon/top';
import iconCenter from './icon/center';
import iconBottom from './icon/bottom';
import iconTopCenter from './icon/top-center';
import iconTopBottom from './icon/top-bottom';
import iconCenterBottom from './icon/center-bottom';
import iconTopCenterBottom from './icon/top-center-bottom';

export default [
	{
		name: 'cover-top',
		title: _x( 'Top', 'cover-variation', 'unitone' ),
		isDefault: false,
		scope: [ 'block' ],
		attributes: {
			variation: 'cover-top',
		},
		innerBlocks: [
			[
				'unitone/cover-content',
				{ position: 'top', lock: { move: true } },
			],
		],
		icon: {
			src: iconTop,
		},
	},
	{
		name: 'cover-center',
		title: _x( 'Center', 'cover-variation', 'unitone' ),
		isDefault: true,
		scope: [ 'block' ],
		attributes: {
			variation: 'cover-center',
		},
		innerBlocks: [
			[
				'unitone/cover-content',
				{ position: 'center', lock: { move: true } },
			],
		],
		icon: {
			src: iconCenter,
		},
	},
	{
		name: 'cover-bottom',
		title: _x( 'Bottom', 'cover-variation', 'unitone' ),
		isDefault: false,
		scope: [ 'block' ],
		attributes: {
			variation: 'cover-bottom',
		},
		innerBlocks: [
			[
				'unitone/cover-content',
				{ position: 'bottom', lock: { move: true } },
			],
		],
		icon: {
			src: iconBottom,
		},
	},
	{
		name: 'cover-top-center',
		title: _x( 'Top / Center', 'cover-variation', 'unitone' ),
		isDefault: false,
		scope: [ 'block' ],
		attributes: {
			variation: 'cover-top-center',
		},
		innerBlocks: [
			[
				'unitone/cover-content',
				{ position: 'top', lock: { move: true } },
			],
			[
				'unitone/cover-content',
				{ position: 'center', lock: { move: true } },
			],
		],
		icon: {
			src: iconTopCenter,
		},
	},
	{
		name: 'cover-top-bottom',
		title: _x( 'Top / Bottom', 'cover-variation', 'unitone' ),
		isDefault: false,
		scope: [ 'block' ],
		attributes: {
			variation: 'cover-top-bottom',
		},
		innerBlocks: [
			[
				'unitone/cover-content',
				{ position: 'top', lock: { move: true } },
			],
			[
				'unitone/cover-content',
				{ position: 'bottom', lock: { move: true } },
			],
		],
		icon: {
			src: iconTopBottom,
		},
	},
	{
		name: 'cover-center-bottom',
		title: _x( 'Center / Bottom', 'cover-variation', 'unitone' ),
		isDefault: false,
		scope: [ 'block' ],
		attributes: {
			variation: 'cover-center-bottom',
		},
		innerBlocks: [
			[
				'unitone/cover-content',
				{ position: 'center', lock: { move: true } },
			],
			[
				'unitone/cover-content',
				{ position: 'bottom', lock: { move: true } },
			],
		],
		icon: {
			src: iconCenterBottom,
		},
	},
	{
		name: 'cover-top-center-bottom',
		title: _x( 'Top / Center / Bottom', 'cover-variation', 'unitone' ),
		isDefault: false,
		scope: [ 'block' ],
		attributes: {
			variation: 'cover-top-center-bottom',
		},
		innerBlocks: [
			[
				'unitone/cover-content',
				{ position: 'top', lock: { move: true } },
			],
			[
				'unitone/cover-content',
				{ position: 'center', lock: { move: true } },
			],
			[
				'unitone/cover-content',
				{ position: 'bottom', lock: { move: true } },
			],
		],
		icon: {
			src: iconTopCenterBottom,
		},
	},
];
