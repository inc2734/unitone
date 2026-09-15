import { __ } from '@wordpress/i18n';
import icon from './icon';

const PREVIOUS_BUTTON_CONTENT =
	'<span aria-hidden="true" style="--unitone--inline-svg: url(&quot;data:image/svg+xml;charset=UTF-8,%3Csvg%0A%09%09%09xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%0A%09%09%09width%3D%2224%22%0A%09%09%09height%3D%2224%22%0A%09%09%09viewBox%3D%220%200%2024%2024%22%0A%09%09%09stroke-width%3D%221.5%22%0A%09%09%3E%3Cpath%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22m15%2019l-7-7l7-7%22%2F%3E%3C%2Fsvg%3E&quot;)" class="unitone-inline-icon"><span inert=""> </span></span>';

const NEXT_BUTTON_CONTENT =
	'<span aria-hidden="true" style="--unitone--inline-svg: url(&quot;data:image/svg+xml;charset=UTF-8,%3Csvg%0A%09%09%09xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%0A%09%09%09width%3D%2224%22%0A%09%09%09height%3D%2224%22%0A%09%09%09viewBox%3D%220%200%2024%2024%22%0A%09%09%09stroke-width%3D%221.5%22%0A%09%09%3E%3Cpath%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22m9%205l7%207l-7%207%22%2F%3E%3C%2Fsvg%3E&quot;)" class="unitone-inline-icon"><span inert=""> </span></span>';

const PLAY_BUTTON_CONTENT =
	'<span aria-hidden="true" style="--unitone--inline-svg: url(&quot;data:image/svg+xml;charset=UTF-8,%3Csvg%0A%09%09%09xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%0A%09%09%09width%3D%2224%22%0A%09%09%09height%3D%2224%22%0A%09%09%09viewBox%3D%220%200%2024%2024%22%0A%09%09%09stroke-width%3D%221.5%22%0A%09%09%3E%3Cpath%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M8%2018V6l8%206z%22%2F%3E%3C%2Fsvg%3E&quot;)" class="unitone-inline-icon"><span inert> </span></span>';

const PAUSE_BUTTON_CONTENT =
	'<span aria-hidden="true" style="--unitone--inline-svg: url(&quot;data:image/svg+xml;charset=UTF-8,%3Csvg%0A%09%09%09xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%0A%09%09%09width%3D%2224%22%0A%09%09%09height%3D%2224%22%0A%09%09%09viewBox%3D%220%200%2024%2024%22%0A%09%09%09stroke-width%3D%221.5%22%0A%09%09%3E%3Cpath%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M9%206H8a1%201%200%200%200-1%201v10a1%201%200%200%200%201%201h1a1%201%200%200%200%201-1V7a1%201%200%200%200-1-1m7%200h-1a1%201%200%200%200-1%201v10a1%201%200%200%200%201%201h1a1%201%200%200%200%201-1V7a1%201%200%200%200-1-1%22%2F%3E%3C%2Fsvg%3E&quot;)" class="unitone-inline-icon"><span inert> </span></span>';

const createTrack = ( slideCount = 3 ) => [
	'unitone/swiper-track',
	{},
	Array.from( { length: slideCount }, () => [ 'unitone/swiper-slide' ] ),
];

const createControls = ( withAutoplayControls = false ) => [
	'unitone/cluster',
	{
		unitone: {
			alignItems: 'center',
			justifyContent: 'center',
		},
	},
	[
		[
			'unitone/swiper-arrow',
			{
				action: 'previous',
				content: PREVIOUS_BUTTON_CONTENT,
				className: 'is-style-1-1',
				unitone: { padding: '1' },
			},
		],
		[ 'unitone/swiper-pagination' ],
		[
			'unitone/swiper-arrow',
			{
				action: 'next',
				content: NEXT_BUTTON_CONTENT,
				className: 'is-style-1-1',
				unitone: { padding: '1' },
			},
		],
		...( withAutoplayControls
			? [
					[
						'unitone/swiper-autoplay-control',
						{
							action: 'play',
							content: PLAY_BUTTON_CONTENT,
							className: 'is-style-1-1',
							unitone: { padding: '1' },
						},
					],
					[
						'unitone/swiper-autoplay-control',
						{
							action: 'pause',
							content: PAUSE_BUTTON_CONTENT,
							className: 'is-style-1-1',
							unitone: { padding: '1' },
						},
					],
			  ]
			: [] ),
	],
];

export default [
	{
		name: 'default',
		title: __( 'Default', 'unitone' ),
		icon: {
			src: icon,
		},
		isDefault: true,
		attributes: {
			settings: {},
		},
		scope: [ 'block' ],
		innerBlocks: [ createTrack( 1 ) ],
	},
	{
		name: 'slider',
		title: __( 'Slider', 'unitone' ),
		icon: {
			src: icon,
		},
		attributes: {
			settings: {
				spaceBetween: 20,
			},
		},
		scope: [ 'block' ],
		innerBlocks: [ createTrack(), createControls() ],
	},
	{
		name: 'autoplay-slider',
		title: __( 'Autoplay slider', 'unitone' ),
		icon: {
			src: icon,
		},
		attributes: {
			settings: {
				spaceBetween: 20,
				autoplay: true,
			},
		},
		scope: [ 'block' ],
		innerBlocks: [
			createTrack(),
			[ 'unitone/swiper-autoplay-progress' ],
			createControls( true ),
		],
	},
	{
		name: 'fade',
		title: __( 'Fade', 'unitone' ),
		icon: {
			src: icon,
		},
		attributes: {
			settings: {
				effect: 'fade',
			},
		},
		scope: [ 'block' ],
		innerBlocks: [ createTrack(), createControls() ],
	},
	{
		name: 'autoplay-fade',
		title: __( 'Autoplay fade', 'unitone' ),
		icon: {
			src: icon,
		},
		attributes: {
			settings: {
				effect: 'fade',
				autoplay: true,
			},
		},
		scope: [ 'block' ],
		innerBlocks: [
			createTrack(),
			[ 'unitone/swiper-autoplay-progress' ],
			createControls( true ),
		],
	},
];
