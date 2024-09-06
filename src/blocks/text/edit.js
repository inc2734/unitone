import clsx from 'clsx';

import {
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	TextControl,
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';

export default function ( {
	attributes,
	setAttributes,
	clientId,
	__unstableLayoutClassNames: layoutClassNames,
} ) {
	const { center, column, columnWidth, templateLock } = attributes;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		className: layoutClassNames,
		style: {
			'--unitone--column-width': ( column && columnWidth ) || undefined,
		},
	} );
	blockProps[ 'data-unitone-layout' ] = clsx(
		'text',
		'-gap',
		blockProps[ 'data-unitone-layout' ],
		{
			'-center': center,
			'-column': column,
		}
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock,
		renderAppender: hasInnerBlocks
			? undefined
			: InnerBlocks.ButtonBlockAppender,
	} );

	return (
		<>
			<InspectorControls>
				<ToolsPanel label={ __( 'Settings', 'unitone' ) }>
					<ToolsPanelItem
						hasValue={ () =>
							center !== metadata.attributes.center.default
						}
						isShownByDefault
						label={ __(
							'Centering by intrinsic size of children',
							'unitone'
						) }
						onDeselect={ () =>
							setAttributes( {
								center: metadata.attributes.center.default,
							} )
						}
					>
						<ToggleControl
							label={ __(
								'Centering by intrinsic size of children',
								'unitone'
							) }
							checked={ center }
							onChange={ ( newAttribute ) => {
								setAttributes( { center: newAttribute } );
							} }
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							column !== metadata.attributes.column.default
						}
						isShownByDefault
						label={ __( 'Multi columns', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								column: metadata.attributes.column.default,
							} )
						}
					>
						<ToggleControl
							label={ __( 'Multi columns', 'unitone' ) }
							checked={ column }
							onChange={ ( newAttribute ) => {
								setAttributes( { column: newAttribute } );
							} }
						/>
					</ToolsPanelItem>

					{ column && (
						<ToolsPanelItem
							hasValue={ () =>
								columnWidth !==
								metadata.attributes.columnWidth.default
							}
							isShownByDefault
							label={ __( 'Column width', 'unitone' ) }
							onDeselect={ () =>
								setAttributes( {
									columnWidth:
										metadata.attributes.columnWidth.default,
								} )
							}
						>
							<TextControl
								label={
									<>
										{ __( 'Column width', 'unitone' ) }
										&nbsp;:&nbsp;
										<code>colum-width</code>
									</>
								}
								value={ columnWidth || '' }
								onChange={ ( newAttribute ) => {
									setAttributes( {
										columnWidth: newAttribute,
									} );
								} }
							/>
						</ToolsPanelItem>
					) }
				</ToolsPanel>
			</InspectorControls>

			<div { ...innerBlocksProps } />
		</>
	);
}
