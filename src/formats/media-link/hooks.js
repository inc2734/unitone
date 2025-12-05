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
} ) {
	const previewType =
		mediaType ||
		( activeAttributes?.href ? 'embed' : getMediaType( media ) );
	const initialTab = previewType === 'embed' ? 'embed' : 'media';
	const tabPanelKey = [ media?.id ?? '', mediaUrl ?? '', initialTab ].join(
		':'
	);

	const [ embedUrlInput, setEmbedUrlInput ] = useState(
		previewType === 'embed' ? mediaUrl : ''
	);
	const [ isEditingEmbed, setIsEditingEmbed ] = useState(
		previewType !== 'embed'
	);

	useEffect( () => {
		setEmbedUrlInput( previewType === 'embed' ? mediaUrl : '' );
		setIsEditingEmbed( previewType !== 'embed' );
	}, [ tabPanelKey, mediaUrl, previewType ] );

	const mediaPreviewUrl =
		mediaType === 'embed' ? '' : media?.source_url || mediaUrl || '';
	const embedPreviewUrl =
		mediaType === 'embed' ? mediaUrl : embedUrlInput || '';

	const mediaDisplayMeta = getDisplayMeta( mediaPreviewUrl, mediaAlt );
	const embedDisplayMeta = getDisplayMeta( embedPreviewUrl, mediaAlt );

	return {
		previewType,
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
	};
}
