import clsx from 'clsx';

import {
	MediaUpload,
	MediaUploadCheck,
	RichTextToolbarButton,
} from '@wordpress/block-editor';

import {
	Popover,
	Button,
	ExternalLink,
	__experimentalTruncate as Truncate,
} from '@wordpress/components';

import {
	registerFormatType,
	applyFormat,
	removeFormat,
	getActiveFormat,
	useAnchor,
} from '@wordpress/rich-text';

import { useState, useCallback, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as preferencesStore } from '@wordpress/preferences';
import { store as coreStore } from '@wordpress/core-data';
import { filterURLForDisplay, safeDecodeURI } from '@wordpress/url';
import { Icon, customLink, pencil, linkOff } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

const name = 'unitone/media-link';
const title = __( 'Media link', 'unitone' );

const ALLOWED_MEDIA_TYPES = [ 'image', 'video' ];

const settings = {
	name,
	title,
	tagName: 'a',
	className: 'unitone-media-link',
	attributes: {
		href: 'href',
		target: 'target',
		className: 'class',
		style: 'style',
		'data-unitone-media-id': 'data-unitone-media-id',
		'data-unitone-media-type': 'data-unitone-media-type',
		'data-unitone-media-alt': 'data-unitone-media-alt',
	},
	contentEditable: true,
	edit: Edit,
};

function getMediaType( media ) {
	if ( media?.type ) {
		return media.type;
	}
	const mime = media?.mime || media?.mime_type;
	if ( mime?.startsWith( 'image/' ) ) {
		return 'image';
	}
	if ( mime?.startsWith( 'video/' ) ) {
		return 'video';
	}
	return 'image';
}

function buildAttributesFromMedia( media ) {
	if ( ! media?.url ) {
		return null;
	}
	const mediaType = getMediaType( media );
	const altText = media.alt_text || media.alt || '';
	const attributes = {
		href: media.url,
		target: '_blank',
		'data-unitone-media-id': String( media?.id ),
		'data-unitone-media-type': mediaType,
		'data-unitone-media-alt': altText,
	};
	return attributes;
}

function getFormatRange( value, formatName, selectionStart = value?.start ) {
	const formats = value?.formats;
	if ( ! formats?.length ) {
		return null;
	}

	const clampedSelection = Math.min(
		Math.max( selectionStart ?? 0, 0 ),
		formats.length - 1
	);
	const indexesToCheck = [ clampedSelection ];
	if ( clampedSelection > 0 ) {
		indexesToCheck.push( clampedSelection - 1 );
	}

	const hasFormatAtIndex = ( index ) => {
		const currentFormats = formats?.[ index ];
		return currentFormats?.some( ( { type } ) => type === formatName );
	};

	const getRangeAtIndex = ( index ) => {
		if ( index < 0 || index >= formats.length ) {
			return null;
		}
		if ( ! hasFormatAtIndex( index ) ) {
			return null;
		}

		let start = index;
		while ( start > 0 && hasFormatAtIndex( start - 1 ) ) {
			start--;
		}

		let end = index + 1;
		while ( end < formats.length && hasFormatAtIndex( end ) ) {
			end++;
		}

		return {
			start,
			end,
		};
	};

	for ( const index of indexesToCheck ) {
		const range = getRangeAtIndex( index );
		if ( range ) {
			return range;
		}
	}

	return null;
}

function applyMediaFormat( value, onChange, media, rangeOverride ) {
	const attributes = buildAttributesFromMedia( media );
	if ( ! attributes ) {
		return;
	}

	let { start, end } = rangeOverride ?? value;
	if ( start === end ) {
		const formatRange =
			getFormatRange( value, name, start ) ||
			getFormatRange( value, 'core/link', start );
		if ( formatRange ) {
			start = formatRange.start;
			end = formatRange.end;
		}
	}
	if ( start === end ) {
		return;
	}

	const nextValue = removeFormat( value, name, start, end );
	const formattedValue = applyFormat(
		nextValue,
		{
			type: name,
			attributes,
		},
		start,
		end
	);
	onChange( formattedValue );
}

function clearMediaFormat( value, onChange, rangeOverride ) {
	let { start, end } = rangeOverride ?? value;
	if ( start === end ) {
		const formatRange = getFormatRange( value, name, start );
		if ( formatRange ) {
			start = formatRange.start;
			end = formatRange.end;
		}
	}
	onChange( removeFormat( value, name, start, end ) );
}

