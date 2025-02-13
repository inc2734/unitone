import clsx from 'clsx';

import {
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	BaseControl,
	Button,
	__experimentalGrid as Grid,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';

const BACKGROUNDS = [
	{
		src: `${ unitone.url }/dist/blocks/abstract-background/img/mountain-1.svg`,
		value: 'mountain-1',
		label: 'Mountain 1',
	},
	{
		src: `${ unitone.url }/dist/blocks/abstract-background/img/mountain-2.svg`,
		value: 'mountain-2',
		label: 'Mountain 2',
	},
	{
		src: `${ unitone.url }/dist/blocks/abstract-background/img/mountain-3.svg`,
		value: 'mountain-3',
		label: 'Mountain 3',
	},
	{
		src: `${ unitone.url }/dist/blocks/abstract-background/img/curve-1.svg`,
		value: 'curve-1',
		label: 'Curve 1',
	},
	{
		src: `${ unitone.url }/dist/blocks/abstract-background/img/blob-1.svg`,
		value: 'blob-1',
		label: 'Blob 1',
	},
	{
		src: `${ unitone.url }/dist/blocks/abstract-background/img/blob-2.svg`,
		value: 'blob-2',
		label: 'Blob 2',
	},
	{
		src: `${ unitone.url }/dist/blocks/abstract-background/img/seaweed-1.svg`,
		value: 'seaweed-1',
		label: 'Seaweed 1',
	},
	{
		src: `${ unitone.url }/dist/blocks/abstract-background/img/mesh-1.svg`,
		value: 'mesh-1',
		label: 'Mesh 1',
	},
	{
		src: `${ unitone.url }/dist/blocks/abstract-background/img/mesh-2.svg`,
		value: 'mesh-2',
		label: 'Mesh 2',
	},
	{
		src: `${ unitone.url }/dist/blocks/abstract-background/img/mesh-3.svg`,
		value: 'mesh-3',
		label: 'Mesh 3',
	},
];

export default function ( { attributes, setAttributes, clientId } ) {
	const { src, allowedBlocks, templateLock } = attributes;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		className: clsx( 'unitone-abstract-background', {
			[ `unitone-abstract-background--src:${ src }` ]: !! src,
		} ),
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'unitone-abstract-background__body',
		},
		{
			templateLock,
			allowedBlocks,
			renderAppender: hasInnerBlocks
				? undefined
				: InnerBlocks.ButtonBlockAppender,
		}
	);

	return (
		<>
			<InspectorControls>
				<ToolsPanel label={ __( 'Settings', 'unitone' ) }>
					<ToolsPanelItem
						hasValue={ () =>
							src !== metadata.attributes.src.default
						}
						isShownByDefault
						label={ __( 'Background', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								src: metadata.attributes.src.default,
							} )
						}
					>
						<BaseControl __nextHasNoMarginBottom>
							<BaseControl.VisualLabel>
								{ __( 'Background', 'unitone' ) }
							</BaseControl.VisualLabel>
							<Grid column={ 2 }>
								{ BACKGROUNDS.map( ( background, i ) => (
									<Button
										key={ i }
										onClick={ () =>
											setAttributes( {
												src: background.value,
											} )
										}
										style={ {
											display: 'flex',
											height: 'auto',
											padding: 0,
										} }
									>
										<img
											src={ background.src }
											alt={ background.label }
										/>
									</Button>
								) ) }
							</Grid>
						</BaseControl>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="unitone-abstract-background__filter"></div>
				<div { ...innerBlocksProps } />
			</div>
		</>
	);
}
