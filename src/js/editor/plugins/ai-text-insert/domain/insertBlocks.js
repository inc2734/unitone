import { createBlock } from '@wordpress/blocks';

import splitParagraphs from './splitParagraphs';

export const insertParagraphBlocks = ( {
	text,
	selectedBlock,
	selectedClientId,
	canInsertBlockType,
	getDefaultBlockName,
	getBlockIndex,
	getBlockRootClientId,
	insertBlocks,
	removeBlocks,
} ) => {
	const paragraphs = splitParagraphs( text );
	if ( paragraphs.length === 0 ) {
		return;
	}

	if ( ! selectedClientId ) {
		return;
	}

	const defaultBlockName =
		typeof getDefaultBlockName === 'function'
			? getDefaultBlockName()
			: 'core/paragraph';
	const fallbackBlockName =
		'default' === defaultBlockName ? 'core/paragraph' : defaultBlockName;
	const blockName = 'core/paragraph';
	const buildBlocks = ( name ) =>
		paragraphs.map( ( paragraph ) =>
			createBlock( name, { content: paragraph } )
		);

	let rootClientId = null;
	let index;

	const canInsertIntoSelected =
		!! selectedClientId &&
		typeof canInsertBlockType === 'function' &&
		canInsertBlockType( blockName, selectedClientId );

	const targetValue = selectedBlock?.attributes?.content;
	const isEmptyParagraph =
		selectedBlock?.name === 'core/paragraph' &&
		( ( 'string' === typeof targetValue &&
			targetValue.trim().length === 0 ) ||
			( targetValue &&
				'string' === typeof targetValue.text &&
				targetValue.text.length === 0 ) );

	if ( canInsertIntoSelected ) {
		rootClientId = selectedClientId;
		index = selectedBlock?.innerBlocks?.length ?? 0;
	} else {
		rootClientId = getBlockRootClientId( selectedClientId );
		index = getBlockIndex( selectedClientId, rootClientId ) + 1;

		if ( isEmptyParagraph ) {
			index = getBlockIndex( selectedClientId, rootClientId );
		}

		if ( Number.isNaN( index ) || index < 0 ) {
			index = undefined;
		}
	}

	const targetBlockName =
		typeof canInsertBlockType === 'function' &&
		! canInsertBlockType( blockName, rootClientId )
			? fallbackBlockName
			: blockName;

	const insertAttempt = ( name ) => {
		insertBlocks( buildBlocks( name ), index, rootClientId );
	};

	insertAttempt( targetBlockName );

	if ( isEmptyParagraph && typeof removeBlocks === 'function' ) {
		removeBlocks( [ selectedClientId ] );
	}
};
