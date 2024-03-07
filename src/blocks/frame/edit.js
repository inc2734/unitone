import classnames from 'classnames';

import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import {
	TextControl,
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { __ } from '@wordpress/i18n';

import metadata from './block.json';

export default function ( { attributes, setAttributes } ) {
	const { ratio, switchRatio, templateLock } = attributes;

	const blockProps = useBlockProps( {
		style: {
			'--unitone--ratio': ratio || undefined,
		},
	} );
	blockProps[ 'data-unitone-layout' ] = classnames(
		'frame',
		blockProps[ 'data-unitone-layout' ],
		{
			'-switch': switchRatio,
		}
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock,
		allowedBlocks: [
			'core/image',
			'core/video',
			'core/post-featured-image',
		],
		renderAppender: false,
	} );

	return (
		<>
			<InspectorControls>
				<ToolsPanel label={ __( 'Settings', 'unitone' ) }>
					<ToolsPanelItem
						hasValue={ () =>
							ratio !== metadata.attributes.ratio.default
						}
						isShownByDefault
						label={ __( 'Preferred aspect ratio', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								ratio: metadata.attributes.ratio.default,
							} )
						}
					>
						<TextControl
							label={
								<>
									{ __(
										'Preferred aspect ratio',
										'unitone'
									) }
									&nbsp;:&nbsp;
									<code>aspect-ratio</code>
								</>
							}
							value={ ratio }
							onChange={ ( newAttribute ) =>
								setAttributes( { ratio: newAttribute } )
							}
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							switchRatio !==
							metadata.attributes.switchRatio.default
						}
						isShownByDefault
						label={ __(
							'Switch aspect ratio when portrait',
							'unitone'
						) }
						onDeselect={ () =>
							setAttributes( {
								switchRatio:
									metadata.attributes.switchRatio.default,
							} )
						}
					>
						<ToggleControl
							label={ __(
								'Switch aspect ratio when portrait',
								'unitone'
							) }
							checked={ switchRatio }
							onChange={ ( newAttribute ) => {
								setAttributes( { switchRatio: newAttribute } );
							} }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<div { ...innerBlocksProps } />
		</>
	);
}
