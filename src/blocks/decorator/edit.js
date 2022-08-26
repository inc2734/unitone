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
	PanelBody,
	Popover,
	SelectControl,
	TextControl,
	ToggleControl,
	ToolbarButton,
} from '@wordpress/components';

import { useCallback, useEffect, useState, useRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { link, linkOff } from '@wordpress/icons';
import { displayShortcut } from '@wordpress/keycodes';
import { __ } from '@wordpress/i18n';

const NEW_TAB_REL = 'noreferrer noopener';

export default function ( {
	attributes,
	setAttributes,
	isSelected,
	clientId,
} ) {
	const {
		tagName,
		shadow,
		position,
		top,
		right,
		bottom,
		left,
		zIndex,
		templateLock,
		rel,
		href,
		linkTarget,
	} = attributes;

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
		style: {
			'--unitone--top': top || undefined,
			'--unitone--right': right || undefined,
			'--unitone--bottom': bottom || undefined,
			'--unitone--left': left || undefined,
			'--unitone--z-index': zIndex || undefined,
		},
	} );
	blockProps[ 'data-unitone-layout' ] = classnames(
		'decorator',
		blockProps[ 'data-unitone-layout' ],
		{
			[ `-position:${ position }` ]: position,
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
				<PanelBody title={ __( 'General', 'unitone' ) }>
					<ToggleControl
						label={ __( 'With shadow', 'unitone' ) }
						checked={ shadow }
						onChange={ ( newAttribute ) => {
							setAttributes( { shadow: newAttribute } );
						} }
					/>

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
				</PanelBody>
				<PanelBody
					title={ __( 'Position', 'unitone' ) }
					initialOpen={ false }
				>
					<SelectControl
						label={ __( 'Position', 'unitone' ) }
						options={ [
							{ label: '', value: '' },
							{
								label: 'static',
								value: 'static',
							},
							{
								label: 'relative',
								value: 'relative',
							},
							{
								label: 'absolute',
								value: 'absolute',
							},
							{ label: 'fixed', value: 'fixed' },
							{
								label: 'sticky',
								value: 'sticky',
							},
						] }
						value={ position }
						onChange={ ( newAttribute ) =>
							setAttributes( {
								position: newAttribute,
							} )
						}
					/>

					<TextControl
						label={ __( 'Top', 'unitone' ) }
						value={ top }
						onChange={ ( newAttribute ) => {
							setAttributes( { top: newAttribute } );
						} }
					/>

					<TextControl
						label={ __( 'Right', 'unitone' ) }
						value={ right }
						onChange={ ( newAttribute ) => {
							setAttributes( {
								right: newAttribute,
							} );
						} }
					/>

					<TextControl
						label={ __( 'Bottom', 'unitone' ) }
						value={ bottom }
						onChange={ ( newAttribute ) => {
							setAttributes( {
								bottom: newAttribute,
							} );
						} }
					/>

					<TextControl
						label={ __( 'Left', 'unitone' ) }
						value={ left }
						onChange={ ( newAttribute ) => {
							setAttributes( {
								left: newAttribute,
							} );
						} }
					/>

					<TextControl
						label={ __( 'z-index', 'unitone' ) }
						value={ zIndex }
						onChange={ ( newAttribute ) => {
							setAttributes( {
								zIndex: newAttribute,
							} );
						} }
					/>
				</PanelBody>
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
