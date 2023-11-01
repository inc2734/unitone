import { registerBlockType } from '@wordpress/blocks';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';

import icon from '../icon';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';
import transforms from './transforms';

import './style.scss';
import './index.scss';

registerBlockType( 'unitone/both-sides', {
	icon: {
		src: icon,
	},
	edit,
	save,
	deprecated,
	transforms,
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

					if ( 'unitone/both-sides' === parentBlock?.name ) {
						const DEFAULT_VALUES = {
							flexBasis: 'fit-content',
						};

						newProps.attributes = {
							...newProps.attributes,
							unitone: {
								...newProps.attributes?.unitone,
								flexBasis:
									null !=
									newProps.attributes?.unitone?.flexBasis
										? newProps.attributes?.unitone
												?.flexBasis
										: DEFAULT_VALUES.flexBasis,
							},
							__unstableUnitoneSupports: {
								flexBasis: {
									default: DEFAULT_VALUES.flexBasis,
								},
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
	'unitone/both-sides/with-child-block-attributes',
	withChildBlockAttributes
);
