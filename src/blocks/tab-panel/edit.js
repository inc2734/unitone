import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

export default function ( {
	attributes,
	setAttributes,
	isSelected,
	clientId,
} ) {
	const { ariaHidden, templateLock } = attributes;

	const { updateBlockAttributes } = useDispatch( blockEditorStore );

	const { getBlockParents, getBlocks } = useSelect( blockEditorStore );
	const parentClientId = getBlockParents( clientId )?.[ 0 ];
	const tabPanels =
		( !! parentClientId && getBlocks( parentClientId ) ) || [];

	useEffect( () => {
		setAttributes( { clientId } );
	}, [ clientId ] );

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
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock,
		template: [
			[ 'unitone/text', { unitone: { maxWidth: '100%', gap: '-1' } } ],
		],
		renderAppender: hasInnerBlocks
			? undefined
			: InnerBlocks.ButtonBlockAppender,
	} );

	return <div { ...innerBlocksProps } />;
}
