import { __experimentalInspectorPopoverHeader as InspectorPopoverHeader } from '@wordpress/block-editor';

import {
	BaseControl,
	Button,
	SelectControl,
	Spinner,
	Popover,
} from '@wordpress/components';

import { useMergeRefs } from '@wordpress/compose';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { useState, useMemo, useRef } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { settings, published, Icon } from '@wordpress/icons';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';

import apiFetch from '@wordpress/api-fetch';

import { BACKGROUNDS } from '../../../../blocks/abstract-background/constant';

export const fetchSVGData = async ( {
	postId,
	postTitle,
	aspectRatio,
	background,
} ) => {
	try {
		const response = await apiFetch( {
			path: addQueryArgs( '/unitone/v1/thumbnail', {
				post_id: postId,
				text: postTitle,
				'aspect-ratio': aspectRatio,
				background,
			} ),
			parse: false,
		} );

		if ( ! response.ok ) {
			throw new Error( 'Failed to upload media.' );
		}

		return response.text();
	} catch ( error ) {
		console.error( error ); // eslint-disable-line no-console
	}
};

export const convertSVGToPNGBlob = ( svgData ) => {
	return new Promise( ( resolve, reject ) => {
		const encoder = new TextEncoder();
		const uint8Array = encoder.encode( svgData );
		const base64 = btoa( String.fromCharCode( ...uint8Array ) );
		const dataUrl = 'data:image/svg+xml;base64,' + base64;

		const parser = new DOMParser();
		const svgDoc = parser.parseFromString( svgData, 'image/svg+xml' );
		const svgEl = svgDoc.querySelector( 'svg' );

		const width = parseInt( svgEl.getAttribute( 'width' ) ) || 1200;
		const height = parseInt( svgEl.getAttribute( 'height' ) ) || 630;

		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement( 'canvas' );
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext( '2d' );

			// @see https://stackoverflow.com/questions/69949555/convert-svg-with-image-not-working-in-safari/69968513
			setTimeout( function () {
				ctx.drawImage( img, 0, 0, width, height );

				canvas.toBlob( ( blob ) => {
					if ( blob ) {
						resolve( blob );
					} else {
						reject(
							new Error( 'Failed to convert SVG to PNG blob.' )
						);
					}
				}, 'image/png' );
			}, 500 );
		};

		img.onerror = () => {
			reject( new Error( 'Image failed to load.' ) );
		};

		img.src = dataUrl;
	} );
};

export const uploadMedia = async ( { blob, postId, filename } ) => {
	const formData = new FormData();
	formData.append( 'file', blob, filename );
	formData.append( 'post', postId );

	try {
		const media = await apiFetch( {
			path: '/wp/v2/media',
			method: 'POST',
			body: formData,
		} );

		return media; // media object
	} catch ( error ) {
		console.error( error ); // eslint-disable-line no-console
	}
};

export const BackgroundControl = ( { background, setBackground } ) => {
	return (
		<BaseControl __nextHasNoMarginBottom>
			<BaseControl.VisualLabel>
				{ __( 'Background', 'unitone' ) }
			</BaseControl.VisualLabel>
			<div
				style={ {
					display: 'grid',
					gap: '8px',
					gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
				} }
			>
				{ [
					{
						label: __( 'Default', 'unitone' ),
						value: '',
					},
					...BACKGROUNDS,
				].map( ( _background, i ) => (
					<Button
						key={ i }
						onClick={ () => setBackground( _background.value ) }
						style={ {
							position: 'relative',
							display: 'flex',
							height: 'auto',
							padding: 0,
						} }
					>
						{ !! _background.src ? (
							<img
								src={ _background.src }
								alt={ _background.label }
								style={ { maxWidth: '100%' } }
							/>
						) : (
							<div
								aria-label={ _background.label }
								style={ {
									backgroundColor: '#eee',
									height: '100%',
									width: '100%',
								} }
							/>
						) }
						{ background === _background.value && (
							<div
								style={ {
									position: 'absolute',
									inset: '4px auto auto 4px',
									display: 'flex',
									background: '#000',
									borderRadius: '100%',
								} }
							>
								<Icon
									icon={ published }
									style={ {
										fill: '#47f654',
									} }
								/>
							</div>
						) }
					</Button>
				) ) }
			</div>
		</BaseControl>
	);
};

