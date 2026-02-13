import clsx from 'clsx';

import {
	ButtonBlockAppender,
	BlockControls,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	useSettings,
	store as blockEditorStore,
	__experimentalBorderRadiusControl as BorderRadiusControl,
} from '@wordpress/block-editor';

import {
	MenuGroup,
	MenuItem,
	ToolbarDropdownMenu,
	ToolbarButton,
	TextControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import {
	link as linkIcon,
	customLink,
	image as imageIcon,
	linkOff,
	fullscreen,
	shuffle,
} from '@wordpress/icons';

import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { memo, useCallback, useEffect, useRef } from '@wordpress/element';
import { __, _x, sprintf } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

import {
	LINK_DESTINATION_ATTACHMENT,
	LINK_DESTINATION_MEDIA,
	LINK_DESTINATION_NONE,
	LINK_DESTINATION_LIGHTBOX,
} from './constants';

import { getHrefAndDestination } from './utils';
import { useToolsPanelDropdownMenuProps } from '../../js/editor/hooks/utils';

import metadata from './block.json';

const MemoizedButtonBlockAppender = memo( ButtonBlockAppender );

const LINK_OPTIONS = [
	{
		icon: customLink,
		label: __( 'Link images to attachment pages' ),
		value: LINK_DESTINATION_ATTACHMENT,
		noticeText: __( 'Attachment Pages' ),
	},
	{
		icon: imageIcon,
		label: __( 'Link images to media files' ),
		value: LINK_DESTINATION_MEDIA,
		noticeText: __( 'Media Files' ),
	},
	{
		icon: fullscreen,
		label: __( 'Enlarge on click' ),
		value: LINK_DESTINATION_LIGHTBOX,
		noticeText: __( 'Lightbox effect' ),
		infoText: __( 'Scale images with a lightbox effect' ),
	},
	{
		icon: linkOff,
		label: _x( 'None', 'Media item link option' ),
		value: LINK_DESTINATION_NONE,
		noticeText: _x( 'None', 'Media item link option' ),
	},
];

const getImageBlocks = ( blocks = [] ) => {
	const imageBlocks = [];

	blocks.forEach( ( block ) => {
		if ( 'core/image' === block.name ) {
			imageBlocks.push( block );
		}

		if ( block.innerBlocks?.length ) {
			imageBlocks.push( ...getImageBlocks( block.innerBlocks ) );
		}
	} );

	return imageBlocks;
};

export default function ( { attributes, setAttributes, clientId } ) {
	const { columnWidth, linkTo, childrenBorder, allowedBlocks, templateLock } =
		attributes;

	const {
		hasInnerBlocks,
		innerBlockClientIds,
		imageBlocks,
		imageDataByClientId,
	} = useSelect(
		( select ) => {
			const { getBlock: _getBlock, getBlockOrder } =
				select( blockEditorStore );
			const { getMedia } = select( coreStore );

			const innerBlocks = _getBlock( clientId )?.innerBlocks || [];
			const _imageBlocks = getImageBlocks( innerBlocks );
			const _imageDataByClientId = {};

			_imageBlocks.forEach( ( block ) => {
				const imageId = block.attributes?.id;
				if ( imageId ) {
					_imageDataByClientId[ block.clientId ] =
						getMedia( imageId );
				}
			} );

			return {
				hasInnerBlocks: !! _getBlock( clientId )?.innerBlocks?.length,
				innerBlockClientIds: getBlockOrder( clientId ),
				imageBlocks: _imageBlocks,
				imageDataByClientId: _imageDataByClientId,
			};
		},
		[ clientId ]
	);

	const { moveBlockToPosition, updateBlockAttributes } =
		useDispatch( blockEditorStore );
	const { createSuccessNotice } = useDispatch( noticesStore );

	const [ lightboxSetting ] = useSettings( 'blocks.core/image.lightbox' );

	const linkOptions = ! lightboxSetting?.allowEditing
		? LINK_OPTIONS.filter(
				( option ) => option.value !== LINK_DESTINATION_LIGHTBOX
		  )
		: LINK_OPTIONS;

	const blockProps = useBlockProps( {
		style: {
			'--unitone--column-width': columnWidth || undefined,
			'--unitone--children--border-radius':
				null != childrenBorder?.radius &&
				'object' !== typeof childrenBorder?.radius
					? childrenBorder?.radius
					: undefined,
			'--unitone--children--border-top-left-radius':
				childrenBorder?.radius?.topLeft,
			'--unitone--children--border-top-right-radius':
				childrenBorder?.radius?.topRight,
			'--unitone--children--border-bottom-left-radius':
				childrenBorder?.radius?.bottomLeft,
			'--unitone--children--border-bottom-right-radius':
				childrenBorder?.radius?.bottomRight,
		},
	} );
	blockProps[ 'data-unitone-layout' ] = clsx(
		'masonry',
		blockProps[ 'data-unitone-layout' ]
	);

	const renderAppender = useCallback(
		() => <MemoizedButtonBlockAppender rootClientId={ clientId } />,
		[ clientId ]
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock,
		allowedBlocks,
		renderAppender: hasInnerBlocks ? undefined : renderAppender,
	} );

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const shuffleInnerBlocks = () => {
		if ( innerBlockClientIds?.length < 2 ) {
			return;
		}

		const shuffled = [ ...innerBlockClientIds ];
		for ( let i = shuffled.length - 1; i > 0; i-- ) {
			const j = Math.floor( Math.random() * ( i + 1 ) );
			[ shuffled[ i ], shuffled[ j ] ] = [ shuffled[ j ], shuffled[ i ] ];
		}

		shuffled.forEach( ( childClientId, index ) => {
			moveBlockToPosition( childClientId, clientId, clientId, index );
		} );
	};

	const setLinkTo = ( value ) => {
		setAttributes( { linkTo: value } );

		const changedAttributes = {};
		const blocks = [];

		imageBlocks.forEach( ( block ) => {
			const imageData = imageDataByClientId[ block.clientId ] || {
				url: block.attributes?.url,
				source_url: block.attributes?.url,
				link: block.attributes?.href,
			};

			blocks.push( block.clientId );
			changedAttributes[ block.clientId ] = getHrefAndDestination(
				imageData,
				value,
				false,
				block.attributes,
				lightboxSetting
			);
		} );

		if ( blocks.length ) {
			updateBlockAttributes( blocks, changedAttributes, true );

			const linkToText = [ ...linkOptions ].find(
				( linkType ) => linkType.value === value
			);

			createSuccessNotice(
				sprintf(
					/* translators: %s: image link destination */
					__( 'All image links updated to: %s', 'unitone' ),
					linkToText?.noticeText
				),
				{
					id: 'masonry-attributes-linkTo',
					type: 'snackbar',
				}
			);
		}
	};

	const prevImageClientIdsRef = useRef( [] );

	useEffect( () => {
		const prevIds = prevImageClientIdsRef.current || [];
		const currentIds = imageBlocks.map( ( block ) => block.clientId );
		prevImageClientIdsRef.current = currentIds;

		if ( LINK_DESTINATION_NONE === linkTo ) {
			return;
		}

		const addedIds = currentIds.filter(
			( clientIdValue ) => ! prevIds.includes( clientIdValue )
		);

		if ( ! addedIds.length ) {
			return;
		}

		const changedAttributes = {};

		imageBlocks.forEach( ( block ) => {
			if ( ! addedIds.includes( block.clientId ) ) {
				return;
			}

			const imageData = imageDataByClientId[ block.clientId ] || {
				url: block.attributes?.url,
				source_url: block.attributes?.url,
				link: block.attributes?.href,
			};

			changedAttributes[ block.clientId ] = getHrefAndDestination(
				imageData,
				linkTo,
				false,
				block.attributes,
				lightboxSetting
			);
		} );

		updateBlockAttributes( addedIds, changedAttributes, true );
	}, [ imageBlocks, imageDataByClientId, linkTo, lightboxSetting ] );

	return (
		<>
			<BlockControls group="block">
				<ToolbarDropdownMenu
					label={ __( 'Link', 'unitone' ) }
					icon={ linkIcon }
				>
					{ ( { onClose } ) => (
						<MenuGroup>
							{ linkOptions.map( ( linkItem ) => {
								const isOptionSelected =
									linkTo === linkItem.value;

								return (
									<MenuItem
										key={ linkItem.value }
										isSelected={ isOptionSelected }
										className={ clsx(
											'components-dropdown-menu__menu-item',
											{
												'is-active': isOptionSelected,
											}
										) }
										iconPosition="left"
										icon={ linkItem.icon }
										onClick={ () => {
											setLinkTo( linkItem.value );
											onClose();
										} }
										role="menuitemradio"
										info={ linkItem.infoText }
									>
										{ linkItem.label }
									</MenuItem>
								);
							} ) }
						</MenuGroup>
					) }
				</ToolbarDropdownMenu>

				<ToolbarButton
					icon={ shuffle }
					label={ __( 'Shuffle child blocks', 'unitone' ) }
					onClick={ shuffleInnerBlocks }
				/>
			</BlockControls>

			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings', 'unitone' ) }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						hasValue={ () =>
							columnWidth !==
							metadata.attributes.columnWidth.default
						}
						isShownByDefault
						label={ __( 'Column width', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								columnWidth:
									metadata.attributes.columnWidth.default,
							} )
						}
					>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={
								<>
									{ __( 'Column width', 'unitone' ) } :
									<code>column-width</code>
								</>
							}
							value={ columnWidth }
							onChange={ ( newAttribute ) => {
								setAttributes( { columnWidth: newAttribute } );
							} }
						/>
					</ToolsPanelItem>
				</ToolsPanel>

				<ToolsPanel
					label={ __( 'Child blocks settings', 'unitone' ) }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						hasValue={ () =>
							JSON.stringify( childrenBorder?.radius ) !==
							JSON.stringify(
								metadata.attributes.childrenBorder.default
									?.radius
							)
						}
						isShownByDefault
						label={ __( 'Radius' ) }
						onDeselect={ () => {
							childrenBorder.radius =
								metadata.attributes.childrenBorder.default?.radius;

							setAttributes( {
								childrenBorder: {
									...childrenBorder,
								},
							} );
						} }
					>
						<BorderRadiusControl
							values={ childrenBorder?.radius }
							onChange={ ( newAttribute ) => {
								setAttributes( {
									childrenBorder: {
										...childrenBorder,
										radius: newAttribute,
									},
								} );
							} }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<div { ...innerBlocksProps } />
		</>
	);
}
