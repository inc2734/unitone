import clsx from 'clsx';

import {
	ButtonBlockAppender,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	TextControl,
	RangeControl,
	SelectControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalUnitControl as UnitControl,
	__experimentalUseCustomUnits as useCustomUnits,
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { memo, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import {
	GridVisualizer,
	normalizeForRangeControl,
	normalizeForSelectControl,
	normalizeForTextControl,
	normalizeForToggleGroupControl,
	normalizeForUnitControl,
	useToolsPanelDropdownMenuProps,
	useVisibleResizeObserver,
} from '../../js/editor/hooks/utils';

import { ResponsiveSettingsContainer } from '../../js/editor/hooks/components';

import metadata from './block.json';

import { setDividerLinewrap } from '@inc2734/unitone-css/library';
import { useResponsiveGridCSS } from '../grid/hooks';

const parseString = ( value ) => {
	value = String( value );
	return null !== value && '' !== value ? value : undefined;
};

const MemoizedButtonBlockAppender = memo( ButtonBlockAppender );

export default function ( { attributes, setAttributes, clientId } ) {
	const {
		tagName,
		columnsOption,
		columns,
		columnMinWidth,
		gridTemplateColumns,
		columnAutoRepeat,
		mdColumnsOption,
		mdColumns,
		mdColumnMinWidth,
		mdGridTemplateColumns,
		smColumnsOption,
		smColumns,
		smColumnMinWidth,
		smGridTemplateColumns,
		rowsOption,
		rows,
		gridTemplateRows,
		mdRowsOption,
		mdRows,
		mdGridTemplateRows,
		smRowsOption,
		smRows,
		smGridTemplateRows,
		mdBreakpoint,
		smBreakpoint,
		allowedBlocks,
		templateLock,
		__unstableUnitoneBlockOutline,
	} = attributes;

	const innerBlocksLength = useSelect(
		( select ) =>
			select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);
	const hasInnerBlocks = !! innerBlocksLength;

	const ref = useVisibleResizeObserver(
		( target ) => setDividerLinewrap( target ),
		[ attributes ]
	);

	const TagName = tagName;
	const breakpointUnits = useCustomUnits( {
		availableUnits: [ 'px', 'em', 'rem' ],
	} );

	const styles = {
		'--unitone--columns':
			( 'columns' === columnsOption && parseString( columns ) ) ||
			undefined,
		'--unitone--column-min-width':
			( 'min' === columnsOption && columnMinWidth ) || undefined,
		'--unitone--grid-template-columns':
			( 'free' === columnsOption && gridTemplateColumns ) || undefined,
		'--unitone--column-auto-repeat':
			( 'min' === columnsOption && columnAutoRepeat ) || undefined,
		'--unitone--md-columns':
			( 'columns' === mdColumnsOption && parseString( mdColumns ) ) ||
			undefined,
		'--unitone--md-column-min-width':
			( 'min' === mdColumnsOption && mdColumnMinWidth ) || undefined,
		'--unitone--md-grid-template-columns':
			( 'free' === mdColumnsOption && mdGridTemplateColumns ) ||
			undefined,
		'--unitone--sm-columns':
			( 'columns' === smColumnsOption && parseString( smColumns ) ) ||
			undefined,
		'--unitone--sm-column-min-width':
			( 'min' === smColumnsOption && smColumnMinWidth ) || undefined,
		'--unitone--sm-grid-template-columns':
			( 'free' === smColumnsOption && smGridTemplateColumns ) ||
			undefined,
		'--unitone--rows':
			( 'rows' === rowsOption && parseString( rows ) ) || undefined,
		'--unitone--grid-template-rows':
			( 'free' === rowsOption && gridTemplateRows ) || undefined,
		'--unitone--md-rows':
			( 'rows' === mdRowsOption && parseString( mdRows ) ) || undefined,
		'--unitone--md-grid-template-rows':
			( 'free' === mdRowsOption && mdGridTemplateRows ) || undefined,
		'--unitone--sm-rows':
			( 'rows' === smRowsOption && parseString( smRows ) ) || undefined,
		'--unitone--sm-grid-template-rows':
			( 'free' === smRowsOption && smGridTemplateRows ) || undefined,
	};

	const blockProps = useBlockProps( {
		ref,
		className: 'unitone-grid',
		style: styles,
		'data-unitone-client-id': clientId,
	} );
	blockProps[ 'data-unitone-layout' ] = clsx(
		blockProps[ 'data-unitone-layout' ],
		{
			[ `-columns:${ columnsOption }` ]: !! columnsOption,
			[ `-columns:md:${ mdColumnsOption }` ]:
				( 'columns' === mdColumnsOption && !! mdColumns ) ||
				( 'min' === mdColumnsOption && !! mdColumnMinWidth ) ||
				( 'free' === mdColumnsOption && !! mdGridTemplateColumns ),
			[ `-columns:sm:${ smColumnsOption }` ]:
				( 'columns' === smColumnsOption && !! smColumns ) ||
				( 'min' === smColumnsOption && !! smColumnMinWidth ) ||
				( 'free' === smColumnsOption && !! smGridTemplateColumns ),
			[ `-rows:${ rowsOption }` ]: !! rowsOption,
			[ `-rows:md:${ mdRowsOption }` ]:
				( 'rows' === mdRowsOption && !! mdRows ) ||
				( 'free' === mdRowsOption && !! mdGridTemplateRows ),
			[ `-rows:sm:${ smRowsOption }` ]:
				( 'rows' === smRowsOption && !! smRows ) ||
				( 'free' === smRowsOption && !! smGridTemplateRows ),
		}
	);

	const renderAppender = useCallback(
		() => <MemoizedButtonBlockAppender rootClientId={ clientId } />,
		[ clientId ]
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock,
		allowedBlocks,
		renderAppender: hasInnerBlocks ? undefined : renderAppender,
	} );

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const responsiveCSS = useResponsiveGridCSS( {
		clientId,
		mdBreakpoint,
		smBreakpoint,
	} );

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings', 'unitone' ) }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						hasValue={ () =>
							tagName !== metadata.attributes.tagName.default
						}
						isShownByDefault
						label={ __( 'HTML element', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								tagName: metadata.attributes.tagName.default,
							} )
						}
					>
						<SelectControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'HTML element', 'unitone' ) }
							options={ [
								{ label: '<div>', value: 'div' },
								{ label: '<ul>', value: 'ul' },
								{ label: '<ol>', value: 'ol' },
							] }
							value={ normalizeForSelectControl( tagName ) }
							onChange={ ( newAttribute ) =>
								setAttributes( {
									tagName:
										normalizeForSelectControl(
											newAttribute
										),
								} )
							}
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							columnsOption !==
								metadata.attributes.columnsOption.default ||
							mdColumnsOption !==
								metadata.attributes.mdColumnsOption.default ||
							smColumnsOption !==
								metadata.attributes.smColumnsOption.default
						}
						isShownByDefault
						label={ 'grid-template-columns' }
						onDeselect={ () => {
							setAttributes( {
								columnsOption:
									metadata.attributes.columnsOption.default,
								columns: metadata.attributes.columns.default,
								columnMinWidth:
									metadata.attributes.columnMinWidth.default,
								columnAutoRepeat:
									metadata.attributes.columnAutoRepeat
										.default,
								gridTemplateColumns:
									metadata.attributes.gridTemplateColumns
										.default,

								mdColumnsOption:
									metadata.attributes.mdColumnsOption.default,
								mdColumns:
									metadata.attributes.mdColumns.default,
								mdColumnMinWidth:
									metadata.attributes.mdColumnMinWidth
										.default,
								mdGridTemplateColumns:
									metadata.attributes.mdGridTemplateColumns
										.default,

								smColumnsOption:
									metadata.attributes.smColumnsOption.default,
								smColumns:
									metadata.attributes.smColumns.default,
								smColumnMinWidth:
									metadata.attributes.smColumnMinWidth
										.default,
								smGridTemplateColumns:
									metadata.attributes.smGridTemplateColumns
										.default,
							} );
						} }
					>
						<ResponsiveSettingsContainer
							label={ 'grid-template-columns' }
							desktopControls={ () => (
								<>
									<ToggleGroupControl
										__next40pxDefaultSize
										__nextHasNoMarginBottom
										hideLabelFromVision
										className="unitone-toggle-group-control"
										value={ normalizeForToggleGroupControl(
											columnsOption
										) }
										onChange={ ( value ) => {
											setAttributes( {
												columnsOption:
													normalizeForToggleGroupControl(
														value
													),
											} );

											if (
												! mdColumns &&
												! mdColumnMinWidth &&
												! mdGridTemplateColumns
											) {
												setAttributes( {
													mdColumnsOption:
														normalizeForToggleGroupControl(
															value
														),
												} );
											}

											if (
												! smColumns &&
												! smColumnMinWidth &&
												! smGridTemplateColumns
											) {
												setAttributes( {
													smColumnsOption:
														normalizeForToggleGroupControl(
															value
														),
												} );
											}
										} }
										isBlock
									>
										<ToggleGroupControlOption
											value="min"
											label={ __(
												'Minimum width',
												'unitone'
											) }
										/>
										<ToggleGroupControlOption
											value="columns"
											label={ __(
												'Columns count',
												'unitone'
											) }
										/>
										<ToggleGroupControlOption
											value="free"
											label={ __(
												'Free input',
												'unitone'
											) }
										/>
									</ToggleGroupControl>

									<div className="unitone-toggle-group-control__body">
										{ 'min' === columnsOption && (
											<>
												<UnitControl
													__next40pxDefaultSize
													label={ __(
														'Minimum width',
														'unitone'
													) }
													value={ normalizeForUnitControl(
														columnMinWidth
													) }
													onChange={ ( value ) =>
														setAttributes( {
															columnMinWidth:
																normalizeForUnitControl(
																	value
																),
														} )
													}
												/>

												<ToggleGroupControl
													__next40pxDefaultSize
													__nextHasNoMarginBottom
													label={ __(
														'Auto repeat',
														'unitone'
													) }
													value={ normalizeForToggleGroupControl(
														columnAutoRepeat
													) }
													onChange={ ( value ) => {
														setAttributes( {
															columnAutoRepeat:
																normalizeForToggleGroupControl(
																	value
																),
														} );
													} }
													isBlock
												>
													<ToggleGroupControlOption
														value="auto-fit"
														label="auto-fit"
													/>
													<ToggleGroupControlOption
														value="auto-fill"
														label="auto-fill"
													/>
												</ToggleGroupControl>
											</>
										) }

										{ 'columns' === columnsOption && (
											<RangeControl
												__next40pxDefaultSize
												__nextHasNoMarginBottom
												label={ __(
													'Columns count',
													'unitone'
												) }
												value={ normalizeForRangeControl(
													columns
												) }
												onChange={ ( value ) =>
													setAttributes( {
														columns:
															normalizeForRangeControl(
																value
															),
													} )
												}
												min={ 1 }
												max={ 12 }
												step={ 1 }
											/>
										) }

										{ 'free' === columnsOption && (
											<TextControl
												__next40pxDefaultSize
												__nextHasNoMarginBottom
												value={ normalizeForTextControl(
													gridTemplateColumns
												) }
												onChange={ ( value ) =>
													setAttributes( {
														gridTemplateColumns:
															normalizeForTextControl(
																value
															),
													} )
												}
											/>
										) }
									</div>
								</>
							) }
							tabletControls={ () => (
								<>
									<ToggleGroupControl
										__next40pxDefaultSize
										__nextHasNoMarginBottom
										hideLabelFromVision
										className="unitone-toggle-group-control"
										value={ normalizeForToggleGroupControl(
											mdColumnsOption
										) }
										onChange={ ( value ) => {
											setAttributes( {
												mdColumnsOption:
													normalizeForToggleGroupControl(
														value
													),
											} );

											if (
												! smColumns &&
												! smColumnMinWidth &&
												! smGridTemplateColumns
											) {
												setAttributes( {
													smColumnsOption:
														normalizeForToggleGroupControl(
															value
														),
												} );
											}
										} }
										isBlock
									>
										<ToggleGroupControlOption
											value="min"
											label={ __(
												'Minimum width',
												'unitone'
											) }
										/>
										<ToggleGroupControlOption
											value="columns"
											label={ __(
												'Columns count',
												'unitone'
											) }
										/>
										<ToggleGroupControlOption
											value="free"
											label={ __(
												'Free input',
												'unitone'
											) }
										/>
									</ToggleGroupControl>

									<div className="unitone-toggle-group-control__body">
										{ 'min' === mdColumnsOption && (
											<UnitControl
												__next40pxDefaultSize
												label={ `${ __(
													'Minimum width',
													'unitone'
												) } (${ __(
													'For tablet / mobile',
													'unitone'
												) })` }
												value={ normalizeForUnitControl(
													mdColumnMinWidth ||
														( 'min' ===
															columnsOption &&
															columnMinWidth )
												) }
												onChange={ ( value ) =>
													setAttributes( {
														mdColumnMinWidth:
															normalizeForUnitControl(
																value
															),
													} )
												}
											/>
										) }

										{ 'columns' === mdColumnsOption && (
											<RangeControl
												__next40pxDefaultSize
												__nextHasNoMarginBottom
												label={ `${ __(
													'Columns count',
													'unitone'
												) } (${ __(
													'For tablet / mobile',
													'unitone'
												) })` }
												value={ normalizeForRangeControl(
													mdColumns ||
														( 'columns' ===
															columnsOption &&
															columns )
												) }
												onChange={ ( value ) =>
													setAttributes( {
														mdColumns:
															normalizeForRangeControl(
																value
															),
													} )
												}
												min={ 1 }
												max={ 12 }
												step={ 1 }
												allowReset
											/>
										) }

										{ 'free' === mdColumnsOption && (
											<TextControl
												__next40pxDefaultSize
												__nextHasNoMarginBottom
												label={ `${ __(
													'Free input',
													'unitone'
												) } (${ __(
													'For tablet / mobile',
													'unitone'
												) })` }
												value={ normalizeForTextControl(
													mdGridTemplateColumns ||
														( 'free' ===
															columnsOption &&
															gridTemplateColumns )
												) }
												onChange={ ( value ) =>
													setAttributes( {
														mdGridTemplateColumns:
															normalizeForTextControl(
																value
															),
													} )
												}
											/>
										) }
									</div>
								</>
							) }
							mobileControls={ () => (
								<>
									<ToggleGroupControl
										__next40pxDefaultSize
										__nextHasNoMarginBottom
										hideLabelFromVision
										className="unitone-toggle-group-control"
										value={ normalizeForToggleGroupControl(
											smColumnsOption
										) }
										onChange={ ( value ) => {
											setAttributes( {
												smColumnsOption:
													normalizeForToggleGroupControl(
														value
													),
											} );
										} }
										isBlock
									>
										<ToggleGroupControlOption
											value="min"
											label={ __(
												'Minimum width',
												'unitone'
											) }
										/>
										<ToggleGroupControlOption
											value="columns"
											label={ __(
												'Columns count',
												'unitone'
											) }
										/>
										<ToggleGroupControlOption
											value="free"
											label={ __(
												'Free input',
												'unitone'
											) }
										/>
									</ToggleGroupControl>

									<div className="unitone-toggle-group-control__body">
										{ 'min' === smColumnsOption && (
											<UnitControl
												__next40pxDefaultSize
												label={ `${ __(
													'Minimum width',
													'unitone'
												) } (${ __(
													'For mobile',
													'unitone'
												) })` }
												value={ normalizeForUnitControl(
													smColumnMinWidth ||
														( 'min' ===
															mdColumnsOption &&
															mdColumnMinWidth ) ||
														( 'min' ===
															columnsOption &&
															columnMinWidth )
												) }
												onChange={ ( value ) =>
													setAttributes( {
														smColumnMinWidth:
															normalizeForUnitControl(
																value
															),
													} )
												}
											/>
										) }

										{ 'columns' === smColumnsOption && (
											<RangeControl
												__next40pxDefaultSize
												__nextHasNoMarginBottom
												label={ `${ __(
													'Columns count',
													'unitone'
												) } (${ __(
													'For mobile',
													'unitone'
												) })` }
												value={ normalizeForRangeControl(
													smColumns ||
														( 'columns' ===
															mdColumnsOption &&
															mdColumns ) ||
														( 'columns' ===
															columnsOption &&
															columns )
												) }
												onChange={ ( value ) =>
													setAttributes( {
														smColumns:
															normalizeForRangeControl(
																value
															),
													} )
												}
												min={ 1 }
												max={ 12 }
												step={ 1 }
												allowReset
											/>
										) }

										{ 'free' === smColumnsOption && (
											<TextControl
												__next40pxDefaultSize
												__nextHasNoMarginBottom
												label={ `${ __(
													'Free input',
													'unitone'
												) } (${ __(
													'For mobile',
													'unitone'
												) })` }
												value={ normalizeForTextControl(
													smGridTemplateColumns ||
														( 'free' ===
															mdColumnsOption &&
															mdGridTemplateColumns ) ||
														( 'free' ===
															columnsOption &&
															gridTemplateColumns )
												) }
												onChange={ ( value ) =>
													setAttributes( {
														smGridTemplateColumns:
															normalizeForTextControl(
																value
															),
													} )
												}
											/>
										) }
									</div>
								</>
							) }
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							rowsOption !==
								metadata.attributes.rowsOption.default ||
							mdRowsOption !==
								metadata.attributes.mdRowsOption.default ||
							smRowsOption !==
								metadata.attributes.smRowsOption.default ||
							rows !== metadata.attributes.rows.default ||
							mdRows !== metadata.attributes.mdRows.default ||
							smRows !== metadata.attributes.smRows.default
						}
						isShownByDefault
						label={ 'grid-template-rows' }
						onDeselect={ () =>
							setAttributes( {
								rowsOption:
									metadata.attributes.rowsOption.default,
								rows: metadata.attributes.rows.default,
								gridTemplateRows:
									metadata.attributes.gridTemplateRows
										.default,

								mdRowsOption:
									metadata.attributes.mdRowsOption.default,
								mdRows: metadata.attributes.mdRows.default,
								mdGridTemplateRows:
									metadata.attributes.mdGridTemplateRows
										.default,

								smRowsOption:
									metadata.attributes.smRowsOption.default,
								smRows: metadata.attributes.smRows.default,
								smGridTemplateRows:
									metadata.attributes.smGridTemplateRows
										.default,
							} )
						}
					>
						<ResponsiveSettingsContainer
							label={ 'grid-template-rows' }
							desktopControls={ () => (
								<>
									<ToggleGroupControl
										__next40pxDefaultSize
										__nextHasNoMarginBottom
										hideLabelFromVision
										className="unitone-toggle-group-control"
										value={ normalizeForToggleGroupControl(
											rowsOption
										) }
										onChange={ ( value ) => {
											setAttributes( {
												rowsOption:
													normalizeForToggleGroupControl(
														value
													),
											} );

											if (
												! mdRows &&
												! mdGridTemplateRows
											) {
												setAttributes( {
													mdRowsOption:
														normalizeForToggleGroupControl(
															value
														),
												} );
											}

											if (
												! smRows &&
												! smGridTemplateRows
											) {
												setAttributes( {
													smRowsOption:
														normalizeForToggleGroupControl(
															value
														),
												} );
											}
										} }
										isBlock
									>
										<ToggleGroupControlOption
											value="rows"
											label={ __(
												'Rows count',
												'unitone'
											) }
										/>
										<ToggleGroupControlOption
											value="free"
											label={ __(
												'Free input',
												'unitone'
											) }
										/>
									</ToggleGroupControl>

									<div className="unitone-toggle-group-control__body">
										{ 'rows' === rowsOption && (
											<RangeControl
												__next40pxDefaultSize
												__nextHasNoMarginBottom
												label={ __(
													'Rows count',
													'unitone'
												) }
												value={ normalizeForRangeControl(
													rows
												) }
												onChange={ ( value ) =>
													setAttributes( {
														rows: normalizeForRangeControl(
															value
														),
													} )
												}
												min={ 1 }
												max={ 12 }
												step={ 1 }
											/>
										) }

										{ 'free' === rowsOption && (
											<TextControl
												__next40pxDefaultSize
												__nextHasNoMarginBottom
												value={ normalizeForTextControl(
													gridTemplateRows
												) }
												onChange={ ( value ) =>
													setAttributes( {
														gridTemplateRows:
															normalizeForTextControl(
																value
															),
													} )
												}
											/>
										) }
									</div>
								</>
							) }
							tabletControls={ () => (
								<>
									<ToggleGroupControl
										__next40pxDefaultSize
										__nextHasNoMarginBottom
										hideLabelFromVision
										className="unitone-toggle-group-control"
										value={ normalizeForToggleGroupControl(
											mdRowsOption
										) }
										onChange={ ( value ) => {
											setAttributes( {
												mdRowsOption:
													normalizeForToggleGroupControl(
														value
													),
											} );

											if (
												! smRows &&
												! smGridTemplateRows
											) {
												setAttributes( {
													smRowsOption:
														normalizeForToggleGroupControl(
															value
														),
												} );
											}
										} }
										isBlock
									>
										<ToggleGroupControlOption
											value="rows"
											label={ __(
												'Rows count',
												'unitone'
											) }
										/>
										<ToggleGroupControlOption
											value="free"
											label={ __(
												'Free input',
												'unitone'
											) }
										/>
									</ToggleGroupControl>

									<div className="unitone-toggle-group-control__body">
										{ 'rows' === mdRowsOption && (
											<RangeControl
												__next40pxDefaultSize
												__nextHasNoMarginBottom
												label={ `${ __(
													'Rows count',
													'unitone'
												) } (${ __(
													'For tablet / mobile',
													'unitone'
												) })` }
												value={ normalizeForRangeControl(
													mdRows ||
														( 'rows' ===
															rowsOption &&
															rows )
												) }
												onChange={ ( value ) =>
													setAttributes( {
														mdRows: normalizeForRangeControl(
															value
														),
													} )
												}
												min={ 1 }
												max={ 12 }
												step={ 1 }
												allowReset
											/>
										) }

										{ 'free' === mdRowsOption && (
											<TextControl
												__next40pxDefaultSize
												__nextHasNoMarginBottom
												label={ `${ __(
													'Free input',
													'unitone'
												) } (${ __(
													'For tablet / mobile',
													'unitone'
												) })` }
												value={ normalizeForTextControl(
													mdGridTemplateRows ||
														( 'free' ===
															rowsOption &&
															gridTemplateRows )
												) }
												onChange={ ( value ) =>
													setAttributes( {
														mdGridTemplateRows:
															normalizeForTextControl(
																value
															),
													} )
												}
											/>
										) }
									</div>
								</>
							) }
							mobileControls={ () => (
								<>
									<ToggleGroupControl
										__next40pxDefaultSize
										__nextHasNoMarginBottom
										label={ `grid-template-rows (${ __(
											'For mobile',
											'unitone'
										) })` }
										className="unitone-toggle-group-control"
										value={ normalizeForToggleGroupControl(
											smRowsOption
										) }
										onChange={ ( value ) => {
											setAttributes( {
												smRowsOption:
													normalizeForToggleGroupControl(
														value
													),
											} );
										} }
										isBlock
									>
										<ToggleGroupControlOption
											value="rows"
											label={ __(
												'Rows count',
												'unitone'
											) }
										/>
										<ToggleGroupControlOption
											value="free"
											label={ __(
												'Free input',
												'unitone'
											) }
										/>
									</ToggleGroupControl>

									<div className="unitone-toggle-group-control__body">
										{ 'rows' === smRowsOption && (
											<RangeControl
												__next40pxDefaultSize
												__nextHasNoMarginBottom
												label={ `${ __(
													'Rows count',
													'unitone'
												) } (${ __(
													'For mobile',
													'unitone'
												) })` }
												value={ normalizeForRangeControl(
													smRows ||
														( 'rows' ===
															mdRowsOption &&
															mdRows ) ||
														( 'rows' ===
															rowsOption &&
															rows )
												) }
												onChange={ ( value ) =>
													setAttributes( {
														smRows: normalizeForRangeControl(
															value
														),
													} )
												}
												min={ 1 }
												max={ 12 }
												step={ 1 }
												allowReset
											/>
										) }

										{ 'free' === smRowsOption && (
											<TextControl
												__next40pxDefaultSize
												__nextHasNoMarginBottom
												label={ `${ __(
													'Free input',
													'unitone'
												) } (${ __(
													'For mobile',
													'unitone'
												) })` }
												value={ normalizeForTextControl(
													smGridTemplateRows ||
														( 'free' ===
															mdRowsOption &&
															mdGridTemplateRows ) ||
														( 'free' ===
															rowsOption &&
															gridTemplateRows )
												) }
												onChange={ ( value ) =>
													setAttributes( {
														smGridTemplateRows:
															normalizeForTextControl(
																value
															),
													} )
												}
											/>
										) }
									</div>
								</>
							) }
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							mdBreakpoint !==
							metadata.attributes.mdBreakpoint.default
						}
						isShownByDefault
						label={ __(
							'Tablet breakpoint (max width)',
							'unitone'
						) }
						onDeselect={ () =>
							setAttributes( {
								mdBreakpoint:
									metadata.attributes.mdBreakpoint.default,
							} )
						}
					>
						<UnitControl
							__next40pxDefaultSize
							label={ __(
								'Tablet breakpoint (max width)',
								'unitone'
							) }
							help={ __(
								'Anything less than this width will be considered tablet size.',
								'unitone'
							) }
							value={ normalizeForUnitControl( mdBreakpoint ) }
							onChange={ ( value ) =>
								setAttributes( {
									mdBreakpoint:
										normalizeForUnitControl( value ),
								} )
							}
							units={ breakpointUnits }
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							smBreakpoint !==
							metadata.attributes.smBreakpoint.default
						}
						isShownByDefault
						label={ __(
							'Mobile breakpoint (max width)',
							'unitone'
						) }
						onDeselect={ () =>
							setAttributes( {
								smBreakpoint:
									metadata.attributes.smBreakpoint.default,
							} )
						}
					>
						<UnitControl
							__next40pxDefaultSize
							label={ __(
								'Mobile breakpoint (max width)',
								'unitone'
							) }
							help={ __(
								'Anything less than this width will be considered mobile size.',
								'unitone'
							) }
							value={ normalizeForUnitControl( smBreakpoint ) }
							onChange={ ( value ) =>
								setAttributes( {
									smBreakpoint:
										normalizeForUnitControl( value ),
								} )
							}
							units={ breakpointUnits }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			{ __unstableUnitoneBlockOutline && (
				<GridVisualizer ref={ ref } attributes={ attributes } />
			) }
			<TagName { ...innerBlocksProps } />
			{ responsiveCSS && <style>{ responsiveCSS }</style> }
		</>
	);
}
