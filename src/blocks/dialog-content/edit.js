import clsx from 'clsx';

import {
	ButtonBlockAppender,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	Button,
	SelectControl,
	Popover,
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

import { useMergeRefs } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import {
	normalizeForSelectControl,
	useToolsPanelDropdownMenuProps,
} from '../../js/editor/hooks/utils';

import metadata from './block.json';

const MemoizedButtonBlockAppender = memo( ButtonBlockAppender );

const TEMPLATE = [
	[
		'unitone/decorator',
		{
			backgroundColor: 'unitone-background',
			textColor: 'unitone-text',
			unitone: {
				padding: '1s',
			},
		},
	],
];

export default function ( { attributes, setAttributes, clientId } ) {
	const { closedBy, templateLock } = attributes;
	const [ isOpen, setIsOpen ] = useState( false );
	const [ triggerElement, setTriggerElement ] = useState( null );

	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const [ popoverAnchor, setPopoverAnchor ] = useState( null );

	const ref = useRef( null );

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
							getBlock( parentId )?.name === 'unitone/dialog'
					) || null
			);
		},
		[ clientId ]
	);

	const triggerClientId = useSelect(
		( select ) => {
			if ( ! parentClientId ) {
				return null;
			}

			const { getBlock } = select( blockEditorStore );
			return (
				getBlock( parentClientId )?.innerBlocks?.find(
					( block ) => block.name === 'unitone/dialog-trigger'
				)?.clientId || null
			);
		},
		[ parentClientId ]
	);

	const hasTriggerSelection = useSelect(
		( select ) => {
			if ( ! triggerClientId ) {
				return false;
			}

			const { isBlockSelected, hasSelectedInnerBlock } =
				select( blockEditorStore );

			return (
				isBlockSelected( triggerClientId ) ||
				hasSelectedInnerBlock( triggerClientId, true )
			);
		},
		[ triggerClientId ]
	);

	const renderAppender = useCallback(
		() => <MemoizedButtonBlockAppender rootClientId={ clientId } />,
		[ clientId ]
	);

	useEffect( () => {
		setIsOpen( false );
	}, [ clientId ] );

	useEffect( () => {
		const nextTriggerElement = ref.current?.parentNode?.querySelector(
			':scope > [data-unitone-layout~="dialog-trigger"]'
		);

		setTriggerElement( nextTriggerElement || null );
	}, [ clientId ] );

	useEffect( () => {
		if ( ! ref?.current ) {
			return;
		}

		if ( isOpen ) {
			if ( ! ref.current?.open ) {
				ref.current?.showModal();
			}
			return;
		}

		if ( ref.current?.open ) {
			ref.current?.close();
		}
	}, [ isOpen ] );

	const blockProps = useBlockProps( {
		ref: useMergeRefs( [ setPopoverAnchor, ref ] ),
		closedby: closedBy,
		onClose: () => setIsOpen( false ),
	} );
	blockProps[ 'data-unitone-layout' ] = clsx(
		'dialog-content',
		blockProps[ 'data-unitone-layout' ]
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock,
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
							closedBy !== metadata.attributes.closedBy.default
						}
						isShownByDefault
						label={ __( 'Closed by', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								closedBy: metadata.attributes.closedBy.default,
							} )
						}
					>
						<SelectControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Closed by', 'unitone' ) }
							options={ [
								{
									label: __( 'any', 'unitone' ),
									value: 'any',
								},
								{
									label: __( 'closerequest', 'unitone' ),
									value: 'closerequest',
								},
								{
									label: __( 'none', 'unitone' ),
									value: 'none',
								},
							] }
							value={ normalizeForSelectControl( closedBy ) }
							onChange={ ( newAttribute ) =>
								setAttributes( {
									closedBy:
										normalizeForSelectControl(
											newAttribute
										),
								} )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			{ hasTriggerSelection && !! triggerElement && (
				<Popover
					anchor={ triggerElement }
					placement="bottom"
					offset={ 8 }
					variant="toolbar"
					focusOnMount={ false }
				>
					<Button
						variant="tertiary"
						onClick={ () => {
							setIsOpen( true );

							ref.current?.ownerDocument?.defaultView?.requestAnimationFrame(
								() => {
									ref.current?.focus();
								}
							);
						} }
					>
						{ __( 'Open dialog', 'unitone' ) }
					</Button>
				</Popover>
			) }

			{ isOpen && !! popoverAnchor && (
				<Popover
					anchor={ popoverAnchor }
					placement="bottom"
					offset={ 8 }
					variant="toolbar"
					focusOnMount={ false }
				>
					<Button
						variant="tertiary"
						onClick={ () => {
							setIsOpen( false );

							ref.current?.ownerDocument?.defaultView?.requestAnimationFrame(
								() => {
									const nextTriggerElement =
										ref.current?.parentNode?.querySelector(
											':scope > [data-unitone-layout~="dialog-trigger"]'
										);
									if ( !! nextTriggerElement ) {
										nextTriggerElement.focus();
									}
								}
							);
						} }
					>
						{ __( 'Close dialog', 'unitone' ) }
					</Button>
				</Popover>
			) }

			<dialog { ...innerBlocksProps } />
		</>
	);
}
