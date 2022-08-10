import {
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { summary } = attributes;

	return (
		<details
			{ ...useBlockProps.save( { className: 'unitone-accordion' } ) }
		>
			<summary className="unitone-accordion__summary">
				<RichText.Content value={ summary } />
				<div className="unitone-accordion__icon">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24.71 13.06"
					>
						<polyline
							points="24.35 .35 12.35 12.35 .35 .35"
							fill="none"
							stroke="currentColor"
							strokeWidth="2px"
							strokeLinecap="round"
						/>
					</svg>
				</div>
			</summary>

			<div
				{ ...useInnerBlocksProps.save( {
					className: 'unitone-accordion__content',
				} ) }
			/>
		</details>
	);
}
