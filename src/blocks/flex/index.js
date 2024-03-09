import { registerBlockType } from '@wordpress/blocks';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';

import './style.scss';
import './index.scss';

import icon from './icon';
import edit from './edit';
import save from './save';
import transforms from './transforms';

registerBlockType( 'unitone/flex', {
	icon: {
		src: icon,
	},
	edit,
	save,
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

					if ( 'unitone/flex' === parentBlock?.name ) {
						const DEFAULT_VALUES = {
							flexGrow: '0',
							flexShrink: '1',
							flexBasis: 'auto',
						};

						newProps.attributes = {
							...newProps.attributes,
							unitone: {
								...newProps.attributes?.unitone,
								flexGrow:
									null !=
									newProps.attributes?.unitone?.flexGrow
										? newProps.attributes?.unitone?.flexGrow
										: DEFAULT_VALUES.flexGrow,
								flexShrink:
									null !=
									newProps.attributes?.unitone?.flexShrink
										? newProps.attributes?.unitone
												?.flexShrink
										: DEFAULT_VALUES.flexShrink,
								flexBasis:
									null !=
									newProps.attributes?.unitone?.flexBasis
										? newProps.attributes?.unitone
												?.flexBasis
										: DEFAULT_VALUES.flexBasis,
							},
							__unstableUnitoneSupports: {
								flexGrow: {
									default: DEFAULT_VALUES.flexGrow,
								},
								flexShrink: {
									default: DEFAULT_VALUES.flexShrink,
								},
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
	'unitone/flex/with-child-block-attributes',
	withChildBlockAttributes
);
