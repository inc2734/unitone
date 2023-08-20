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
import variations from './variations';

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
						newProps.attributes = {
							...newProps.attributes,
							__unstableUnitoneSupports: {
								alignSelf: true,
								justifySelf: true,
								gridColumn: true,
								gridRow: true,
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
