import classnames from 'classnames';

import {
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	useSetting,
} from '@wordpress/block-editor';

import {
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';

export default function ( { attributes, setAttributes, clientId } ) {
	const { center, column } = attributes;

	const { hasInnerBlocks, themeSupportsLayout } = useSelect(
		( select ) => {
			const { getBlock, getSettings } = select( 'core/block-editor' );
			const block = getBlock( clientId );
			return {
				hasInnerBlocks: !! ( block && block.innerBlocks.length ),
				themeSupportsLayout: getSettings()?.supportsLayout,
			};
		},
		[ clientId ]
	);
	const defaultLayout = useSetting( 'layout' ) || {};
	const { layout = {} } = attributes;
	const usedLayout = !! layout && layout.inherit ? defaultLayout : layout;
	const { type = 'default' } = usedLayout;
	const layoutSupportEnabled = themeSupportsLayout || type !== 'default';

	const blockProps = useBlockProps();
	blockProps[ 'data-unitone-layout' ] = classnames(
		'text',
		blockProps[ 'data-unitone-layout' ],
		{
			'-center': center,
			'-column': column,
		}
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock: false,
		renderAppender: hasInnerBlocks
			? InnerBlocks.DefaultBlockAppender
			: InnerBlocks.ButtonBlockAppender,
		__experimentalLayout: layoutSupportEnabled ? usedLayout : undefined,
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
							help={ __(
								'The "Max width" setting is used as the width of each column.',
								'unitone'
							) }
							checked={ column }
							onChange={ ( newAttribute ) => {
								setAttributes( { column: newAttribute } );
							} }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<div { ...innerBlocksProps } />
		</>
	);
}
