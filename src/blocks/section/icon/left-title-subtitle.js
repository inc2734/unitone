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
					<line
						x1="5"
						y1="18"
						x2="25"
						y2="18"
						stroke="#AAAAAA"
						strokeWidth="2"
					/>
					<line x1="5" y1="13.5" x2="17" y2="13.5" stroke="#AAAAAA" />
					<line
						x1="5"
						y1="25"
						x2="43"
						y2="25"
						stroke="#AAAAAA"
						strokeWidth="2"
					/>
					<line
						x1="5"
						y1="29"
						x2="43"
						y2="29"
						stroke="#AAAAAA"
						strokeWidth="2"
					/>
					<line
						x1="5"
						y1="33"
						x2="43"
						y2="33"
						stroke="#AAAAAA"
						strokeWidth="2"
					/>
				</svg>
			}
		/>
	);
}
