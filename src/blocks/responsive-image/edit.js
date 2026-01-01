import clsx from 'clsx';

import {
	useBlockProps,
	BlockControls,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	MediaPlaceholder,
	MediaReplaceFlow,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalGetShadowClassesAndStyles as getShadowClassesAndStyles,
	__experimentalImageURLInputUI as ImageURLInputUI,
} from '@wordpress/block-editor';

import {
	Button,
	SelectControl,
	__experimentalUnitControl as UnitControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { arrowDown, arrowUp, pencil, trash } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import { useToolsPanelDropdownMenuProps } from '../../js/editor/hooks/utils';

import metadata from './block.json';

export default function ( { attributes, setAttributes } ) {
	const {
		id,
		url,
		alt,
		title,
		sources,
		tagName,
		linkUrl,
		linkTarget,
		rel,
		linkClass,
		linkDestination,
	} = attributes;

	const setMainImage = ( media ) => {
		if ( ! media ) {
			return;
		}

		setAttributes( {
			id: media.id,
			url: media.url,
			alt: media.alt || '',
			title: media.title || '',
		} );
	};

	const setMainImageFromUrl = ( newUrl ) => {
		if ( ! newUrl ) {
			return;
		}

		setAttributes( {
			id: 0,
			url: newUrl,
			alt: '',
			title: '',
		} );
	};

	const addSource = ( media ) => {
		if ( ! media ) {
			return;
		}

		const newSource = {
			url: media.url,
			breakpoint: '600',
			originalWidth: media.width,
			originalHeight: media.height,
		};

		setAttributes( { sources: [ ...sources, newSource ] } );
	};

	const addSourceFromUrl = ( newUrl ) => {
		if ( ! newUrl ) {
			return;
		}

		const newSource = {
			url: newUrl,
			breakpoint: '600',
		};
		setAttributes( {
			sources: [ ...sources, newSource ],
		} );
	};

	const updateSource = ( index, media ) => {
		if ( ! media ) {
			return;
		}

		const newSources = [ ...sources ];
		newSources[ index ] = {
			...newSources[ index ],
			url: media.url,
			originalWidth: media.width,
			originalHeight: media.height,
		};
		setAttributes( { sources: newSources } );
	};

	const updateSourceBreakpoint = ( index, breakpoint ) => {
		const newSources = [ ...sources ];
		newSources[ index ] = { ...newSources[ index ], breakpoint };
		setAttributes( { sources: newSources } );
	};

	const updateSourceWidth = ( index, value ) => {
		const newSources = [ ...sources ];
		const currentSource = newSources[ index ];
		const parsedValue =
			'' === value || null == value ? undefined : Number( value );
		const originalWidth = currentSource.originalWidth;
		const originalHeight = currentSource.originalHeight;

		let nextWidth = currentSource.width;
		let nextHeight = currentSource.height;

		if ( null == parsedValue ) {
			nextWidth = originalWidth;
			nextHeight = originalHeight;
		} else if ( originalWidth && originalHeight ) {
			nextWidth = parsedValue;
			nextHeight = Math.round(
				( parsedValue * originalHeight ) / originalWidth
			);
		} else {
			nextWidth = undefined;
			nextHeight = undefined;
		}

		newSources[ index ] = {
			...currentSource,
			width: nextWidth,
			height: nextHeight,
		};

		setAttributes( { sources: newSources } );
	};

	const removeSource = ( index ) => {
		const newSources = sources.filter( ( _, i ) => i !== index );
		setAttributes( { sources: newSources } );
	};

	const moveSource = ( index, direction ) => {
		const targetIndex = index + direction;
		if ( targetIndex < 0 || targetIndex >= sources.length ) {
			return;
		}

		const newSources = [ ...sources ];
		const [ movedSource ] = newSources.splice( index, 1 );
		newSources.splice( targetIndex, 0, movedSource );
		setAttributes( { sources: newSources } );
	};

	const updateLinkSettings = ( nextValue = {} ) => {
		const {
			href,
			linkDestination: nextLinkDestination,
			linkTarget: nextLinkTarget,
			rel: nextRel,
			linkClass: nextLinkClass,
		} = nextValue;

		setAttributes( {
			linkUrl: undefined === href ? linkUrl : href || undefined,
			linkDestination:
				undefined === nextLinkDestination
					? linkDestination
					: nextLinkDestination,
			linkTarget:
				undefined === nextLinkTarget ? linkTarget : nextLinkTarget,
			rel: undefined === nextRel ? rel : nextRel,
			linkClass: undefined === nextLinkClass ? linkClass : nextLinkClass,
		} );
	};

	const mainImage = url
		? {
				id,
				url,
				alt: alt || '',
				title: title || '',
		  }
		: null;

	const sourceImages = [ ...sources ].sort(
		( a, b ) =>
			parseInt( a.breakpoint || 0, 10 ) -
			parseInt( b.breakpoint || 0, 10 )
	);

	const mainImageId = mainImage?.id;
	const mainImageClassName = mainImageId
		? `wp-image-${ mainImageId }`
		: undefined;

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const borderProps = useBorderProps( attributes );
	const shadowProps = getShadowClassesAndStyles( attributes );

	const TagName = tagName;

	const pictureMarkup = mainImage ? (
		<picture>
			{ sourceImages.map( ( image ) => {
				if ( ! image.breakpoint || ! image.url ) {
					return null;
				}

				return (
					<source
						key={ image.url }
						media={ `(max-width: ${ image.breakpoint }px)` }
						srcSet={ image.url }
						width={ image.width }
						height={ image.height }
					/>
				);
			} ) }

			<img
				src={ mainImage.url }
				alt={ mainImage.alt }
				title={ mainImage.title }
				className={ mainImageClassName }
				style={ {
					...borderProps.style,
					...shadowProps.style,
				} }
			/>
		</picture>
	) : null;

	const classes = clsx( 'unitone-responsive-image', {
		'has-custom-border':
			!! borderProps.className ||
			( borderProps.style &&
				Object.keys( borderProps.style ).length > 0 ),
	} );

	const blockProps = useBlockProps( {
		className: classes,
	} );

	return (
		<>
			{ mainImage && (
				<>
					<BlockControls group="block">
						<ImageURLInputUI
							url={ linkUrl || '' }
							onChangeUrl={ updateLinkSettings }
							linkDestination={
								linkDestination ||
								( linkUrl ? 'custom' : 'none' )
							}
							mediaUrl={ mainImage.url }
							mediaLink=""
							linkTarget={ linkTarget }
							linkClass={ linkClass }
							rel={ rel }
							showLightboxSetting={ false }
							lightboxEnabled={ false }
						/>
					</BlockControls>

					<BlockControls group="other">
						<MediaReplaceFlow
							mediaId={ id }
							mediaURL={ url }
							allowedTypes={ [ 'image' ] }
							onSelect={ setMainImage }
							onSelectURL={ setMainImageFromUrl }
							name={ __( 'Replace', 'unitone' ) }
						/>
					</BlockControls>
				</>
			) }

			<InspectorControls>
				<ToolsPanel
					label={ __( 'Sources', 'unitone' ) }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						hasValue={ () => sources.length > 0 }
						isShownByDefault
						label={ __( 'Sources', 'unitone' ) }
						onDeselect={ () => setAttributes( { sources: [] } ) }
					>
						{ sources.length > 0 &&
							sources.map( ( image, index ) => (
								<div
									key={ image.url }
									style={ {
										borderBottom: '1px solid #ddd',
										marginBottom: '1.25rem',
										paddingBottom: '.5rem',
									} }
								>
									<div>
										<img
											src={ image.url }
											alt={ image.alt }
											title={ image.title }
											style={ {
												verticalAlign: 'bottom',
											} }
										/>
									</div>

									<div
										style={ {
											marginTop: '.75rem',
											display: 'grid',
											gap: '.75rem',
										} }
									>
										<UnitControl
											__next40pxDefaultSize
											label={ __(
												'Target max viewport width',
												'unitone'
											) }
											units={ [] }
											disableUnits={ false }
											min={ 1 }
											value={
												image.breakpoint
													? parseInt(
															image.breakpoint,
															10
													  )
													: 600
											}
											onChange={ ( value ) =>
												updateSourceBreakpoint(
													index,
													undefined === value
														? 600
														: parseInt( value )
												)
											}
										/>

										<UnitControl
											__next40pxDefaultSize
											label={ __( 'Width', 'unitone' ) }
											placeholder={ __(
												'Auto',
												'unitone'
											) }
											units={ [] }
											value={
												null == image.width
													? undefined
													: parseInt( image.width )
											}
											onChange={ ( value ) =>
												updateSourceWidth(
													index,
													null == value
														? undefined
														: parseInt( value )
												)
											}
										/>

										<div
											style={ {
												display: 'flex',
												gap: '.25rem',
											} }
										>
											<MediaUploadCheck>
												<MediaUpload
													onSelect={ ( media ) =>
														updateSource(
															index,
															media
														)
													}
													allowedTypes={ [ 'image' ] }
													multiple={ false }
													render={ ( { open } ) => (
														<Button
															onClick={ open }
															icon={ pencil }
															iconSize={ 20 }
															label={ __(
																'Change image',
																'unitone'
															) }
														/>
													) }
												/>
											</MediaUploadCheck>

											<Button
												onClick={ () =>
													removeSource( index )
												}
												icon={ trash }
												iconSize={ 20 }
												label={ __(
													'Remove',
													'unitone'
												) }
											/>

											<Button
												onClick={ () =>
													moveSource( index, -1 )
												}
												disabled={ 0 === index }
												icon={ arrowUp }
												iconSize={ 20 }
												label={ __(
													'Move up',
													'unitone'
												) }
											/>

											<Button
												onClick={ () =>
													moveSource( index, 1 )
												}
												disabled={
													index === sources.length - 1
												}
												icon={ arrowDown }
												iconSize={ 20 }
												label={ __(
													'Move down',
													'unitone'
												) }
											/>
										</div>
									</div>
								</div>
							) ) }

						<div>
							<MediaPlaceholder
								className="unitone-responsive-image__url-placeholder"
								labels={ {
									title: __( 'Add source', 'unitone' ),
									instructions: '',
								} }
								onSelect={ addSource }
								onSelectURL={ addSourceFromUrl }
								allowedTypes={ [ 'image' ] }
								multiple={ false }
								accept="image/*"
							/>
						</div>
					</ToolsPanelItem>
				</ToolsPanel>

				<ToolsPanel
					label={ __( 'Settings', 'unitone' ) }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						hasValue={ () =>
							tagName !== metadata.attributes.tagName.default
						}
						isShownByDefault
						label={ __( 'HTML element', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								tagName: metadata.attributes.tagName.default,
							} )
						}
					>
						<SelectControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'HTML element', 'unitone' ) }
							value={ tagName }
							options={ [
								{ label: 'figure', value: 'figure' },
								{ label: 'div', value: 'div' },
								{ label: 'h1', value: 'h1' },
							] }
							onChange={ ( value ) =>
								setAttributes( { tagName: value } )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<TagName { ...blockProps }>
				{ ! mainImage ? (
					<MediaPlaceholder
						icon="format-image"
						labels={ {
							title: __( 'Responsive image', 'unitone' ),
						} }
						onSelect={ setMainImage }
						onSelectURL={ setMainImageFromUrl }
						allowedTypes={ [ 'image' ] }
						multiple={ false }
						accept="image/*"
					/>
				) : (
					<>
						{ linkUrl ? (
							<a
								href={ linkUrl }
								target={ linkTarget }
								rel={ rel }
								className={ linkClass }
							>
								{ pictureMarkup }
							</a>
						) : (
							pictureMarkup
						) }
					</>
				) }
			</TagName>
		</>
	);
}
