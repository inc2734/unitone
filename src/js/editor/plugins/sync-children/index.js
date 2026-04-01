import {
	BlockControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import { store as blocksStore, hasBlockSupport } from '@wordpress/blocks';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { batch, dispatch, select, subscribe } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';
import { update } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../../hooks/utils';

const SUPPORT_KEY = 'unitone.syncChildren';
const EXCLUDED_SYNC_ATTRIBUTE_KEYS = new Set( [
	'__unstableUnitoneSupports',
	'__unitoneStates',
	'__unstableUnitoneBlockOutline',
	'anchor',
] );

const hasOwn = ( object, key ) =>
	Object.prototype.hasOwnProperty.call( object, key );

const isObjectLike = ( value ) => null !== value && 'object' === typeof value;

const normalizedObjectEntries = ( object ) =>
	Object.entries( object ).filter( ( [ , value ] ) => undefined !== value );

const isEqual = ( a, b ) => {
	if ( Object.is( a, b ) ) {
		return true;
	}

	if ( ! isObjectLike( a ) || ! isObjectLike( b ) ) {
		return false;
	}

	const isArrayA = Array.isArray( a );
	const isArrayB = Array.isArray( b );
	if ( isArrayA !== isArrayB ) {
		return false;
	}

	if ( isArrayA && isArrayB ) {
		if ( a.length !== b.length ) {
			return false;
		}

		for ( let i = 0; i < a.length; i++ ) {
			if ( ! isEqual( a[ i ], b[ i ] ) ) {
				return false;
			}
		}
		return true;
	}

	const entriesA = normalizedObjectEntries( a );
	const entriesB = normalizedObjectEntries( b );
	if ( entriesA.length !== entriesB.length ) {
		return false;
	}

	for ( const [ key, valueA ] of entriesA ) {
		if ( ! hasOwn( b, key ) || undefined === b[ key ] ) {
			return false;
		}

		if ( ! isEqual( valueA, b[ key ] ) ) {
			return false;
		}
	}

	return true;
};

const getSyncAttributeChanges = (
	blockName,
	previousAttributes,
	attributes
) => {
	const prevAttrs = previousAttributes || {};
	const currentAttrs = attributes || {};
	const changedKeys = [];
	const contentAttributeKeys = getContentAttributeKeys( blockName );

	const keys = new Set( [
		...Object.keys( prevAttrs ),
		...Object.keys( currentAttrs ),
	] );

	keys.forEach( ( key ) => {
		if ( EXCLUDED_SYNC_ATTRIBUTE_KEYS.has( key ) ) {
			return;
		}

		if ( contentAttributeKeys.has( key ) ) {
			return;
		}

		if ( ! isEqual( prevAttrs[ key ], currentAttrs[ key ] ) ) {
			changedKeys.push( key );
		}
	} );

	return changedKeys;
};

const contentAttributeKeysCache = new Map();

const getContentAttributeKeys = ( name ) => {
	if ( contentAttributeKeysCache.has( name ) ) {
		return contentAttributeKeysCache.get( name );
	}

	const blockType = select( blocksStore ).getBlockType( name );
	if ( ! blockType?.attributes ) {
		const emptySet = new Set();
		contentAttributeKeysCache.set( name, emptySet );
		return emptySet;
	}

	const contentAttributeKeys = new Set(
		Object.entries( blockType.attributes )
			.filter( ( [ , settings ] ) => 'content' === settings?.role )
			.map( ( [ attributeKey ] ) => attributeKey )
	);
	contentAttributeKeysCache.set( name, contentAttributeKeys );
	return contentAttributeKeys;
};

const mergeTemplateAttributes = ( {
	sourceAttributes = {},
	targetAttributes = {},
	blockName,
} ) => {
	const contentAttributeKeys = getContentAttributeKeys( blockName );
	const mergedAttributes = { ...targetAttributes };
	let isChanged = false;

	const keys = new Set( [
		...Object.keys( sourceAttributes ),
		...Object.keys( targetAttributes ),
	] );

	keys.forEach( ( key ) => {
		if ( EXCLUDED_SYNC_ATTRIBUTE_KEYS.has( key ) ) {
			return;
		}

		if ( contentAttributeKeys.has( key ) ) {
			return;
		}

		const nextValue = hasOwn( sourceAttributes, key )
			? sourceAttributes[ key ]
			: undefined;

		if ( ! isEqual( mergedAttributes[ key ], nextValue ) ) {
			mergedAttributes[ key ] = nextValue;
			isChanged = true;
		}
	} );

	if ( ! isChanged ) {
		return null;
	}

	if ( hasOwn( mergedAttributes, 'unitone' ) ) {
		mergedAttributes.unitone = cleanEmptyObject( mergedAttributes.unitone );
	}

	return mergedAttributes;
};

const isSyncEnabledParent = ( block ) =>
	hasBlockSupport( block?.name, SUPPORT_KEY ) &&
	!! block?.attributes?.unitone?.syncChildren;

const findTargetByPath = ( rootBlock, pathSteps ) => {
	let currentBlock = rootBlock;

	for ( const step of pathSteps ) {
		const sameNameBlocks =
			currentBlock.innerBlocks?.filter(
				( siblingBlock ) => siblingBlock.name === step.name
			) ?? [];
		const nextBlock = sameNameBlocks?.[ step.sameNameIndex ];
		if ( ! nextBlock || nextBlock.name !== step.name ) {
			return null;
		}
		currentBlock = nextBlock;
	}

	return currentBlock;
};

const withSyncChildrenToolbar = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { name, attributes, setAttributes, isSelected } = props;

		const canDisplay = isSelected && hasBlockSupport( name, SUPPORT_KEY );
		const isSyncing = !! attributes?.unitone?.syncChildren;

		return (
			<>
				{ canDisplay && (
					<BlockControls group="parent">
						<ToolbarGroup>
							<ToolbarButton
								label={ __(
									"Sync children's settings",
									'unitone'
								) }
								icon={ update }
								isPressed={ isSyncing }
								onClick={ () => {
									setAttributes( {
										unitone: cleanEmptyObject( {
											...attributes?.unitone,
											syncChildren:
												! isSyncing || undefined,
										} ),
									} );
								} }
							/>
						</ToolbarGroup>
					</BlockControls>
				) }

				<BlockEdit { ...props } />
			</>
		);
	};
}, 'withSyncChildrenToolbar' );

