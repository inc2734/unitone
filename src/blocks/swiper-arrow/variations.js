import { __ } from '@wordpress/i18n';

import { next, prev } from './icons';

export default [
	{
		name: 'previous',
		title: __( '[Swiper] Previous arrow', 'unitone' ),
		icon: {
			src: prev,
		},
		attributes: {
			action: 'previous',
			content: __( 'Previous', 'unitone' ),
		},
		isDefault: true,
		isActive: [ 'action' ],
		scope: [ 'inserter', 'transform' ],
	},
	{
		name: 'next',
		title: __( '[Swiper] Next arrow', 'unitone' ),
		icon: {
			src: next,
		},
		attributes: {
			action: 'next',
			content: __( 'Next', 'unitone' ),
		},
		isActive: [ 'action' ],
		scope: [ 'inserter', 'transform' ],
	},
];
