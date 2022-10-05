import {
	BlockControls,
	InnerBlocks,
	InspectorAdvancedControls,
	useBlockProps,
	useInnerBlocksProps,
	useSetting,
	BlockContextProvider,
	__experimentalBlockPatternSetup as BlockPatternSetup,
} from '@wordpress/block-editor';

import {
	TextControl,
	Modal,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';

import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default function ( { attributes, setAttributes, clientId } ) {
	const { blockTypes, layout = {} } = attributes;

	const [ isPatternSelectionModalOpen, setIsPatternSelectionModalOpen ] =
		useState( false );

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( 'core/block-editor' ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	// @see https://github.com/WordPress/gutenberg/issues/43731#issuecomment-1237579857
	const layoutSettings = useSetting( 'layout' ) || {};
	const usedLayout = ! layout?.type
		? { ...layoutSettings, ...layout, type: 'constrained' }
		: { ...layoutSettings, ...layout };

	const blockProps = useBlockProps( {
		className: [
			'is-root-container',
			'is-layout-flow',
			'wp-block-post-content',
			'block-editor-block-list__layout',
		],
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		__experimentalLayout: usedLayout,
		renderAppender: hasInnerBlocks
			? InnerBlocks.DefaultBlockAppender
			: InnerBlocks.ButtonBlockAppender,
	} );

	return (
		<>
			{ blockTypes && (
				<BlockControls>
					<ToolbarGroup className="wp-block-template-part__block-control-group">
						<ToolbarButton
							onClick={ () =>
								setIsPatternSelectionModalOpen( true )
							}
						>
							{ __( 'Replace', 'unitone' ) }
						</ToolbarButton>
					</ToolbarGroup>
				</BlockControls>
			) }

			<InspectorAdvancedControls>
				<TextControl
					label={ __( 'Block types', 'unitone' ) }
					help={ __(
						'Enter a name for this area. The block patterns associated with this name will appear in the modal.',
						'unitone'
					) }
					value={ blockTypes }
					onChange={ ( newValue ) => {
						setAttributes( { blockTypes: newValue } );
					} }
				/>
			</InspectorAdvancedControls>

			<div { ...innerBlocksProps } />

			{ isPatternSelectionModalOpen && (
				<PatternSelectionModal
					clientId={ clientId }
					attributes={ attributes }
					setIsPatternSelectionModalOpen={
						setIsPatternSelectionModalOpen
					}
				/>
			) }
		</>
	);
}

function PatternSelectionModal( {
	clientId,
	attributes,
	setIsPatternSelectionModalOpen,
} ) {
	const { replaceInnerBlocks } = useDispatch( 'core/block-editor' );
	const onBlockPatternSelect = ( blocks ) => {
		replaceInnerBlocks(
			clientId,
			createBlocksFromInnerBlocksTemplate( blocks ),
			true
		);
	};

	const { blockTypes } = attributes;

	return (
		<Modal
			className="block-editor-query-pattern__selection-modal"
			title={ __( 'Choose a pattern' ) }
			closeLabel={ __( 'Cancel' ) }
			onRequestClose={ () => setIsPatternSelectionModalOpen( false ) }
		>
			<BlockContextProvider value={ {} }>
				<BlockPatternSetup
					blockName={ blockTypes }
					clientId={ clientId }
					onBlockPatternSelect={ onBlockPatternSelect }
				/>
			</BlockContextProvider>
		</Modal>
	);
}
