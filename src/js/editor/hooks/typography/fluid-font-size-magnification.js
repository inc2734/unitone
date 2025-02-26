import {
	useMemo,
	useEffect,
	useRef,
	useState,
	useCallback,
} from '@wordpress/element';

import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';

import { cleanEmptyObject, throttle } from '../utils';
import { getFontSizeStatus } from './fluid-typography';

function getFontSizeMagnification( document, clientId ) {
	const defaultView = document?.defaultView;
	const target = document?.getElementById( `block-${ clientId }` );
	const root = document?.querySelector( '.editor-styles-wrapper' );

	if ( ! target || ! root ) {
		return undefined;
	}

	const fontSize = parseFloat(
		defaultView.getComputedStyle( target ).getPropertyValue( 'font-size' )
	);

	const baseFontSize = parseFloat(
		defaultView.getComputedStyle( root ).getPropertyValue( 'font-size' )
	);

	return fontSize / baseFontSize;
}

const withFluidTypography = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const { attributes, setAttributes, clientId } = props;

		const [ width, setWidth ] = useState();
		const [ magnification, setMagnification ] = useState();

		const ref = useRef( null );

		const fontSizeStatus = useMemo(
			() => getFontSizeStatus( attributes?.style?.typography?.fontSize ),
			[ attributes?.style?.typography?.fontSize ]
		);

		const getMagnification = useCallback(
			( document ) => getFontSizeMagnification( document, clientId ),
			[
				clientId,
				attributes?.fontSize,
				attributes?.style?.typography?.fontSize,
			]
		);

		const enableFluidTypography = attributes?.unitone?.fluidTypography;

		/**
		 * If enabled custom fixed font size, disabled fluid typography.
		 */
		useEffect( () => {
			if ( fontSizeStatus.fixed ) {
				setAttributes( {
					unitone: cleanEmptyObject( {
						...attributes?.unitone,
						fluidTypography: undefined,
					} ),
				} );
			}
		}, [ fontSizeStatus.fixed ] );

		/**
		 * Set resize observer.
		 */
		useEffect( () => {
			if ( ! ref?.current ) {
				return;
			}

			const ownerDocument = ref?.current?.ownerDocument;
			const defaultView = ownerDocument?.defaultView;
			const target = ownerDocument?.getElementById(
				`block-${ clientId }`
			);

			if ( ! defaultView || ! target ) {
				return;
			}

			const resizeObserver = new defaultView.ResizeObserver(
				throttle( ( entries ) => {
					if ( entries[ 0 ].contentBoxSize[ 0 ] !== width ) {
						setWidth( entries[ 0 ].contentBoxSize[ 0 ].inlineSize );
					}
				}, 250 )
			);
			resizeObserver.observe( ownerDocument.body );

			return () => resizeObserver?.disconnect();
		}, [ ref?.current, enableFluidTypography ] );

		/**
		 * Update magnification.
		 */
		useEffect( () => {
			// Delay the execution a little because the exact font size cannot be obtained unless
			// it is executed after the rendering is completed.
			setTimeout( () => {
				setMagnification(
					getMagnification(
						enableFluidTypography
							? ref?.current?.ownerDocument
							: undefined
					)
				);
			}, 50 );
		}, [
			width,
			enableFluidTypography,
			attributes?.fontSize,
			attributes?.style?.typography?.fontSize,
		] );

		return (
			<>
				<BlockListBlock
					{ ...{
						...props,
						wrapperProps: {
							...props?.wrapperProps,
							style: {
								...props?.wrapperProps?.style,
								'--unitone--fluid-font-size-magnification':
									magnification,
							},
						},
					} }
				/>

				{ enableFluidTypography && (
					<div
						ref={ ref }
						className="unitone-fluild-typography-ref"
						style={ { display: 'none' } }
					/>
				) }
			</>
		);
	};
}, 'withFluidTypography' );

addFilter(
	'editor.BlockListBlock',
	'unitone/fluidTypography/withFluidTypography',
	withFluidTypography
);
