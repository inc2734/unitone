import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import metadata from './block.json';
import { DIALOG_CONTENT_TEMPLATE } from './variations';

export default function ( { attributes } ) {
	const { templateLock } = attributes;

	const blockProps = useBlockProps();
	blockProps[ 'data-unitone-layout' ] = clsx(
		'dialog',
		blockProps[ 'data-unitone-layout' ]
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: metadata.allowedBlocks,
		templateLock,
		template: DIALOG_CONTENT_TEMPLATE,
		renderAppender: false,
	} );

	return <div { ...innerBlocksProps } />;
}
