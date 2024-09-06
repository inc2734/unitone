import clsx from 'clsx';

import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import { useSelect } from '@wordpress/data';

export default function ( { attributes, clientId } ) {
	const { templateLock } = attributes;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const blockProps = useBlockProps();
	blockProps[ 'data-unitone-layout' ] = clsx(
		'cluster',
		blockProps[ 'data-unitone-layout' ]
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		orientation: 'horizontal',
		templateLock,
		renderAppender: hasInnerBlocks
			? undefined
			: InnerBlocks.ButtonBlockAppender,
	} );

	return <div { ...innerBlocksProps } />;
}
