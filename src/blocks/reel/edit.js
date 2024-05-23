import classnames from 'classnames';

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

export default function ( { attributes, setAttributes, clientId } ) {
	const { height, itemWidth, noBar, templateLock } = attributes;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		style: {
			'--unitone--height': height || undefined,
			'--unitone--item-width': itemWidth || undefined,
		},
	} );
	blockProps[ 'data-unitone-layout' ] = classnames(
		'reel',
		blockProps[ 'data-unitone-layout' ],
		{
			'-no-bar': noBar,
		}
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		orientation: 'horizontal',
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
							height !== metadata.attributes.height.default
						}
						isShownByDefault
						label={ __( 'Height', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								height: metadata.attributes.height.default,
							} )
						}
					>
						<TextControl
							label={
								<>
									{ __( 'Height', 'unitone' ) }&nbsp;:&nbsp;
									<code>height</code>
								</>
							}
							value={ height }
							onChange={ ( newAttribute ) => {
								setAttributes( { height: newAttribute } );
							} }
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							itemWidth !== metadata.attributes.itemWidth.default
						}
						isShownByDefault
						label={ __( 'Each items width', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								itemWidth:
									metadata.attributes.itemWidth.default,
							} )
						}
					>
						<TextControl
							label={
								<>
									{ __( 'Each items width', 'unitone' ) } :
									<code>flex-basis</code>
								</>
							}
							value={ itemWidth }
							onChange={ ( newAttribute ) => {
								setAttributes( { itemWidth: newAttribute } );
							} }
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							noBar !== metadata.attributes.noBar.default
						}
						isShownByDefault
						label={ __( 'No scrollbar', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								noBar: metadata.attributes.noBar.default,
							} )
						}
					>
						<ToggleControl
							label={ __( 'No scrollbar', 'unitone' ) }
							checked={ noBar }
							onChange={ ( newAttribute ) => {
								setAttributes( { noBar: newAttribute } );
							} }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
			<div { ...innerBlocksProps } />
		</>
	);
}
