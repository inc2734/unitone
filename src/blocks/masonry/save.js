import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { columnWidth, childrenBorder } = attributes;

	const blockProps = useBlockProps.save( {
		style: {
			'--unitone--column-width': columnWidth || undefined,
			'--unitone--children--border-radius':
				null != childrenBorder?.radius &&
				'object' !== typeof childrenBorder?.radius
					? childrenBorder?.radius
					: undefined,
			'--unitone--children--border-top-left-radius':
				childrenBorder?.radius?.topLeft,
			'--unitone--children--border-top-right-radius':
				childrenBorder?.radius?.topRight,
			'--unitone--children--border-bottom-left-radius':
				childrenBorder?.radius?.bottomLeft,
			'--unitone--children--border-bottom-right-radius':
				childrenBorder?.radius?.bottomRight,
		},
		'data-unitone-layout': 'masonry',
	} );

	return <div { ...useInnerBlocksProps.save( { ...blockProps } ) } />;
}
