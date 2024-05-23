import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

export default function ( { attributes, setAttributes, clientId, context } ) {
	const { tagName, verticalAlignment, templateLock } = attributes;

	useEffect( () => {
		setAttributes( {
			tagName: [ 'ul', 'ol' ].includes(
				context[ 'unitone/flex-divided/tagName' ]
			)
				? 'li'
				: 'div',
		} );
	}, [ context[ 'unitone/flex-divided/tagName' ] ] );

	useEffect(
		() =>
			setAttributes( {
				verticalAlignment:
					context[ 'unitone/flex-divided/verticalAlignment' ],
			} ),
		[ context[ 'unitone/flex-divided/verticalAlignment' ] ]
	);

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		className: 'unitone-flex__content',
		style: {
			'--unitone--align-items': verticalAlignment,
		},
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'unitone-flex__content__content',
		},
		{
			templateLock,
			renderAppender: hasInnerBlocks
				? InnerBlocks.DefaultBlockAppender
				: InnerBlocks.ButtonBlockAppender,
		}
	);

	const TagName = tagName;

	return (
		<TagName { ...blockProps }>
			<div { ...innerBlocksProps } />
		</TagName>
	);
}
