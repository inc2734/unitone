import clsx from 'clsx';

import {
	ButtonBlockAppender,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	createPortal,
	memo,
	useCallback,
	useEffect,
	useRef,
	useState,
} from '@wordpress/element';

import { Button, Popover } from '@wordpress/components';
import { useMergeRefs } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

const MemoizedButtonBlockAppender = memo( ButtonBlockAppender );

const TEMPLATE = [
	[
		'unitone/decorator',
		{
			backgroundColor: 'unitone-background',
			textColor: 'unitone-text',
			unitone: {
				maxWidth: 'var(--wp--style--global--content-size)',
				maxHeight: '80vh',
				padding: '1s',
				overflow: 'auto',
			},
		},
	],
];

const getTriggerElement = ( element, variation ) => {
	if ( ! element ) {
		return null;
	}

	if ( 'dialog-button' === variation ) {
		return (
			element.querySelector(
				':scope > .wp-block-buttons > .wp-block-button > .wp-block-button__link'
			) || null
		);
	}

	if ( 'dialog-box' === variation ) {
		return (
			element.querySelector(
				':scope > [data-unitone-layout~="decorator"]'
			) || null
		);
	}

	return (
		element.querySelector(
			'.wp-block-button__link, [data-unitone-layout~="decorator"][data-unitone-tag-name="button"]'
		) || null
	);
};

export default function ( { attributes, clientId, context } ) {
	const { templateLock } = attributes;

	const dialogVariation = context[ 'unitone/dialog/variation' ] || '';

	const [ isOpen, setIsOpen ] = useState( false );
	const [ portalContainer, setPortalContainer ] = useState( null );
	const [ triggerElement, setTriggerElement ] = useState( null );

	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const [ popoverAnchor, setPopoverAnchor ] = useState( null );

	const containerRef = useRef( null );
	const ref = useRef( null );

	const setContainerRef = useCallback( ( node ) => {
		containerRef.current = node;
		setPortalContainer( node?.ownerDocument?.body || null );
	}, [] );

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

	const hasSelection = useSelect(
		( select ) => {
			const { isBlockSelected, hasSelectedInnerBlock } =
				select( blockEditorStore );
			const targetClientId = parentClientId || clientId;

			return (
				isBlockSelected( targetClientId ) ||
				hasSelectedInnerBlock( targetClientId, true )
			);
		},
		[ clientId, parentClientId ]
	);

	const renderAppender = useCallback(
		() => <MemoizedButtonBlockAppender rootClientId={ clientId } />,
		[ clientId ]
	);

	const closeDialog = useCallback( () => {
		setIsOpen( false );

		ref.current?.ownerDocument?.defaultView?.requestAnimationFrame( () => {
			const nextTriggerElement =
				containerRef.current?.parentNode?.querySelector(
					':scope > [data-unitone-layout~="dialog-trigger"]'
				);
			const nextTriggerTarget = getTriggerElement(
				nextTriggerElement,
				dialogVariation
			);
			if ( !! nextTriggerTarget ) {
				nextTriggerTarget.focus();
			}
		} );
	}, [ dialogVariation ] );

	useEffect( () => {
		setIsOpen( false );
	}, [ clientId ] );

	useEffect( () => {
		const element = containerRef.current?.parentNode?.querySelector(
			':scope > [data-unitone-layout~="dialog-trigger"]'
		);
		if ( ! element ) {
			setTriggerElement( null );
			return;
		}

		setTriggerElement( getTriggerElement( element, dialogVariation ) );
	}, [ clientId, dialogVariation ] );

	useEffect( () => {
		if ( ! ref?.current ) {
			return;
		}

		if ( isOpen ) {
			ref.current?.ownerDocument?.defaultView?.requestAnimationFrame(
				() => {
					ref.current?.focus();
				}
			);
		}
	}, [ isOpen ] );

	useEffect( () => {
		if ( ! isOpen ) {
			return undefined;
		}

		const dialogElement = ref.current;
		const ownerDocument = dialogElement?.ownerDocument;
		if ( ! dialogElement || ! ownerDocument ) {
			return undefined;
		}

		const handlePointerDown = ( event ) => {
			if ( dialogElement.contains( event.target ) ) {
				return;
			}

			closeDialog();
		};

		ownerDocument.addEventListener(
			'pointerdown',
			handlePointerDown,
			true
		);

		return () => {
			ownerDocument.removeEventListener(
				'pointerdown',
				handlePointerDown,
				true
			);
		};
	}, [ closeDialog, isOpen ] );

	const blockProps = useBlockProps( {
		ref: useMergeRefs( [ setPopoverAnchor, ref ] ),
		role: 'dialog',
		'aria-modal': 'true',
		tabIndex: -1,
		style: isOpen
			? {
					position: 'fixed',
					inset: '50% auto auto 50%',
					margin: 0,
					transform: 'translate(-50%, -50%)',
					maxWidth:
						'calc(100% - 2 * var(--unitone--global--gutters))',
					maxHeight:
						'calc(100vh - 2 * var(--unitone--global--gutters))',
					zIndex: 9999,
			  }
			: {
					display: 'none',
			  },
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

	const dialogContent = <div { ...innerBlocksProps } />;
	const dialogLayer = (
		<>
			<div
				aria-hidden="true"
				style={ {
					position: 'fixed',
					inset: 0,
					backgroundColor: 'rgb(0 0 0 / 35%)',
					zIndex: 9998,
				} }
			/>
			{ dialogContent }
		</>
	);

	return (
		<>
			<div ref={ setContainerRef } style={ { display: 'none' } } />

			{ ! isOpen && hasSelection && !! triggerElement && (
				<Popover
					anchor={ triggerElement }
					placement="bottom"
					offset={ 8 }
					variant="toolbar"
					focusOnMount={ false }
					style={ { zIndex: 10000 } }
				>
					<Button
						variant="tertiary"
						onClick={ () => setIsOpen( true ) }
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
					style={ { zIndex: 10000 } }
				>
					<Button variant="tertiary" onClick={ closeDialog }>
						{ __( 'Close dialog', 'unitone' ) }
					</Button>
				</Popover>
			) }

			{ isOpen && !! portalContainer
				? createPortal( dialogLayer, portalContainer )
				: dialogContent }
		</>
	);
}
