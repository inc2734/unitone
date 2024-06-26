import { registerBlockType } from '@wordpress/blocks';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';

import icon from './icon';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';
import transforms from './transforms';
import variations from './variations';

import './style.scss';
import './index.scss';

registerBlockType( 'unitone/layers', {
	icon: {
		src: icon,
	},
	edit,
	save,
	deprecated,
	transforms,
	variations,
} );

const withChildBlockAttributes = createHigherOrderComponent(
	( BlockListBlock ) => {
		return ( props ) => {
			const { getBlockParents, getBlock } = useSelect(
				( select ) => {
					return select( blockEditorStore );
				},
				[ props.clientId ]
			);

			const newProps = { ...props };

			const blockParents = getBlockParents( props.clientId );
			if ( 0 < blockParents.length ) {
				const parentClientId = blockParents[ blockParents.length - 1 ];
				if ( !! parentClientId ) {
					const parentBlock = getBlock( parentClientId );

					if ( 'unitone/layers' === parentBlock?.name ) {
						const DEFAULT_VALUES = {
							alignSelf: 'stretch',
							justifySelf: 'stretch',
							gridColumn: '1 / -1',
							gridRow: '1 / -1',
						};

						newProps.attributes = {
							...newProps.attributes,
							unitone: {
								...newProps.attributes?.unitone,
								alignSelf:
									null !=
									newProps.attributes?.unitone?.alignSelf
										? newProps.attributes?.unitone
												?.alignSelf
										: DEFAULT_VALUES.alignSelf,
								justifySelf:
									null !=
									newProps.attributes?.unitone?.justifySelf
										? newProps.attributes?.unitone
												?.justifySelf
										: DEFAULT_VALUES.justifySelf,
								gridColumn:
									null !=
									newProps.attributes?.unitone?.gridColumn
										? newProps.attributes?.unitone
												?.gridColumn
										: DEFAULT_VALUES.gridColumn,
								gridRow:
									null !=
									newProps.attributes?.unitone?.gridRow
										? newProps.attributes?.unitone?.gridRow
										: DEFAULT_VALUES.gridRow,
							},
							__unstableUnitoneSupports: {
								alignSelf: {
									default: DEFAULT_VALUES.alignSelf,
								},
								justifySelf: {
									default: DEFAULT_VALUES.justifySelf,
								},
								gridColumn: {
									default: DEFAULT_VALUES.gridColumn,
								},
								gridRow: {
									default: DEFAULT_VALUES.gridRow,
								},
								maxWidth: true,
								minHeight: true,
								mixBlendMode: true,
							},
						};
					}
				}
			}

			return <BlockListBlock { ...newProps } />;
		};
	},
	'withChildBlockAttributes'
);

addFilter(
	'editor.BlockListBlock',
	'unitone/layers/with-child-block-attributes',
	withChildBlockAttributes
);
