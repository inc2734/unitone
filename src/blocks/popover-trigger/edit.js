import {
	ButtonBlockAppender,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import { useSelect } from '@wordpress/data';
import { memo, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';

const MemoizedButtonBlockAppender = memo( ButtonBlockAppender );

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
			'data-unitone-layout': 'popover-trigger',
		} ),
		{
			allowedBlocks: metadata.allowedBlocks,
			templateLock,
			template: [
				[
					'core/buttons',
					{},
					[
						[
							'core/button',
							{
								text: __( 'Open popover', 'unitone' ),
								tagName: 'button',
							},
						],
					],
				],
			],
			renderAppender: hasInnerBlocks ? undefined : renderAppender,
		}
	);

	return <div { ...innerBlocksProps } />;
}
