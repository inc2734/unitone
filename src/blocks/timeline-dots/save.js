import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const {
		rows,
		columnLayout,
		dotSize,
		lineWidth,
		dotColor,
		customDotColor,
		lineColor,
		customLineColor,
	} = attributes;

	return (
		<div
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					className: clsx( 'unitone-timeline-dots', {
						[ `unitone-timeline-dots--column-layout:${ columnLayout }` ]:
							!! columnLayout,
					} ),
					style: {
						'--unitone--timeline-dots-rows': rows,
						'--unitone--dot-size': dotSize || undefined,
						'--unitone--line-width': lineWidth || undefined,
						'--unitone--dot-color': !! dotColor
							? `var(--wp--preset--color--${ dotColor })`
							: customDotColor,
						'--unitone--line-color': !! lineColor
							? `var(--wp--preset--color--${ lineColor })`
							: customLineColor,
					},
				} )
			) }
		/>
	);
}
