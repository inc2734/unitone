import classnames from 'classnames';

import {
	BlockControls,
	InnerBlocks,
	InspectorControls,
	RichText,
	store as blockEditorStore,
	useBlockProps,
	useInnerBlocksProps,
	__experimentalLinkControl as LinkControl,
} from '@wordpress/block-editor';

import {
	PanelBody,
	Popover,
	TextControl,
	TextareaControl,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';

import {
	useState,
	useEffect,
	useRef,
	useMemo,
	useLayoutEffect,
} from '@wordpress/element';

import { speak } from '@wordpress/a11y';
import { useMergeRefs } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { link as linkIcon } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { displayShortcut } from '@wordpress/keycodes';
import { isURL, prependHTTP, safeDecodeURI } from '@wordpress/url';

import { ItemSubmenuIcon } from './toggle-icon';

const LINK_SETTINGS = [
	...LinkControl.DEFAULT_LINK_SETTINGS,
	{
		id: 'nofollow',
		title: __( 'Mark as nofollow' ),
	},
];

export default function ( {
	attributes,
	setAttributes,
	isSelected,
	context,
	clientId,
} ) {
	const { label, url, description, rel, title, opensInNewTab, templateLock } =
		attributes;

	const { showSubmenuIcon, openSubmenusOnClick } = context;

	const nofollow = !! rel?.includes( 'nofollow' );

	const [ isLinkOpen, setIsLinkOpen ] = useState( false );
	const [ isMegaMenuOpen, setIsMegaMenuOpen ] = useState( false );
	const [ parentWidth, setParentWidth ] = useState( 0 );
	const [ diffx, setDiffx ] = useState( 0 );
	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const [ popoverAnchor, setPopoverAnchor ] = useState( null );
	const itemLabelPlaceholder = __( 'Add text…' );
	const ref = useRef( null );
	const listItemRef = useRef( null );

	// Memoize link value to avoid overriding the LinkControl's internal state.
	// This is a temporary fix. See https://github.com/WordPress/gutenberg/issues/51256.
	const linkValue = useMemo(
		() => ( { url, opensInNewTab, nofollow } ),
		[ url, opensInNewTab, nofollow ]
	);

	/**
	 * Focus the Link label text and select it.
	 */
	function selectLabelText() {
		ref.current.focus();
		const { ownerDocument } = ref?.current;
		const { defaultView } = ref?.current?.ownerDocument;
		const selection = defaultView.getSelection();
		const range = ownerDocument.createRange();
		// Get the range of the current ref contents so we can add this range to the selection.
		range.selectNodeContents( ref.current );
		selection.removeAllRanges();
		selection.addRange( range );
	}

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	// Update props when the viewport is resized or the block is resized.
	useLayoutEffect( () => {
		const parent =
			listItemRef.current.closest( '.site-header' ) ??
			listItemRef.current.closest( '.wp-block-navigation' );

		let resizeObserver;
		const defaultView = listItemRef.current?.ownerDocument?.defaultView;
		if ( defaultView.ResizeObserver ) {
			resizeObserver = new defaultView.ResizeObserver( ( entries ) =>
				setParentWidth( entries[ 0 ].contentBoxSize )
			);
			resizeObserver.observe( parent );
		}

		return () => {
			if ( resizeObserver ) {
				resizeObserver.disconnect();
			}
		};
	}, [] );

	// Check if either the block or the inner blocks are selected.
	const hasSelection = useSelect(
		( select ) => {
			const { isBlockSelected, hasSelectedInnerBlock } =
				select( blockEditorStore );
			/* Sets deep to true to also find blocks inside the details content block. */
			return (
				hasSelectedInnerBlock( clientId, true ) ||
				isBlockSelected( clientId )
			);
		},
		[ clientId ]
	);

	useEffect( () => {
		if ( hasSelection ) {
			const parent =
				listItemRef.current.closest( '.site-header' ) ??
				listItemRef.current.closest( '.wp-block-navigation' );
			setDiffx(
				`${
					listItemRef.current.getBoundingClientRect().x -
					parent.getBoundingClientRect().x
				}px`
			);
			setIsMegaMenuOpen( true );
		} else {
			setDiffx( 0 );
			setIsMegaMenuOpen( false );
		}
	}, [ hasSelection, label, hasInnerBlocks, parentWidth ] );

	// Show the LinkControl on mount if the URL is empty
	// ( When adding a new menu item)
	// This can't be done in the useState call because it conflicts
	// with the autofocus behavior of the BlockListBlock component.
	useEffect( () => {
		if ( ! openSubmenusOnClick && ! url ) {
			setIsLinkOpen( true );
		}
	}, [] );

	/**
	 * The hook shouldn't be necessary but due to a focus loss happening
	 * when selecting a suggestion in the link popover, we force close on block unselection.
	 */
	useEffect( () => {
		if ( ! isSelected ) {
			setIsLinkOpen( false );
		}
	}, [ isSelected ] );

	// If the LinkControl popover is open and the URL has changed, close the LinkControl and focus the label text.
	useEffect( () => {
		if ( isLinkOpen && url ) {
			// Does this look like a URL and have something TLD-ish?
			if (
				isURL( prependHTTP( label ) ) &&
				/^.+\.[a-z]+/.test( label )
			) {
				// Focus and select the label text.
				selectLabelText();
			}
		}
	}, [ url ] );

	const blockProps = useBlockProps( {
		ref: useMergeRefs( [ setPopoverAnchor, listItemRef ] ),
		className: classnames(
			'unitone-mega-menu',
			'wp-block-navigation-item',
			{
				'has-link': !! url,
				'open-on-click': openSubmenusOnClick,
			}
		),
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: classnames( 'unitone-mega-menu__container', {
				'open-on-click': openSubmenusOnClick,
			} ),
			style: {
				'--unitone--diffx': diffx,
			},
		},
		{
			templateLock,
			renderAppender: hasInnerBlocks
				? InnerBlocks.DefaultBlockAppender
				: InnerBlocks.ButtonBlockAppender,
		}
	);

	const ParentElement = openSubmenusOnClick ? 'button' : 'a';

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					{ ! openSubmenusOnClick && (
						<ToolbarButton
							name="link"
							icon={ linkIcon }
							title={ __( 'Link' ) }
							shortcut={ displayShortcut.primary( 'k' ) }
							onClick={ () => {
								setIsLinkOpen( true );
							} }
						/>
					) }
				</ToolbarGroup>
			</BlockControls>

			<InspectorControls>
				<PanelBody title={ __( 'Settings' ) }>
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						value={ label || '' }
						onChange={ ( labelValue ) => {
							setAttributes( { label: labelValue } );
						} }
						label={ __( 'Text' ) }
						autoComplete="off"
					/>
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						value={ url || '' }
						onChange={ ( urlValue ) => {
							setAttributes( { url: urlValue } );
						} }
						label={ __( 'Link' ) }
						autoComplete="off"
					/>
					<TextareaControl
						__nextHasNoMarginBottom
						value={ description || '' }
						onChange={ ( descriptionValue ) => {
							setAttributes( {
								description: descriptionValue,
							} );
						} }
						label={ __( 'Description' ) }
						help={ __(
							'The description will be displayed in the menu if the current theme supports it.'
						) }
					/>
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						value={ title || '' }
						onChange={ ( titleValue ) => {
							setAttributes( { title: titleValue } );
						} }
						label={ __( 'Title attribute' ) }
						autoComplete="off"
						help={ __(
							'Additional information to help clarify the purpose of the link.'
						) }
					/>
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						value={ rel || '' }
						onChange={ ( relValue ) => {
							setAttributes( { rel: relValue } );
						} }
						label={ __( 'Rel attribute' ) }
						autoComplete="off"
						help={ __(
							'The relationship of the linked URL as space-separated link types.'
						) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<ParentElement
					className="wp-block-navigation-item__content"
					aria-expanded={ isMegaMenuOpen }
				>
					{
						<RichText
							ref={ ref }
							identifier="label"
							className="wp-block-navigation-item__label"
							value={ label }
							onChange={ ( newAttribute ) =>
								setAttributes( {
									label: newAttribute,
								} )
							}
							aria-label={ __(
								'Mega menu link text',
								'unitone'
							) }
							placeholder={ itemLabelPlaceholder }
							allowedFormats={ [
								'core/bold',
								'core/italic',
								'core/image',
								'core/strikethrough',
							] }
							onClick={ () => {
								if ( ! openSubmenusOnClick && ! url ) {
									setIsLinkOpen( true );
								}
							} }
						/>
					}
					{ ! openSubmenusOnClick && isLinkOpen && (
						<Popover
							placement="bottom"
							onClose={ () => {
								setIsLinkOpen( false );
								// richTextRef.current?.focus();
							} }
							anchor={ popoverAnchor }
							focusOnMount={ false }
							shift
						>
							<LinkControl
								value={ linkValue }
								onChange={ ( {
									url: newURL,
									opensInNewTab: newOpensInNewTab,
									nofollow: newNofollow,
								} ) => {
									let newRel = [
										...( rel ?? '' ).split( ' ' ),
									];
									if ( newNofollow ) {
										newRel.push( 'nofollow' );
									} else {
										newRel = newRel.filter(
											( v ) => v !== 'nofollow'
										);
									}
									setAttributes( {
										rel: Array.from( new Set( newRel ) )
											.join( ' ' )
											.trim(),
										url: encodeURI(
											safeDecodeURI( newURL )
										),
										opensInNewTab:
											undefined !== newOpensInNewTab,
									} );
								} }
								onRemove={ () => {
									setAttributes( { url: '' } );
									speak( __( 'Link removed.' ), 'assertive' );
									// richTextRef.current?.focus();
								} }
								settings={ LINK_SETTINGS }
								focus
							/>
						</Popover>
					) }
				</ParentElement>
				{ ( showSubmenuIcon || openSubmenusOnClick ) && (
					<span className="wp-block-navigation__submenu-icon">
						<ItemSubmenuIcon />
					</span>
				) }
				<div { ...innerBlocksProps } />
			</div>
		</>
	);
}
