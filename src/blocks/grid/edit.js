import classnames from 'classnames';

import {
	InnerBlocks,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
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
import { __ } from '@wordpress/i18n';

import metadata from './block.json';

export default function ( { attributes, setAttributes, clientId } ) {
	const {
		tagName,
		columnsOption,
		columns,
		columnMinWidth,
		columnAutoRepeat,
		gridTemplateColumns,
		rowsOption,
		rows,
		gridTemplateRows,
	} = attributes;

	const hasInnerBlocks = useSelect(
		( select ) => {
			const { getBlock } = select( 'core/block-editor' );
			const block = getBlock( clientId );
			return !! ( block && block.innerBlocks.length );
		},
		[ clientId ]
	);

	const TagName = tagName;

	const styles = {
		'--unitone--columns':
			( 'columns' === columnsOption && String( columns ) ) || undefined,
		'--unitone--column-min-width':
			( 'min' === columnsOption && columnMinWidth ) || undefined,
		'--unitone--column-auto-repeat':
			( 'min' === columnsOption && columnAutoRepeat ) || undefined,
		'--unitone--grid-template-columns':
			( 'free' === columnsOption && gridTemplateColumns ) || undefined,
		'--unitone--rows':
			( 'rows' === rowsOption && String( rows ) ) || undefined,
		'--unitone--grid-template-rows':
			( 'free' === rowsOption && gridTemplateRows ) || undefined,
	};

	const blockProps = useBlockProps( {
		className: 'unitone-grid',
		style: styles,
		'data-unitone-layout': classnames( {
			[ `-columns:${ columnsOption }` ]: !! columnsOption,
			[ `-rows:${ rowsOption }` ]: !! rowsOption,
		} ),
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
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

					<ToolsPanelItem
						hasValue={ () =>
							columnsOption !==
							metadata.attributes.columnsOption.default
						}
						isShownByDefault
						label={ 'grid-template-columns' }
						onDeselect={ () =>
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
							} )
						}
					>
						<ToggleGroupControl
							label="grid-template-columns"
							className="unitone-toggle-group-control"
							value={ columnsOption }
							onChange={ ( value ) => {
								setAttributes( {
									columnsOption: value,
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
									/>

									<ToggleGroupControl
										label={ __( 'Auto repeat', 'unitone' ) }
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
									label={ __( 'Columns count', 'unitone' ) }
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
				</ToolsPanel>
			</InspectorControls>

			<TagName { ...innerBlocksProps } />
		</>
	);
}
