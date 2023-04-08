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
						x1="5"
						y1="17"
						x2="25"
						y2="17"
						stroke="#AAAAAA"
						strokeWidth="2"
					/>
					<line
						x1="5"
						y1="24"
						x2="43"
						y2="24"
						stroke="#AAAAAA"
						strokeWidth="2"
					/>
					<line
						x1="5"
						y1="28"
						x2="43"
						y2="28"
						stroke="#AAAAAA"
						strokeWidth="2"
					/>
					<line
						x1="5"
						y1="32"
						x2="43"
						y2="32"
						stroke="#AAAAAA"
						strokeWidth="2"
					/>
				</svg>
			}
		/>
	);
}
