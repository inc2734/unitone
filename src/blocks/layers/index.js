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
			const { getBlock } = useSelect( blockEditorStore );

			if ( ! props.rootClientId ) {
				return <BlockListBlock { ...props } />;
			}

			const parentBlock = getBlock( props.rootClientId );
			if ( 'unitone/layers' !== parentBlock?.name ) {
				return <BlockListBlock { ...props } />;
			}

			const DEFAULT_VALUES = {
				alignSelf: 'stretch',
				justifySelf: 'stretch',
				gridColumn: '1 / -1',
				gridRow: '1 / -1',
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
						...props?.attributes?.__unstableUnitoneSupports,
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
				},
			};

			return <BlockListBlock { ...newProps } />;
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
