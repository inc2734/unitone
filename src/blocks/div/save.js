import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function () {
	const blockProps = useBlockProps.save( {
		className: 'unitone-div',
	} );

	return (
		<div
			{ ...useInnerBlocksProps.save( {
				...blockProps,
			} ) }
		/>
	);
}
