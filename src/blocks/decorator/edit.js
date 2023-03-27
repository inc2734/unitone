import classnames from 'classnames';

import {
	BlockControls,
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	__experimentalLinkControl as LinkControl,
} from '@wordpress/block-editor';

import {
	Popover,
	SelectControl,
	TextControl,
	ToggleControl,
	ToolbarButton,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useCallback, useEffect, useState, useRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { link, linkOff } from '@wordpress/icons';
import { displayShortcut } from '@wordpress/keycodes';
import { __ } from '@wordpress/i18n';

const NEW_TAB_REL = 'noreferrer noopener';

import metadata from './block.json';

export default function ( {
	attributes,
	setAttributes,
	isSelected,
	clientId,
} ) {
	const { tagName, shadow, templateLock, rel, href, linkTarget } = attributes;

	const onSetLinkRel = useCallback(
		( value ) => {
			setAttributes( { rel: value } );
		},
		[ setAttributes ]
	);

	function onToggleOpenInNewTab( value ) {
		const newLinkTarget = value ? '_blank' : undefined;

		let updatedRel = rel;
		if ( newLinkTarget && ! rel ) {
			updatedRel = NEW_TAB_REL;
		} else if ( ! newLinkTarget && rel === NEW_TAB_REL ) {
			updatedRel = undefined;
		}

		setAttributes( {
			linkTarget: newLinkTarget,
			rel: updatedRel,
		} );
	}

	const ref = useRef();

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( 'core/block-editor' ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		ref,
	} );
	blockProps[ 'data-unitone-layout' ] = classnames(
		'decorator',
		blockProps[ 'data-unitone-layout' ],
		{
			'-shadow': shadow,
		}
	);

	const innerBlocksPropsArgs = {
		templateLock,
		renderAppender: hasInnerBlocks
			? InnerBlocks.DefaultBlockAppender
			: InnerBlocks.ButtonBlockAppender,
	};

	const [ isEditingHref, setIsEditingHref ] = useState( false );
	const isHrefSet = !! href;
	const opensInNewTab = linkTarget === '_blank';

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

	useEffect( () => {
		if ( ! isSelected ) {
			setIsEditingHref( false );
		}
	}, [ isSelected ] );

	const TagName = tagName || 'div';

	return (
		<>
			<InspectorControls>
				<ToolsPanel label={ __( 'Settings', 'unitone' ) }>
					<ToolsPanelItem
						hasValue={ () =>
							shadow !== metadata.attributes.shadow.default
						}
						isShownByDefault
						label={ __( 'With shadow', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								shadow: metadata.attributes.shadow.default,
							} )
						}
					>
						<ToggleControl
							label={ __( 'With shadow', 'unitone' ) }
							checked={ shadow }
							onChange={ ( newAttribute ) => {
								setAttributes( { shadow: newAttribute } );
							} }
						/>
					</ToolsPanelItem>

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
							label={ __( 'HTML element', 'unitone' ) }
							options={ [
								{ label: '<header>', value: 'header' },
								{ label: '<main>', value: 'main' },
								{ label: '<section>', value: 'section' },
								{ label: '<article>', value: 'article' },
								{ label: '<aside>', value: 'aside' },
								{ label: '<footer>', value: 'footer' },
								{ label: '<div>', value: 'div' },
							] }
							value={ tagName || 'div' }
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
					anchorRef={ ref?.current }
					focusOnMount={ isEditingHref ? 'firstElement' : false }
				>
					<LinkControl
						className="wp-block-navigation-link__inline-link-input"
						value={ { url: href, opensInNewTab } }
						onChange={ ( {
							url: newHref = '',
							opensInNewTab: newOpensInNewTab,
						} ) => {
							setAttributes( { href: newHref } );

							if ( opensInNewTab !== newOpensInNewTab ) {
								onToggleOpenInNewTab( newOpensInNewTab );
							}
						} }
						onRemove={ () => {
							unlink();
						} }
						forceIsEditingLink={ isEditingHref }
					/>
				</Popover>
			) }

			<InspectorControls __experimentalGroup="advanced">
				<TextControl
					label={ __( 'Link rel' ) }
					value={ rel || '' }
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
