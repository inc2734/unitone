/*
 * @see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/dimensions.js
 */

import fastDeepEqual from 'fast-deep-equal/es6';

import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { BlockControls, InspectorControls } from '@wordpress/block-editor';
import { compose } from '@wordpress/compose';
import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject, useToolsPanelDropdownMenuProps } from '../utils';

import {
	isJustifyContentSupportDisabled,
	hasJustifyContentValue,
	resetJustifyContentFilter,
	resetJustifyContent,
	JustifyContentToolbar,
	getJustifyContentEditLabel,
	JustifyContentEdit,
	withJustifyContentBlockProps,
} from './justify-content';

import {
	isJustifyItemsSupportDisabled,
	hasJustifyItemsValue,
	resetJustifyItemsFilter,
	resetJustifyItems,
	JustifyItemsToolbar,
	getJustifyItemsEditLabel,
	JustifyItemsEdit,
	withJustifyItemsBlockProps,
} from './justify-items';

import {
	isJustifyContentColumnSupportDisabled,
	hasJustifyContentColumnValue,
	resetJustifyContentColumnFilter,
	resetJustifyContentColumn,
	JustifyContentColumnToolbar,
	getJustifyContentColumnEditLabel,
	JustifyContentColumnEdit,
	withJustifyContentColumnBlockProps,
} from './justify-content-column';

import {
	isAlignContentSupportDisabled,
	hasAlignContentValue,
	resetAlignContentFilter,
	resetAlignContent,
	AlignContentToolbar,
	getAlignContentEditLabel,
	AlignContentEdit,
	withAlignContentBlockProps,
} from './align-content';

import {
	isAlignItemsSupportDisabled,
	hasAlignItemsValue,
	resetAlignItemsFilter,
	resetAlignItems,
	AlignItemsToolbar,
	getAlignItemsEditLabel,
	AlignItemsEdit,
	withAlignItemsBlockProps,
} from './align-items';

import {
	isBlockAlignSupportDisabled,
	hasBlockAlignValue,
	resetBlockAlignFilter,
	resetBlockAlign,
	BlockAlignToolbar,
	getBlockAlignEditLabel,
	BlockAlignEdit,
	withBlockAlignBlockProps,
} from './block-align';

import {
	isAlignSelfSupportDisabled,
	hasAlignSelfValue,
	resetAlignSelfFilter,
	resetAlignSelf,
	AlignSelfToolbar,
	getAlignSelfEditLabel,
	AlignSelfEdit,
	withAlignSelfBlockProps,
} from './align-self';

import {
	isJustifySelfSupportDisabled,
	hasJustifySelfValue,
	resetJustifySelfFilter,
	resetJustifySelf,
	JustifySelfToolbar,
	getJustifySelfEditLabel,
	JustifySelfEdit,
	withJustifySelfBlockProps,
} from './justify-self';

export const withAlignmentDistributionBlockProps = compose(
	withAlignContentBlockProps,
	withAlignItemsBlockProps,
	withAlignSelfBlockProps,
	withBlockAlignBlockProps,
	withJustifyContentBlockProps,
	withJustifyContentColumnBlockProps,
	withJustifyItemsBlockProps,
	withJustifySelfBlockProps
);

export const resetAlignmentDistribution = ( props ) => {
	const filters = [
		[ isJustifyContentSupportDisabled, resetJustifyContentFilter ],
		[
			isJustifyContentColumnSupportDisabled,
			resetJustifyContentColumnFilter,
		],
		[ isJustifyItemsSupportDisabled, resetJustifyItemsFilter ],
		[ isAlignContentSupportDisabled, resetAlignContentFilter ],
		[ isAlignItemsSupportDisabled, resetAlignItemsFilter ],
		[ isBlockAlignSupportDisabled, resetBlockAlignFilter ],
		[ isAlignSelfSupportDisabled, resetAlignSelfFilter ],
		[ isJustifySelfSupportDisabled, resetJustifySelfFilter ],
	];

	const unitone = filters.reduce(
		( accumulator, [ isDisabled, resetFilter ] ) => {
			return isDisabled( { ...props } )
				? { ...accumulator, ...resetFilter() }
				: accumulator;
		},
		{ ...props.attributes?.unitone }
	);

	return { ...props, attributes: { ...props.attributes, unitone } };
};

