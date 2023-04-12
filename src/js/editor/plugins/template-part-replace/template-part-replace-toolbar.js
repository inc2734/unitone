/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/block-library/src/template-part/edit/index.js
 */

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import {
	store as blockEditorStore,
	BlockControls,
} from '@wordpress/block-editor';
import { Modal, ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import TemplatePartSelectionModal from './selection-modal';
import { createTemplatePartId } from './utils/create-template-part-id';
import {
	useAlternativeBlockPatterns,
	useAlternativeTemplateParts,
	useTemplatePartArea,
} from './utils/hooks';

export const TemplatePartReplaceToolbar = ( props ) => {
	const { attributes, setAttributes, clientId, isSelected } = props;

	const { slug, theme } = attributes;
	const templatePartId = createTemplatePartId( theme, slug );
	const [ isTemplatePartSelectionOpen, setIsTemplatePartSelectionOpen ] =
		useState( false );

	// Set the postId block attribute if it did not exist,
	// but wait until the inner blocks have loaded to allow
	// new edits to trigger this.
	const { isResolved, isMissing, area } = useSelect(
		( select ) => {
			const { getEditedEntityRecord, hasFinishedResolution } =
				select( coreStore );
			const { getBlocks } = select( blockEditorStore );

			const getEntityArgs = [
				'postType',
				'wp_template_part',
				templatePartId,
			];
			const entityRecord = templatePartId
				? getEditedEntityRecord( ...getEntityArgs )
				: null;
			const _area = entityRecord?.area || attributes.area;
			const hasResolvedEntity = templatePartId
				? hasFinishedResolution(
						'getEditedEntityRecord',
						getEntityArgs
				  )
				: false;

			return {
				innerBlocks: getBlocks( clientId ),
				isResolved: hasResolvedEntity,
				isMissing: hasResolvedEntity && isEmpty( entityRecord ),
				area: _area,
			};
		},
		[ templatePartId, clientId ]
	);
	const { templateParts } = useAlternativeTemplateParts(
		area,
		templatePartId
	);
	const blockPatterns = useAlternativeBlockPatterns( area, clientId );
	const hasReplacements = !! templateParts.length || !! blockPatterns.length;
	const areaObject = useTemplatePartArea( area );
	const isPlaceholder = ! slug;
	const isEntityAvailable = ! isPlaceholder && ! isMissing && isResolved;

	// The `isSelected` check ensures the `BlockSettingsMenuControls` fill
	// doesn't render multiple times. The block controls has similar internal check.
	const canReplace = isSelected && isEntityAvailable && hasReplacements;

	return (
		<>
			{ canReplace && (
				<BlockControls>
					<ToolbarGroup className="wp-block-template-part__block-control-group">
						<ToolbarButton
							onClick={ () => {
								setIsTemplatePartSelectionOpen( true );
							} }
						>
							{ __( 'Replace', 'unitone' ) }
						</ToolbarButton>
					</ToolbarGroup>
				</BlockControls>
			) }

			{ isTemplatePartSelectionOpen && (
				<Modal
					overlayClassName="block-editor-template-part__selection-modal"
					title={ sprintf(
						// Translators: %s as template part area title ("Header", "Footer", etc.).
						__( 'Choose a %s' ),
						areaObject.label.toLowerCase()
					) }
					closeLabel={ __( 'Cancel' ) }
					onRequestClose={ () =>
						setIsTemplatePartSelectionOpen( false )
					}
				>
					<TemplatePartSelectionModal
						templatePartId={ templatePartId }
						clientId={ clientId }
						area={ area }
						setAttributes={ setAttributes }
						onClose={ () =>
							setIsTemplatePartSelectionOpen( false )
						}
					/>
				</Modal>
			) }
		</>
	);
};
