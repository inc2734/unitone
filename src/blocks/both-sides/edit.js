import classnames from 'classnames';

import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';

const MAX_CHILDREN_COUNT = 2;

export default function ( { clientId } ) {
	const { getBlockOrder } = useSelect( ( select ) => select( editorStore ) );

	const isMax = MAX_CHILDREN_COUNT <= getBlockOrder( clientId ).length;

	const blockProps = useBlockProps();
	blockProps[ 'data-unitone-layout' ] = classnames(
		'both-sides',
		blockProps[ 'data-unitone-layout' ]
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		orientation: 'horizontal',
		templateLock: isMax ? 'insert' : undefined,
		renderAppender: ! isMax ? InnerBlocks.ButtonBlockAppender : false,
	} );

	return <div { ...innerBlocksProps } />;
}
