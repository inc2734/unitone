import clsx from 'clsx';

import {
	ButtonBlockAppender,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import { Button, Popover } from '@wordpress/components';

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

	const closeDialog = useCallback( () => {
		setIsOpen( false );

		ref.current?.ownerDocument?.defaultView?.requestAnimationFrame( () => {
			const nextTriggerElement = ref.current?.parentNode?.querySelector(
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
		const element = ref.current?.parentNode?.querySelector(
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
			if ( ! ref.current?.open ) {
				ref.current?.showModal();
			}
			return;
		}

		if ( ref.current?.open ) {
			ref.current?.close();
		}
	}, [ isOpen ] );

	useEffect( () => {
		const dialogElement = ref.current;
		if ( ! dialogElement ) {
			return undefined;
		}

		const handleBackdropClick = ( event ) => {
			if ( event.target === dialogElement ) {
				closeDialog();
			}
		};

		dialogElement.addEventListener( 'click', handleBackdropClick );

		return () => {
			dialogElement.removeEventListener( 'click', handleBackdropClick );
		};
	}, [ closeDialog ] );

	const blockProps = useBlockProps( {
		ref: useMergeRefs( [ setPopoverAnchor, ref ] ),
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

	return (
		<>
			{ hasTriggerSelection && !! triggerElement && (
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
					style={ { zIndex: 10000 } }
				>
					<Button variant="tertiary" onClick={ closeDialog }>
						{ __( 'Close dialog', 'unitone' ) }
					</Button>
				</Popover>
			) }

			<dialog { ...innerBlocksProps } />
		</>
	);
}
