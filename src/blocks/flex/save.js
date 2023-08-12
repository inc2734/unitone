import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { tagName } = attributes;

	const TagName = tagName;

	const blockProps = useBlockProps.save( {
		className: 'unitone-flex',
	} );

	return (
		<TagName
			{ ...useInnerBlocksProps.save( {
				...blockProps,
			} ) }
		/>
	);
}
