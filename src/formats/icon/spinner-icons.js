const ring = ( { strokeWidth = 2 } ) =>
	`<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="${ strokeWidth }"
		stroke-linecap="round"
		role="img"
	>
		<circle cx="12" cy="12" r="9" fill="none" opacity=".25" />
		<circle cx="12" cy="12" r="9" stroke-dasharray="45 45" fill="none">
			<animateTransform
				attributeName="transform"
				type="rotate"
				values="0 12 12;360 12 12"
				dur="1s"
				repeatCount="indefinite"
			/>
		</circle>
	</svg>`;

const ringResize = ( { strokeWidth = 2 } ) =>
	`<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="${ strokeWidth }"
		stroke-linecap="round"
		role="img"
	>
		<g>
			<circle
				cx="12"
				cy="12"
				r="9"
				fill="none"
			>
				<animate
					attributeName="stroke-dasharray"
					calcMode="spline"
					dur="1.5s"
					keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" keyTimes="0;0.475;0.95;1" repeatCount="indefinite" values="0 150;42 150;42 150;42 150"
				/>
				<animate
					attributeName="stroke-dashoffset"
					calcMode="spline"
					dur="1.5s"
					keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
					keyTimes="0;0.475;0.95;1"
					repeatCount="indefinite"
					values="0;-16;-59;-59"
				/>
			</circle>
			<animateTransform
				attributeName="transform"
				dur="2s"
				repeatCount="indefinite"
				type="rotate"
				values="0 12 12;360 12 12"
			/>
		</g>
	</svg>`;

const twelveSpokes = ( { strokeWidth = 2 } ) =>
	`<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="${ strokeWidth }"
		stroke-linecap="round"
		role="img"
	>
		<g transform="translate(12,12)">
			<g transform="rotate(0)">
				<line x1="0" y1="-10" x2="0" y2="-7.5">
					<animate attributeName="opacity" values="1;0.2;1" dur="1s" begin="0s" repeatCount="indefinite"/>
				</line>
			</g>
			<g transform="rotate(30)">
				<line x1="0" y1="-10" x2="0" y2="-7.5">
					<animate attributeName="opacity" values="1;0.2;1" dur="1s" begin="0.083s" repeatCount="indefinite"/>
				</line>
			</g>
			<g transform="rotate(60)">
				<line x1="0" y1="-10" x2="0" y2="-7.5">
					<animate attributeName="opacity" values="1;0.2;1" dur="1s" begin="0.166s" repeatCount="indefinite"/>
				</line>
			</g>
			<g transform="rotate(90)">
				<line x1="0" y1="-10" x2="0" y2="-7.5">
					<animate attributeName="opacity" values="1;0.2;1" dur="1s" begin="0.249s" repeatCount="indefinite"/>
				</line>
			</g>
			<g transform="rotate(120)">
				<line x1="0" y1="-10" x2="0" y2="-7.5">
					<animate attributeName="opacity" values="1;0.2;1" dur="1s" begin="0.332s" repeatCount="indefinite"/>
				</line>
			</g>
			<g transform="rotate(150)">
				<line x1="0" y1="-10" x2="0" y2="-7.5">
					<animate attributeName="opacity" values="1;0.2;1" dur="1s" begin="0.415s" repeatCount="indefinite"/>
				</line>
			</g>
			<g transform="rotate(180)">
				<line x1="0" y1="-10" x2="0" y2="-7.5">
					<animate attributeName="opacity" values="1;0.2;1" dur="1s" begin="0.498s" repeatCount="indefinite"/>
				</line>
			</g>
			<g transform="rotate(210)">
				<line x1="0" y1="-10" x2="0" y2="-7.5">
					<animate attributeName="opacity" values="1;0.2;1" dur="1s" begin="0.581s" repeatCount="indefinite"/>
				</line>
			</g>
			<g transform="rotate(240)">
				<line x1="0" y1="-10" x2="0" y2="-7.5">
					<animate attributeName="opacity" values="1;0.2;1" dur="1s" begin="0.664s" repeatCount="indefinite"/>
				</line>
			</g>
			<g transform="rotate(270)">
				<line x1="0" y1="-10" x2="0" y2="-7.5">
					<animate attributeName="opacity" values="1;0.2;1" dur="1s" begin="0.747s" repeatCount="indefinite"/>
				</line>
			</g>
			<g transform="rotate(300)">
				<line x1="0" y1="-10" x2="0" y2="-7.5">
					<animate attributeName="opacity" values="1;0.2;1" dur="1s" begin="0.83s" repeatCount="indefinite"/>
				</line>
			</g>
			<g transform="rotate(330)">
				<line x1="0" y1="-10" x2="0" y2="-7.5">
					<animate attributeName="opacity" values="1;0.2;1" dur="1s" begin="0.913s" repeatCount="indefinite"/>
				</line>
			</g>
		</g>
	</svg>`;

const barPulse = ( { strokeWidth = 2 } ) =>
	`<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="${ strokeWidth }"
		stroke-linecap="round"
		role="img"
	>
		<line x1="4" y1="12" x2="4" y2="12" visibility="hidden">
			<set attributeName="visibility" to="visible" begin="0s;leftReset.end+.5s"/>

			<animate id="leftGrow" attributeName="x2" values="4;20" dur="0.5s" begin="0s;leftReset.end+.5s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.5, 1, 0.89, 1"/>

			<animate id="leftShrink" attributeName="x1" values="4;20" dur="0.5s" begin="leftGrow.end-.05s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.5, 1, 0.89, 1"/>

			<set attributeName="visibility" to="hidden" begin="leftShrink.end-.05s"/>
			<animate attributeName="x1" values="20;4" dur=".001s" begin="leftShrink.end" fill="freeze" id="leftReset" />
			<animate attributeName="x2" values="20;4" dur=".001s" begin="leftShrink.end" fill="freeze"/>
		</line>
	</svg>`;

export default [
	{
		name: 'spinner-ring',
		svg: ring,
	},
	{
		name: 'spinner-ring-resize',
		svg: ringResize,
	},
	{
		name: 'spinner-twelve-spokes',
		svg: twelveSpokes,
	},
	{
		name: 'spinner-bar-pulse',
		svg: barPulse,
	},
];
