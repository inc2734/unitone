import {
	BlockControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	Button,
	CheckboxControl,
	Popover,
	Spinner,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';

import {
	createInterpolateElement,
	useEffect,
	useMemo,
	useRef,
	useState,
} from '@wordpress/element';

import { createHigherOrderComponent } from '@wordpress/compose';
import { useRegistry, useSelect } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';
import { closeSmall } from '@wordpress/icons';
import { __, sprintf } from '@wordpress/i18n';

import { getImageFilename, shortenText } from './labels';
import { scrollBlockIntoView } from './navigation';
import { getPreviewURL } from './urls';

let conversionModule;

const getKindLabel = ( kind ) =>
	( {
		heading: __( 'Headings', 'unitone' ),
		paragraph: __( 'Text (paragraphs)', 'unitone' ),
		list: __( 'Lists', 'unitone' ),
		'list-item': __( 'List items', 'unitone' ),
		image: __( 'Images', 'unitone' ),
	} )[ kind ];

const getNoteTemplate = ( note ) => {
	const names = '<names />';
	const tag = '<tag />';

	switch ( note.code ) {
		case 'unsafe-attributes-removed':
			return sprintf(
				/* translators: 1: HTML tag, 2: attribute names. */
				__(
					'%1$s: attributes were removed for safety: %2$s.',
					'unitone'
				),
				tag,
				names
			);
		case 'unsafe-urls-removed':
			return sprintf(
				/* translators: 1: HTML tag, 2: URL attribute names. */
				__(
					'%1$s: URL attributes were removed for safety: %2$s.',
					'unitone'
				),
				tag,
				names
			);
		case 'attributes-removed':
			return sprintf(
				/* translators: 1: HTML tag, 2: attribute names. */
				__(
					'%1$s: attributes could not be retained: %2$s.',
					'unitone'
				),
				tag,
				names
			);
		case 'attributes-changed':
			return sprintf(
				/* translators: 1: HTML tag, 2: attribute names. */
				__( '%1$s: attributes changed: %2$s.', 'unitone' ),
				tag,
				names
			);
		case 'styles-removed':
			return sprintf(
				/* translators: 1: HTML tag, 2: CSS property names. */
				__(
					'%1$s: style properties could not be retained: %2$s.',
					'unitone'
				),
				tag,
				names
			);
		case 'styles-changed':
			return sprintf(
				/* translators: 1: HTML tag, 2: CSS property names. */
				__(
					'%1$s: style values or priorities changed: %2$s.',
					'unitone'
				),
				tag,
				names
			);
		case 'styles-moved':
			return sprintf(
				/* translators: 1: HTML tag, 2: CSS property names. */
				__(
					'%1$s: style properties moved to another element: %2$s.',
					'unitone'
				),
				tag,
				names
			);
		case 'attribute-moved':
			return sprintf(
				/* translators: 1: original HTML tag, 2: destination HTML tag, 3: attribute names. */
				__( '%1$s: attributes moved to %2$s: %3$s.', 'unitone' ),
				tag,
				'<destination />',
				names
			);
		case 'attribute-to-style':
			return sprintf(
				/* translators: 1: HTML tag, 2: attribute names. */
				__(
					'%1$s: attributes were converted to styles: %2$s.',
					'unitone'
				),
				tag,
				names
			);
		case 'image-wrapper':
			return __(
				'The image is now wrapped in a figure element.',
				'unitone'
			);
		case 'inline-markup-changed':
			return __( 'The markup inside the text changed.', 'unitone' );
		case 'markup-normalized':
			return __(
				'The HTML structure was normalized during conversion.',
				'unitone'
			);
		case 'text-changed':
			return __(
				'Some text changed during conversion. Please check the result.',
				'unitone'
			);
		case 'contains-blocks':
			return __(
				'This element already contains blocks. The original HTML was retained.',
				'unitone'
			);
		case 'unavailable-block':
			return __(
				'The destination block is unavailable. The original HTML was retained.',
				'unitone'
			);
		case 'complex-image':
			return __(
				'This image structure could not be converted. The original HTML was retained.',
				'unitone'
			);
		case 'complex-list':
			return __(
				'This list contains unsupported content or structure. The original HTML was retained.',
				'unitone'
			);
		case 'missing-image-url':
			return __(
				'The image has no source URL. The original HTML was retained.',
				'unitone'
			);
		case 'unsafe-image-url':
			return __(
				'This image URL cannot be safely retained. The image was not converted and the original HTML was retained.',
				'unitone'
			);
		case 'inline-image':
			return __(
				'Converting this inline image would create invalid HTML. The original HTML was retained.',
				'unitone'
			);
		case 'mixed-text':
			return __(
				'This text contains media or other unsupported content. The original HTML was retained.',
				'unitone'
			);
		default:
			return __(
				'Conversion failed. The original HTML was retained.',
				'unitone'
			);
	}
};

const getNoteContent = ( note ) =>
	// Source names stay in React text nodes, outside the interpolation markup.
	createInterpolateElement( getNoteTemplate( note ), {
		tag: <code>{ note.tag }</code>,
		destination: <code>{ note.to }</code>,
		names: (
			<>
				{ note.names?.map( ( name, index ) => [
					index > 0 ? ', ' : '',
					<code key={ index }>{ name }</code>,
				] ) }
			</>
		),
	} );

function ReportEntry( { entry, onSelect } ) {
	const [ imageFailed, setImageFailed ] = useState( false );

	const isImage = entry.kind === 'image';
	const text = isImage
		? getImageFilename( entry.imageUrl ) ||
		  entry.imageAlt ||
		  __( 'Image', 'unitone' )
		: entry.text || __( '(Empty text)', 'unitone' );
	const shortText = shortenText( text );
	const previewURL = getPreviewURL( entry.imageUrl );

	return (
		<li className="unitone-html-converter__entry">
			<span className="unitone-html-converter__kind">
				{ getKindLabel( entry.kind ) }
				{ entry.status === 'failed' &&
					` — ${ __( 'Not converted', 'unitone' ) }` }
			</span>

			<Button
				className="unitone-html-converter__target"
				variant="link"
				onClick={ onSelect }
			>
				{ isImage && previewURL && ! imageFailed && (
					<img
						className="unitone-html-converter__thumbnail"
						src={ previewURL }
						alt=""
						loading="lazy"
						referrerPolicy="no-referrer"
						onError={ () => setImageFailed( true ) }
					/>
				) }

				<span>{ shortText }</span>
			</Button>

			<ul className="unitone-html-converter__notes">
				{ entry.notes.map( ( note, index ) => (
					<li key={ index }>{ getNoteContent( note ) }</li>
				) ) }
			</ul>
		</li>
	);
}

function ConversionPanel( { clientId, onClose } ) {
	const registry = useRegistry();

	const block = useSelect(
		( select ) => select( blockEditorStore ).getBlock( clientId ),
		[ clientId ]
	);

	const [ selected, setSelected ] = useState( {
		heading: true,
		paragraph: true,
		list: true,
		image: false,
	} );

	// Keep logs for this open panel only; dismissal unmounts and discards them.
	const [ report, setReport ] = useState();
	const [ error, setError ] = useState();
	const [ conversion, setConversion ] = useState( conversionModule );
	const cancelScroll = useRef();

	useEffect( () => () => cancelScroll.current?.(), [] );

	useEffect( () => {
		let cancelled = false;

		// Load the HTML parser only when the conversion popover is first opened.
		import( './conversion' )
			.then( ( module ) => {
				conversionModule = module;
				if ( ! cancelled ) {
					setConversion( module );
				}
			} )
			.catch( () => {
				if ( ! cancelled ) {
					setError(
						__(
							'The converter could not be loaded. Please reopen this panel.',
							'unitone'
						)
					);
				}
			} );
		return () => {
			cancelled = true;
		};
	}, [] );

	const candidates = useMemo(
		() =>
			block && conversion
				? conversion.analyzeHTML( block ).candidates
				: [],
		[ block, conversion ]
	);

	const counts = candidates.reduce(
		( result, candidate ) => {
			result[ candidate.kind ]++;
			return result;
		},
		{ heading: 0, paragraph: 0, list: 0, image: 0 }
	);

	const canConvert = Object.keys( selected ).some(
		( kind ) => selected[ kind ] && counts[ kind ]
	);

	const convert = () => {
		setError( undefined );
		try {
			// Read again on execution so a stale preview never overwrites edits.
			const currentBlock = registry
				.select( blockEditorStore )
				.getBlock( clientId );

			if ( ! currentBlock ) {
				return;
			}

			const result = conversion.convertHTML( currentBlock, selected );
			if ( Object.values( result.counts ).some( Boolean ) ) {
				registry.batch( () => {
					const { updateBlock, replaceInnerBlocks } =
						registry.dispatch( blockEditorStore );

					updateBlock( clientId, {
						innerContent: result.innerContent,
						attributes: {
							...currentBlock.attributes,
							content: undefined,
						},
					} );

					replaceInnerBlocks( clientId, result.innerBlocks, false );
				} );
			}
			setReport( result );
		} catch {
			setError(
				__(
					'Conversion failed. The original HTML was retained.',
					'unitone'
				)
			);
		}
	};

	const selectEntry = ( entry, event ) => {
		const { getBlock } = registry.select( blockEditorStore );
		const target = getBlock( entry.blockId ) ? entry.blockId : clientId;
		const { ownerDocument } = event.currentTarget;
		const view = ownerDocument.defaultView;

		cancelScroll.current?.();
		registry.dispatch( blockEditorStore ).selectBlock( target );
		// Wait for selection and focus to settle before moving the editor canvas.
		const frame = view.requestAnimationFrame( () => {
			cancelScroll.current = undefined;
			if (
				registry
					.select( blockEditorStore )
					.getSelectedBlockClientId() === target
			) {
				scrollBlockIntoView( target, ownerDocument );
			}
		} );
		cancelScroll.current = () => view.cancelAnimationFrame( frame );
	};

	const notes = report?.entries.filter( ( entry ) => entry.notes.length );

	return (
		<div className="unitone-html-converter">
			<div className="unitone-html-converter__header">
				<p className="unitone-html-converter__title">
					{ __( 'Convert HTML to blocks', 'unitone' ) }
				</p>
				<Button
					icon={ closeSmall }
					label={ __( 'Close', 'unitone' ) }
					size="small"
					onClick={ onClose }
				/>
			</div>

			{ ! conversion && ! error && <Spinner /> }

			{ Object.keys( selected ).map( ( kind ) => (
				<CheckboxControl
					key={ kind }
					__nextHasNoMarginBottom
					label={ `${ getKindLabel( kind ) } (${ counts[ kind ] })` }
					checked={ selected[ kind ] }
					disabled={ ! counts[ kind ] }
					onChange={ ( checked ) =>
						setSelected( { ...selected, [ kind ]: checked } )
					}
				/>
			) ) }

			<p className="unitone-html-converter__help">
				{ __(
					'Some attributes and appearance may change during conversion.',
					'unitone'
				) }
			</p>

			<Button
				variant="primary"
				disabled={ ! canConvert }
				onClick={ convert }
			>
				{ __( 'Convert selected elements', 'unitone' ) }
			</Button>

			{ conversion && ! candidates.length && (
				<p>{ __( 'No elements remain to convert.', 'unitone' ) }</p>
			) }

			{ error && <p role="alert">{ error }</p> }

			{ report && (
				<div className="unitone-html-converter__report">
					<div role="status" aria-live="polite">
						<p>
							{ sprintf(
								/* translators: 1: heading count, 2: paragraph count, 3: list count, 4: image count. */
								__(
									'Converted: headings %1$d, paragraphs %2$d, lists %3$d, images %4$d.',
									'unitone'
								),
								report.counts.heading,
								report.counts.paragraph,
								report.counts.list,
								report.counts.image
							) }
						</p>
						<p>
							{ sprintf(
								/* translators: %d: number of conversion notes. */
								__( 'Notes: %d', 'unitone' ),
								report.entries.reduce(
									( total, entry ) =>
										total + entry.notes.length,
									0
								)
							) }
						</p>
					</div>

					{ !! notes.length && (
						<details>
							<summary className="unitone-html-converter__details-title">
								{ __( 'Conversion details', 'unitone' ) }
							</summary>
							<ul className="unitone-html-converter__entries">
								{ notes.map( ( entry ) => (
									<ReportEntry
										key={
											entry.blockId ??
											`${ entry.start }-${ entry.kind }`
										}
										entry={ entry }
										onSelect={ ( event ) =>
											selectEntry( entry, event )
										}
									/>
								) ) }
							</ul>
						</details>
					) }
				</div>
			) }
		</div>
	);
}

function HTMLConverter( { clientId, isSelected } ) {
	const [ anchor, setAnchor ] = useState();
	const isOwnerSelected = useSelect(
		( select ) => {
			const { isBlockSelected, hasSelectedInnerBlock } =
				select( blockEditorStore );
			return (
				isBlockSelected( clientId ) ||
				hasSelectedInnerBlock( clientId, true )
			);
		},
		[ clientId ]
	);

	useEffect( () => {
		if ( ! isOwnerSelected ) {
			setAnchor( undefined );
		}
	}, [ isOwnerSelected ] );

	const close = () => setAnchor( undefined );
	const toggle = ( event ) => {
		const { currentTarget } = event;
		const rect = currentTarget.getBoundingClientRect();
		// The opening toolbar disappears when a converted child is selected.
		setAnchor(
			anchor
				? undefined
				: {
						ownerDocument: currentTarget.ownerDocument,
						getBoundingClientRect: () => rect,
				  }
		);
	};

	return (
		<>
			{ isSelected && (
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							onClick={ toggle }
							aria-expanded={ !! anchor }
							aria-haspopup="dialog"
						>
							{ __( 'Convert', 'unitone' ) }
						</ToolbarButton>
					</ToolbarGroup>
				</BlockControls>
			) }
			{ anchor && (
				// Result navigation moves focus into the editor. Keep this outside
				// BlockControls so that the report and its scroll position survive.
				<Popover
					anchor={ anchor }
					role="dialog"
					placement="bottom-start"
					offset={ 13 }
					aria-label={ __( 'Convert HTML to blocks', 'unitone' ) }
					constrainTabbing={ false }
					onFocusOutside={ () => undefined }
					onClose={ close }
				>
					<ConversionPanel clientId={ clientId } onClose={ close } />
				</Popover>
			) }
		</>
	);
}

const withHTMLConverter = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => (
		<>
			<BlockEdit { ...props } />
			{ props.name === 'core/html' && (
				<HTMLConverter
					clientId={ props.clientId }
					isSelected={ props.isSelected }
				/>
			) }
		</>
	),
	'withHTMLConverter'
);

addFilter( 'editor.BlockEdit', 'unitone/html-converter', withHTMLConverter );
