import {
	Popover,
	Button,
	ExternalLink,
	TabPanel,
	TextControl,
	__experimentalTruncate as Truncate,
} from '@wordpress/components';

import { useMemo } from '@wordpress/element';
import { useAnchor } from '@wordpress/rich-text';
import { Icon, customLink, pencil, linkOff } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import {
	useMediaRecord,
	useIconLabelPreference,
	useEmbedControls,
} from './hooks';

import { applyEmbedFormat, clearMediaFormat } from './utils';

export default function InlineUI( {
	name,
	isActive,
	value,
	onChange,
	contentRef,
	activeAttributes,
	onClose,
	onFocusOutside,
	onOpenMedia,
	focusOnMount,
} ) {
	const mediaId = activeAttributes?.[ 'data-unitone-media-id' ];
	const mediaUrl = activeAttributes?.href || '';
	const mediaAlt = activeAttributes?.[ 'data-unitone-media-alt' ] || '';
	const mediaType = activeAttributes?.[ 'data-unitone-media-type' ];

	const popoverAnchor = useAnchor( {
		editableContentElement: contentRef.current,
		settings: {
			tagName: 'a',
			className: 'unitone-media-link',
			isActive,
		},
	} );

	const media = useMediaRecord( mediaId );

	const {
		initialTab,
		tabPanelKey,
		embedUrlInput,
		setEmbedUrlInput,
		isEditingEmbed,
		setIsEditingEmbed,
		mediaPreviewUrl,
		embedPreviewUrl,
		mediaDisplayMeta,
		embedDisplayMeta,
	} = useEmbedControls( {
		activeAttributes,
		media,
		mediaUrl,
		mediaAlt,
		mediaType,
	} );

	const showIconLabels = useIconLabelPreference();

	const handleApplyUrl = ( event ) => {
		event?.preventDefault?.();
		applyEmbedFormat( value, onChange, embedUrlInput?.trim(), name );
		setIsEditingEmbed( false );
	};

	const mediaPanel = useMemo(
		() => (
			<div
				role="group"
				aria-label={ __( 'Media', 'unitone' ) }
				className="block-editor-link-control__search-item is-current is-preview"
			>
				<div className="block-editor-link-control__search-item-top">
					<span
						className="block-editor-link-control__search-item-header"
						role="figure"
						aria-label={
							/* translators: Accessibility text for the link preview when editing a link. */
							__( 'Media information', 'unitone' )
						}
					>
						<span className="block-editor-link-control__search-item-icon">
							<Icon icon={ customLink } size="24" />
						</span>

						<span className="block-editor-link-control__search-item-details">
							{ ! mediaDisplayMeta.isEmptyURL ? (
								<>
									<ExternalLink
										className="block-editor-link-control__search-item-title"
										href={ mediaPreviewUrl }
									>
										<Truncate numberOfLines={ 1 }>
											{ mediaDisplayMeta.displayTitle }
										</Truncate>
									</ExternalLink>

									{ ! mediaDisplayMeta.isUrlRedundant && (
										<span className="block-editor-link-control__search-item-info">
											<Truncate numberOfLines={ 1 }>
												{ mediaDisplayMeta.displayURL }
											</Truncate>
										</span>
									) }
								</>
							) : (
								<span className="block-editor-link-control__search-item-error-notice">
									<Button
										variant="secondary"
										onClick={ onOpenMedia }
									>
										{ __( 'Select media', 'unitone' ) }
									</Button>
								</span>
							) }
						</span>
					</span>

					{ ! mediaDisplayMeta.isEmptyURL && (
						<Button
							icon={ pencil }
							label={ __(
								'Change to different media',
								'unitone'
							) }
							onClick={ onOpenMedia }
							size="compact"
							showTooltip={ ! showIconLabels }
							type="button"
							disabled={ ! onOpenMedia }
						/>
					) }

					<Button
						icon={ linkOff }
						label={ __( 'Remove media', 'unitone' ) }
						onClick={ () => {
							clearMediaFormat( value, onChange, name );
							onClose?.();
						} }
						size="compact"
						showTooltip={ ! showIconLabels }
					/>
				</div>
			</div>
		),
		[
			mediaDisplayMeta,
			mediaPreviewUrl,
			onChange,
			onClose,
			onOpenMedia,
			showIconLabels,
			value,
		]
	);

	const embedPanel = useMemo(
		() => (
			<div className="block-editor-link-control__search-item is-current is-preview">
				<div className="block-editor-link-control__search-item-top">
					<span
						className="block-editor-link-control__search-item-header"
						role="figure"
						aria-label={ __( 'Embed', 'unitone' ) }
					>
						<span className="block-editor-link-control__search-item-icon">
							<Icon icon={ customLink } size="24" />
						</span>

						<span className="block-editor-link-control__search-item-details unitone-media-link__embed-input">
							{ ! isEditingEmbed && embedPreviewUrl ? (
								<ExternalLink
									className="block-editor-link-control__search-item-title"
									href={ embedPreviewUrl }
								>
									<Truncate numberOfLines={ 1 }>
										{ embedDisplayMeta.displayTitle }
									</Truncate>
								</ExternalLink>
							) : (
								<TextControl
									__nextHasNoMarginBottom
									__next40pxDefaultSize
									placeholder={ __(
										'Enter URL to embed here…',
										'unitone'
									) }
									value={ embedUrlInput }
									onChange={ setEmbedUrlInput }
									onKeyDown={ ( event ) => {
										if ( event.key === 'Enter' ) {
											event.preventDefault();
											handleApplyUrl( event );
										}
									} }
								/>
							) }
						</span>
					</span>

					{ ! isEditingEmbed && embedPreviewUrl ? (
						<Button
							icon={ pencil }
							label={ __( 'Edit link', 'unitone' ) }
							onClick={ () => {
								setIsEditingEmbed( true );
								setEmbedUrlInput( embedPreviewUrl );
							} }
							size="compact"
							showTooltip={ ! showIconLabels }
							type="button"
						/>
					) : (
						<Button
							variant="primary"
							icon={ customLink }
							aria-label={ __( 'Apply URL', 'unitone' ) }
							disabled={ ! embedUrlInput?.trim() }
							size="compact"
							showTooltip={ ! showIconLabels }
							type="button"
							onClick={ handleApplyUrl }
						/>
					) }

					<Button
						icon={ linkOff }
						label={ __( 'Remove link', 'unitone' ) }
						onClick={ () => {
							clearMediaFormat( value, onChange, name );
							onClose?.();
							setIsEditingEmbed( true );
							setEmbedUrlInput( '' );
						} }
						size="compact"
						showTooltip={ ! showIconLabels }
					/>
				</div>
			</div>
		),
		[
			embedDisplayMeta,
			embedPreviewUrl,
			embedUrlInput,
			handleApplyUrl,
			onChange,
			onClose,
			setEmbedUrlInput,
			showIconLabels,
			value,
			isEditingEmbed,
			name,
			setIsEditingEmbed,
		]
	);

	return (
		<Popover
			placement="bottom"
			shift={ true }
			offset={ 8 }
			focusOnMount={ focusOnMount }
			anchor={ popoverAnchor }
			className="unitone-media-link__popover block-editor-format-toolbar__image-popover"
			onClose={ onClose }
			onFocusOutside={ onFocusOutside }
		>
			<div
				tabIndex={ -1 }
				className="block-editor-link-control unitone-media-link__popover-form"
			>
				<TabPanel
					key={ tabPanelKey }
					className="unitone-media-link__tabs"
					activeClass="is-active"
					initialTabName={ initialTab }
					tabs={ [
						{
							name: 'media',
							title: __( 'Media', 'unitone' ),
						},
						{
							name: 'embed',
							title: __( 'Embed', 'unitone' ),
						},
					] }
				>
					{ ( tab ) =>
						'media' === tab.name ? mediaPanel : embedPanel
					}
				</TabPanel>
			</div>
		</Popover>
	);
}
