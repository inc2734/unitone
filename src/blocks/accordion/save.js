import clsx from 'clsx';

import {
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import { ChevronDown, Cross } from './mark';

export default function ( { attributes } ) {
	const {
		summary,
		mark,
		q,
		qLabel,
		qWidth,
		a,
		aLabel,
		aWidth,
		borderColor,
		style,
	} = attributes;

	return (
		<details
			{ ...useBlockProps.save( {
				className: clsx( 'unitone-accordion', {
					[ `unitone-accordion--mark:cross` ]: 'cross' === mark,
				} ),
				style: {
					'--unitone--border-width': style?.border?.width,
					'--unitone--border-style': style?.border?.style,
					'--unitone--border-color': !! borderColor
						? `var(--wp--preset--color--${ borderColor })`
						: style?.border?.color,
				},
			} ) }
			data-wp-interactive='{ "namespace": "unitone/accordion" }'
		>
			<summary
				className="unitone-accordion__summary"
				data-wp-on--click="actions.toggle"
			>
				<span
					className="unitone-accordion__summary-inner"
					data-unitone-layout="with-sidebar -sidebar:right"
				>
					<span
						className="unitone-accordion__summary-content"
						data-unitone-layout="with-sidebar -sidebar:left"
						style={ {
							'--unitone--sidebar-width': qWidth || undefined,
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
						{ 'cross' === mark ? <Cross /> : <ChevronDown /> }
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
}
