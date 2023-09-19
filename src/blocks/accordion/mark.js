export function ChevronDown( { width, height } ) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24.71 13.06"
			width={ width }
			height={ height }
		>
			<polyline
				points="24.35 .35 12.35 12.35 .35 .35"
				fill="none"
				stroke="currentColor"
				strokeWidth="2px"
				strokeLinecap="round"
			/>
		</svg>
	);
}

export function Cross( { width, height } ) {
	return (
		<svg
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
			width={ width }
			height={ height }
		>
			<line
				y1="10"
				x2="20"
				y2="10"
				stroke="currentColor"
				strokeWidth="2"
			/>
			<line
				x1="10"
				x2="10"
				y2="20"
				stroke="currentColor"
				strokeWidth="2"
			/>
		</svg>
	);
}
