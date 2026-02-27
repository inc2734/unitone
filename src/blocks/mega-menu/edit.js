import clsx from 'clsx';

import {
	ButtonBlockAppender,
	BlockControls,
	InspectorControls,
	RichText,
	store as blockEditorStore,
	useBlockProps,
	useInnerBlocksProps,
	withColors,
	LinkControl,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

import {
	Button,
	Notice,
	PanelBody,
	Popover,
	TextControl,
	TextareaControl,
	ToggleControl,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';

import {
	useCallback,
	useState,
	useEffect,
	useRef,
	useMemo,
	memo,
} from '@wordpress/element';

import {
	link as linkIcon,
	stretchFullWidth,
	stretchWide,
	alignNone,
} from '@wordpress/icons';

import { speak } from '@wordpress/a11y';
import { useMergeRefs } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
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

const MemoizedButtonBlockAppender = memo( ButtonBlockAppender );

const widthOptions = [
	{
		value: 'full',
		icon: stretchFullWidth,
		label: __( 'Full Width', 'unitone' ),
	},
	{
		value: 'wide',
		icon: stretchWide,
		label: __( 'Wide Width', 'unitone' ),
	},
	{
		value: 'content',
		icon: alignNone,
		label: __( 'Content Width', 'unitone' ),
	},
];

function Edit( {
	attributes,
	setAttributes,
	isSelected,
	clientId,
	overlayBackgroundColor,
	setOverlayBackgroundColor,
} ) {
	const {
		label,
		url,
		description,
		rel,
		title,
		showSubmenuIcon,
		openSubmenusOnClick,
		opensInNewTab,
		customOverlayBackgroundColor,
		width,
		templateLock,
	} = attributes;

	const nofollow = !! rel?.includes( 'nofollow' );

	const [ isLinkOpen, setIsLinkOpen ] = useState( false );
	const [ isMegaMenuOpen, setIsMegaMenuOpen ] = useState( false );
	const [ parentWidth, setParentWidth ] = useState( 0 );
	const [ rect, setRect ] = useState( { top: 0, left: 0, width: 0 } );
	const [ megaMenuRect, setMegaMenuRect ] = useState( {
		left: 0,
		width: 0,
		diff: 0,
	} );
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

	const setPositionMegaMenu = useCallback( () => {
		const listItem = listItemRef.current;
		const listItemRect = listItem.getBoundingClientRect();
		setRect( {
			top: listItemRect.y,
			left: listItemRect.x,
			width: listItemRect.width,
		} );

		const documentElement = listItem.ownerDocument.documentElement;
		const viewport = {
			width: documentElement.clientWidth,
			height: documentElement.clientHeight,
		};

		const megaMenuContainer = listItem.querySelector(
			'.unitone-mega-menu__container'
		);
		const _megaMenuRect = megaMenuContainer.getBoundingClientRect();
		let diff = 0;
		if ( viewport.width < _megaMenuRect.left + _megaMenuRect.width ) {
			diff =
				viewport.width - ( _megaMenuRect.left + _megaMenuRect.width );
		} else if ( 0 > _megaMenuRect.left ) {
			diff = _megaMenuRect.left * -1;
		}
		setMegaMenuRect( {
			left: _megaMenuRect.x,
			width: _megaMenuRect.width,
			diff,
		} );
	}, [ setRect, setMegaMenuRect ] );

	const openMegaMenu = useCallback( () => {
		setPositionMegaMenu();
		setIsMegaMenuOpen( true );
	}, [ setPositionMegaMenu, setIsMegaMenuOpen ] );

	const closeMegaMenu = useCallback( () => {
		setRect( { top: 0, left: 0, width: 0 } );
		setMegaMenuRect( { left: 0, width: 0, diff: 0 } );
		setIsMegaMenuOpen( false );
	}, [ setRect, setMegaMenuRect, setIsMegaMenuOpen ] );

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
	useEffect( () => {
		const parent =
			listItemRef.current.closest( '.site-header' ) ??
			listItemRef.current.closest( '.wp-block-navigation' );

		const ownerDocument = listItemRef.current?.ownerDocument;

		let resizeObserver;
		let documentResizeObserver;

		const defaultView = ownerDocument?.defaultView;
		if ( defaultView.ResizeObserver ) {
			resizeObserver = new defaultView.ResizeObserver( ( entries ) =>
				defaultView.requestAnimationFrame( () => {
					setParentWidth( entries[ 0 ].contentBoxSize );
				} )
			);
			resizeObserver.observe( parent );

			documentResizeObserver = new defaultView.ResizeObserver( () =>
				defaultView.requestAnimationFrame( () => {
					setPositionMegaMenu();
				} )
			);
			documentResizeObserver.observe( ownerDocument.documentElement );
		}

		const target = ownerDocument?.documentElement?.classList?.contains(
			'interface-interface-skeleton__html-container'
		)
			? ownerDocument.querySelector(
					'.interface-interface-skeleton__content'
			  )
			: ownerDocument;

		target.addEventListener( 'scroll', setPositionMegaMenu );

		return () => {
			if ( resizeObserver ) {
				resizeObserver.unobserve( parent );
			}

			if ( documentResizeObserver ) {
				documentResizeObserver.unobserve(
					ownerDocument.documentElement
				);
			}

			target.removeEventListener( 'scroll', setPositionMegaMenu );
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
			openMegaMenu();
		} else {
			closeMegaMenu();
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
		className: clsx( 'unitone-mega-menu', 'wp-block-navigation-item', {
			'has-link': !! url,
			'open-on-click': openSubmenusOnClick,
			[ `unitone-mega-menu--width:${ width }` ]: !! width,
		} ),
		style: {
			'--unitone--rect-top': `${ rect.top }px`,
			'--unitone--rect-left': `${ rect.left }px`,
			'--unitone--rect-right': `${ rect.left + rect.width }px`,
			'--unitone--mega-menu-diff': `${ megaMenuRect.diff }px`,
		},
	} );

	const renderAppender = useCallback(
		() => <MemoizedButtonBlockAppender rootClientId={ clientId } />,
		[ clientId ]
	);

	const { children, ...innerBlocksProps } = useInnerBlocksProps(
		{
			className: clsx( 'unitone-mega-menu__container', {
				'open-on-click': openSubmenusOnClick,
				'has-background':
					overlayBackgroundColor.slug || customOverlayBackgroundColor,
				[ `has-${ overlayBackgroundColor.slug }-background-color` ]:
					overlayBackgroundColor.slug,
			} ),
			style: {
				backgroundColor: overlayBackgroundColor.slug
					? `var(--wp--preset--color--${ overlayBackgroundColor.slug })`
					: customOverlayBackgroundColor,
			},
		},
		{
			templateLock,
			renderAppender,
		}
	);

	const submenuAccessibilityNotice =
		! showSubmenuIcon && ! openSubmenusOnClick
			? __(
					'The current menu options offer reduced accessibility for users and are not recommended. Enabling either "Open on Click" or "Show arrow" offers enhanced accessibility by allowing keyboard users to browse submenus selectively.'
			  )
			: '';

	const ParentElement = openSubmenusOnClick ? 'button' : 'a';

	const multipleOriginColorsAndGradients =
		useMultipleOriginColorsAndGradients();

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
				<PanelBody title={ __( 'Settings of menu item', 'unitone' ) }>
					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						value={ label || '' }
						onChange={ ( labelValue ) => {
							setAttributes( { label: labelValue } );
						} }
						label={ __( 'Text' ) }
						autoComplete="off"
					/>
					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
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
						__next40pxDefaultSize
						__nextHasNoMarginBottom
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
						__next40pxDefaultSize
						__nextHasNoMarginBottom
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

				<PanelBody title={ __( 'Settings of mega menu', 'unitone' ) }>
					<fieldset className="block-editor-hooks__flex-layout-justification-controls unitone-dimension-control">
						<legend>{ __( 'Width', 'unitone' ) }</legend>
						<div>
							{ widthOptions.map(
								( { value, icon, label: buttonLabel } ) => (
									<Button
										key={ value }
										label={ buttonLabel }
										icon={ icon }
										isPressed={ width === value }
										onClick={ () => {
											setAttributes( {
												width: value,
											} );
											setPositionMegaMenu();
										} }
									/>
								)
							) }
						</div>
					</fieldset>
				</PanelBody>

				<PanelBody title={ __( 'Display' ) }>
					<ToggleControl
						__nextHasNoMarginBottom
						checked={ openSubmenusOnClick }
						onChange={ ( value ) => {
							setAttributes( {
								openSubmenusOnClick: value,
								...( value && {
									showSubmenuIcon: true,
								} ), // Make sure arrows are shown when we toggle this on.
							} );
						} }
						label={ __( 'Open on click' ) }
					/>

					<ToggleControl
						__nextHasNoMarginBottom
						checked={ showSubmenuIcon }
						onChange={ ( value ) => {
							setAttributes( {
								showSubmenuIcon: value,
							} );
						} }
						disabled={ attributes.openSubmenusOnClick }
						label={ __( 'Show arrow' ) }
					/>

					{ submenuAccessibilityNotice && (
						<div>
							<Notice
								spokenMessage={ null }
								status="warning"
								isDismissible={ false }
							>
								{ submenuAccessibilityNotice }
							</Notice>
						</div>
					) }
				</PanelBody>
			</InspectorControls>

			<InspectorControls group="color">
				<ColorGradientSettingsDropdown
					__experimentalIsRenderedInSidebar
					settings={ [
						{
							label: __( 'Mega menu background', 'unitone' ),
							colorValue: overlayBackgroundColor.color,
							onColorChange: ( value ) => {
								setOverlayBackgroundColor( value );

								setAttributes( {
									customOverlayBackgroundColor: value,
								} );
							},
							resetAllFilter: () => ( {
								overlayBackgroundColor: undefined,
								customOverlayBackgroundColor: undefined,
							} ),
							enableAlpha: true,
							clearable: true,
						},
					] }
					panelId={ clientId }
					{ ...multipleOriginColorsAndGradients }
					gradients={ [] }
					disableCustomGradients
				/>
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
								if ( ! isMegaMenuOpen ) {
									openMegaMenu();
								}
							} }
						/>
					}
					{ ! openSubmenusOnClick && isLinkOpen && (
						<Popover
							placement="bottom"
							onClose={ () => {
								setIsLinkOpen( false );
								ref.current.focus();
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
									ref.current.focus();
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
				<div { ...innerBlocksProps }>
					<div className="unitone-mega-menu__placement">
						{ children }
					</div>
				</div>
			</div>
		</>
	);
}

export default withColors( { overlayBackgroundColor: 'color' } )( Edit );
