import clsx from 'clsx';

import {
	MediaUpload,
	MediaUploadCheck,
	store as blockEditorStore,
	__experimentalInspectorPopoverHeader as InspectorPopoverHeader,
} from '@wordpress/block-editor';

import {
	Button,
	Notice,
	DropZone,
	Spinner,
	Popover,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
} from '@wordpress/components';

import {
	PluginDocumentSettingPanel,
	store as editorStore,
} from '@wordpress/editor';

import { registerPlugin } from '@wordpress/plugins';
import { isBlobURL } from '@wordpress/blob';
import { useMergeRefs } from '@wordpress/compose';
import { useEntityProp, store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useRef, useState, useMemo } from '@wordpress/element';
import { settings } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import {
	fetchSVGData,
	convertSVGToPNGBlob,
	uploadMedia,
	BackgroundControl,
} from '../featured-image-generator';

const ALLOWED_MEDIA_TYPES = [ 'image' ];

const OGPPanel = () => {
	const returnsFocusRef = useRef( false );
	const [ isLoading, setIsLoading ] = useState( false );
	const [ isGenerating, setIsGenerating ] = useState( false );
	const [ ogpImageUrl, setOgpImageUrl ] = useState( undefined );
	const [ background, setBackground ] = useState(
		window.unitoneFeaturedImageGenerator.background
	);
	const [ isOpenSettingsPopover, setIsOpenSettingsPopover ] =
		useState( false );
	const [ settingsPopoverAnchor, setSettingsPopoverAnchor ] =
		useState( null );

	const popoverRef = useRef( null );
	const ref = useMergeRefs( [ setSettingsPopoverAnchor, popoverRef ] );

	// Memoize popoverProps to avoid returning a new object every time.
	const settingsPopoverProps = useMemo(
		() => ( {
			// Anchor the popover to the middle of the entire row so that it doesn't
			// move around when the label changes.
			anchor: settingsPopoverAnchor,
			'aria-label': __( 'OGP image generator settings', 'unitone' ),
			headerTitle: __( 'OGP image generator settings', 'unitone' ),
			placement: 'left-start',
			offset: 36,
			shift: true,
		} ),
		[ settingsPopoverAnchor ]
	);

	const { getSettings } = useSelect( blockEditorStore );

	const { postId, postType } = useSelect( ( select ) => {
		const { getCurrentPostId, getCurrentPostType } = select( editorStore );
		return {
			postId: getCurrentPostId(),
			postType: getCurrentPostType(),
		};
	}, [] );

	const [ meta, setMeta ] = useEntityProp(
		'postType',
		postType,
		'meta',
		postId
	);

	const { ogpImageId, media, isRequestingOGPImageMedia, postTitle } =
		useSelect(
			( select ) => {
				const { getEntityRecord, hasFinishedResolution } =
					select( coreStore );
				const { getEditedPostAttribute } = select( editorStore );

				const _ogpImageId = meta?.[ 'unitone-ogp-image-id' ];
				const entityArgs = [
					'postType',
					'attachment',
					_ogpImageId,
					{ context: 'view' },
				];
				const _media = _ogpImageId
					? getEntityRecord( ...entityArgs )
					: null;

				setOgpImageUrl( _media?.source_url );

				return {
					ogpImageId: _ogpImageId,
					media: _ogpImageId
						? getEntityRecord( ...entityArgs )
						: null,
					isRequestingOGPImageMedia:
						!! _ogpImageId &&
						! hasFinishedResolution(
							'getEntityRecord',
							entityArgs
						),
					postTitle: getEditedPostAttribute( 'title' ),
				};
			},
			[ meta?.[ 'unitone-ogp-image-id' ] ]
		);

	function onDropFiles( filesList ) {
		getSettings().mediaUpload( {
			allowedTypes: ALLOWED_MEDIA_TYPES,
			filesList,
			onFileChange( [ image ] ) {
				if ( isBlobURL( image?.url ) ) {
					setIsLoading( true );
					return;
				}
				if ( image ) {
					onUpdateImage( image );
				}
				setIsLoading( false );
			},
			// onError( message ) {
			// 	noticeOperations.removeAllNotices();
			// 	noticeOperations.createErrorNotice( message );
			// },
			multiple: false,
		} );
	}

	const onUpdateImage = ( _media ) => {
		setOgpImageUrl( _media?.sizes?.full?.url );
		setMeta( { 'unitone-ogp-image-id': _media.id } );
	};

	const onRemoveImage = () => {
		setOgpImageUrl( undefined );
		setMeta( { 'unitone-ogp-image-id': null } );
	};

	function returnFocus( node ) {
		if ( returnsFocusRef.current && node ) {
			node.focus();
			returnsFocusRef.current = false;
		}
	}

	const isMissingMedia =
		! isRequestingOGPImageMedia && !! ogpImageId && ! media;

	const handleGenerate = async () => {
		setIsGenerating( true );

		try {
			const svgData = await fetchSVGData( {
				postId,
				postTitle,
				aspectRatio: '1.91:1',
				background,
			} );
			const blob = await convertSVGToPNGBlob( svgData );
			const _media = await uploadMedia( {
				blob,
				postId,
				filename: `unitone-generated-ogp-image-${ postId }-${ Date.now() }.png`,
			} );

			onUpdateImage( _media );

			setIsGenerating( false );
		} catch ( error ) {
			console.error( error ); // eslint-disable-line no-console
			setIsGenerating( false );
		}
	};

	return (
		! [ 'wp_template', 'wp_template_part' ].includes( postType ) && (
			<>
				<PluginDocumentSettingPanel
					name="unitone-ogp-panel"
					title={ __( 'OGP', 'unitone' ) }
					className="unitone-ogp-panel"
				>
					<VStack spacing="16px">
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ onUpdateImage }
								allowedTypes={ [ 'image' ] }
								value={ ogpImageId }
								render={ ( { open } ) => (
									<div className="editor-post-featured-image__container">
										{ isMissingMedia ? (
											<Notice
												status="warning"
												isDismissible={ false }
											>
												{ __(
													'Could not retrieve the OGP image data.',
													'unitone'
												) }
											</Notice>
										) : (
											<Button
												__next40pxDefaultSize
												ref={ returnFocus }
												className={
													! ogpImageId
														? 'editor-post-featured-image__toggle'
														: 'editor-post-featured-image__preview'
												}
												onClick={ open }
												aria-label={
													! ogpImageId
														? null
														: __(
																'Edit or replace the OGP image',
																'unitone'
														  )
												}
												aria-describedby={
													! ogpImageId
														? null
														: `editor-post-featured-image-${ ogpImageId }-describedby`
												}
												aria-haspopup="dialog"
												disabled={ isLoading }
												accessibleWhenDisabled
											>
												{ !! ogpImageId && (
													<img
														className="editor-post-featured-image__preview-image"
														src={ ogpImageUrl }
														alt=""
													/>
												) }
												{ ( isLoading ||
													isRequestingOGPImageMedia ) && (
													<Spinner />
												) }
												{ ! ogpImageId &&
													! isLoading &&
													__(
														'OGP image',
														'unitone'
													) }
											</Button>
										) }
										{ !! ogpImageId && (
											<HStack
												className={ clsx(
													'editor-post-featured-image__actions',
													{
														'editor-post-featured-image__actions-missing-image':
															isMissingMedia,
														'editor-post-featured-image__actions-is-requesting-image':
															isRequestingOGPImageMedia,
													}
												) }
											>
												<Button
													__next40pxDefaultSize
													className="editor-post-featured-image__action"
													onClick={ open }
													aria-haspopup="dialog"
													variant={
														isMissingMedia
															? 'secondary'
															: undefined
													}
												>
													{ __( 'Replace' ) }
												</Button>

												<Button
													__next40pxDefaultSize
													className="editor-post-featured-image__action"
													onClick={ () => {
														onRemoveImage();
														// Signal that the toggle button should be focused,
														// when it is rendered. Can't focus it directly here
														// because it's rendered conditionally.
														returnsFocusRef.current = true;
													} }
													variant={
														isMissingMedia
															? 'secondary'
															: undefined
													}
													isDestructive={
														isMissingMedia
													}
												>
													{ __( 'Remove' ) }
												</Button>
											</HStack>
										) }
										<DropZone onFilesDrop={ onDropFiles } />
									</div>
								) }
							/>
						</MediaUploadCheck>

						<div ref={ ref } className="unitone-button-group">
							<Button
								onClick={ handleGenerate }
								disabled={ isGenerating }
								style={ {
									width: '100%',
									justifyContent: 'center',
								} }
							>
								{ isGenerating ? (
									<Spinner />
								) : (
									__( 'Generate OGP image', 'unitone' )
								) }
							</Button>

							<Button
								label={ __( 'Settings', 'unitone' ) }
								id="unitone-ogp-image-generator-button"
								icon={ settings }
								onMouseDown={ ( event ) => {
									event.preventDefault();
								} }
								onClick={ () =>
									setIsOpenSettingsPopover(
										( state ) => ! state
									)
								}
							/>
						</div>

						{ isOpenSettingsPopover && (
							<Popover
								className="unitone-featured-image-generator-popover"
								onClose={ () =>
									setIsOpenSettingsPopover( false )
								}
								focusOnMount
								{ ...settingsPopoverProps }
							>
								<InspectorPopoverHeader
									title={ __(
										'OGP image generator settings',
										'unitone'
									) }
									onClose={ () =>
										setIsOpenSettingsPopover( false )
									}
								/>

								<BackgroundControl
									background={ background }
									setBackground={ setBackground }
								/>
							</Popover>
						) }

						<span
							style={ {
								lineHeight: 1.4,
								fontSize: '13px',
								color: '#757575',
							} }
						>
							{ __(
								'If no OGP image is set, the featured image will be used as the og:image.',
								'unitone'
							) }
						</span>
					</VStack>
				</PluginDocumentSettingPanel>
			</>
		)
	);
};

registerPlugin( 'unitone-ogp-plugin', {
	render: window.unitoneOGP.outputOGPTags ? OGPPanel : () => {},
} );
