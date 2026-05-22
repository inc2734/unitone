import {
	ButtonBlockAppender,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import { useSelect } from '@wordpress/data';
import { memo, useCallback } from '@wordpress/element';

const MemoizedButtonBlockAppender = memo( ButtonBlockAppender );

const TEMPLATE = [ [ 'core/paragraph' ] ];

export default function ( { attributes, clientId } ) {
	const { templateLock } = attributes;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const renderAppender = useCallback(
		() => <MemoizedButtonBlockAppender rootClientId={ clientId } />,
		[ clientId ]
	);

	const innerBlocksProps = useInnerBlocksProps(
		useBlockProps( {
			'data-unitone-layout': 'popover-dialog',
		} ),
		{
			templateLock,
			template: TEMPLATE,
			renderAppender: hasInnerBlocks ? undefined : renderAppender,
		}
	);

	return <div { ...innerBlocksProps } />;
}
