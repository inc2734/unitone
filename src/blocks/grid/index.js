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

registerBlockType( 'unitone/grid', {
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
			if ( 'unitone/grid' !== parentBlock?.name ) {
				return <BlockListBlock { ...props } />;
			}

			const DEFAULT_VALUES = {
				alignSelf: {
					lg: 'stretch',
				},
				justifySelf: {
					lg: 'stretch',
				},
				gridColumn: {
					lg: 'auto',
				},
				gridRow: {
					lg: 'auto',
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
						gridColumn:
							null != props?.attributes?.unitone?.gridColumn
								? props?.attributes?.unitone?.gridColumn
								: DEFAULT_VALUES.gridColumn,
						gridRow:
							null != props?.attributes?.unitone?.gridRow
								? props?.attributes?.unitone?.gridRow
								: DEFAULT_VALUES.gridRow,
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
						gridColumn: {
							responsive: true,
							default: DEFAULT_VALUES.gridColumn,
						},
						gridRow: {
							responsive: true,
							default: DEFAULT_VALUES.gridRow,
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
