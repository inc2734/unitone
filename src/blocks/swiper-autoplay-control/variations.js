import { __ } from '@wordpress/i18n';

import { pause, start } from './icons';

export default [
	{
		name: 'toggle',
		title: __( 'Swiper Autoplay start / pause', 'unitone' ),
		icon: { src: start },
		attributes: {
			action: 'toggle',
			playContent: __( 'Play', 'unitone' ),
			pauseContent: __( 'Stop', 'unitone' ),
		},
		isActive: [ 'action' ],
		scope: [ 'inserter', 'transform' ],
	},
	{
		name: 'start',
		title: __( 'Swiper Autoplay start', 'unitone' ),
		icon: {
			src: start,
		},
		attributes: {
			action: 'play',
			content: __( 'Play', 'unitone' ),
		},
		isActive: [ 'action' ],
		scope: [ 'inserter', 'transform' ],
	},
	{
		name: 'pause',
		title: __( 'Swiper Autoplay pause', 'unitone' ),
		icon: {
			src: pause,
		},
		attributes: {
			action: 'pause',
			content: __( 'Pause', 'unitone' ),
		},
		isDefault: true,
		isActive: [ 'action' ],
		scope: [ 'inserter', 'transform' ],
	},
];
