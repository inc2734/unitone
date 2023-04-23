import classnames from 'classnames';

import {
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	SelectControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useRefEffect } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';

import { verticalsResizeObserve } from '../../../node_modules/@inc2734/unitone-css/src/app';

export default function ( { attributes, setAttributes, clientId } ) {
	const { textOrientation } = attributes;

	const { hasInnerBlocks, children } = useSelect(
		( select ) => {
			const block = select( blockEditorStore ).getBlock( clientId );

			return {
				hasInnerBlocks: !! block?.innerBlocks?.length,
				children: block?.innerBlocks,
			};
		},
		[ clientId ]
	);

	const ref = useRefEffect( ( target ) => {
		verticalsResizeObserve( target );
	}, [] );

	const blockProps = useBlockProps();
	blockProps[ 'data-unitone-layout' ] = classnames(
		'vertical-writing-wrapper',
		blockProps[ 'data-unitone-layout' ]
	);

	const innerBlocksProps = useInnerBlocksProps(
		{
			ref,
			'data-unitone-layout': classnames( 'vertical-writing', {
				[ `-text-orientation:${ textOrientation }` ]:
					!! textOrientation,
			} ),
		},
		{
			templateLock: false,
			allowedBlocks: [
				'core/heading',
				'core/paragraph',
				'core/buttons',
				'core/image',
				'core/video',
			],
			renderAppender: hasInnerBlocks
				? InnerBlocks.DefaultBlockAppender
				: InnerBlocks.ButtonBlockAppender,
		}
	);

	return (
		<>
			<InspectorControls>
				<ToolsPanel label={ __( 'Settings', 'unitone' ) }>
					<ToolsPanelItem
						hasValue={ () =>
							textOrientation !==
							metadata.attributes.textOrientation.default
						}
						isShownByDefault
						label={ __( 'Text orientation', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								textOrientation:
									metadata.attributes.textOrientation.default,
							} )
						}
					>
						<SelectControl
							label={ __( 'Text orientation', 'unitone' ) }
							options={ [
								{ label: '', value: '' },
								{ label: 'mixed', value: 'mixed' },
								{ label: 'upright', value: 'upright' },
								{ label: 'sideways', value: 'sideways' },
							] }
							value={ textOrientation }
							onChange={ ( newAttribute ) =>
								setAttributes( {
									textOrientation: newAttribute,
								} )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<div { ...blockProps }>
				<div { ...innerBlocksProps } />
			</div>
		</>
	);
}
