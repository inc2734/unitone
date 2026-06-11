import clsx from 'clsx';

import {
	InspectorControls,
	store as blockEditorStore,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import {
	normalizeForToggleGroupControl,
	useToolsPanelDropdownMenuProps,
} from '../../js/editor/hooks/utils';

import metadata from './block.json';

const TEMPLATE = [
	[
		'unitone/popover-trigger',
		{ lock: { move: true, remove: true } },
		[
			[
				'core/buttons',
				{},
				[
					[
						'core/button',
						{
							text: __( 'Open popover', 'unitone' ),
							tagName: 'button',
						},
					],
				],
			],
		],
	],
	[
		'unitone/popover-content',
		{ lock: { move: true, remove: true } },
		[ [ 'unitone/popover-dialog', {}, [ [ 'core/paragraph' ] ] ] ],
	],
];

export default function ( { attributes, setAttributes, clientId } ) {
	const { placement, templateLock } = attributes;

	const popoverContentClientIds = useSelect(
		( select ) =>
			select( blockEditorStore )
				.getBlocks( clientId )
				.filter( ( block ) => block.name === 'unitone/popover-content' )
				.map( ( block ) => block.clientId ),
		[ clientId ]
	);

	const { updateBlockAttributes } = useDispatch( blockEditorStore );

	const setPlacement = useCallback(
		( newAttribute ) => {
			const nextPlacement =
				normalizeForToggleGroupControl( newAttribute );

			setAttributes( {
				placement: nextPlacement,
			} );

			popoverContentClientIds.forEach( ( popoverContentClientId ) => {
				updateBlockAttributes( popoverContentClientId, {
					placement: nextPlacement,
				} );
			} );
		},
		[ popoverContentClientIds, setAttributes, updateBlockAttributes ]
	);

	const blockProps = useBlockProps();
	blockProps[ 'data-unitone-layout' ] = clsx(
		'popover',
		blockProps[ 'data-unitone-layout' ]
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: metadata.allowedBlocks,
		templateLock,
		template: TEMPLATE,
		renderAppender: false,
	} );

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
							placement !== metadata.attributes.placement.default
						}
						isShownByDefault
						label={ __( 'Popover placement', 'unitone' ) }
						onDeselect={ () =>
							setPlacement(
								metadata.attributes.placement.default
							)
						}
					>
						<ToggleGroupControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Popover placement', 'unitone' ) }
							value={ normalizeForToggleGroupControl(
								placement
							) }
							onChange={ setPlacement }
						>
							<ToggleGroupControlOption
								label={ __( 'Top', 'unitone' ) }
								value="top"
							/>
							<ToggleGroupControlOption
								label={ __( 'Right', 'unitone' ) }
								value="right"
							/>
							<ToggleGroupControlOption
								label={ __( 'Bottom', 'unitone' ) }
								value="bottom"
							/>
							<ToggleGroupControlOption
								label={ __( 'Left', 'unitone' ) }
								value="left"
							/>
						</ToggleGroupControl>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<div { ...innerBlocksProps } />
		</>
	);
}
