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
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { useRef, useEffect } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

import { GridVisualizer } from '../../js/editor/hooks/utils';

import metadata from './block.json';

import {
	stairsResizeObserver,
	setStairsStep,
} from '@inc2734/unitone-css/library';

export default function ( { attributes, setAttributes, clientId } ) {
	const {
		columnMinWidth,
		unitone,
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

	useEffect( () => {
		const target = ref.current;

		const observer = stairsResizeObserver( target );

		return () => {
			if ( !! target ) {
				observer.unobserve( target );
			}
		};
	}, [
		clientId,
		columnMinWidth,
		unitone?.gap,
		unitone?.stairs,
		unitone?.stairsUp,
	] );

	useEffect( () => {
		setStairsStep( ref.current );
	}, [ innerBlocksLength ] );

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
			<div { ...innerBlocksProps } />
		</>
	);
}