function AlignmentDistributionPanelPure( props ) {
	const { name, attributes, setAttributes, clientId } = props;

	const resetAll = () => {
		setAttributes( {
			unitone: cleanEmptyObject(
				Object.assign(
					{ ...attributes?.unitone },
					resetJustifyContentFilter(),
					resetJustifyContentColumnFilter(),
					resetJustifyItemsFilter(),
					resetAlignContentFilter(),
					resetAlignItemsFilter(),
					resetBlockAlignFilter(),
					resetAlignSelfFilter(),
					resetJustifySelfFilter()
				)
			),
		} );
	};

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const isJustifyContentDisabled = isJustifyContentSupportDisabled( {
		name,
	} );
	const isJustifyContentColumnDisabled =
		isJustifyContentColumnSupportDisabled( {
			name,
		} );
	const isJustifyItemsDisabled = isJustifyItemsSupportDisabled( { name } );
	const isAlignContentDisabled = isAlignContentSupportDisabled( { name } );
	const isAlignItemsDisabled = isAlignItemsSupportDisabled( { name } );
	const isBlockAlignDisabled = isBlockAlignSupportDisabled( { name } );
	const isAlignSelfDisabled = isAlignSelfSupportDisabled( {
		name,
		attributes,
	} );
	const isJustifySelfDisabled = isJustifySelfSupportDisabled( {
		name,
		attributes,
	} );

	if (
		isJustifyContentDisabled &&
		isJustifyContentColumnDisabled &&
		isJustifyItemsDisabled &&
		isAlignContentDisabled &&
		isAlignItemsDisabled &&
		isBlockAlignDisabled &&
		isAlignSelfDisabled &&
		isJustifySelfDisabled
	) {
		return null;
	}

	return (
		<>
			{ ( ! isJustifyContentDisabled ||
				! isJustifyContentColumnDisabled ||
				! isJustifyItemsDisabled ||
				! isAlignContentDisabled ||
				! isAlignItemsDisabled ||
				! isJustifySelfDisabled ||
				! isAlignSelfDisabled ||
				! isBlockAlignDisabled ) && (
				<BlockControls group="block">
					{ ! isJustifyContentDisabled && (
						<JustifyContentToolbar { ...props } />
					) }
					{ ! isJustifyContentColumnDisabled && (
						<JustifyContentColumnToolbar { ...props } />
					) }
					{ ! isJustifyItemsDisabled && (
						<JustifyItemsToolbar { ...props } />
					) }
					{ ! isAlignContentDisabled && (
						<AlignContentToolbar { ...props } />
					) }
					{ ! isAlignItemsDisabled && (
						<AlignItemsToolbar { ...props } />
					) }
					{ ! isJustifySelfDisabled && (
						<JustifySelfToolbar { ...props } />
					) }
					{ ! isAlignSelfDisabled && (
						<AlignSelfToolbar { ...props } />
					) }
					{ ! isBlockAlignDisabled && (
						<BlockAlignToolbar { ...props } />
					) }
				</BlockControls>
			) }

			{ ( ! isJustifyContentDisabled ||
				! isJustifyContentColumnDisabled ||
				! isJustifyItemsDisabled ||
				! isAlignContentDisabled ||
				! isAlignItemsDisabled ||
				! isBlockAlignDisabled ||
				! isAlignSelfDisabled ||
				! isJustifySelfDisabled ) && (
				<InspectorControls>
					<ToolsPanel
						label={ __( 'Alignment & Distribution', 'unitone' ) }
						resetAll={ resetAll }
						panelId={ clientId }
						dropdownMenuProps={ dropdownMenuProps }
					>
						{ ! isJustifyContentDisabled && (
							<ToolsPanelItem
								hasValue={ () =>
									hasJustifyContentValue( { ...props } )
								}
								label={ getJustifyContentEditLabel( {
									...props,
								} ) }
								onDeselect={ () =>
									resetJustifyContent( { ...props } )
								}
								isShownByDefault
								panelId={ clientId }
							>
								<JustifyContentEdit
									{ ...props }
									label={ getJustifyContentEditLabel( {
										...props,
										__withCode: true,
									} ) }
								/>
							</ToolsPanelItem>
						) }
						{ ! isJustifyContentColumnDisabled && (
							<ToolsPanelItem
								hasValue={ () =>
									hasJustifyContentColumnValue( { ...props } )
								}
								label={ getJustifyContentColumnEditLabel( {
									...props,
								} ) }
								onDeselect={ () =>
									resetJustifyContentColumn( { ...props } )
								}
								isShownByDefault
								panelId={ clientId }
							>
								<JustifyContentColumnEdit
									{ ...props }
									label={ getJustifyContentColumnEditLabel( {
										...props,
										__withCode: true,
									} ) }
								/>
							</ToolsPanelItem>
						) }
						{ ! isJustifyItemsDisabled && (
							<ToolsPanelItem
								hasValue={ () =>
									hasJustifyItemsValue( { ...props } )
								}
								label={ getJustifyItemsEditLabel( {
									...props,
								} ) }
								onDeselect={ () =>
									resetJustifyItems( { ...props } )
								}
								isShownByDefault
								panelId={ clientId }
							>
								<JustifyItemsEdit
									{ ...props }
									label={ getJustifyItemsEditLabel( {
										...props,
										__withCode: true,
									} ) }
								/>
							</ToolsPanelItem>
						) }
						{ ! isAlignContentDisabled && (
							<ToolsPanelItem
								hasValue={ () =>
									hasAlignContentValue( { ...props } )
								}
								label={ getAlignContentEditLabel( {
									...props,
								} ) }
								onDeselect={ () =>
									resetAlignContent( { ...props } )
								}
								isShownByDefault
								panelId={ clientId }
							>
								<AlignContentEdit
									{ ...props }
									label={ getAlignContentEditLabel( {
										...props,
										__withCode: true,
									} ) }
								/>
							</ToolsPanelItem>
						) }
						{ ! isAlignItemsDisabled && (
							<ToolsPanelItem
								hasValue={ () =>
									hasAlignItemsValue( { ...props } )
								}
								label={ getAlignItemsEditLabel( { ...props } ) }
								onDeselect={ () =>
									resetAlignItems( { ...props } )
								}
								isShownByDefault
								panelId={ clientId }
							>
								<AlignItemsEdit
									{ ...props }
									label={ getAlignItemsEditLabel( {
										...props,
										__withCode: true,
									} ) }
								/>
							</ToolsPanelItem>
						) }
						{ ! isBlockAlignDisabled && (
							<ToolsPanelItem
								hasValue={ () =>
									hasBlockAlignValue( { ...props } )
								}
								label={ getBlockAlignEditLabel( { ...props } ) }
								onDeselect={ () =>
									resetBlockAlign( { ...props } )
								}
								isShownByDefault
								panelId={ clientId }
							>
								<BlockAlignEdit
									{ ...props }
									label={ getBlockAlignEditLabel( {
										...props,
									} ) }
								/>
							</ToolsPanelItem>
						) }
						{ ! isJustifySelfDisabled && (
							<ToolsPanelItem
								hasValue={ () =>
									hasJustifySelfValue( { ...props } )
								}
								label={ getJustifySelfEditLabel( {
									...props,
								} ) }
								onDeselect={ () =>
									resetJustifySelf( { ...props } )
								}
								isShownByDefault
								panelId={ clientId }
							>
								<JustifySelfEdit
									{ ...props }
									label={ getJustifySelfEditLabel( {
										...props,
										__withCode: true,
									} ) }
								/>
							</ToolsPanelItem>
						) }
						{ ! isAlignSelfDisabled && (
							<ToolsPanelItem
								hasValue={ () =>
									hasAlignSelfValue( { ...props } )
								}
								label={ getAlignSelfEditLabel( { ...props } ) }
								onDeselect={ () =>
									resetAlignSelf( { ...props } )
								}
								isShownByDefault
								panelId={ clientId }
							>
								<AlignSelfEdit
									{ ...props }
									label={ getAlignSelfEditLabel( {
										...props,
										__withCode: true,
									} ) }
								/>
							</ToolsPanelItem>
						) }
					</ToolsPanel>
				</InspectorControls>
			) }
		</>
	);
}

export const AlignmentDistributionPanel = memo(
	AlignmentDistributionPanelPure,
	( oldProps, newProps ) => fastDeepEqual( oldProps, newProps )
);
