import clsx from 'clsx';

import {
	BlockControls,
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
	LinkControl,
} from '@wordpress/block-editor';

import {
	Popover,
	SelectControl,
	TextControl,
	ToolbarButton,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import {
	useCallback,
	useEffect,
	useState,
	useRef,
	useMemo,
} from '@wordpress/element';

import { useMergeRefs } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { link, linkOff } from '@wordpress/icons';
import { displayShortcut } from '@wordpress/keycodes';
import { prependHTTP } from '@wordpress/url';
import { __ } from '@wordpress/i18n';

const NEW_TAB_REL = 'noreferrer noopener';
const NEW_TAB_TARGET = '_blank';
const NOFOLLOW_REL = 'nofollow';

const LINK_SETTINGS = [
	...LinkControl.DEFAULT_LINK_SETTINGS,
	{
		id: 'nofollow',
		title: __( 'Mark as nofollow' ),
	},
];

import metadata from './block.json';

/**
 * Updates the link attributes.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/block-library/src/button/get-updated-link-attributes.js
 *
 * @param {Object}  attributes               The current block attributes.
 * @param {string}  attributes.rel           The current link rel attribute.
 * @param {string}  attributes.url           The current link url.
 * @param {string}  attributes.title         The current link text.
 * @param {boolean} attributes.opensInNewTab Whether the link should open in a new window.
 * @param {boolean} attributes.nofollow      Whether the link should be marked as nofollow.
 */
export function getUpdatedLinkAttributes( {
	rel = '',
	url = '',
	title,
	opensInNewTab,
	nofollow,
} ) {
	let newLinkTarget;
	// Since `rel` is editable attribute, we need to check for existing values and proceed accordingly.
	let updatedRel = rel;

	if ( opensInNewTab ) {
		newLinkTarget = NEW_TAB_TARGET;
		updatedRel = updatedRel?.includes( NEW_TAB_REL )
			? updatedRel
			: updatedRel + ` ${ NEW_TAB_REL }`;
	} else {
		const relRegex = new RegExp( `\\b${ NEW_TAB_REL }\\s*`, 'g' );
		updatedRel = updatedRel?.replace( relRegex, '' ).trim();
	}

	if ( nofollow ) {
		updatedRel = updatedRel?.includes( NOFOLLOW_REL )
			? updatedRel
			: ( updatedRel + ` ${ NOFOLLOW_REL }` ).trim();
	} else {
		const relRegex = new RegExp( `\\b${ NOFOLLOW_REL }\\s*`, 'g' );
		updatedRel = updatedRel?.replace( relRegex, '' ).trim();
	}

	return {
		href: prependHTTP( url ),
		linkText: title,
		linkTarget: newLinkTarget,
		rel: updatedRel || undefined,
	};
}

export default function ( {
	attributes,
	setAttributes,
	isSelected,
	clientId,
} ) {
	const { tagName, templateLock, rel, href, linkText, linkTarget } =
		attributes;

	const onSetLinkRel = useCallback(
		( value ) => {
			setAttributes( { rel: value } );
		},
		[ setAttributes ]
	);

	const ref = useRef();

	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const [ popoverAnchor, setPopoverAnchor ] = useState( null );

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const [ isEditingHref, setIsEditingHref ] = useState( false );
	const isHrefSet = !! href;
	const opensInNewTab = linkTarget === NEW_TAB_TARGET;
	const nofollow = !! rel?.includes( NOFOLLOW_REL );

	function startEditing( event ) {
		event.preventDefault();
		setIsEditingHref( true );
	}

	function unlink() {
		setAttributes( {
			href: undefined,
			linkTarget: undefined,
			rel: undefined,
		} );
		setIsEditingHref( false );
	}

	const blockProps = useBlockProps( {
		ref: useMergeRefs( [ setPopoverAnchor, ref ] ),
	} );
	blockProps[ 'data-unitone-layout' ] = clsx(
		'decorator',
		blockProps[ 'data-unitone-layout' ],
		{
			'-has-link': isHrefSet,
		}
	);

	const innerBlocksPropsArgs = {
		templateLock,
		renderAppender: hasInnerBlocks
			? undefined
			: InnerBlocks.ButtonBlockAppender,
	};

	useEffect( () => {
		if ( ! isSelected ) {
			setIsEditingHref( false );
		}
	}, [ isSelected ] );

	// Memoize link value to avoid overriding the LinkControl's internal state.
	// This is a temporary fix. See https://github.com/WordPress/gutenberg/issues/51256.
	const linkValue = useMemo(
		() => ( { url: href, title: linkText, opensInNewTab, nofollow } ),
		[ href, linkText, opensInNewTab, nofollow ]
	);

	const TagName = tagName;

	return (
		<>
			<InspectorControls>
				<ToolsPanel label={ __( 'Settings', 'unitone' ) }>
					<ToolsPanelItem
						hasValue={ () =>
							tagName !== metadata.attributes.tagName.default
						}
						isShownByDefault
						label={ __( 'HTML element', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								tagName: metadata.attributes.tagName.default,
							} )
						}
					>
						<SelectControl
							__nextHasNoMarginBottom
							label={ __( 'HTML element', 'unitone' ) }
							options={ [
								{ label: '<main>', value: 'main' },
								{ label: '<section>', value: 'section' },
								{ label: '<article>', value: 'article' },
								{ label: '<aside>', value: 'aside' },
								{ label: '<header>', value: 'header' },
								{ label: '<footer>', value: 'footer' },
								{ label: '<div>', value: 'div' },
							] }
							value={ tagName }
							onChange={ ( newAttribute ) =>
								setAttributes( { tagName: newAttribute } )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<BlockControls group="block">
				{ ! isHrefSet && (
					<ToolbarButton
						name="link"
						icon={ link }
						title={ __( 'Link' ) }
						shortcut={ displayShortcut.primary( 'k' ) }
						onClick={ startEditing }
					/>
				) }
				{ isHrefSet && (
					<ToolbarButton
						name="link"
						icon={ linkOff }
						title={ __( 'Unlink' ) }
						shortcut={ displayShortcut.primaryShift( 'k' ) }
						onClick={ unlink }
						isActive={ true }
					/>
				) }
			</BlockControls>

			{ isSelected && ( isEditingHref || isHrefSet ) && (
				<Popover
					position="bottom center"
					onClose={ () => {
						setIsEditingHref( false );
					} }
					anchor={ popoverAnchor }
					focusOnMount={ isEditingHref ? 'firstElement' : false }
				>
					<LinkControl
						className="wp-block-navigation-link__inline-link-input"
						value={ linkValue }
						onChange={ ( {
							url: newHref = '',
							title: newLinkText,
							opensInNewTab: newOpensInNewTab,
							nofollow: newNofollow,
						} ) => {
							setAttributes(
								getUpdatedLinkAttributes( {
									rel,
									url: newHref,
									title: newLinkText,
									opensInNewTab: newOpensInNewTab,
									nofollow: newNofollow,
								} )
							);
						} }
						onRemove={ () => {
							unlink();
						} }
						forceIsEditingLink={ isEditingHref }
						hasRichPreviews
						hasTextControl
						settings={ LINK_SETTINGS }
						showInitialSuggestions
						suggestionsQuery={ {
							// always show Pages as initial suggestions
							initialSuggestionsSearchOptions: {
								type: 'post',
								subtype: 'page',
								perPage: 20,
							},
						} }
					/>
				</Popover>
			) }

			<InspectorControls group="advanced">
				<TextControl
					__nextHasNoMarginBottom
					label={ __( 'Link rel' ) }
					value={ rel }
					onChange={ onSetLinkRel }
				/>
			</InspectorControls>

			{ isHrefSet ? (
				<TagName { ...blockProps }>
					<div data-unitone-layout="decorator__inner">
						<div
							{ ...useInnerBlocksProps(
								{},
								innerBlocksPropsArgs
							) }
						/>
					</div>
				</TagName>
			) : (
				<TagName
					{ ...useInnerBlocksProps(
						blockProps,
						innerBlocksPropsArgs
					) }
				/>
			) }
		</>
	);
}
