import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function () {
	const blockProps = useBlockProps.save( {
		className: 'unitone-reference-sources',
	} );

	const innerBlocksProps = useInnerBlocksProps.save( {
		className: 'unitone-reference-sources__inner',
	} );

	return (
		<div { ...blockProps }>
			<ul { ...innerBlocksProps } />
		</div>
	);
}
