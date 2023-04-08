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
						y1="19"
						x2="25"
						y2="19"
						stroke="#AAAAAA"
						strokeWidth="2"
					/>
					<line x1="5" y1="14.5" x2="17" y2="14.5" stroke="#AAAAAA" />
					<line
						x1="5"
						y1="26"
						x2="43"
						y2="26"
						stroke="#AAAAAA"
						strokeWidth="2"
					/>
					<line
						x1="5"
						y1="30"
						x2="43"
						y2="30"
						stroke="#AAAAAA"
						strokeWidth="2"
					/>
					<line
						x1="5"
						y1="34"
						x2="43"
						y2="34"
						stroke="#AAAAAA"
						strokeWidth="2"
					/>
				</svg>
			}
		/>
	);
}
