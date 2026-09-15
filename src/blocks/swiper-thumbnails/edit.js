import {
	InspectorControls,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';

import {
	TextControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import {
	normalizeForTextControl,
	useToolsPanelDropdownMenuProps,
} from '../../js/editor/hooks/utils';

import { getFirstOwnedParts } from '../swiper/editor-parts';
import metadata from './block.json';

export default function ( { attributes, setAttributes, clientId } ) {
	const { columnMinWidth } = attributes;

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const slideCount = useSelect(
		( select ) => {
			const selector = select( blockEditorStore );
			const swiperClientId = selector
				.getBlockParents( clientId, true )
				.find(
					( parentId ) =>
						'unitone/swiper' === selector.getBlockName( parentId )
				);
			if ( ! swiperClientId ) {
				return 0;
			}

			const trackClientId = getFirstOwnedParts(
				selector.getBlocks( swiperClientId )
			)[ 'unitone/swiper-track' ];
			return trackClientId
				? selector
						.getBlocks( trackClientId )
						.filter(
							( block ) => 'unitone/swiper-slide' === block.name
						).length
				: 0;
		},
		[ clientId ]
	);

	const resetColumnMinWidth = () =>
		setAttributes( {
			columnMinWidth: metadata.attributes.columnMinWidth.default,
		} );

	const blockProps = useBlockProps( {
		className: 'unitone-swiper-thumbnails',
		style: {
			'--unitone--column-min-width': columnMinWidth || undefined,
		},
	} );

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings', 'unitone' ) }
					resetAll={ resetColumnMinWidth }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						hasValue={ () =>
							columnMinWidth !==
							metadata.attributes.columnMinWidth.default
						}
						isShownByDefault
						label={ __( 'Column min width', 'unitone' ) }
						onDeselect={ resetColumnMinWidth }
					>
						<TextControl
							__nextHasNoMarginBottom
							label={ __( 'Column min width', 'unitone' ) }
							help={ __(
								'Thumbnails wrap automatically and share the same column width.',
								'unitone'
							) }
							value={ normalizeForTextControl( columnMinWidth ) }
							onChange={ ( value ) =>
								setAttributes( {
									columnMinWidth:
										normalizeForTextControl( value ),
								} )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<div { ...blockProps }>
				{ Array.from( { length: slideCount }, ( _, index ) => (
					<div
						className="unitone-swiper-thumbnails__placeholder"
						key={ index }
					/>
				) ) }
			</div>
		</>
	);
}
