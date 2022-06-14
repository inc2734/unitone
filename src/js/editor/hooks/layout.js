/*
 *@see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/dimensions.js
 */

import { BlockControls, InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import {
	useIsJustifyContentDisabled,
	JustifyContentToolbar,
	JustifyContentEdit,
	saveJustifyContentProp,
	editJustifyContentProp,
} from './justify-content';

import {
	useIsJustifyContentColumnDisabled,
	JustifyContentColumnToolbar,
	JustifyContentColumnEdit,
	saveJustifyContentColumnProp,
	editJustifyContentColumnProp,
} from './justify-content-column';

import {
	useIsAlignItemsDisabled,
	AlignItemsToolbar,
	AlignItemsEdit,
	saveAlignItemsProp,
	editAlignItemsProp,
} from './align-items';

import {
	useIsBlockAlignDisabled,
	BlockAlignToolbar,
	BlockAlignEdit,
	saveBlockAlignProp,
	editBlockAlignProp,
} from './block-align';

import {
	useIsMaxWidthDisabled,
	MaxWidthEdit,
	saveMaxWidthProp,
	editMaxWidthProp,
} from './max-width';

import {
	useIsMinHeightDisabled,
	MinHeightEdit,
	saveMinHeightProp,
	editMinHeightProp,
} from './min-height';

export {
	saveAlignItemsProp,
	editAlignItemsProp,
	saveJustifyContentProp,
	editJustifyContentProp,
	saveJustifyContentColumnProp,
	editJustifyContentColumnProp,
	saveBlockAlignProp,
	editBlockAlignProp,
	saveMaxWidthProp,
	editMaxWidthProp,
	saveMinHeightProp,
	editMinHeightProp,
};

export function LayoutPanel( props ) {
	const isJustifyContentDisabled = useIsJustifyContentDisabled( props );
	const isJustifyContentColumnDisabled =
		useIsJustifyContentColumnDisabled( props );
	const isAlignItemsDisabled = useIsAlignItemsDisabled( props );
	const isBlockAlignDisabled = useIsBlockAlignDisabled( props );
	const isMaxWidthDisabled = useIsMaxWidthDisabled( props );
	const isMinHeightDisabled = useIsMinHeightDisabled( props );

	if (
		isJustifyContentDisabled &&
		isJustifyContentColumnDisabled &&
		isAlignItemsDisabled &&
		isBlockAlignDisabled &&
		isMaxWidthDisabled &&
		isMinHeightDisabled
	) {
		return null;
	}

	return (
		<>
			{ ( ! isJustifyContentDisabled ||
				! isJustifyContentColumnDisabled ||
				! isAlignItemsDisabled ||
				! isBlockAlignDisabled ) && (
				<BlockControls group="block">
					{ ! isJustifyContentDisabled && (
						<JustifyContentToolbar { ...props } />
					) }
					{ ! isJustifyContentColumnDisabled && (
						<JustifyContentColumnToolbar { ...props } />
					) }
					{ ! isAlignItemsDisabled && (
						<AlignItemsToolbar { ...props } />
					) }
					{ ! isBlockAlignDisabled && (
						<BlockAlignToolbar { ...props } />
					) }
				</BlockControls>
			) }

			{ ( ! isJustifyContentDisabled ||
				! isJustifyContentColumnDisabled ||
				! isAlignItemsDisabled ||
				! isBlockAlignDisabled ||
				! isMaxWidthDisabled ||
				! isMinHeightDisabled ) && (
				<InspectorControls>
					<PanelBody title={ __( 'Layout', 'unitone' ) }>
						{ ! isJustifyContentDisabled && (
							<JustifyContentEdit { ...props } />
						) }
						{ ! isJustifyContentColumnDisabled && (
							<JustifyContentColumnEdit { ...props } />
						) }
						{ ! isAlignItemsDisabled && (
							<AlignItemsEdit { ...props } />
						) }
						{ ! isBlockAlignDisabled && (
							<BlockAlignEdit { ...props } />
						) }
						{ ! isMaxWidthDisabled && (
							<MaxWidthEdit { ...props } />
						) }
						{ ! isMinHeightDisabled && (
							<MinHeightEdit { ...props } />
						) }
					</PanelBody>
				</InspectorControls>
			) }
		</>
	);
}
