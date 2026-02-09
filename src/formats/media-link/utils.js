import { applyFormat, removeFormat } from '@wordpress/rich-text';

const DEFAULT_FORMAT_NAME = 'unitone/media-link';

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
	const width = media?.media_details?.width ?? media?.width ?? null;
	const height = media?.media_details?.height ?? media?.height ?? null;

	const attributes = {
		href: media.url,
		target: '_blank',
		'data-unitone-media-id': String( media?.id ),
		'data-unitone-media-type': mediaType,
		'data-unitone-media-alt': altText,
	};

	if ( width ) {
		attributes[ 'data-unitone-media-width' ] = String( width );
	}

	if ( height ) {
		attributes[ 'data-unitone-media-height' ] = String( height );
	}

	return attributes;
}

function buildAttributesFromUrl( url ) {
	if ( ! url ) {
		return null;
	}

	return {
		href: url,
		target: '_blank',
		'data-unitone-media-type': 'embed',
	};
}

function buildAttributesFromTarget( targetId ) {
	const normalizedTargetId = targetId?.trim?.() ?? '';
	if ( ! normalizedTargetId ) {
		return null;
	}

	return {
		href: `#${ normalizedTargetId.replace( /^#/, '' ) }`,
		'data-unitone-media-type': 'target',
		'data-unitone-overlay-target': normalizedTargetId.replace( /^#/, '' ),
	};
}

function clearMediaFormat( value, onChange, formatName = DEFAULT_FORMAT_NAME ) {
	onChange( removeFormat( value, formatName ) );
}

function applyMediaFormat(
	value,
	onChange,
	media,
	formatName = DEFAULT_FORMAT_NAME
) {
	const attributes = buildAttributesFromMedia( media );
	if ( ! attributes ) {
		return;
	}

	onChange(
		applyFormat( value, {
			type: formatName,
			attributes,
		} )
	);
}

function applyEmbedFormat(
	value,
	onChange,
	url,
	formatName = DEFAULT_FORMAT_NAME
) {
	const attributes = buildAttributesFromUrl( url );
	if ( ! attributes ) {
		clearMediaFormat( value, onChange, formatName );
		return;
	}

	onChange(
		applyFormat( value, {
			type: formatName,
			attributes,
		} )
	);
}

function applyTargetFormat(
	value,
	onChange,
	targetId,
	formatName = DEFAULT_FORMAT_NAME
) {
	const attributes = buildAttributesFromTarget( targetId );
	if ( ! attributes ) {
		clearMediaFormat( value, onChange, formatName );
		return;
	}

	onChange(
		applyFormat( value, {
			type: formatName,
			attributes,
		} )
	);
}

export {
	getMediaType,
	buildAttributesFromMedia,
	buildAttributesFromUrl,
	buildAttributesFromTarget,
	clearMediaFormat,
	applyMediaFormat,
	applyEmbedFormat,
	applyTargetFormat,
};
