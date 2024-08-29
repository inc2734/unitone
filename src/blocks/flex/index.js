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
			const { getBlockParents, getBlock } = useSelect( blockEditorStore );

			const blockParents = getBlockParents( props.clientId );
			if ( 1 > blockParents.length ) {
				return <BlockListBlock { ...props } />;
			}

			const parentClientId = blockParents[ blockParents.length - 1 ];
			if ( ! parentClientId ) {
				return <BlockListBlock { ...props } />;
			}

			const parentBlock = getBlock( parentClientId );
			if ( 'unitone/flex' !== parentBlock?.name ) {
				return <BlockListBlock { ...props } />;
			}

			const DEFAULT_VALUES = {
				flexGrow: '0',
				flexShrink: '1',
				flexBasis: 'auto',
			};

			const newProps = {
				...props,
				attributes: {
					...props?.attributes,
					unitone: {
						...props?.attributes?.unitone,
						flexGrow:
							null != props?.attributes?.unitone?.flexGrow
								? props?.attributes?.unitone?.flexGrow
								: DEFAULT_VALUES.flexGrow,
						flexShrink:
							null != props?.attributes?.unitone?.flexShrink
								? props?.attributes?.unitone?.flexShrink
								: DEFAULT_VALUES.flexShrink,
						flexBasis:
							null != props?.attributes?.unitone?.flexBasis
								? props?.attributes?.unitone?.flexBasis
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
				},
			};

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
