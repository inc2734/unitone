import clsx from 'clsx';

import {
	InnerBlocks,
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
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import {
	GridVisualizer,
	useToolsPanelDropdownMenuProps,
} from '../../js/editor/hooks/utils';
import { ResponsiveSettingsContainer } from '../../js/editor/hooks/components';

import metadata from './block.json';

const parseString = ( value ) => {
	if ( null == value ) {
		return undefined;
	}

	value = String( value );
	return null !== value && '' !== value ? value : undefined;
};

const parseNumber = ( value ) => {
	if ( null == value ) {
		return undefined;
	}

	value = parseInt( value );
	return ! isNaN( value ) ? value : undefined;
};

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
		templateLock,
		__unstableUnitoneBlockOutline,
	} = attributes;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const TagName = tagName;

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

	const ref = useRef();

	const blockProps = useBlockProps( {
		ref,
		className: 'unitone-grid',
		style: styles,
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

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock,
		renderAppender: hasInnerBlocks
			? undefined
			: InnerBlocks.ButtonBlockAppender,
	} );

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
								{ label: '<header>', value: 'header' },
								{ label: '<main>', value: 'main' },
								{ label: '<section>', value: 'section' },
								{ label: '<article>', value: 'article' },
								{ label: '<aside>', value: 'aside' },
								{ label: '<footer>', value: 'footer' },
								{ label: '<div>', value: 'div' },
							] }
							value={ tagName }
							onChange={ ( newAttribute ) =>
								setAttributes( { tagName: newAttribute } )
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
								metadata.attributes.smColumnsOption.default ||
							columnMinWidth !==
								metadata.attributes.columnMinWidth.default ||
							mdColumnMinWidth !==
								metadata.attributes.mdColumnMinWidth.default ||
							smColumnMinWidth !==
								metadata.attributes.smColumnMinWidth.default
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
										value={ columnsOption }
										onChange={ ( value ) => {
											setAttributes( {
												columnsOption: value,
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
										{ 'min' === columnsOption && (
											<>
												<UnitControl
													__next40pxDefaultSize
													label={ __(
														'Minimum width',
														'unitone'
													) }
													value={ columnMinWidth }
													onChange={ ( value ) =>
														setAttributes( {
															columnMinWidth:
																value,
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
													value={ columnAutoRepeat }
													onChange={ ( value ) => {
														setAttributes( {
															columnAutoRepeat:
																value,
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
												value={ parseNumber( columns ) }
												onChange={ ( value ) =>
													setAttributes( {
														columns:
															parseNumber(
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
												value={ gridTemplateColumns }
												onChange={ ( value ) =>
													setAttributes( {
														gridTemplateColumns:
															value,
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
										value={ mdColumnsOption }
										onChange={ ( value ) => {
											setAttributes( {
												mdColumnsOption: value,
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
												value={ mdColumnMinWidth }
												onChange={ ( value ) =>
													setAttributes( {
														mdColumnMinWidth: value,
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
												value={ parseNumber(
													mdColumns
												) }
												onChange={ ( value ) =>
													setAttributes( {
														mdColumns:
															parseNumber(
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
												value={ mdGridTemplateColumns }
												onChange={ ( value ) =>
													setAttributes( {
														mdGridTemplateColumns:
															value,
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
										value={ smColumnsOption }
										onChange={ ( value ) => {
											setAttributes( {
												smColumnsOption: value,
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
												value={ smColumnMinWidth }
												onChange={ ( value ) =>
													setAttributes( {
														smColumnMinWidth: value,
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
												value={ parseNumber(
													smColumns
												) }
												onChange={ ( value ) =>
													setAttributes( {
														smColumns:
															parseNumber(
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
												value={ smGridTemplateColumns }
												onChange={ ( value ) =>
													setAttributes( {
														smGridTemplateColumns:
															value,
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
										value={ rowsOption }
										onChange={ ( value ) => {
											setAttributes( {
												rowsOption: value,
												rows: metadata.attributes.rows
													.default,
												gridTemplateRows:
													metadata.attributes
														.gridTemplateRows
														.default,
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
										{ 'rows' === rowsOption && (
											<RangeControl
												__next40pxDefaultSize
												__nextHasNoMarginBottom
												label={ __(
													'Rows count',
													'unitone'
												) }
												value={ parseNumber( rows ) }
												onChange={ ( value ) =>
													setAttributes( {
														rows: parseNumber(
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
												value={ gridTemplateRows }
												onChange={ ( value ) =>
													setAttributes( {
														gridTemplateRows: value,
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
										value={ mdRowsOption }
										onChange={ ( value ) => {
											setAttributes( {
												mdRowsOption: value,
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
												value={ parseNumber( mdRows ) }
												onChange={ ( value ) =>
													setAttributes( {
														mdRows: parseNumber(
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
												value={ mdGridTemplateRows }
												onChange={ ( value ) =>
													setAttributes( {
														mdGridTemplateRows:
															value,
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
										value={ mdRowsOption }
										onChange={ ( value ) => {
											setAttributes( {
												smRowsOption: value,
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
												value={ parseNumber( smRows ) }
												onChange={ ( value ) =>
													setAttributes( {
														smRows: parseNumber(
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
												value={ smGridTemplateRows }
												onChange={ ( value ) =>
													setAttributes( {
														smGridTemplateRows:
															value,
													} )
												}
											/>
										) }
									</div>
								</>
							) }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			{ __unstableUnitoneBlockOutline && (
				<GridVisualizer ref={ ref } attributes={ attributes } />
			) }
			<TagName { ...innerBlocksProps } />
		</>
	);
}
