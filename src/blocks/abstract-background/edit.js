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

import { useToolsPanelDropdownMenuProps } from '../../js/editor/hooks/utils';

import metadata from './block.json';
import { BACKGROUNDS } from './constant';

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

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings', 'unitone' ) }
					dropdownMenuProps={ dropdownMenuProps }
				>
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
