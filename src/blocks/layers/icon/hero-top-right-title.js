import { Icon } from '@wordpress/components';

export default function () {
	return (
		<Icon
			height="48px"
			width="48px"
			icon={
				<svg
					width="48"
					height="48"
					viewBox="0 0 48 48"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect x="3" y="17" width="38" height="22" fill="#DDDDDD" />
					<line
						x1="23"
						y1="10"
						x2="45"
						y2="10"
						stroke="#AAAAAA"
						strokeWidth="2"
					/>
					<line
						x1="23"
						y1="14"
						x2="41"
						y2="14"
						stroke="#AAAAAA"
						strokeWidth="2"
					/>
					<line
						x1="23"
						y1="18"
						x2="39"
						y2="18"
						stroke="#AAAAAA"
						strokeWidth="2"
					/>
					<line
						x1="23"
						y1="22"
						x2="43"
						y2="22"
						stroke="#AAAAAA"
						strokeWidth="2"
					/>
				</svg>
			}
		/>
	);
}
