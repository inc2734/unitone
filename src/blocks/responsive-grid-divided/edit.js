import clsx from 'clsx';

import {
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	SelectControl,
	TextControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useResizeObserver } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { useRef, useEffect, useLayoutEffect } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

import {
	GridVisualizer,
	useToolsPanelDropdownMenuProps,
} from '../../js/editor/hooks/utils';

import metadata from './block.json';

import { setDividerLinewrap, debounce } from '@inc2734/unitone-css/library';

export default function ( { attributes, setAttributes, clientId } ) {
	const {
		tagName,
		columnMinWidth,
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

	const ref = useRef( null );

	const resizeObserve = useResizeObserver(
		debounce(
			( entries ) => setDividerLinewrap( entries?.[ 0 ]?.target ),
			250
		)
	);

	useLayoutEffect( () => {
		resizeObserve( ref.current );
	}, [ ref.current ] );

	useEffect( () => {
		setDividerLinewrap( ref.current );
	}, [ innerBlocksLength, attributes ] );

	const blockProps = useBlockProps( {
		ref,
		style: {
			'--unitone--column-min-width': columnMinWidth || undefined,
		},
	} );
	blockProps[ 'data-unitone-layout' ] = clsx(
		'responsive-grid',
		blockProps[ 'data-unitone-layout' ]
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock,
		allowedBlocks,
		renderAppender: hasInnerBlocks
			? undefined
			: InnerBlocks.ButtonBlockAppender,
	} );

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const TagName = tagName;

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
							value={ tagName }
							onChange={ ( newAttribute ) =>
								setAttributes( { tagName: newAttribute } )
							}
						/>
					</ToolsPanelItem>
					<ToolsPanelItem
						hasValue={ () =>
							columnMinWidth !==
							metadata.attributes.columnMinWidth.default
						}
						isShownByDefault
						label={ __( 'Column min width', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								columnMinWidth:
									metadata.attributes.columnMinWidth.default,
							} )
						}
					>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={
								<>
									{ __( 'Column min width', 'unitone' ) }
									&nbsp;:&nbsp;
									<span
										dangerouslySetInnerHTML={ {
											__html: sprintf(
												// translators: %1$s: <code>, %2$s: </code>
												__(
													'Inside the %1$sgrid-template-columns%2$s formula',
													'unitone'
												),
												'<code>',
												'</code>'
											),
										} }
									/>
								</>
							}
							help={
								__(
									'When the column width is less than this value, it is aligned in a single column.',
									'unitone'
								) +
								' ' +
								__(
									'If "auto-repeat" is "auto-fill" the column will maintain this size." auto-fit", the column will stretch to fill the available space.',
									'unitone'
								)
							}
							value={ columnMinWidth }
							onChange={ ( newAttribute ) =>
								setAttributes( {
									columnMinWidth: newAttribute,
								} )
							}
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