function MediaToolbarButton( {
	value,
	onChange,
	isActive,
	canOpenWithoutSelection = false,
} ) {
	const hasSelection = value.start !== value.end;
	const canOpen = hasSelection || canOpenWithoutSelection;
	const onSelect = useCallback(
		( media ) => {
			applyMediaFormat( value, onChange, media );
		},
		[ value, onChange ]
	);

	return (
		<MediaUploadCheck>
			<MediaUpload
				allowedTypes={ ALLOWED_MEDIA_TYPES }
				onSelect={ onSelect }
				render={ ( { open } ) => (
					<RichTextToolbarButton
						icon={ customLink }
						title={ title }
						onClick={ () => {
							if ( canOpen ) {
								open();
							}
						} }
						disabled={ ! canOpen }
						isActive={ isActive }
					/>
				) }
			/>
		</MediaUploadCheck>
	);
}

function MediaInlinePopover( {
	value,
	onChange,
	contentRef,
	onClose,
	onFocusOutside,
	focusOnMount,
	rangeOverride,
	attributesOverride,
} ) {
	const activeFormat = getActiveFormat( value, name );
	const formatAttributes = activeFormat?.attributes || attributesOverride;
	const mediaId = formatAttributes?.[ 'data-unitone-media-id' ];
	const mediaUrl = formatAttributes?.href;
	const mediaAlt = formatAttributes?.[ 'data-unitone-media-alt' ];
	const popoverAnchor = useAnchor( {
		editableContentElement: contentRef.current,
		settings,
	} );

	const showIconLabels = useSelect(
		( select ) =>
			select( preferencesStore ).get( 'core', 'showIconLabels' ),
		[]
	);

	const media = useSelect(
		( select ) => {
			if ( ! mediaId ) {
				return null;
			}
			return select( coreStore ).getMedia( mediaId );
		},
		[ mediaId ]
	);

	const fixMediaUrl = media?.source_url || mediaUrl;

	const onSelect = useCallback(
		( nextMedia ) => {
			applyMediaFormat( value, onChange, nextMedia, rangeOverride );
		},
		[ value, onChange, rangeOverride ]
	);

	if ( ! formatAttributes ) {
		return null;
	}

	const displayURL =
		( !! fixMediaUrl &&
			filterURLForDisplay( safeDecodeURI( fixMediaUrl ?? '' ), 24 ) ) ||
		'';

	// url can be undefined if the href attribute is unset
	const isEmptyURL = ! fixMediaUrl?.length;

	const displayTitle = ( ! isEmptyURL && mediaAlt ) || displayURL;

	function filterTitleForDisplay( text ) {
		// Derived from `filterURLForDisplay` in `@wordpress/url`.
		return text
			.replace( /^[a-z\-.\+]+[0-9]*:(\/\/)?/i, '' )
			.replace( /^www\./i, '' );
	}

	const isUrlRedundant =
		! fixMediaUrl || filterTitleForDisplay( displayTitle ) === displayURL;

	const handleFocusOutside = ( event ) => {
		const target = event?.target;
		if (
			target?.closest( '.unitone-media-link__popover' ) ||
			target?.closest( '.media-modal' )
		) {
			return;
		}
		onFocusOutside?.( event );
	};

	return (
		<Popover
			anchor={ popoverAnchor }
			animate={ false }
			onClose={ onClose }
			onFocusOutside={ handleFocusOutside }
			placement="bottom"
			offset={ 8 }
			shift
			focusOnMount={ focusOnMount }
			constrainTabbing
			className="unitone-media-link__popover block-editor-format-toolbar__image-popover"
		>
			<div tabIndex={ -1 } className="block-editor-link-control">
				<div
					role="group"
					aria-label={ __( 'Manage link' ) }
					className={ clsx(
						'block-editor-link-control__search-item',
						{
							'is-current': true,
							'is-preview': true,
						}
					) }
				>
					<div className="block-editor-link-control__search-item-top">
						<span
							className="block-editor-link-control__search-item-header"
							role="figure"
							aria-label={
								/* translators: Accessibility text for the link preview when editing a link. */
								__( 'Link information' )
							}
						>
							<span className="block-editor-link-control__search-item-icon">
								<Icon icon={ customLink } size="24" />
							</span>

							<span className="block-editor-link-control__search-item-details">
								{ ! isEmptyURL ? (
									<>
										<ExternalLink
											className="block-editor-link-control__search-item-title"
											href={ fixMediaUrl }
										>
											<Truncate numberOfLines={ 1 }>
												{ displayTitle }
											</Truncate>
										</ExternalLink>
										{ ! isUrlRedundant && (
											<span className="block-editor-link-control__search-item-info">
												<Truncate numberOfLines={ 1 }>
													{ displayURL }
												</Truncate>
											</span>
										) }
									</>
								) : (
									<span className="block-editor-link-control__search-item-error-notice">
										{ __( 'Link is empty' ) }
									</span>
								) }
							</span>
						</span>

						<MediaUploadCheck>
							<MediaUpload
								allowedTypes={ ALLOWED_MEDIA_TYPES }
								onSelect={ onSelect }
								render={ ( { open } ) => (
									<Button
										icon={ pencil }
										label={ __( 'Edit link' ) }
										onClick={ open }
										size="compact"
										showTooltip={ ! showIconLabels }
									/>
								) }
							/>
						</MediaUploadCheck>

						<Button
							icon={ linkOff }
							label={ __( 'Remove link' ) }
							onClick={ () => {
								clearMediaFormat(
									value,
									onChange,
									rangeOverride
								);
								onClose?.();
							} }
							size="compact"
							showTooltip={ ! showIconLabels }
						/>
					</div>
				</div>
			</div>
		</Popover>
	);
}

