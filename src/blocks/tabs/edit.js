import clsx from 'clsx';

import {
	InspectorControls,
	useBlockProps,
	RichText,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	Button,
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import {
	Icon,
	plus,
	justifyLeft,
	justifyCenter,
	justifyRight,
	justifyStretch,
} from '@wordpress/icons';

import { createBlock } from '@wordpress/blocks';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import {
	compacting as compactPadding,
	expand as expandPadding,
} from '../../js/editor/hooks/dimensions/padding';

import {
	useToolsPanelDropdownMenuProps,
	isObject,
} from '../../js/editor/hooks/utils';

import { PaddingControl } from '../../js/editor/hooks/components';

import metadata from './block.json';

const JUSTIFICATION_OPTIONS = [
	{
		value: 'left',
		icon: justifyLeft,
		label: __( 'Justify items left', 'unitone' ),
	},
	{
		value: 'center',
		icon: justifyCenter,
		label: __( 'Justify items center', 'unitone' ),
	},
	{
		value: 'right',
		icon: justifyRight,
		label: __( 'Justify items right', 'unitone' ),
	},
	{
		value: 'fill',
		icon: justifyStretch,
		label: __( 'Fill', 'unitone' ),
	},
];

export default function ( { attributes, setAttributes, clientId } ) {
	const {
		tabBarJustification,
		tabPadding,
		tabPanelPadding,
		matchHeight,
		allowedBlocks,
		templateLock,
		borderColor,
		style,
	} = attributes;

	const { insertBlocks, updateBlockAttributes } =
		useDispatch( blockEditorStore );

	const _tabPanels =
		useSelect(
			( select ) => select( blockEditorStore ).getBlocks( clientId ),
			[ clientId ]
		) ?? [];

	const tabPanels = _tabPanels.map( ( tabPanel ) => {
		return {
			clientId: tabPanel?.clientId,
			attributes: tabPanel?.attributes,
		};
	} );

	const compactedTabPadding = compactPadding( tabPadding );
	const expandedTabPadding = expandPadding( compactedTabPadding );
	const compactedTabPanelPadding = compactPadding( tabPanelPadding );
	const expandedTabPanelPadding = expandPadding( compactedTabPanelPadding );
	const isMixedTabPadding = isObject( compactedTabPadding );
	const isMixedTabPanelPadding = isObject( compactedTabPanelPadding );

	const onChangeTabPaddingSide = ( side, newValue ) => {
		if ( null != newValue ) {
			newValue = String( newValue );
		}

		setAttributes( {
			tabPadding: compactPadding( {
				...expandedTabPadding,
				[ side ]: newValue || undefined,
			} ),
		} );
	};

	const onChangeTabPanelPaddingSide = ( side, newValue ) => {
		if ( null != newValue ) {
			newValue = String( newValue );
		}

		setAttributes( {
			tabPanelPadding: compactPadding( {
				...expandedTabPanelPadding,
				[ side ]: newValue || undefined,
			} ),
		} );
	};

	/**
	 * Update tab panels aria-hidden attribute.
	 *
	 * @param {string} activeTabPanelClientId Active tab panel clientId.
	 */
	const updateTabPaneslAriaHidden = ( activeTabPanelClientId ) => {
		tabPanels.forEach( ( tabPanel ) => {
			const newAriaHidden = tabPanel.clientId !== activeTabPanelClientId;

			updateBlockAttributes( tabPanel.clientId, {
				ariaHidden: newAriaHidden,
			} );
		} );
	};

	/**
	 * Initialize.
	 */
	useEffect( () => {
		updateTabPaneslAriaHidden( tabPanels[ 0 ]?.clientId );
	}, [] );

	/**
	 * Update tab panels aria-hidden attribute when tab panels length changes.
	 */
	useEffect( () => {
		const activeTabPanels = tabPanels.filter(
			( tabPanel ) => ! tabPanel.attributes?.ariaHidden
		);
		if ( 1 < activeTabPanels.length ) {
			updateTabPaneslAriaHidden( activeTabPanels[ 0 ].clientId );
		} else {
			updateTabPaneslAriaHidden( tabPanels[ 0 ]?.clientId );
		}
	}, [ tabPanels.length ] );

	const blockProps = useBlockProps( {
		className: clsx( 'unitone-tabs', {
			'unitone-tabs--match-height': matchHeight,
		} ),
		style: {
			'--unitone--border-width': style?.border?.width,
			'--unitone--border-style': style?.border?.style,
			'--unitone--border-color': !! borderColor
				? `var(--wp--preset--color--${ borderColor })`
				: style?.border?.color,
		},
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'unitone-tab-view',
		},
		{
			allowedBlocks,
			template: [
				[
					'unitone/tab-panel',
					{},
					[
						[
							'unitone/text',
							{ unitone: { maxWidth: '100%', gap: '-1' } },
						],
					],
				],
			],
			templateLock,
			renderAppender: false,
		}
	);

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Tabs settings', 'unitone' ) }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						hasValue={ () =>
							tabBarJustification !==
							metadata.attributes.tabBarJustification.default
						}
						isShownByDefault
						label={ __( 'Tab bar justification', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								tabBarJustification:
									metadata.attributes.tabBarJustification
										.default,
							} )
						}
					>
						<fieldset className="block-editor-hooks__flex-layout-justification-controls unitone-dimension-control">
							<legend>
								{ __( 'Tab bar justification', 'unitone' ) }
							</legend>
							<div>
								{ JUSTIFICATION_OPTIONS.map(
									( { value, icon, label } ) => (
										<Button
											key={ value }
											label={ label }
											icon={ icon }
											isPressed={
												tabBarJustification === value
											}
											onClick={ () => {
												setAttributes( {
													tabBarJustification:
														tabBarJustification !==
														value
															? value
															: undefined,
												} );
											} }
										/>
									)
								) }
							</div>
						</fieldset>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () => null != compactPadding( tabPadding ) }
						isShownByDefault
						label={ __( 'Padding', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								tabPadding:
									metadata.attributes.tabPadding.default,
							} )
						}
					>
						<PaddingControl
							label={
								<>
									{ __( 'Padding', 'unitone' ) }
									&nbsp;:&nbsp;
									<code>padding</code>
								</>
							}
							split
							isMixed={ isMixedTabPadding }
							value={ compactedTabPadding }
							onChange={ ( newAttribute ) => {
								if ( null != newAttribute ) {
									newAttribute = String( newAttribute );
								}

								setAttributes( {
									tabPadding: newAttribute || undefined,
								} );
							} }
							sideControls={ [
								{
									key: 'top',
									value: expandedTabPadding?.top,
									onChange: ( newAttribute ) =>
										onChangeTabPaddingSide(
											'top',
											newAttribute
										),
								},
								{
									key: 'right',
									value: expandedTabPadding?.right,
									onChange: ( newAttribute ) =>
										onChangeTabPaddingSide(
											'right',
											newAttribute
										),
								},
								{
									key: 'bottom',
									value: expandedTabPadding?.bottom,
									onChange: ( newAttribute ) =>
										onChangeTabPaddingSide(
											'bottom',
											newAttribute
										),
								},
								{
									key: 'left',
									value: expandedTabPadding?.left,
									onChange: ( newAttribute ) =>
										onChangeTabPaddingSide(
											'left',
											newAttribute
										),
								},
							] }
						/>
					</ToolsPanelItem>
				</ToolsPanel>

				<ToolsPanel
					label={ __( 'Tab panels settings', 'unitone' ) }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						hasValue={ () =>
							matchHeight !==
							metadata.attributes.matchHeight.default
						}
						isShownByDefault
						label={ __(
							'Make tab panels the same height',
							'unitone'
						) }
						onDeselect={ () =>
							setAttributes( {
								matchHeight:
									metadata.attributes.matchHeight.default,
							} )
						}
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __(
								'Make tab panels the same height',
								'unitone'
							) }
							checked={ matchHeight }
							onChange={ ( newAttribute ) => {
								setAttributes( { matchHeight: newAttribute } );
							} }
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							null != compactPadding( tabPanelPadding )
						}
						isShownByDefault
						label={ __( 'Padding', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								tabPanelPadding:
									metadata.attributes.tabPanelPadding.default,
							} )
						}
					>
						<PaddingControl
							label={
								<>
									{ __( 'Padding', 'unitone' ) }
									&nbsp;:&nbsp;
									<code>padding</code>
								</>
							}
							split
							isMixed={ isMixedTabPanelPadding }
							value={ compactedTabPanelPadding }
							onChange={ ( newAttribute ) => {
								if ( null != newAttribute ) {
									newAttribute = String( newAttribute );
								}

								setAttributes( {
									tabPanelPadding: newAttribute || undefined,
								} );
							} }
							sideControls={ [
								{
									key: 'top',
									value: expandedTabPanelPadding?.top,
									onChange: ( newAttribute ) =>
										onChangeTabPanelPaddingSide(
											'top',
											newAttribute
										),
								},
								{
									key: 'right',
									value: expandedTabPanelPadding?.right,
									onChange: ( newAttribute ) =>
										onChangeTabPanelPaddingSide(
											'right',
											newAttribute
										),
								},
								{
									key: 'bottom',
									value: expandedTabPanelPadding?.bottom,
									onChange: ( newAttribute ) =>
										onChangeTabPanelPaddingSide(
											'bottom',
											newAttribute
										),
								},
								{
									key: 'left',
									value: expandedTabPanelPadding?.left,
									onChange: ( newAttribute ) =>
										onChangeTabPanelPaddingSide(
											'left',
											newAttribute
										),
								},
							] }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<div { ...blockProps }>
				{ 0 < tabPanels.length && (
					<div className="unitone-tabs__tab-bar">
						<div
							className={ clsx( 'unitone-tab-bar', {
								[ `unitone-tab-bar--justification:${ tabBarJustification }` ]:
									!! tabBarJustification,
							} ) }
							role="tablist"
						>
							{ tabPanels.map( ( tabPanel, i ) => (
								<button
									key={ i }
									role="tab"
									className="unitone-tab"
									data-unitone-layout={ clsx( {
										[ `-padding:${ compactedTabPadding }` ]:
											null != compactedTabPadding &&
											! isObject( compactedTabPadding ),
										[ `-padding-top:${ compactedTabPadding?.top }` ]:
											null != compactedTabPadding?.top,
										[ `-padding-right:${ compactedTabPadding?.right }` ]:
											null != compactedTabPadding?.right,
										[ `-padding-bottom:${ compactedTabPadding?.bottom }` ]:
											null != compactedTabPadding?.bottom,
										[ `-padding-left:${ compactedTabPadding?.left }` ]:
											null != compactedTabPadding?.left,
									} ) }
									aria-controls={
										tabPanel.attributes.anchor ||
										tabPanel.clientId
									}
									aria-selected={
										! tabPanel.attributes?.ariaHidden
									}
									onClick={ () => {
										tabPanels.forEach(
											( _tabPanel, _i ) => {
												updateBlockAttributes(
													_tabPanel.clientId,
													{
														ariaHidden: _i !== i,
													}
												);
											}
										);
									} }
									style={ {
										'--unitone--active-background-color':
											!! tabPanel.attributes
												?.backgroundColor
												? `var(--wp--preset--color--${ tabPanel.attributes?.backgroundColor })`
												: tabPanel.attributes?.style
														?.color?.background,
										'--unitone--active-color': !! tabPanel
											.attributes?.textColor
											? `var(--wp--preset--color--${ tabPanel.attributes?.textColor })`
											: tabPanel.attributes?.style?.color
													?.text,
									} }
								>
									<RichText
										className="unitone-tab__label"
										value={ tabPanel.attributes?.tabLabel }
										onChange={ ( newAttribute ) => {
											updateBlockAttributes(
												tabPanel.clientId,
												{
													tabLabel: newAttribute,
												}
											);
										} }
										placeholder={ __( 'Tab', 'unitone' ) }
										withoutInteractiveFormatting
									/>
								</button>
							) ) }

							<button
								aria-label={ __( 'Add new tab', 'unitone' ) }
								className="unitone-tab unitone-tab-inserter"
								onClick={ () => {
									const newTabPanel =
										createBlock( 'unitone/tab-panel' );

									insertBlocks(
										newTabPanel,
										tabPanels.length,
										clientId,
										true
									);
								} }
							>
								<Icon icon={ plus } size={ 16 } />
							</button>
						</div>
					</div>
				) }

				<div className="unitone-tabs__tab-view">
					<div { ...innerBlocksProps } />
				</div>
			</div>
		</>
	);
}
