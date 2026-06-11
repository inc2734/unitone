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

const TEMPLATE = [ [ 'unitone/popover-dialog', {}, [ [ 'core/paragraph' ] ] ] ];
const DEFAULT_POPOVER_OFFSET = 8;

const getResolvedPixelValue = ( element, value ) => {
	if ( ! element || ! value ) {
		return DEFAULT_POPOVER_OFFSET;
	}

	const ownerDocument = element.ownerDocument;
	const defaultView = ownerDocument?.defaultView;
	if ( ! defaultView ) {
		return DEFAULT_POPOVER_OFFSET;
	}

	const measuringElement = ownerDocument.createElement( 'div' );
	measuringElement.style.position = 'absolute';
	measuringElement.style.visibility = 'hidden';
	measuringElement.style.pointerEvents = 'none';
	measuringElement.style.inset = '0 auto auto 0';
	measuringElement.style.width = value;
	measuringElement.style.height = '0';

	element.appendChild( measuringElement );
	const resolvedValue = parseFloat(
		defaultView.getComputedStyle( measuringElement ).width
	);
	measuringElement.remove();

	return Number.isNaN( resolvedValue )
		? DEFAULT_POPOVER_OFFSET
		: resolvedValue;
};

export default function ( { attributes, setAttributes, clientId } ) {
	const { placement, templateLock } = attributes;

	const ref = useRef();
	const [ triggerElement, setTriggerElement ] = useState( null );
	const [ popoverOffset, setPopoverOffset ] = useState(
		DEFAULT_POPOVER_OFFSET
	);

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

	const parentGap = useSelect(
		( select ) =>
			parentClientId
				? select( blockEditorStore ).getBlock( parentClientId )
						?.attributes?.unitone?.gap
				: undefined,
		[ parentClientId ]
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

	const getTriggerElement = useCallback( () => {
		const element = ref.current;
		if ( ! element?.parentNode ) {
			return null;
		}

		return element.parentNode.querySelector(
			':scope > [data-unitone-layout~="popover-trigger"] .wp-block-button'
		);
	}, [] );

	const updatePopoverOffset = useCallback( () => {
		const element = ref.current?.parentNode;
		if ( ! element ) {
			return;
		}

		const defaultView = element.ownerDocument?.defaultView;
		if ( ! defaultView ) {
			return;
		}

		const gap =
			defaultView
				.getComputedStyle( element )
				.getPropertyValue( '--unitone--gap' )
				.trim() || `${ DEFAULT_POPOVER_OFFSET }px`;
		const nextOffset = getResolvedPixelValue( element, gap );

		setPopoverOffset( ( currentOffset ) =>
			currentOffset === nextOffset ? currentOffset : nextOffset
		);
	}, [] );

	useEffect( () => {
		const trigger = getTriggerElement();
		if ( triggerElement === trigger ) {
			return;
		}

		if ( triggerElement?.isConnected && trigger ) {
			return;
		}

		setTriggerElement( trigger );
	}, [ clientId, getTriggerElement, triggerElement ] );

	useEffect( () => {
		updatePopoverOffset();
	}, [ parentGap, updatePopoverOffset ] );

	const renderAppender = useCallback(
		() => <MemoizedButtonBlockAppender rootClientId={ clientId } />,
		[ clientId ]
	);

	const blockProps = useBlockProps();
	blockProps[ 'data-unitone-layout' ] = clsx(
		'popover-content',
		blockProps[ 'data-unitone-layout' ],
		{
			[ `-placement:${ placement }` ]: !! placement,
		}
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock,
		prioritizedInserterBlocks: [ 'unitone/popover-dialog' ],
		template: TEMPLATE,
		renderAppender: hasInnerBlocks ? undefined : renderAppender,
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

			<div ref={ ref } style={ { visibility: 'hidden' } }></div>

			{ hasSelection && !! triggerElement && (
				<EditorPopover
					anchor={ triggerElement }
					placement={ placement }
					offset={ popoverOffset }
				>
					<div { ...innerBlocksProps } />
				</EditorPopover>
			) }
		</>
	);
}