function Edit( props ) {
	const { isActive, value, onChange, contentRef } = props;
	const [ isPopoverDismissed, setPopoverDismissed ] = useState( false );
	const [ persistedRange, setPersistedRange ] = useState( null );
	const [ persistedAttributes, setPersistedAttributes ] = useState( null );

	const activeFormat = getActiveFormat( value, name );
	const hasActiveFormat = !! activeFormat;

	useEffect( () => {
		if ( ! activeFormat ) {
			return;
		}

		const formatRange = getFormatRange( value, name, value.start );

		if ( formatRange ) {
			setPersistedRange( formatRange );
			setPersistedAttributes( activeFormat.attributes );
			setPopoverDismissed( false );
		}
	}, [ value, activeFormat ] );

	useEffect( () => {
		if ( activeFormat || ! persistedRange ) {
			return;
		}

		const activeElement =
			typeof document !== 'undefined'
				? contentRef.current?.ownerDocument?.activeElement
				: undefined;

		const shouldKeepOpen =
			activeElement?.closest( '.unitone-media-link__popover' ) ||
			activeElement?.closest( '.media-modal' );

		if ( shouldKeepOpen ) {
			return;
		}

		setPopoverDismissed( true );
		setPersistedRange( null );
		setPersistedAttributes( null );
	}, [ activeFormat, persistedRange ] );

	useEffect( () => {
		const editable = contentRef?.current;
		if ( ! editable ) {
			return;
		}

		const handlePointerDown = ( event ) => {
			if ( event.target.closest( '.unitone-media-link' ) ) {
				setPopoverDismissed( false );
				return;
			}

			setPopoverDismissed( true );
			setPersistedRange( null );
			setPersistedAttributes( null );
		};

		editable.addEventListener( 'pointerdown', handlePointerDown );
		return () => {
			editable.removeEventListener( 'pointerdown', handlePointerDown );
		};
	}, [ contentRef ] );

	useEffect( () => {
		if ( typeof document === 'undefined' ) {
			return undefined;
		}
		const handleDocumentPointerDown = ( event ) => {
			if (
				event.target.closest( '.unitone-media-link' ) ||
				event.target.closest( '.unitone-media-link__popover' ) ||
				event.target.closest( '.media-modal' )
			) {
				return;
			}
			setPopoverDismissed( true );
			setPersistedRange( null );
			setPersistedAttributes( null );
		};
		document.addEventListener( 'pointerdown', handleDocumentPointerDown );
		return () => {
			document.removeEventListener(
				'pointerdown',
				handleDocumentPointerDown
			);
		};
	}, [] );

	const shouldShowPopover =
		( isActive || hasActiveFormat || !! persistedRange ) &&
		! isPopoverDismissed;

	const handlePopoverClose = () => {
		setPopoverDismissed( true );
		setPersistedRange( null );
		setPersistedAttributes( null );
	};

	return (
		<>
			<MediaToolbarButton
				value={ value }
				onChange={ onChange }
				isActive={ isActive || hasActiveFormat }
				canOpenWithoutSelection={ hasActiveFormat }
			/>

			{ shouldShowPopover && (
				<MediaInlinePopover
					value={ value }
					onChange={ onChange }
					contentRef={ contentRef }
					onClose={ handlePopoverClose }
					onFocusOutside={ handlePopoverClose }
					rangeOverride={ persistedRange }
					attributesOverride={ persistedAttributes }
					focusOnMount={ false }
				/>
			) }
		</>
	);
}

registerFormatType( settings.name, settings );
