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

import { applyEmbedFormat, applyTargetFormat, clearMediaFormat } from './utils';

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
	const overlayTarget =
		activeAttributes?.[ 'data-unitone-overlay-target' ] || '';

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
		targetIdInput,
		setTargetIdInput,
		isEditingTarget,
		setIsEditingTarget,
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
		overlayTarget,
	} );

	const showIconLabels = useIconLabelPreference();

	const handleApplyUrl = ( event ) => {
		event?.preventDefault?.();
		applyEmbedFormat( value, onChange, embedUrlInput?.trim(), name );
		setIsEditingEmbed( false );
	};

	const handleApplyTarget = ( event ) => {
		event?.preventDefault?.();
		applyTargetFormat(
			value,
			onChange,
			targetIdInput?.trim?.().replace( /^#/, '' ),
			name
		);
		setIsEditingTarget( false );
	};

	const renderPanel = ( {
		ariaLabel,
		icon,
		details,
		detailsClassName,
		actions,
	} ) => (
		<div className="block-editor-link-control__search-item is-current is-preview">
			<div className="block-editor-link-control__search-item-top">
				<span
					className="block-editor-link-control__search-item-header"
					role="figure"
					aria-label={ ariaLabel }
				>
					<span className="block-editor-link-control__search-item-icon">
						{ icon }
					</span>

					<span
						className={
							detailsClassName
								? `block-editor-link-control__search-item-details ${ detailsClassName }`
								: 'block-editor-link-control__search-item-details'
						}
					>
						{ details }
					</span>
				</span>

				{ actions }
			</div>
		</div>
	);

	const mediaPanel = useMemo(
		() =>
			renderPanel( {
				ariaLabel:
					/* translators: Accessibility text for the link preview when editing a link. */
					__( 'Media information', 'unitone' ),
				icon: <Icon icon={ customLink } size="24" />,
				details: ! mediaDisplayMeta.isEmptyURL ? (
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
						<Button variant="secondary" onClick={ onOpenMedia }>
							{ __( 'Select media', 'unitone' ) }
						</Button>
					</span>
				),
				actions: (
					<>
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
					</>
				),
			} ),
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
		() =>
			renderPanel( {
				ariaLabel: __( 'Embed', 'unitone' ),
				icon: <Icon icon={ customLink } size="24" />,
				detailsClassName: 'unitone-media-link__embed-input',
				details:
					! isEditingEmbed && embedPreviewUrl ? (
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
					),
				actions: (
					<>
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
					</>
				),
			} ),
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

	const targetPanel = useMemo(
		() =>
			renderPanel( {
				ariaLabel: __( 'Target', 'unitone' ),
				icon: '#',
				detailsClassName: 'unitone-media-link__target-input',
				details:
					! isEditingTarget && targetIdInput ? (
						<span className="block-editor-link-control__search-item-title">
							<Truncate numberOfLines={ 1 }>
								{ targetIdInput.replace( /^#/, '' ) }
							</Truncate>
						</span>
					) : (
						<TextControl
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							placeholder={ __(
								'Enter target ID to open in overlay…',
								'unitone'
							) }
							value={ targetIdInput }
							onChange={ setTargetIdInput }
							onKeyDown={ ( event ) => {
								if ( event.key === 'Enter' ) {
									event.preventDefault();
									handleApplyTarget( event );
								}
							} }
						/>
					),
				actions: (
					<>
						{ ! isEditingTarget && targetIdInput ? (
							<Button
								icon={ pencil }
								label={ __( 'Edit target', 'unitone' ) }
								onClick={ () => {
									setIsEditingTarget( true );
								} }
								size="compact"
								showTooltip={ ! showIconLabels }
								type="button"
							/>
						) : (
							<Button
								variant="primary"
								icon={ customLink }
								aria-label={ __( 'Apply link', 'unitone' ) }
								disabled={ ! targetIdInput?.trim() }
								size="compact"
								showTooltip={ ! showIconLabels }
								type="button"
								onClick={ handleApplyTarget }
							/>
						) }

						<Button
							icon={ linkOff }
							label={ __( 'Remove link', 'unitone' ) }
							onClick={ () => {
								clearMediaFormat( value, onChange, name );
								onClose?.();
								setTargetIdInput( '' );
								setIsEditingTarget( true );
							} }
							size="compact"
							showTooltip={ ! showIconLabels }
						/>
					</>
				),
			} ),
		[
			handleApplyTarget,
			name,
			onChange,
			onClose,
			setTargetIdInput,
			setIsEditingTarget,
			showIconLabels,
			targetIdInput,
			value,
			isEditingTarget,
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
						{
							name: 'target',
							title: __( ':target', 'unitone' ),
						},
					] }
				>
					{ ( tab ) => {
						if ( 'media' === tab.name ) {
							return mediaPanel;
						}

						if ( 'target' === tab.name ) {
							return targetPanel;
						}

						return embedPanel;
					} }
				</TabPanel>
			</div>
		</Popover>
	);
}
