const PREVIOUS_BUTTON_CONTENT =
	'<span aria-hidden="true" style="--unitone--inline-svg: url(&quot;data:image/svg+xml;charset=UTF-8,%3Csvg%0A%09%09%09xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%0A%09%09%09width%3D%2224%22%0A%09%09%09height%3D%2224%22%0A%09%09%09viewBox%3D%220%200%2024%2024%22%0A%09%09%09stroke-width%3D%221.5%22%0A%09%09%3E%3Cpath%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22m15%2019l-7-7l7-7%22%2F%3E%3C%2Fsvg%3E&quot;)" class="unitone-inline-icon"><span inert=""> </span></span>';

const NEXT_BUTTON_CONTENT =
	'<span aria-hidden="true" style="--unitone--inline-svg: url(&quot;data:image/svg+xml;charset=UTF-8,%3Csvg%0A%09%09%09xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%0A%09%09%09width%3D%2224%22%0A%09%09%09height%3D%2224%22%0A%09%09%09viewBox%3D%220%200%2024%2024%22%0A%09%09%09stroke-width%3D%221.5%22%0A%09%09%3E%3Cpath%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22m9%205l7%207l-7%207%22%2F%3E%3C%2Fsvg%3E&quot;)" class="unitone-inline-icon"><span inert=""> </span></span>';

const PLAY_BUTTON_CONTENT =
	'<span aria-hidden="true" style="--unitone--inline-svg: url(&quot;data:image/svg+xml;charset=UTF-8,%3Csvg%0A%09%09%09xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%0A%09%09%09width%3D%2224%22%0A%09%09%09height%3D%2224%22%0A%09%09%09viewBox%3D%220%200%2024%2024%22%0A%09%09%09stroke-width%3D%221.5%22%0A%09%09%3E%3Cpath%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M8%2018V6l8%206z%22%2F%3E%3C%2Fsvg%3E&quot;)" class="unitone-inline-icon"><span inert> </span></span>';

const PAUSE_BUTTON_CONTENT =
	'<span aria-hidden="true" style="--unitone--inline-svg: url(&quot;data:image/svg+xml;charset=UTF-8,%3Csvg%0A%09%09%09xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%0A%09%09%09width%3D%2224%22%0A%09%09%09height%3D%2224%22%0A%09%09%09viewBox%3D%220%200%2024%2024%22%0A%09%09%09stroke-width%3D%221.5%22%0A%09%09%3E%3Cpath%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M9%206H8a1%201%200%200%200-1%201v10a1%201%200%200%200%201%201h1a1%201%200%200%200%201-1V7a1%201%200%200%200-1-1m7%200h-1a1%201%200%200%200-1%201v10a1%201%200%200%200%201%201h1a1%201%200%200%200%201-1V7a1%201%200%200%200-1-1%22%2F%3E%3C%2Fsvg%3E&quot;)" class="unitone-inline-icon"><span inert> </span></span>';

const SLIDE_IMAGES = [
	'stocksnap_lgg8nat9jy.jpg',
	'stocksnap_ydxj69toal.jpg',
	'building-architecture-sky2096.jpg',
	'stocksnap_wrn48fo5mr.jpg',
];

const createTrack = ( slideCount = 4, attributes = {} ) => [
	'unitone/swiper-track',
	attributes,
	Array.from( { length: slideCount }, ( _, index ) => [
		'unitone/swiper-slide',
		{},
		[
			[
				'core/image',
				{
					id: 1,
					url: `${ window.unitoneSettings.url }/dist/img/${
						SLIDE_IMAGES[ index % SLIDE_IMAGES.length ]
					}`,
				},
			],
		],
	] ),
];

const createAutoplayControls = () => [
	'unitone/cluster',
	{
		unitone: {
			alignItems: 'center',
			justifyContent: 'start',
			gap: '-1',
		},
	},
	[
		[
			'unitone/cluster',
			{
				unitone: {
					alignItems: 'stretch',
					justifyContent: 'start',
					gap: '-3',
				},
			},
			[
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
			],
		],
		[ 'unitone/swiper-autoplay-progress', { type: 'circle' } ],
	],
];

const createControls = ( autoplay = false, overlay = false ) => [
	'unitone/cluster',
	{
		unitone: {
			alignItems: 'center',
			justifyContent: 'center',
		},
		...( overlay
			? {
					style: {
						elements: {
							link: {
								color: { text: 'var:preset|color|white' },
							},
						},
					},
					textColor: 'white',
			  }
			: {} ),
	},
	[
		...( overlay
			? []
			: [
					[
						'unitone/swiper-arrow',
						{
							action: 'previous',
							content: PREVIOUS_BUTTON_CONTENT,
							className: 'is-style-1-1',
							unitone: { padding: '1' },
						},
					],
			  ] ),
		[ 'unitone/swiper-pagination' ],
		...( overlay
			? []
			: [
					[
						'unitone/swiper-arrow',
						{
							action: 'next',
							content: NEXT_BUTTON_CONTENT,
							className: 'is-style-1-1',
							unitone: { padding: '1' },
						},
					],
			  ] ),
		...( autoplay ? [ createAutoplayControls() ] : [] ),
	],
];

const createOverlayBlocks = ( track = createTrack(), autoplay = false ) => [
	[
		'unitone/layers',
		{},
		[
			track,
			[
				'unitone/swiper-arrow',
				{
					action: 'previous',
					content: PREVIOUS_BUTTON_CONTENT,
					className: 'is-style-1-1',
					unitone: {
						padding: '1',
						alignSelf: 'center',
						justifySelf: 'start',
					},
					style: {
						elements: {
							link: {
								color: {
									text: 'var:preset|color|white',
								},
							},
						},
					},
					textColor: 'white',
				},
			],
			[
				'unitone/swiper-arrow',
				{
					action: 'next',
					content: NEXT_BUTTON_CONTENT,
					className: 'is-style-1-1',
					unitone: {
						padding: '1',
						alignSelf: 'center',
						justifySelf: 'end',
					},
					style: {
						elements: {
							link: {
								color: {
									text: 'var:preset|color|white',
								},
							},
						},
					},
					textColor: 'white',
				},
			],
			[
				'unitone/decorator',
				{
					unitone: {
						position: { position: 'relative' },
						overflow: 'visible',
						alignSelf: 'end',
						justifySelf: 'stretch',
						padding: '-1',
					},
				},
				[ createControls( autoplay, true ) ],
			],
		],
	],
];

export const createEmptySwiperTemplate = () => ( {
	attributes: {
		settings: {},
	},
	innerBlocks: [
		[ 'unitone/swiper-track', {}, [ [ 'unitone/swiper-slide' ] ] ],
	],
} );

export const createSwiperTemplate = ( {
	effect = 'slide',
	autoplay = false,
	fullBleed = false,
	overlayControls = false,
} = {} ) => {
	const track = createTrack(
		4,
		'slide' === effect && fullBleed
			? { unitone: { overflow: 'visible' } }
			: {}
	);

	return {
		attributes: {
			settings: {
				...( 'slide' === effect ? { spaceBetween: 20 } : { effect } ),
				...( autoplay ? { autoplay: true } : {} ),
			},
		},
		innerBlocks: overlayControls
			? createOverlayBlocks( track, autoplay )
			: [ track, createControls( autoplay ) ],
	};
};
