import {
	InnerBlocks,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	SelectControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useRefEffect } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { physicalToLogical } from '../../js/helper';

import metadata from './block.json';

import {
	dividersResizeObserver,
	setDividerLinewrap,
} from '@inc2734/unitone-css/library';

export default function ( { attributes, setAttributes, clientId } ) {
	const { tagName, layout, templateLock } = attributes;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	useEffect( () => {
		const newVerticalAlignment =
			'vertical' !== layout?.orientation
				? physicalToLogical( layout?.verticalAlignment )
				: undefined;

		setAttributes( {
			verticalAlignment: newVerticalAlignment,
		} );
	}, [ layout?.verticalAlignment, layout?.orientation ] );

	const ref = useRefEffect( ( target ) => {
		dividersResizeObserver( target, {
			ignore: {
				className: [
					'is-selected',
					'has-child-selected',
					'is-hovered',
					'is-highlighted',
				],
			},
		} );

		setTimeout( () => {
			setDividerLinewrap( target );
		}, 100 );
	}, [] );

	const blockProps = useBlockProps( {
		ref,
		className: 'unitone-flex',
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock,
		allowedBlocks: [ 'unitone/flex-divided-content' ],
		renderAppender: hasInnerBlocks
			? undefined
			: InnerBlocks.ButtonBlockAppender,
	} );

	const TagName = tagName;

	return (
		<>
			<InspectorControls>
				<ToolsPanel label={ __( 'Settings', 'unitone' ) }>
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
							label={ __( 'HTML element', 'unitone' ) }
							options={ [
								{ label: '<div>', value: 'div' },
								{ label: '<ul>', value: 'ul' },
								{ label: '<ol>', value: 'ol' },
							] }
							value={ tagName }
							onChange={ ( newAttribute ) =>
								setAttributes( { tagName: newAttribute } )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<TagName { ...innerBlocksProps } />
		</>
	);
}
