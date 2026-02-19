import {
	ButtonBlockAppender,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, memo, useCallback } from '@wordpress/element';
import clsx from 'clsx';

import { compacting as compactPadding } from '../../js/editor/hooks/dimensions/padding';
import { isObject } from '../../js/editor/hooks/utils';

const MemoizedButtonBlockAppender = memo( ButtonBlockAppender );

export default function ( { attributes, isSelected, clientId, context } ) {
	const { ariaHidden, templateLock } = attributes;

	const tabPanelPadding = context?.[ 'unitone/tabPanelPadding' ];

	const compactedTabPanelPadding = compactPadding( tabPanelPadding );

	const { updateBlockAttributes } = useDispatch( blockEditorStore );

	const { getBlockParents, getBlocks } = useSelect( blockEditorStore );
	const parentClientId = getBlockParents( clientId )?.[ 0 ];
	const tabPanels =
		( !! parentClientId && getBlocks( parentClientId ) ) || [];

	useEffect( () => {
		if ( isSelected ) {
			tabPanels.forEach( ( tabPanel ) => {
				updateBlockAttributes( tabPanel.clientId, {
					ariaHidden: tabPanel.clientId !== clientId,
				} );
			} );
		}
	}, [ isSelected ] );

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		role: 'tabpanel',
		className: 'unitone-tab-panel',
		'aria-hidden': ariaHidden ? 'true' : 'false',
		'data-unitone-layout': clsx( {
			[ `-padding:${ compactedTabPanelPadding }` ]:
				null != compactedTabPanelPadding &&
				! isObject( compactedTabPanelPadding ),
			[ `-padding-top:${ compactedTabPanelPadding?.top }` ]:
				null != compactedTabPanelPadding?.top,
			[ `-padding-right:${ compactedTabPanelPadding?.right }` ]:
				null != compactedTabPanelPadding?.right,
			[ `-padding-bottom:${ compactedTabPanelPadding?.bottom }` ]:
				null != compactedTabPanelPadding?.bottom,
			[ `-padding-left:${ compactedTabPanelPadding?.left }` ]:
				null != compactedTabPanelPadding?.left,
		} ),
	} );

	const renderAppender = useCallback(
		() => <MemoizedButtonBlockAppender rootClientId={ clientId } />,
		[ clientId ]
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock,
		template: [
			[ 'unitone/text', { unitone: { maxWidth: '100%', gap: '-1' } } ],
		],
		renderAppender: hasInnerBlocks ? undefined : renderAppender,
	} );

	return <div { ...innerBlocksProps } />;
}
