import clsx from 'clsx';

import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

export default function ( { attributes, setAttributes, clientId, context } ) {
	const { tagName, templateLock } = attributes;

	useEffect( () => {
		setAttributes( {
			tagName: [ 'ul', 'ol' ].includes(
				context[ 'unitone/cluster-divided/tagName' ]
			)
				? 'li'
				: 'div',
		} );
	}, [ context ] );

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const blockProps = useBlockProps();
	blockProps[ 'data-unitone-layout' ] = clsx(
		'cluster__content',
		blockProps[ 'data-unitone-layout' ]
	);

	const innerBlocksProps = useInnerBlocksProps(
		{
			'data-unitone-layout': 'cluster__content__content',
		},
		{
			templateLock,
			renderAppender: hasInnerBlocks
				? undefined
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