addFilter(
	'editor.BlockEdit',
	'unitone/with-sync-children-toolbar',
	withSyncChildrenToolbar
);

const blockEditorSelector = select( blockEditorStore );
const { updateBlockAttributes } = dispatch( blockEditorStore );

let previousSelectedClientId = null;
let previousSelectedAttributes = null;
let previousSelectedSyncContext = null;
let isApplyingSync = false;

const updateSelectedBaseline = (
	selectedClientId,
	selectedAttributes,
	selectedSyncContext = previousSelectedSyncContext
) => {
	previousSelectedClientId = selectedClientId;
	previousSelectedAttributes = selectedAttributes;
	previousSelectedSyncContext = selectedSyncContext;
};

const resetSelectedBaseline = () => {
	previousSelectedClientId = null;
	previousSelectedAttributes = null;
	previousSelectedSyncContext = null;
};

const getChildPositionInParent = ( parentBlock, childClientId, childName ) => {
	const childIndex =
		parentBlock?.innerBlocks?.findIndex(
			( innerBlock ) => innerBlock.clientId === childClientId
		) ?? -1;
	if ( 0 > childIndex ) {
		return null;
	}

	const sameNameIndex =
		parentBlock.innerBlocks
			.slice( 0, childIndex + 1 )
			.filter( ( siblingBlock ) => siblingBlock.name === childName )
			.length - 1;

	return {
		childIndex,
		sameNameIndex,
	};
};

