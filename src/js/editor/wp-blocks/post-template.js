import { createHigherOrderComponent } from '@wordpress/compose';
import { useEffect, useRef } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';

import { debounce, setDividerLinewrap } from '@inc2734/unitone-css/library';

const observers = new WeakMap();
const selector =
	'.editor-styles-wrapper .wp-block-post-template[data-unitone-layout*="-divider:"]';

const refreshPostTemplates = ( ownerDocument ) => {
	ownerDocument.querySelectorAll( selector ).forEach( setDividerLinewrap );
};

const ensureObserver = ( ownerDocument ) => {
	const currentObserver = observers.get( ownerDocument );
	if ( currentObserver ) {
		currentObserver.count += 1;
		return currentObserver;
	}

	const root =
		ownerDocument.querySelector( '.editor-styles-wrapper' ) ??
		ownerDocument.body;
	const defaultView = ownerDocument.defaultView;

	const refresh = debounce(
		() => refreshPostTemplates( ownerDocument ),
		250
	);

	const mutationObserver = new defaultView.MutationObserver( refresh );
	const resizeObserver = new defaultView.ResizeObserver( refresh );

	mutationObserver.observe( root, {
		childList: true,
		subtree: true,
	} );

	resizeObserver.observe( root );

	const entry = {
		count: 1,
		refresh,
		disconnect: () => {
			entry.count -= 1;
			if ( entry.count <= 0 ) {
				mutationObserver.disconnect();
				resizeObserver.disconnect();
				observers.delete( ownerDocument );
			}
		},
	};

	observers.set( ownerDocument, entry );

	return entry;
};

const useBlockProps = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const { attributes, name } = props;

		const dummyRef = useRef( null );

		const shouldObserve =
			'core/post-template' === name &&
			!! attributes?.unitone?.dividerType;

		useEffect( () => {
			if ( ! shouldObserve || ! dummyRef.current ) {
				return;
			}

			const ownerDocument = dummyRef.current.ownerDocument;
			const entry = ensureObserver( ownerDocument );

			entry.refresh();

			return () => {
				entry.refresh();
				entry.disconnect();
			};
		}, [ shouldObserve, attributes ] );

		if ( 'core/post-template' !== name ) {
			return <BlockListBlock { ...props } />;
		}

		return (
			<>
				<BlockListBlock { ...props } />

				{ shouldObserve && (
					<div ref={ dummyRef } style={ { display: 'none' } } />
				) }
			</>
		);
	};
}, 'useBlockProps' );

addFilter(
	'editor.BlockListBlock',
	'unitone/post-template/useBlockProps',
	useBlockProps
);
