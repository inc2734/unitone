import classnames from 'classnames';

import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

export default function () {
	const blockProps = useBlockProps();
	blockProps[ 'data-unitone-layout' ] = classnames(
		'both-sides',
		blockProps[ 'data-unitone-layout' ]
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		orientation: 'horizontal',
		templateLock: false,
		renderAppender: InnerBlocks.ButtonBlockAppender,
	} );

	return <div { ...innerBlocksProps } />;
}
