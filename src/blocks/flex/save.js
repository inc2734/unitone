import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { tagName, revert } = attributes;

	const TagName = tagName;

	const blockProps = useBlockProps.save( {
		className: 'unitone-flex',
		'data-unitone-layout': {
			'-revert': revert,
		},
	} );

	return (
		<TagName
			{ ...useInnerBlocksProps.save( {
				...blockProps,
			} ) }
		/>
	);
}