const resolveSyncContextFromSelected = ( selectedClientId ) => {
	const steps = [];
	let currentClientId = selectedClientId;

	while ( true ) {
		const currentBlock = blockEditorSelector.getBlock( currentClientId );
		if ( ! currentBlock ) {
			return null;
		}

		const parentClientId =
			blockEditorSelector.getBlockRootClientId( currentClientId );
		if ( ! parentClientId ) {
			return null;
		}

		const parentBlock = blockEditorSelector.getBlock( parentClientId );
		if ( ! parentBlock ) {
			return null;
		}

		if ( isSyncEnabledParent( parentBlock ) ) {
			return {
				syncParentClientId: parentClientId,
				sourceRootClientId: currentClientId,
				steps: steps.reverse(),
			};
		}

		const childPosition = getChildPositionInParent(
			parentBlock,
			currentClientId,
			currentBlock.name
		);
		if ( ! childPosition ) {
			return null;
		}

		steps.push( {
			index: childPosition.childIndex,
			name: currentBlock.name,
			sameNameIndex: childPosition.sameNameIndex,
		} );

		currentClientId = parentClientId;
	}
};

subscribe( () => {
	const selectedClientId = blockEditorSelector.getSelectedBlockClientId();
	if ( ! selectedClientId ) {
		resetSelectedBaseline();
		return;
	}

	const selectedBlock = blockEditorSelector.getBlock( selectedClientId );
	if ( ! selectedBlock ) {
		resetSelectedBaseline();
		return;
	}

	if ( isApplyingSync ) {
		updateSelectedBaseline( selectedClientId, selectedBlock.attributes );
		return;
	}

	if ( selectedClientId !== previousSelectedClientId ) {
		updateSelectedBaseline(
			selectedClientId,
			selectedBlock.attributes,
			resolveSyncContextFromSelected( selectedClientId )
		);
		return;
	}

	if ( selectedBlock.attributes === previousSelectedAttributes ) {
		return;
	}

	const changedKeys = getSyncAttributeChanges(
		selectedBlock.name,
		previousSelectedAttributes,
		selectedBlock.attributes
	);

	updateSelectedBaseline( selectedClientId, selectedBlock.attributes );

	if ( 0 === changedKeys.length ) {
		return;
	}

	const syncContext = previousSelectedSyncContext;
	if ( ! syncContext ) {
		return;
	}

	const sourceRoot = blockEditorSelector.getBlock(
		syncContext.sourceRootClientId
	);
	const syncParent = blockEditorSelector.getBlock(
		syncContext.syncParentClientId
	);
	if ( ! sourceRoot || ! syncParent ) {
		return;
	}

	const updates = new Map();

	syncParent.innerBlocks.forEach( ( siblingRoot ) => {
		if ( sourceRoot.clientId === siblingRoot.clientId ) {
			return;
		}

		if ( sourceRoot.name !== siblingRoot.name ) {
			return;
		}

		const targetBlock = findTargetByPath( siblingRoot, syncContext.steps );
		if ( ! targetBlock || targetBlock.name !== selectedBlock.name ) {
			return;
		}

		const mergedAttributes = mergeTemplateAttributes( {
			sourceAttributes: selectedBlock.attributes,
			targetAttributes: targetBlock.attributes,
			blockName: selectedBlock.name,
		} );

		if ( mergedAttributes ) {
			updates.set( targetBlock.clientId, mergedAttributes );
		}
	} );

	if ( 0 === updates.size ) {
		return;
	}

	isApplyingSync = true;
	try {
		if ( 'function' === typeof batch ) {
			batch( () => {
				updates.forEach( ( attributes, targetClientId ) => {
					updateBlockAttributes( targetClientId, attributes );
				} );
			} );
		} else {
			updates.forEach( ( attributes, targetClientId ) => {
				updateBlockAttributes( targetClientId, attributes );
			} );
		}
	} finally {
		isApplyingSync = false;
	}
} );
