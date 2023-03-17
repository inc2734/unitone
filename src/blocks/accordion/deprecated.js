import classnames from 'classnames';

import {
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import metadata from './block.json';

export default [
	{
		attributes: {
			...metadata.attributes,
		},

		supports: {
			...metadata.supports,
		},

		save( { attributes } ) {
			const { summary, q, qLabel, qWidth, a, aLabel, aWidth } =
				attributes;

			return (
				<details
					{ ...useBlockProps.save( {
						className: 'unitone-accordion',
						'data-unitone-layout': classnames( {
							[ `-padding:${ attributes?.unitone?.padding }` ]:
								null != attributes?.unitone?.padding,
						} ),
					} ) }
				>
					<summary className="unitone-accordion__summary">
						<span
							className="unitone-accordion__summary-inner"
							data-unitone-layout="with-sidebar -sidebar:right"
						>
							<span
								className="unitone-accordion__summary-content"
								data-unitone-layout="with-sidebar -sidebar:left"
								style={ {
									'--unitone--sidebar-width':
										qWidth || undefined,
								} }
							>
								{ q && (
									<span className="unitone-accordion__q">
										<RichText.Content
											className="unitone-accordion__q-text"
											tagName="span"
											value={ qLabel }
										/>
									</span>
								) }

								<RichText.Content
									className="unitone-accordion__summary-text"
									tagName="span"
									value={ summary }
								/>
							</span>

							<span className="unitone-accordion__icon">
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
							</span>
						</span>
					</summary>

					<div
						className="unitone-accordion__content"
						data-unitone-layout="with-sidebar -sidebar:left"
						style={ {
							'--unitone--sidebar-width': aWidth || undefined,
						} }
					>
						{ a && (
							<div className="unitone-accordion__a">
								<RichText.Content
									className="unitone-accordion__a-text"
									tagName="span"
									value={ aLabel }
								/>
							</div>
						) }

						<div
							{ ...useInnerBlocksProps.save( {
								className: 'unitone-accordion__detail',
							} ) }
						/>
					</div>
				</details>
			);
		},
	},
	{
		attributes: {
			...metadata.attributes,
			summary: {
				type: 'string',
			},
		},

		supports: {
			...metadata.supports,
		},

		save( { attributes } ) {
			const { summary } = attributes;

			return (
				<details
					{ ...useBlockProps.save( {
						className: 'unitone-accordion',
					} ) }
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
		},
	},
];
