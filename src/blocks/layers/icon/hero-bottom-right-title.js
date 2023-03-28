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
					<rect x="3" y="9" width="38" height="22" fill="#DDDDDD" />
					<line
						x1="23"
						y1="26"
						x2="45"
						y2="26"
						stroke="#AAAAAA"
						strokeWidth="2"
					/>
					<line
						x1="23"
						y1="30"
						x2="41"
						y2="30"
						stroke="#AAAAAA"
						strokeWidth="2"
					/>
					<line
						x1="23"
						y1="34"
						x2="39"
						y2="34"
						stroke="#AAAAAA"
						strokeWidth="2"
					/>
					<line
						x1="23"
						y1="38"
						x2="43"
						y2="38"
						stroke="#AAAAAA"
						strokeWidth="2"
					/>
				</svg>
			}
		/>
	);
}
