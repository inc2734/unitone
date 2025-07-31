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

import { useToolsPanelDropdownMenuProps } from '../../js/editor/hooks/utils';

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
	const { tabBarJustification, matchHeight, allowedBlocks, templateLock } =
		attributes;

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
					label={ __( 'Settings', 'unitone' ) }
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
