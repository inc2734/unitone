import classnames from 'classnames';

import {
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

export default function ( { attributes, setAttributes, clientId } ) {
	const { tagName, shadow, position, top, right, bottom, left, zIndex } =
		attributes;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( 'core/block-editor' ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		style: {
			'--unitone--top': top || undefined,
			'--unitone--right': right || undefined,
			'--unitone--bottom': bottom || undefined,
			'--unitone--left': left || undefined,
			'--unitone--z-index': zIndex || undefined,
		},
	} );
	blockProps[ 'data-unitone-layout' ] = classnames(
		'decorator',
		blockProps[ 'data-unitone-layout' ],
		{
			[ `-position:${ position }` ]: position,
			'-shadow': shadow,
		}
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock: false,
		renderAppender: hasInnerBlocks
			? InnerBlocks.DefaultBlockAppender
			: InnerBlocks.ButtonBlockAppender,
	} );

	const TagName = tagName || 'div';

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'General', 'unitone' ) }>
					<ToggleControl
						label={ __( 'With shadow', 'unitone' ) }
						checked={ shadow }
						onChange={ ( newAttribute ) => {
							setAttributes( { shadow: newAttribute } );
						} }
					/>

					<SelectControl
						label={ __( 'HTML element', 'unitone' ) }
						options={ [
							{ label: '<header>', value: 'header' },
							{ label: '<main>', value: 'main' },
							{ label: '<section>', value: 'section' },
							{ label: '<article>', value: 'article' },
							{ label: '<aside>', value: 'aside' },
							{ label: '<footer>', value: 'footer' },
							{ label: '<div>', value: 'div' },
						] }
						value={ tagName || 'div' }
						onChange={ ( newAttribute ) =>
							setAttributes( { tagName: newAttribute } )
						}
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Position', 'unitone' ) }
					initialOpen={ false }
				>
					<SelectControl
						label={ __( 'Position', 'unitone' ) }
						options={ [
							{ label: '', value: '' },
							{
								label: __( 'static', 'unitone' ),
								value: 'static',
							},
							{
								label: __( 'relative', 'unitone' ),
								value: 'relative',
							},
							{
								label: __( 'absolute', 'unitone' ),
								value: 'absolute',
							},
							{ label: __( 'fixed', 'unitone' ), value: 'fixed' },
							{
								label: __( 'sticky', 'unitone' ),
								value: 'sticky',
							},
						] }
						value={ position }
						onChange={ ( newAttribute ) =>
							setAttributes( {
								position: newAttribute,
							} )
						}
					/>

					<TextControl
						label={ __( 'Top', 'unitone' ) }
						value={ top }
						onChange={ ( newAttribute ) => {
							setAttributes( { top: newAttribute } );
						} }
					/>

					<TextControl
						label={ __( 'Right', 'unitone' ) }
						value={ right }
						onChange={ ( newAttribute ) => {
							setAttributes( {
								right: newAttribute,
							} );
						} }
					/>

					<TextControl
						label={ __( 'Bottom', 'unitone' ) }
						value={ bottom }
						onChange={ ( newAttribute ) => {
							setAttributes( {
								bottom: newAttribute,
							} );
						} }
					/>

					<TextControl
						label={ __( 'Left', 'unitone' ) }
						value={ left }
						onChange={ ( newAttribute ) => {
							setAttributes( {
								left: newAttribute,
							} );
						} }
					/>

					<TextControl
						label={ __( 'z-index', 'unitone' ) }
						value={ zIndex }
						onChange={ ( newAttribute ) => {
							setAttributes( {
								zIndex: newAttribute,
							} );
						} }
					/>
				</PanelBody>
			</InspectorControls>

			<TagName { ...innerBlocksProps } />
		</>
	);
}