function addFeaturedImageGenerator( OriginalComponent ) {
	return ( props ) => {
		const [ isGenerating, setIsGenerating ] = useState( false );
		const [ aspectRatio, setAspectRatio ] = useState(
			window.unitoneFeaturedImageGenerator.aspectRatio
		);
		const [ background, setBackground ] = useState(
			window.unitoneFeaturedImageGenerator.background
		);
		const [ isOpenSettingsPopover, setIsOpenSettingsPopover ] =
			useState( false );
		const [ settingsPopoverAnchor, setSettingsPopoverAnchor ] =
			useState( null );

		const popoverRef = useRef( null );

		// Memoize popoverProps to avoid returning a new object every time.
		const settingsPopoverProps = useMemo(
			() => ( {
				// Anchor the popover to the middle of the entire row so that it doesn't
				// move around when the label changes.
				anchor: settingsPopoverAnchor,
				'aria-label': __(
					'Featured image generator settings',
					'unitone'
				),
				headerTitle: __(
					'Featured image generator settings',
					'unitone'
				),
				placement: 'left-start',
				offset: 36,
				shift: true,
			} ),
			[ settingsPopoverAnchor ]
		);

		const { postId, postTitle } = useSelect( ( select ) => {
			const { getCurrentPostId, getEditedPostAttribute } =
				select( editorStore );
			return {
				postId: getCurrentPostId(),
				postTitle: getEditedPostAttribute( 'title' ),
			};
		} );
		const { editPost } = useDispatch( editorStore );

		const setFeaturedImage = async ( mediaId ) => {
			try {
				await apiFetch( {
					path: `/wp/v2/posts/${ postId }`,
					method: 'POST',
					body: { featured_media: mediaId },
				} );
			} catch ( error ) {
				console.error( error ); // eslint-disable-line no-console
			}
		};

		const handleGenerate = async () => {
			setIsGenerating( true );

			try {
				const svgData = await fetchSVGData( {
					postId,
					postTitle,
					aspectRatio,
					background,
				} );
				const blob = await convertSVGToPNGBlob( svgData );
				const media = await uploadMedia( {
					blob,
					postId,
					filename: `unitone-generated-featured-image-${ postId }-${ Date.now() }.png`,
				} );

				await setFeaturedImage( media.id );
				editPost( { featured_media: media.id } );

				setIsGenerating( false );
			} catch ( error ) {
				console.error( error ); // eslint-disable-line no-console
				setIsGenerating( false );
			}
		};

		return (
			<>
				<OriginalComponent { ...props } />

				<div
					ref={ useMergeRefs( [
						setSettingsPopoverAnchor,
						popoverRef,
					] ) }
					className="unitone-button-group"
				>
					<Button
						onClick={ handleGenerate }
						disabled={ isGenerating }
						style={ {
							position: 'relative',
							flex: '1',
							justifyContent: 'center',
						} }
					>
						{ isGenerating ? (
							<Spinner />
						) : (
							__( 'Generate featured image', 'unitone' )
						) }
					</Button>

					<Button
						label={ __( 'Settings', 'unitone' ) }
						id="unitone-featured-image-generator-button"
						icon={ settings }
						onMouseDown={ ( event ) => {
							event.preventDefault();
						} }
						onClick={ () =>
							setIsOpenSettingsPopover( ( state ) => ! state )
						}
					/>
				</div>

				{ isOpenSettingsPopover && (
					<Popover
						className="unitone-featured-image-generator-popover"
						onClose={ () => setIsOpenSettingsPopover( false ) }
						focusOnMount
						{ ...settingsPopoverProps }
					>
						<InspectorPopoverHeader
							title={ __(
								'Featured image generator settings',
								'unitone'
							) }
							onClose={ () => setIsOpenSettingsPopover( false ) }
						/>

						<SelectControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Aspect ratio', 'unitone' ) }
							value={ aspectRatio }
							options={ [
								{ label: '4:3', value: '4:3' },
								{ label: '16:9', value: '16:9' },
							] }
							onChange={ ( newSetting ) => {
								setAspectRatio( newSetting );
							} }
						/>

						<BackgroundControl
							background={ background }
							setBackground={ setBackground }
						/>
					</Popover>
				) }
			</>
		);
	};
}

addFilter(
	'editor.PostFeaturedImage',
	'unitone/featured-image-generator',
	addFeaturedImageGenerator
);
