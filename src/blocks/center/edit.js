import classnames from 'classnames';

import {
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
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
	const { intrinsic, withText } = attributes;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( 'core/block-editor' ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const blockProps = useBlockProps();
	blockProps[ 'data-unitone-layout' ] = classnames(
		'center',
		blockProps[ 'data-unitone-layout' ],
		{
			'-intrinsic': intrinsic,
			'-with-text': withText,
		}
	);

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
							intrinsic !== metadata.attributes.intrinsic.default
						}
						isShownByDefault
						label={ __(
							'Centering by intrinsic size of children',
							'unitone'
						) }
						onDeselect={ () =>
							setAttributes( {
								intrinsic:
									metadata.attributes.intrinsic.default,
							} )
						}
					>
						<ToggleControl
							label={ __(
								'Centering by intrinsic size of children',
								'unitone'
							) }
							checked={ intrinsic }
							onChange={ ( newAttribute ) => {
								setAttributes( { intrinsic: newAttribute } );
							} }
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							withText !== metadata.attributes.withText.default
						}
						isShownByDefault
						label={ __( 'Text is also centered', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								withText: metadata.attributes.withText.default,
							} )
						}
					>
						<ToggleControl
							label={ __( 'Text is also centered', 'unitone' ) }
							checked={ withText }
							onChange={ ( newAttribute ) => {
								setAttributes( { withText: newAttribute } );
							} }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<div { ...innerBlocksProps } />
		</>
	);
}
