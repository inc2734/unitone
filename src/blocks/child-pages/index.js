import { registerBlockType } from '@wordpress/blocks';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';

import icon from './icon';
import edit from './edit';
import save from './save';

import clusterDividedMetadata from '../cluster-divided/block.json';
import stackDividedMetadata from '../stack-divided/block.json';

import './style.scss';
import './index.scss';

registerBlockType( 'unitone/child-pages', {
	icon: {
		src: icon,
	},
	edit,
	save,
} );

const withChildBlockAttributes = createHigherOrderComponent(
	( BlockListBlock ) => {
		return ( props ) => {
			const { getBlock } = useSelect( blockEditorStore );

			const block = getBlock( props.clientId );
			if ( 'unitone/child-pages' !== block.name ) {
				return <BlockListBlock { ...props } />;
			}

			const layout = props.attributes.layout;
			const legacyLayout = ( props.attributes.className || '' ).match(
				/(?:^|\s)is-style-(\S+?)(?:-divided-(\S+))?(?:\s|$)/
			);
			const effectiveLayout =
				'default' === layout ? legacyLayout?.[ 1 ] || layout : layout;
			const effectiveDividerType =
				( 'default' === layout ? legacyLayout?.[ 2 ] : undefined ) ??
				props.attributes.unitone?.dividerType ??
				stackDividedMetadata.attributes.unitone.default.dividerType;

			let dividerType;
			let divider;
			let dividerColor;
			if ( 'cluster' === layout ) {
				dividerType = {
					options: [
						'',
						...clusterDividedMetadata.supports.unitone.dividerType,
					],
					default:
						clusterDividedMetadata.attributes?.unitone?.default
							?.dividerType,
				};
				divider = {
					default: {
						...clusterDividedMetadata.attributes?.unitone?.default
							?.divider,
					},
				};
				dividerColor = {
					default:
						clusterDividedMetadata.attributes?.unitone?.default
							?.dividerColor,
				};
			} else if ( 'stack' === layout ) {
				dividerType = {
					options: [
						'',
						...stackDividedMetadata.supports.unitone.dividerType,
					],
					default:
						stackDividedMetadata.attributes?.unitone?.default
							?.dividerType,
				};
				divider = {
					default: {
						...stackDividedMetadata.attributes?.unitone?.default
							?.divider,
					},
				};
				dividerColor = {
					default:
						stackDividedMetadata.attributes?.unitone?.default
							?.dividerColor,
				};
			}

			return (
				<BlockListBlock
					{ ...props }
					attributes={ {
						...props.attributes,
						__unstableUnitoneSupports: {
							...props.attributes?.__unstableUnitoneSupports,
							gap: {
								...props.attributes?.__unstableUnitoneSupports
									?.gap,
								uiDirection:
									'stack' === effectiveLayout &&
									'bordered' !== effectiveDividerType
										? 'vertical'
										: 'all',
							},
							dividerType,
							divider,
							dividerColor,
						},
					} }
				/>
			);
		};
	},
	'withChildBlockAttributes'
);

addFilter(
	'editor.BlockListBlock',
	'unitone/layers/with-child-block-attributes',
	withChildBlockAttributes,
	11
);
