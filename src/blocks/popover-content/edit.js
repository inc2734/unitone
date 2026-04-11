import clsx from 'clsx';

import {
	ButtonBlockAppender,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import {
	memo,
	useCallback,
	useEffect,
	useRef,
	useState,
} from '@wordpress/element';

import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { EditorPopover } from '../components';
import {
	normalizeForToggleGroupControl,
	useToolsPanelDropdownMenuProps,
} from '../../js/editor/hooks/utils';

import metadata from './block.json';

const MemoizedButtonBlockAppender = memo( ButtonBlockAppender );

export default function ( { attributes, setAttributes, clientId } ) {
	const { placement, templateLock } = attributes;

	const ref = useRef();
	const [ triggerElement, setTriggerElement ] = useState( null );

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const parentClientId = useSelect(
		( select ) => {
			const { getBlockParents, getBlock } = select( blockEditorStore );

			return (
				getBlockParents( clientId )
					.reverse()
					.find(
						( parentId ) =>
							getBlock( parentId )?.name === 'unitone/popover'
					) || null
			);
		},
		[ clientId ]
	);

	const hasSelection = useSelect(
		( select ) => {
			const { isBlockSelected, hasSelectedInnerBlock } =
				select( blockEditorStore );
			const targetClientId = parentClientId || clientId;

			return (
				hasSelectedInnerBlock( targetClientId, true ) ||
				isBlockSelected( targetClientId )
			);
		},
		[ clientId, parentClientId ]
	);

	useEffect( () => {
		const element = ref.current;
		if ( ! element ) {
			return;
		}

		const ownerDocument = element?.ownerDocument;
		if ( ! ownerDocument ) {
			return;
		}

		const trigger = element.parentNode.querySelector(
			':scope > [data-unitone-layout~="popover-trigger"] .wp-block-button'
		);
		if ( ! trigger ) {
			return;
		}

		setTriggerElement( trigger );

		return () => {
			setTriggerElement( ( currentTriggerElement ) => {
				return currentTriggerElement === trigger
					? null
					: currentTriggerElement;
			} );
		};
	}, [ clientId ] );

	useEffect( () => {
		const element = ref.current;
		if ( ! element || triggerElement?.isConnected ) {
			return;
		}

		const trigger = element.parentNode.querySelector(
			':scope > [data-unitone-layout~="popover-trigger"] .wp-block-button'
		);
		if ( trigger ) {
			setTriggerElement( trigger );
		} else {
			setTriggerElement( null );
		}
	}, [ triggerElement ] );

	const renderAppender = useCallback(
		() => <MemoizedButtonBlockAppender rootClientId={ clientId } />,
		[ clientId ]
	);

	const blockProps = useBlockProps( { ref } );
	blockProps[ 'data-unitone-layout' ] = clsx(
		'popover-content',
		blockProps[ 'data-unitone-layout' ],
		{
			[ `-placement:${ placement }` ]: !! placement,
		}
	);

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'unitone-popover-content__editor',
		},
		{
			templateLock,
			prioritizedInserterBlocks: [ 'unitone/popover-dialog' ],
			renderAppender: hasInnerBlocks ? undefined : renderAppender,
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
							placement !== metadata.attributes.placement.default
						}
						isShownByDefault
						label={ __( 'Placement', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								placement:
									metadata.attributes.placement.default,
							} )
						}
					>
						<ToggleGroupControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Placement', 'unitone' ) }
							value={ normalizeForToggleGroupControl(
								placement
							) }
							onChange={ ( newAttribute ) =>
								setAttributes( {
									placement:
										normalizeForToggleGroupControl(
											newAttribute
										),
								} )
							}
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

			<div { ...blockProps }>
				{ hasSelection && !! triggerElement && (
					<EditorPopover
						anchor={ triggerElement }
						placement={ placement }
						offset={ 8 }
					>
						<div { ...innerBlocksProps } />
					</EditorPopover>
				) }
			</div>
		</>
	);
}
