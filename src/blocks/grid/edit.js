import classnames from 'classnames';

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
import { store as editorStore } from '@wordpress/editor';
import { store as editPostStore } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';

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
	} = attributes;

	const hasInnerBlocks = useSelect(
		( select ) => {
			const { getBlock } = select( blockEditorStore );
			const block = getBlock( clientId );
			return !! ( block && block.innerBlocks.length );
		},
		[ clientId ]
	);

	const deviceType = useSelect( ( select ) => {
		const { getDeviceType } = select( editorStore );
		if ( null != getDeviceType ) {
			return getDeviceType();
		}

		const { __experimentalGetPreviewDeviceType } = select( editPostStore );
		return __experimentalGetPreviewDeviceType();
	}, [] );

	const TagName = tagName;

	const styles = {
		'--unitone--columns':
			( 'columns' === columnsOption && String( columns ) ) || undefined,
		'--unitone--column-min-width':
			( 'min' === columnsOption && columnMinWidth ) || undefined,
		'--unitone--grid-template-columns':
			( 'free' === columnsOption && gridTemplateColumns ) || undefined,
		'--unitone--column-auto-repeat':
			( 'min' === columnsOption && columnAutoRepeat ) || undefined,
		'--unitone--md-columns':
			( 'columns' === mdColumnsOption &&
				!! mdColumns &&
				String( mdColumns ) ) ||
			undefined,
		'--unitone--md-column-min-width':
			( 'min' === mdColumnsOption && mdColumnMinWidth ) || undefined,
		'--unitone--md-grid-template-columns':
			( 'free' === mdColumnsOption && mdGridTemplateColumns ) ||
			undefined,
		'--unitone--sm-columns':
			( 'columns' === smColumnsOption &&
				!! smColumns &&
				String( smColumns ) ) ||
			undefined,
		'--unitone--sm-column-min-width':
			( 'min' === smColumnsOption && smColumnMinWidth ) || undefined,
		'--unitone--sm-grid-template-columns':
			( 'free' === smColumnsOption && smGridTemplateColumns ) ||
			undefined,
		'--unitone--rows':
			( 'rows' === rowsOption && String( rows ) ) || undefined,
		'--unitone--grid-template-rows':
			( 'free' === rowsOption && gridTemplateRows ) || undefined,
		'--unitone--md-rows':
			( 'rows' === mdRowsOption && String( mdRows ) ) || undefined,
		'--unitone--md-grid-template-rows':
			( 'free' === mdRowsOption && mdGridTemplateRows ) || undefined,
		'--unitone--sm-rows':
			( 'rows' === smRowsOption && String( smRows ) ) || undefined,
		'--unitone--sm-grid-template-rows':
			( 'free' === smRowsOption && smGridTemplateRows ) || undefined,
	};

	const blockProps = useBlockProps( {
		className: 'unitone-grid',
		style: styles,
	} );
	blockProps[ 'data-unitone-layout' ] = classnames(
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
			? InnerBlocks.DefaultBlockAppender
			: InnerBlocks.ButtonBlockAppender,
	} );

	return (
		<>
			<InspectorControls>
				<ToolsPanel label={ __( 'Settings', 'unitone' ) }>
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

					{ 'Desktop' === deviceType && (
						<ToolsPanelItem
							hasValue={ () =>
								columnsOption !==
								metadata.attributes.columnsOption.default
							}
							isShownByDefault
							label={ 'grid-template-columns' }
							onDeselect={ () => {
								setAttributes( {
									columnsOption:
										metadata.attributes.columnsOption
											.default,
									columns:
										metadata.attributes.columns.default,
									columnMinWidth:
										metadata.attributes.columnMinWidth
											.default,
									columnAutoRepeat:
										metadata.attributes.columnAutoRepeat
											.default,
									gridTemplateColumns:
										metadata.attributes.gridTemplateColumns
											.default,
								} );
							} }
						>
							<ToggleGroupControl
								label="grid-template-columns"
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
									label={ __( 'Minimum width', 'unitone' ) }
								/>
								<ToggleGroupControlOption
									value="columns"
									label={ __( 'Columns count', 'unitone' ) }
								/>
								<ToggleGroupControlOption
									value="free"
									label={ __( 'Free input', 'unitone' ) }
								/>
							</ToggleGroupControl>

							<div className="unitone-toggle-group-control__body">
								{ 'min' === columnsOption && (
									<>
										<UnitControl
											label={ __(
												'Minimum width',
												'unitone'
											) }
											value={ columnMinWidth }
											onChange={ ( value ) =>
												setAttributes( {
													columnMinWidth: value,
												} )
											}
											disabled={
												'Desktop' !== deviceType
											}
										/>

										<ToggleGroupControl
											label={ __(
												'Auto repeat',
												'unitone'
											) }
											value={ columnAutoRepeat }
											onChange={ ( value ) => {
												setAttributes( {
													columnAutoRepeat: value,
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
										label={ __(
											'Columns count',
											'unitone'
										) }
										value={ parseInt( columns ) }
										onChange={ ( value ) =>
											setAttributes( {
												columns: parseInt( value ),
											} )
										}
										min={ 1 }
										max={ 12 }
										step={ 1 }
									/>
								) }

								{ 'free' === columnsOption && (
									<TextControl
										value={ gridTemplateColumns }
										onChange={ ( value ) =>
											setAttributes( {
												gridTemplateColumns: value,
											} )
										}
									/>
								) }
							</div>
						</ToolsPanelItem>
					) }

					{ 'Tablet' === deviceType && (
						<ToolsPanelItem
							hasValue={ () =>
								mdColumnsOption !==
								metadata.attributes.mdColumnsOption.default
							}
							isShownByDefault
							label={ `grid-template-columns (${ __(
								'For tablet / mobile',
								'unitone'
							) })` }
							onDeselect={ () => {
								setAttributes( {
									mdColumnsOption:
										metadata.attributes.mdColumnsOption
											.default,
									mdColumns:
										metadata.attributes.mdColumns.default,
									mdColumnMinWidth:
										metadata.attributes.mdColumnMinWidth
											.default,
									mdGridTemplateColumns:
										metadata.attributes
											.mdGridTemplateColumns.default,
								} );
							} }
						>
							<ToggleGroupControl
								label={ `grid-template-columns (${ __(
									'For tablet / mobile',
									'unitone'
								) })` }
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
									label={ __( 'Minimum width', 'unitone' ) }
								/>
								<ToggleGroupControlOption
									value="columns"
									label={ __( 'Columns count', 'unitone' ) }
								/>
								<ToggleGroupControlOption
									value="free"
									label={ __( 'Free input', 'unitone' ) }
								/>
							</ToggleGroupControl>

							<div className="unitone-toggle-group-control__body">
								{ 'min' === mdColumnsOption && (
									<>
										<UnitControl
											label={ __(
												'Minimum width',
												'unitone'
											) }
											value={ columnMinWidth }
											disabled
										/>

										<UnitControl
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
									</>
								) }

								{ 'columns' === mdColumnsOption && (
									<>
										<RangeControl
											label={ __(
												'Columns count',
												'unitone'
											) }
											value={ parseInt( columns ) }
											min={ 1 }
											max={ 12 }
											step={ 1 }
											disabled
										/>

										<RangeControl
											label={ `${ __(
												'Columns count',
												'unitone'
											) } (${ __(
												'For tablet / mobile',
												'unitone'
											) })` }
											value={
												!! mdColumns &&
												parseInt( mdColumns )
											}
											onChange={ ( value ) =>
												setAttributes( {
													mdColumns:
														parseInt( value ),
												} )
											}
											min={ 1 }
											max={ 12 }
											step={ 1 }
											allowReset
										/>
									</>
								) }

								{ 'free' === mdColumnsOption && (
									<>
										<TextControl
											label={ __(
												'Free input',
												'unitone'
											) }
											value={ gridTemplateColumns }
											disabled
										/>

										<TextControl
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
									</>
								) }
							</div>
						</ToolsPanelItem>
					) }

					{ 'Mobile' === deviceType && (
						<ToolsPanelItem
							hasValue={ () =>
								smColumnsOption !==
								metadata.attributes.smColumnsOption.default
							}
							isShownByDefault
							label={ `grid-template-columns (${ __(
								'For mobile',
								'unitone'
							) })` }
							onDeselect={ () => {
								setAttributes( {
									smColumnsOption:
										metadata.attributes.smColumnsOption
											.default,
									smColumns:
										metadata.attributes.smColumns.default,
									smColumnMinWidth:
										metadata.attributes.smColumnMinWidth
											.default,
									smGridTemplateColumns:
										metadata.attributes
											.smGridTemplateColumns.default,
								} );
							} }
						>
							<ToggleGroupControl
								label={ `grid-template-columns (${ __(
									'For mobile',
									'unitone'
								) })` }
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
									label={ __( 'Minimum width', 'unitone' ) }
								/>
								<ToggleGroupControlOption
									value="columns"
									label={ __( 'Columns count', 'unitone' ) }
								/>
								<ToggleGroupControlOption
									value="free"
									label={ __( 'Free input', 'unitone' ) }
								/>
							</ToggleGroupControl>

							<div className="unitone-toggle-group-control__body">
								{ 'min' === smColumnsOption && (
									<>
										<UnitControl
											label={ __(
												'Minimum width',
												'unitone'
											) }
											value={ columnMinWidth }
											disabled
										/>

										<UnitControl
											label={ `${ __(
												'Minimum width',
												'unitone'
											) } (${ __(
												'For tablet / mobile',
												'unitone'
											) })` }
											value={ mdColumnMinWidth }
											disabled
										/>

										<UnitControl
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
									</>
								) }

								{ 'columns' === smColumnsOption && (
									<>
										<RangeControl
											label={ __(
												'Columns count',
												'unitone'
											) }
											value={ parseInt( columns ) }
											min={ 1 }
											max={ 12 }
											step={ 1 }
											disabled
										/>

										<RangeControl
											label={ `${ __(
												'Columns count',
												'unitone'
											) } (${ __(
												'For tablet / mobile',
												'unitone'
											) })` }
											value={
												!! mdColumns &&
												parseInt( mdColumns )
											}
											min={ 1 }
											max={ 12 }
											step={ 1 }
											disabled
										/>

										<RangeControl
											label={ `${ __(
												'Columns count',
												'unitone'
											) } (${ __(
												'For mobile',
												'unitone'
											) })` }
											value={
												!! smColumns &&
												parseInt( smColumns )
											}
											onChange={ ( value ) =>
												setAttributes( {
													smColumns:
														parseInt( value ),
												} )
											}
											min={ 1 }
											max={ 12 }
											step={ 1 }
											allowReset
										/>
									</>
								) }

								{ 'free' === smColumnsOption && (
									<>
										<TextControl
											label={ __(
												'Free input',
												'unitone'
											) }
											value={ gridTemplateColumns }
											disabled
										/>

										<TextControl
											label={ `${ __(
												'Free input',
												'unitone'
											) } (${ __(
												'For tablet / mobile',
												'unitone'
											) })` }
											value={ mdGridTemplateColumns }
											disabled
										/>

										<TextControl
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
									</>
								) }
							</div>
						</ToolsPanelItem>
					) }

					{ 'Desktop' === deviceType && (
						<ToolsPanelItem
							hasValue={ () =>
								rowsOption !==
								metadata.attributes.rowsOption.default
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
								} )
							}
						>
							<ToggleGroupControl
								label="grid-template-rows"
								className="unitone-toggle-group-control"
								value={ rowsOption }
								onChange={ ( value ) => {
									setAttributes( {
										rowsOption: value,
										rows: metadata.attributes.rows.default,
										gridTemplateRows:
											metadata.attributes.gridTemplateRows
												.default,
									} );
								} }
								isBlock
							>
								<ToggleGroupControlOption
									value="rows"
									label={ __( 'Rows count', 'unitone' ) }
								/>
								<ToggleGroupControlOption
									value="free"
									label={ __( 'Free input', 'unitone' ) }
								/>
							</ToggleGroupControl>

							<div className="unitone-toggle-group-control__body">
								{ 'rows' === rowsOption && (
									<RangeControl
										label={ __( 'Rows count', 'unitone' ) }
										value={ parseInt( rows ) }
										onChange={ ( value ) =>
											setAttributes( {
												rows: parseInt( value ),
											} )
										}
										min={ 1 }
										max={ 12 }
										step={ 1 }
									/>
								) }

								{ 'free' === rowsOption && (
									<TextControl
										value={ gridTemplateRows }
										onChange={ ( value ) =>
											setAttributes( {
												gridTemplateRows: value,
											} )
										}
									/>
								) }
							</div>
						</ToolsPanelItem>
					) }

					{ 'Tablet' === deviceType && (
						<ToolsPanelItem
							hasValue={ () =>
								rowsOption !==
								metadata.attributes.mdRowsOption.default
							}
							isShownByDefault
							label={ `grid-template-rows (${ __(
								'For tablet / mobile',
								'unitone'
							) })` }
							onDeselect={ () =>
								setAttributes( {
									mdRowsOption:
										metadata.attributes.mdRowsOption
											.default,
									mdRows: metadata.attributes.mdRows.default,
									mdGridTemplateRows:
										metadata.attributes.mdGridTemplateRows
											.default,
								} )
							}
						>
							<ToggleGroupControl
								label={ `grid-template-rows (${ __(
									'For tablet / mobile',
									'unitone'
								) })` }
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
									label={ __( 'Rows count', 'unitone' ) }
								/>
								<ToggleGroupControlOption
									value="free"
									label={ __( 'Free input', 'unitone' ) }
								/>
							</ToggleGroupControl>

							<div className="unitone-toggle-group-control__body">
								{ 'rows' === mdRowsOption && (
									<>
										<RangeControl
											label={ __(
												'Rows count',
												'unitone'
											) }
											value={ parseInt( rows ) }
											min={ 1 }
											max={ 12 }
											step={ 1 }
											disabled
										/>

										<RangeControl
											label={ `${ __(
												'Rows count',
												'unitone'
											) } (${ __(
												'For tablet / mobile',
												'unitone'
											) })` }
											value={
												!! mdRows && parseInt( mdRows )
											}
											onChange={ ( value ) =>
												setAttributes( {
													mdRows: parseInt( value ),
												} )
											}
											min={ 1 }
											max={ 12 }
											step={ 1 }
											allowReset
										/>
									</>
								) }

								{ 'free' === mdRowsOption && (
									<>
										<TextControl
											label={ __(
												'Free input',
												'unitone'
											) }
											value={ gridTemplateRows }
											disabled
										/>

										<TextControl
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
													mdGridTemplateRows: value,
												} )
											}
										/>
									</>
								) }
							</div>
						</ToolsPanelItem>
					) }

					{ 'Mobile' === deviceType && (
						<ToolsPanelItem
							hasValue={ () =>
								rowsOption !==
								metadata.attributes.smRowsOption.default
							}
							isShownByDefault
							label={ `grid-template-rows (${ __(
								'For mobile',
								'unitone'
							) })` }
							onDeselect={ () =>
								setAttributes( {
									smRowsOption:
										metadata.attributes.smRowsOption
											.default,
									smRows: metadata.attributes.smRows.default,
									smGridTemplateRows:
										metadata.attributes.smGridTemplateRows
											.default,
								} )
							}
						>
							<ToggleGroupControl
								label={ `grid-template-rows (${ __(
									'For mobile',
									'unitone'
								) })` }
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
									label={ __( 'Rows count', 'unitone' ) }
								/>
								<ToggleGroupControlOption
									value="free"
									label={ __( 'Free input', 'unitone' ) }
								/>
							</ToggleGroupControl>

							<div className="unitone-toggle-group-control__body">
								{ 'rows' === mdRowsOption && (
									<>
										<RangeControl
											label={ __(
												'Rows count',
												'unitone'
											) }
											value={ parseInt( rows ) }
											min={ 1 }
											max={ 12 }
											step={ 1 }
											disabled
										/>

										<RangeControl
											label={ `${ __(
												'Rows count',
												'unitone'
											) } (${ __(
												'For tablet / mobile',
												'unitone'
											) })` }
											value={
												!! mdRows && parseInt( mdRows )
											}
											min={ 1 }
											max={ 12 }
											step={ 1 }
											disabled
										/>

										<RangeControl
											label={ `${ __(
												'Rows count',
												'unitone'
											) } (${ __(
												'For mobile',
												'unitone'
											) })` }
											value={
												!! smRows && parseInt( smRows )
											}
											onChange={ ( value ) =>
												setAttributes( {
													smRows: parseInt( value ),
												} )
											}
											min={ 1 }
											max={ 12 }
											step={ 1 }
											allowReset
										/>
									</>
								) }

								{ 'free' === smRowsOption && (
									<>
										<TextControl
											label={ __(
												'Free input',
												'unitone'
											) }
											value={ gridTemplateRows }
											disabled
										/>

										<TextControl
											label={ `${ __(
												'Free input',
												'unitone'
											) } (${ __(
												'For tablet / mobile',
												'unitone'
											) })` }
											value={ mdGridTemplateRows }
											disabled
										/>

										<TextControl
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
													smGridTemplateRows: value,
												} )
											}
										/>
									</>
								) }
							</div>
						</ToolsPanelItem>
					) }
				</ToolsPanel>
			</InspectorControls>

			<TagName { ...innerBlocksProps } />
		</>
	);
}
