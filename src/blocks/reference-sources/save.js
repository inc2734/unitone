import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { hasInnerBlocks } = attributes;

	if ( ! hasInnerBlocks ) {
		return null;
	}

	const blockProps = useBlockProps.save( {
		className: 'unitone-reference-sources',
	} );

	const innerBlocksProps = useInnerBlocksProps.save( {
		className: 'unitone-reference-sources__list',
	} );

	return (
		<div { ...blockProps }>
			<ul { ...innerBlocksProps } />
		</div>
	);
}
