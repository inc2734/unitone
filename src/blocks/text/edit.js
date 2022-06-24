import classnames from 'classnames';

import {
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	useSetting,
} from '@wordpress/block-editor';

import { PanelBody, ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

export default function ( { attributes, setAttributes, clientId } ) {
	const { center, column } = attributes;

	// const hasInnerBlocks = useSelect(
	// 	( select ) =>
	// 		!! select( 'core/block-editor' ).getBlock( clientId )?.innerBlocks
	// 			?.length,
	// 	[ clientId ]
	// );

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
				<PanelBody title={ __( 'General', 'unitone' ) }>
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

					<ToggleControl
						label={ __( 'Multi columns', 'unitone' ) }
						checked={ column }
						onChange={ ( newAttribute ) => {
							setAttributes( { column: newAttribute } );
						} }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...innerBlocksProps } />
		</>
	);
}
