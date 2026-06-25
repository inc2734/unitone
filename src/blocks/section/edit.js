import clsx from 'clsx';
import { get } from 'lodash';

import {
	ButtonBlockAppender,
	BlockAlignmentToolbar,
	BlockControls,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
	__experimentalBlockVariationPicker as BlockVariationPicker,
} from '@wordpress/block-editor';

import {
	createBlocksFromInnerBlocksTemplate,
	store as blocksStore,
} from '@wordpress/blocks';

import {
	SelectControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';

import {
	justifyCenter,
	justifyLeft,
	justifyRight,
	justifyStretch,
} from '@wordpress/icons';

import {
	useEffect,
	useState,
	useMemo,
	memo,
	useCallback,
} from '@wordpress/element';

import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import {
	cleanEmptyObject,
	normalizeForSelectControl,
	useToolsPanelDropdownMenuProps,
} from '../../js/editor/hooks/utils';

import { logicalToPhysical, physicalToLogical } from '../../js/utils/direction';

import metadata from './block.json';

const MemoizedButtonBlockAppender = memo( ButtonBlockAppender );

const blockAlignOptions = [
	{
		value: 'left',
		icon: justifyLeft,
		label: __( 'Left', 'unitone' ),
	},
	{
		value: 'center',
		icon: justifyCenter,
		label: __( 'Center', 'unitone' ),
	},
	{
		value: 'right',
		icon: justifyRight,
		label: __( 'Right', 'unitone' ),
	},
	{
		value: 'none',
		icon: justifyStretch,
		label: __( 'None', 'unitone' ),
	},
];

export default function ( { name, attributes, setAttributes, clientId } ) {
	const { tagName, containerAlign, templateLock } = attributes;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const defaultAttributes = useMemo( () => {
		const _object = {};
		Object.values( metadata.attributes || [] ).forEach(
			( value, index ) => {
				_object[ Object.keys( metadata.attributes )[ index ] ] =
					value.default;
			}
		);
		return cleanEmptyObject( _object );
	}, [] );

	const preComparativeAttributes = {
		...attributes,
		__unstableUnitoneSupports: undefined,
	};

	const comparativeAttributes = useMemo( () => {
		return cleanEmptyObject( preComparativeAttributes );
	}, [ JSON.stringify( preComparativeAttributes ) ] );

	const [ isShowPlaceholder, setIsShowPlaceholder ] = useState(
		! hasInnerBlocks &&
			JSON.stringify( defaultAttributes ) ===
				JSON.stringify( comparativeAttributes )
	);

	useEffect( () => {
		if (
			JSON.stringify( defaultAttributes ) ===
				JSON.stringify( comparativeAttributes ) &&
			! hasInnerBlocks
		) {
			setIsShowPlaceholder( true );
		}
	}, [ comparativeAttributes, defaultAttributes, hasInnerBlocks ] );

	const blockProps = useBlockProps( { className: 'unitone-section' } );

	const renderAppender = useCallback(
		() => <MemoizedButtonBlockAppender rootClientId={ clientId } />,
		[ clientId ]
	);

	const innerBlocksProps = useInnerBlocksProps(
		{
			'data-unitone-layout': 'stack',
		},
		{
			templateLock,
			renderAppender: hasInnerBlocks ? undefined : renderAppender,
		}
	);

	const { replaceInnerBlocks } = useDispatch( blockEditorStore );

	const onSelect = ( nextVariation ) => {
		setIsShowPlaceholder( false );

		if ( nextVariation.attributes ) {
			setAttributes( nextVariation.attributes );
		}

		if ( nextVariation.innerBlocks ) {
			replaceInnerBlocks(
				clientId,
				createBlocksFromInnerBlocksTemplate(
					nextVariation.innerBlocks
				),
				true
			);
		}
	};

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const newContainerAlign =
		containerAlign ?? metadata.attributes.containerAlign.default;

	const TagName = tagName;

	return (
		<>
			<BlockControls group="block">
				<BlockAlignmentToolbar
					controls={ blockAlignOptions.map(
						( option ) => option.value
					) }
					value={ logicalToPhysical(
						containerAlign ??
							metadata.attributes.containerAlign.default
					) }
					onChange={ ( newAttribute ) => {
						setAttributes( {
							containerAlign: physicalToLogical(
								newAttribute || 'none'
							),
						} );
					} }
				/>
			</BlockControls>

			<InspectorControls>
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
							options={ [
								{ label: '<main>', value: 'main' },
								{ label: '<section>', value: 'section' },
								{ label: '<article>', value: 'article' },
								{ label: '<aside>', value: 'aside' },
								{ label: '<header>', value: 'header' },
								{ label: '<footer>', value: 'footer' },
								{ label: '<div>', value: 'div' },
							] }
							value={ normalizeForSelectControl( tagName ) }
							onChange={ ( newAttribute ) =>
								setAttributes( {
									tagName:
										normalizeForSelectControl(
											newAttribute
										),
								} )
							}
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							containerAlign !==
							metadata.attributes.containerAlign.default
						}
						isShownByDefault
						label={ __( 'Container alignment', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								containerAlign:
									metadata.attributes.containerAlign.default,
							} )
						}
					>
						<fieldset className="block-editor-hooks__flex-layout-justification-controls unitone-dimension-control">
							<ToggleGroupControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Container alignment', 'unitone' ) }
								value={ logicalToPhysical(
									containerAlign ??
										metadata.attributes.containerAlign
											.default
								) }
								onChange={ ( value ) => {
									setAttributes( {
										containerAlign:
											logicalToPhysical(
												containerAlign
											) !== value
												? physicalToLogical( value )
												: undefined,
									} );
								} }
							>
								{ blockAlignOptions.map(
									( { value, icon, label: iconLabel } ) => (
										<ToggleGroupControlOptionIcon
											key={ value }
											icon={ icon }
											label={ iconLabel }
											value={ value }
										/>
									)
								) }
							</ToggleGroupControl>
						</fieldset>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			{ isShowPlaceholder ? (
				<div { ...blockProps }>
					<Placeholder { ...{ name, onSelect } } />
				</div>
			) : (
				<TagName { ...blockProps }>
					<div data-unitone-layout="gutters">
						<div
							data-unitone-layout={ clsx(
								'container',
								'none' !== newContainerAlign &&
									`-align:${ newContainerAlign }`
							) }
						>
							<div { ...innerBlocksProps } />
						</div>
					</div>
				</TagName>
			) }
		</>
	);
}

function Placeholder( { name, onSelect } ) {
	const { blockType, variations } = useSelect(
		( select ) => {
			const { getBlockVariations, getBlockType } = select( blocksStore );

			return {
				blockType: getBlockType( name ),
				variations: getBlockVariations( name, 'block' ),
			};
		},
		[ name ]
	);

	return (
		<BlockVariationPicker
			icon={ get( blockType, [ 'icon', 'src' ] ) }
			label={ get( blockType, [ 'title' ] ) }
			variations={ variations }
			onSelect={ onSelect }
			allowSkip
		/>
	);
}
