import {
	MediaUpload,
	MediaUploadCheck,
	RichTextToolbarButton,
} from '@wordpress/block-editor';

import {
	useState,
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
} from '@wordpress/element';

import { registerFormatType } from '@wordpress/rich-text';
import { customLink } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import InlineUI from './inline-ui';
import { applyMediaFormat } from './utils';

export const name = 'unitone/media-link';
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
		'data-unitone-media-width': 'data-unitone-media-width',
		'data-unitone-media-height': 'data-unitone-media-height',
		'data-unitone-overlay-target': 'data-unitone-overlay-target',
	},
	contentEditable: true,
	edit: Edit,
};

function Edit( { isActive, value, onChange, contentRef, activeAttributes } ) {
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	useEffect( () => {
		// When the link becomes inactive (i.e. isActive is false), reset the editingLink state
		// and the creatingLink state. This means that if the Link UI is displayed and the link
		// becomes inactive (e.g. used arrow keys to move cursor outside of link bounds), the UI will close.
		if ( ! isActive ) {
			setIsModalOpen( false );
		}
	}, [ isActive ] );

	useLayoutEffect( () => {
		const editableContentElement = contentRef.current;
		if ( ! editableContentElement ) {
			return;
		}

		function handleClick( event ) {
			// There is a situation whereby there is an existing link in the rich text
			// and the user clicks on the leftmost edge of that link and fails to activate
			// the link format, but the click event still fires on the `<a>` element.
			// This causes the `editingLink` state to be set to `true` and the link UI
			// to be rendered in "creating" mode. We need to check isActive to see if
			// we have an active link format.
			const link = event.target.closest( '[contenteditable] a' );
			if (
				! link || // other formats (e.g. bold) may be nested within the link.
				! isActive
			) {
				return;
			}

			setIsModalOpen( true );
		}

		editableContentElement.addEventListener( 'click', handleClick );

		return () => {
			editableContentElement.removeEventListener( 'click', handleClick );
		};
	}, [ contentRef, isActive ] );

	useEffect( () => {
		valueRef.current = value;
	}, [ value ] );

	useEffect( () => {
		onChangeRef.current = onChange;
	}, [ onChange ] );

	const mediaOpenerRef = useRef( null );
	const valueRef = useRef( value );
	const rangeRef = useRef( null );
	const onChangeRef = useRef( onChange );

	const openModal = useCallback( () => {
		rangeRef.current = {
			start: value.start,
			end: value.end,
		};
		setIsModalOpen( true );
	}, [ setIsModalOpen ] );

	const closeModal = useCallback( () => {
		setIsModalOpen( false );
	}, [ setIsModalOpen ] );

	const onSelect = useCallback( ( media ) => {
		applyMediaFormat( valueRef.current, onChangeRef.current, media, name );
	}, [] );

	// Test for this:
	// 1. Click on the link button
	// 2. Click the Options button in the top right of header
	// 3. Focus should be in the dropdown of the Options button
	// 4. Press Escape
	// 5. Focus should be on the Options button
	function onFocusOutside() {
		setIsModalOpen( false );
	}

	return (
		<>
			<MediaUploadCheck>
				<MediaUpload
					allowedTypes={ ALLOWED_MEDIA_TYPES }
					onSelect={ onSelect }
					render={ ( { open } ) => {
						mediaOpenerRef.current = open;
					} }
				/>
			</MediaUploadCheck>

			<RichTextToolbarButton
				icon={ customLink }
				isActive={ isActive }
				title={ title }
				onClick={ openModal }
				className="unitone-media-link__toolbar-button"
			/>

			{ isModalOpen && (
				<InlineUI
					name={ name }
					isActive={ isActive }
					value={ value }
					onChange={ onChange }
					contentRef={ contentRef }
					activeAttributes={ activeAttributes }
					onClose={ closeModal }
					onFocusOutside={ onFocusOutside }
					onOpenMedia={ () => mediaOpenerRef.current?.() }
					focusOnMount={ false }
				/>
			) }
		</>
	);
}

registerFormatType( settings.name, settings );
