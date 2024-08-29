import { registerBlockType } from '@wordpress/blocks';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';

import icon from '../grid/icon';
import edit from './edit';
import save from './save';
import transforms from './transforms';
import variations from './variations';

import './style.scss';
import './index.scss';

registerBlockType( 'unitone/grid-divided', {
	icon: {
		src: icon,
	},
	edit,
	save,
	transforms,
	variations,
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
			if ( 'unitone/grid-divided' !== parentBlock?.name ) {
				return <BlockListBlock { ...props } />;
			}

			const DEFAULT_VALUES = {
				alignSelf: {
					lg: 'stretch',
				},
				justifySelf: {
					lg: 'stretch',
				},
			};

			const newProps = {
				...props,
				attributes: {
					...props?.attributes,
					unitone: {
						...props?.attributes?.unitone,
						alignSelf:
							null != props?.attributes?.unitone?.alignSelf
								? props?.attributes?.unitone?.alignSelf
								: DEFAULT_VALUES.alignSelf,
						justifySelf:
							null != props?.attributes?.unitone?.justifySelf
								? props?.attributes?.unitone?.justifySelf
								: DEFAULT_VALUES.justifySelf,
					},
					__unstableUnitoneSupports: {
						alignSelf: {
							responsive: true,
							default: DEFAULT_VALUES.alignSelf,
						},
						justifySelf: {
							responsive: true,
							default: DEFAULT_VALUES.justifySelf,
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
	'unitone/grid/with-child-block-attributes',
	withChildBlockAttributes
);
