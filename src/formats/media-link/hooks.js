import { useEffect, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as preferencesStore } from '@wordpress/preferences';
import { filterURLForDisplay, safeDecodeURI } from '@wordpress/url';

import { getMediaType } from './utils';

export function useMediaRecord( mediaId ) {
	return useSelect(
		( select ) => {
			if ( ! mediaId ) {
				return null;
			}

			return select( coreStore ).getEntityRecord(
				'postType',
				'attachment',
				mediaId
			);
		},
		[ mediaId ]
	);
}

export function useIconLabelPreference() {
	return useSelect(
		( select ) =>
			select( preferencesStore ).get( 'core', 'showIconLabels' ),
		[]
	);
}

function filterTitleForDisplay( text ) {
	// Derived from `filterURLForDisplay` in `@wordpress/url`.
	return text
		.replace( /^[a-z\-.\+]+[0-9]*:(\/\/)?/i, '' )
		.replace( /^www\./i, '' );
}

function getDisplayMeta( url, mediaAlt ) {
	const displayURL =
		( !! url && filterURLForDisplay( safeDecodeURI( url ?? '' ), 24 ) ) ||
		'';
	const isEmptyURL = ! url?.length;
	const displayTitle = ( ! isEmptyURL && mediaAlt ) || displayURL;
	const isUrlRedundant =
		! url || filterTitleForDisplay( displayTitle ) === displayURL;

	return {
		displayURL,
		isEmptyURL,
		displayTitle,
		isUrlRedundant,
	};
}

export function useEmbedControls( {
	activeAttributes,
	media,
	mediaUrl,
	mediaAlt,
	mediaType,
	overlayTarget,
} ) {
	let previewType = mediaType;
	if ( ! previewType ) {
		if ( overlayTarget ) {
			previewType = 'target';
		} else if ( activeAttributes?.href ) {
			previewType = 'embed';
		} else {
			previewType = getMediaType( media );
		}
	}

	let initialTab = 'media';
	if ( previewType === 'embed' ) {
		initialTab = 'embed';
	} else if ( previewType === 'target' ) {
		initialTab = 'target';
	}
	const tabPanelKey = [
		media?.id ?? '',
		mediaUrl ?? '',
		overlayTarget ?? '',
		initialTab,
	].join( ':' );

	const [ embedUrlInput, setEmbedUrlInput ] = useState(
		previewType === 'embed' ? mediaUrl : ''
	);
	const [ isEditingEmbed, setIsEditingEmbed ] = useState(
		previewType !== 'embed'
	);
	const [ targetIdInput, setTargetIdInput ] = useState(
		previewType === 'target' ? overlayTarget : ''
	);
	const [ isEditingTarget, setIsEditingTarget ] = useState(
		previewType !== 'target'
	);

	useEffect( () => {
		setEmbedUrlInput( previewType === 'embed' ? mediaUrl : '' );
		setIsEditingEmbed( previewType !== 'embed' );
		setTargetIdInput( previewType === 'target' ? overlayTarget : '' );
		setIsEditingTarget( previewType !== 'target' );
	}, [ tabPanelKey, mediaUrl, overlayTarget, previewType ] );

	const mediaPreviewUrl =
		mediaType === 'embed' || mediaType === 'target'
			? ''
			: media?.source_url || mediaUrl || '';
	const embedPreviewUrl =
		mediaType === 'embed' ? mediaUrl : embedUrlInput || '';

	return {
		previewType,
		initialTab,
		tabPanelKey,
		controls: {
			media: {
				previewUrl: mediaPreviewUrl,
				displayMeta: getDisplayMeta( mediaPreviewUrl, mediaAlt ),
			},
			embed: {
				input: embedUrlInput,
				setInput: setEmbedUrlInput,
				isEditing: isEditingEmbed,
				setIsEditing: setIsEditingEmbed,
				previewUrl: embedPreviewUrl,
				displayMeta: getDisplayMeta( embedPreviewUrl, mediaAlt ),
			},
			target: {
				input: targetIdInput,
				setInput: setTargetIdInput,
				isEditing: isEditingTarget,
				setIsEditing: setIsEditingTarget,
			},
		},
	};
}
