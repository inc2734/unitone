import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

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
			const { dotColor, customDotColor } = attributes;

			const blockProps = useBlockProps.save( {
				className: 'unitone-timeline-dots-row',
				style: {
					'--unitone--dot-color': !! dotColor
						? `var(--wp--preset--color--${ dotColor } )`
						: customDotColor,
				},
			} );

			const innerBlocksProps = useInnerBlocksProps.save( {
				className: 'unitone-timeline-dots-row__columns',
			} );

			return (
				<div { ...blockProps }>
					<div className="unitone-timeline-dots-row__dot" />
					<div { ...innerBlocksProps } />
				</div>
			);
		},
	},
];
