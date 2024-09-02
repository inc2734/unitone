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
			const { getBlock } = useSelect( blockEditorStore );

			if ( ! props.rootClientId ) {
				return <BlockListBlock { ...props } />;
			}

			const parentBlock = getBlock( props.rootClientId );
			if ( 'unitone/both-sides' !== parentBlock?.name ) {
				return <BlockListBlock { ...props } />;
			}

			const DEFAULT_VALUES = {
				flexBasis: 'fit-content',
			};

			const newProps = {
				...props,
				attributes: {
					...props?.attributes,
					unitone: {
						...props?.attributes?.unitone,
						flexBasis:
							null != props?.attributes?.unitone?.flexBasis
								? props?.attributes?.unitone?.flexBasis
								: DEFAULT_VALUES.flexBasis,
					},
					__unstableUnitoneSupports: {
						...props?.attributes?.__unstableUnitoneSupports,
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
	'unitone/both-sides/with-child-block-attributes',
	withChildBlockAttributes,
	11
);
