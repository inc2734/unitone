import { registerBlockVariation } from '@wordpress/blocks';
import { Path, SVG } from '@wordpress/components';
import { sprintf, __ } from '@wordpress/i18n';

const variationsForShareButtons = [
	{
		name: 'unitone-share-button-x',
		title: __( 'Post to X', 'unitone' ),
		icon: {
			foreground: '#000',
			src: (
				<SVG viewBox="0 0 24 24">
					<Path d="M13.5222 10.7714L19.4785 4H18.0671L12.8952 9.87954L8.76437 4H4L10.2466 12.8909L4 19.9918H5.41155L10.8732 13.7828L15.2356 19.9918H20L13.5218 10.7714H13.5222ZM11.5889 12.9692L10.956 12.0839L5.92015 5.03921H8.0882L12.1522 10.7245L12.7851 11.6098L18.0677 18.9998H15.8997L11.5889 12.9696V12.9692Z" />
				</SVG>
			),
		},
		attributes: {
			text: '<strong>X</strong>',
			title: __( 'Post this entry to X', 'unitone' ),
			backgroundColor: 'black',
			textColor: 'white',
			metadata: {
				bindings: {
					url: {
						source: 'unitone/share-button',
						args: {
							key: 'x',
						},
					},
				},
			},
		},
	},
	{
		name: 'unitone-share-button-facebook',
		title: __( 'Share to Facebook', 'unitone' ),
		icon: {
			foreground: '#3b5998',
			src: (
				<SVG viewBox="0 0 24 24">
					<Path d="M20 3H4c-.6 0-1 .4-1 1v16c0 .5.4 1 1 1h8.6v-7h-2.3v-2.7h2.3v-2c0-2.3 1.4-3.6 3.5-3.6 1 0 1.8.1 2.1.1v2.4h-1.4c-1.1 0-1.3.5-1.3 1.3v1.7h2.7l-.4 2.8h-2.3v7H20c.5 0 1-.4 1-1V4c0-.6-.4-1-1-1z" />
				</SVG>
			),
		},
		attributes: {
			text: '<strong>Facebook</strong>',
			title: __( 'Share this entry to Facebook', 'unitone' ),
			textColor: 'white',
			style: {
				color: {
					background: '#0965fe',
				},
			},
			metadata: {
				bindings: {
					url: {
						source: 'unitone/share-button',
						args: {
							key: 'facebook',
						},
					},
				},
			},
		},
	},
	{
		name: 'unitone-share-button-line',
		title: __( 'Share to LINE', 'unitone' ),
		icon: {
			foreground: '#68b82b',
			src: (
				<SVG viewBox="0 0 24 24">
					<Path d="M6 3C5.20435 3 4.44129 3.31607 3.87868 3.87868C3.31607 4.44129 3 5.20435 3 6L3 18C3 18.7956 3.31607 19.5587 3.87868 20.1213C4.44129 20.6839 5.20435 21 6 21H18C18.7956 21 19.5587 20.6839 20.1213 20.1213C20.6839 19.5587 21 18.7956 21 18V6C21 5.20435 20.6839 4.44129 20.1213 3.87868C19.5587 3.31607 18.7956 3 18 3H6ZM17.1375 14.5125L14.775 16.35C14.775 16.35 12.675 18 12 18.3C11.325 18.6 11.4 18.1125 11.4375 17.9625V17.85C11.4934 17.5526 11.531 17.252 11.55 16.95V16.8L11.475 16.6125C11.175 16.5375 9.75 15.9 8.25 15.1875C8.25 15.1875 5.475 13.875 5.475 11.2125C5.475 8.55 8.3625 5.925 12 5.925C15.6375 5.925 18.5625 8.2875 18.5625 11.2125V12.4125L17.1375 14.5125Z" />
					<Path d="M10.65 9.82495H10.2C10.1702 9.82495 10.1415 9.8368 10.1204 9.8579C10.0993 9.879 10.0875 9.90761 10.0875 9.93745V12.7875C10.0875 12.8625 10.125 12.9375 10.2 12.9375H10.65C10.6898 12.9375 10.7279 12.9216 10.7561 12.8935C10.7842 12.8654 10.8 12.8272 10.8 12.7875V9.93745C10.8 9.86245 10.725 9.82495 10.65 9.82495Z" />
					<Path d="M13.8375 9.82495H13.35C13.3352 9.82495 13.3206 9.82786 13.3069 9.83351C13.2933 9.83917 13.2809 9.84745 13.2705 9.8579C13.26 9.86835 13.2517 9.88075 13.2461 9.8944C13.2404 9.90805 13.2375 9.92268 13.2375 9.93745V11.625L11.925 9.86245H11.3625C11.3327 9.86245 11.304 9.8743 11.283 9.8954C11.2619 9.9165 11.25 9.94511 11.25 9.97495V12.825C11.25 12.9 11.2875 12.975 11.3625 12.975H11.8125C11.8523 12.975 11.8904 12.9591 11.9186 12.931C11.9467 12.9029 11.9625 12.8647 11.9625 12.825V11.1L13.275 12.8625H13.8375C13.9125 12.8625 13.95 12.7875 13.95 12.7125V9.93745C13.95 9.90761 13.9381 9.879 13.917 9.8579C13.896 9.8368 13.8673 9.82495 13.8375 9.82495Z" />
					<Path d="M9.56251 12.225H8.28751V9.93745C8.28751 9.90761 8.27566 9.879 8.25456 9.8579C8.23346 9.8368 8.20485 9.82495 8.17501 9.82495H7.72501C7.65001 9.82495 7.57501 9.86245 7.57501 9.93745V12.7875V12.9H9.52501C9.60001 12.9 9.63751 12.825 9.63751 12.75V12.3375C9.63751 12.3076 9.62566 12.279 9.60456 12.2579C9.58346 12.2368 9.55485 12.225 9.52501 12.225" />
					<Path d="M16.35 10.5375C16.3898 10.5375 16.4279 10.5216 16.4561 10.4935C16.4842 10.4654 16.5 10.4272 16.5 10.3875V9.93745C16.5 9.86245 16.425 9.82495 16.35 9.82495H14.4375C14.4 9.82495 14.4 9.86245 14.4 9.89995V12.75C14.3983 12.7703 14.4007 12.7907 14.4072 12.8101C14.4136 12.8294 14.4239 12.8472 14.4375 12.8625H16.35C16.3898 12.8625 16.4279 12.8466 16.4561 12.8185C16.4842 12.7904 16.5 12.7522 16.5 12.7125V12.3375C16.5 12.2625 16.425 12.225 16.35 12.225H15.1125V11.7375H16.35C16.3898 11.7375 16.4279 11.7216 16.4561 11.6935C16.4842 11.6654 16.5 11.6272 16.5 11.5875V11.1375C16.5 11.0625 16.425 11.025 16.35 11.025H15.1125V10.5375H16.35Z" />
				</SVG>
			),
		},
		attributes: {
			text: '<strong>LINE</strong>',
			title: __( 'Share this entry to LINE', 'unitone' ),
			textColor: 'white',
			style: {
				color: {
					background: '#06c755',
				},
			},
			metadata: {
				bindings: {
					url: {
						source: 'unitone/share-button',
						args: {
							key: 'line',
						},
					},
				},
			},
		},
	},
	{
		name: 'unitone-share-button-hatena',
		title: __( 'Add to Hatena Bookmarks', 'unitone' ),
		icon: {
			foreground: '#00a4de',
			src: (
				<SVG viewBox="0 0 24 24">
					<Path d="M6.675 3H17.325C18.2997 3 19.2344 3.38719 19.9236 4.07638C20.6128 4.76558 21 5.70033 21 6.675V17.325C21 18.2997 20.6128 19.2344 19.9236 19.9236C19.2344 20.6128 18.2997 21 17.325 21H6.675C5.70033 21 4.76558 20.6128 4.07638 19.9236C3.38719 19.2344 3 18.2997 3 17.325V6.675C3 5.70033 3.38719 4.76558 4.07638 4.07638C4.76558 3.38719 5.70033 3 6.675 3ZM16.7625 7.9125H14.9625V13.35H16.7625V7.9125ZM12.45 15.675C12.7822 15.4929 13.0554 15.2197 13.2375 14.8875C13.4248 14.543 13.5155 14.1543 13.5 13.7625C13.5202 13.4985 13.4875 13.2332 13.4038 12.9821C13.3201 12.7309 13.1871 12.499 13.0125 12.3C12.6558 11.9293 12.1754 11.7025 11.6625 11.6625C12.0923 11.5889 12.4869 11.3784 12.7875 11.0625C13.0253 10.7371 13.1444 10.3401 13.125 9.9375C13.1268 9.59943 13.0498 9.2656 12.9 8.9625C12.7333 8.69572 12.5009 8.47621 12.225 8.325C11.9197 8.16208 11.5907 8.04818 11.25 7.9875L9.3375 7.9125H7.0875V16.0875H9.4125L11.4 16.0125C11.7645 15.9513 12.1181 15.8376 12.45 15.675ZM15.2507 15.7252C15.4063 15.9135 15.6227 16.0416 15.8625 16.0875C16.0144 16.1166 16.1708 16.1118 16.3206 16.0734C16.4704 16.035 16.6098 15.9641 16.729 15.8655C16.8482 15.767 16.9442 15.6434 17.01 15.5035C17.0759 15.3636 17.11 15.2109 17.11 15.0563C17.11 14.9016 17.0759 14.7489 17.01 14.609C16.9442 14.4691 16.8482 14.3455 16.729 14.247C16.6098 14.1484 16.4704 14.0775 16.3206 14.0391C16.1708 14.0007 16.0144 13.9959 15.8625 14.025C15.6227 14.0709 15.4063 14.199 15.2507 14.3873C15.0952 14.5755 15.01 14.812 15.01 15.0563C15.01 15.3005 15.0952 15.537 15.2507 15.7252ZM10.725 11.175C10.8328 11.1205 10.9202 11.0327 10.9742 10.9246C11.0283 10.8165 11.0461 10.694 11.025 10.575C11.0418 10.4495 11.0265 10.3217 10.9806 10.2037C10.9347 10.0857 10.8597 9.98118 10.7625 9.89998C10.408 9.74799 10.0221 9.68368 9.63751 9.71248H9.15001V11.3625H9.60001C9.98463 11.3913 10.3705 11.327 10.725 11.175ZM11.1 13.05C10.7532 12.872 10.3636 12.7941 9.97501 12.825H9.15001V14.625H9.93751C10.3261 14.6558 10.7157 14.5779 11.0625 14.4C11.1766 14.3402 11.2699 14.2473 11.3301 14.1335C11.3903 14.0198 11.4147 13.8904 11.4 13.7625C11.4155 13.6279 11.396 13.4917 11.3435 13.3669C11.2909 13.2421 11.2071 13.1329 11.1 13.05Z" />
				</SVG>
			),
		},
		attributes: {
			text: sprintf(
				'<strong>%1$s</strong>',
				__( 'B! Bookmark', 'unitone' )
			),
			title: __( 'Add this entry to Hatena Bookmarks', 'unitone' ),
			textColor: 'white',
			style: {
				color: {
					background: '#01a4de',
				},
			},
			metadata: {
				bindings: {
					url: {
						source: 'unitone/share-button',
						args: {
							key: 'hatena',
						},
					},
				},
			},
		},
	},
];

variationsForShareButtons.forEach( ( variation ) => {
	registerBlockVariation( 'core/button', {
		...variation,
		isActive: ( blockAttributes, variationAttributes ) => {
			const blockAttributeKey =
				blockAttributes?.metadata?.bindings?.url?.args?.key;
			const variationAttributeKey =
				variationAttributes?.metadata?.bindings?.url?.args?.key;
			if ( ! blockAttributeKey || ! variationAttributeKey ) {
				return false;
			}
			return blockAttributeKey === variationAttributeKey;
		},
		attributes: {
			...variation.attributes,
			linkTarget: '_blank',
			rel: 'nofollow',
			fontSize: 'unitone-xs',
			unitone: {
				halfLeading: 0,
				padding: '-1',
			},
		},
	} );
} );
