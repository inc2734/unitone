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
						height="22"
						transform="matrix(1 0 0 -1 0 31)"
						fill="#DDDDDD"
					/>
					<line
						y1="-1"
						x2="22"
						y2="-1"
						transform="matrix(1 0 0 -1 23 37)"
						stroke="#AAAAAA"
						strokeWidth="2"
					/>
					<line
						y1="-1"
						x2="18"
						y2="-1"
						transform="matrix(1 0 0 -1 23 33)"
						stroke="#AAAAAA"
						strokeWidth="2"
					/>
					<line
						y1="-1"
						x2="16"
						y2="-1"
						transform="matrix(1 0 0 -1 23 29)"
						stroke="#AAAAAA"
						strokeWidth="2"
					/>
					<line
						y1="-1"
						x2="20"
						y2="-1"
						transform="matrix(1 0 0 -1 23 25)"
						stroke="#AAAAAA"
						strokeWidth="2"
					/>
				</svg>
			}
		/>
	);
}
