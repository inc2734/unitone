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
					<rect
						width="48"
						height="48"
						transform="matrix(1 0 0 -1 0 48)"
						fill="#DDDDDD"
					/>
					<line
						x1="14"
						y1="16"
						x2="34"
						y2="16"
						stroke="#AAAAAA"
						strokeWidth="2"
					/>
					<line
						x1="5"
						y1="23"
						x2="43"
						y2="23"
						stroke="#AAAAAA"
						strokeWidth="2"
					/>
					<line
						x1="5"
						y1="27"
						x2="43"
						y2="27"
						stroke="#AAAAAA"
						strokeWidth="2"
					/>
					<line
						x1="5"
						y1="31"
						x2="43"
						y2="31"
						stroke="#AAAAAA"
						strokeWidth="2"
					/>
				</svg>
			}
		/>
	);
}
