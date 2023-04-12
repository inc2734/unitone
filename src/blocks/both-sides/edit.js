import classnames from 'classnames';

import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import { useSelect } from '@wordpress/data';

const MAX_CHILDREN_COUNT = 2;

export default function ( { clientId } ) {
	const { getBlockOrder } = useSelect( ( select ) =>
		select( blockEditorStore )
	);

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
