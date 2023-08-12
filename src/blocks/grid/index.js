import { registerBlockType } from '@wordpress/blocks';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';

import './style.scss';

import icon from '../icon';
import edit from './edit';
import save from './save';
import transforms from './transforms';

registerBlockType( 'unitone/grid', {
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

					if ( 'unitone/grid' === parentBlock?.name ) {
						newProps.attributes = {
							...newProps.attributes,
							__unstableUnitoneSupports: {
								alignSelf: true,
								justifySelf: true,
								gridColumn: true,
								gridRow: true,
							},
						};
					}
				}
			}

			return <BlockListBlock { ...newProps } />;
		};
	},
	'withClientIdClassName'
);

addFilter(
	'editor.BlockListBlock',
	'unitone/grid/with-child-block-attributes',
	withChildBlockAttributes
);
