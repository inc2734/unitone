import { registerBlockType } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import icon from '../cluster/icon';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';
import transforms from './transforms';
import variations from './variations';

import './style.scss';
import './index.scss';

registerBlockType( 'unitone/cluster-divided', {
	icon: {
		src: icon,
	},
	edit,
	save,
	deprecated,
	transforms,
	variations,
} );

const changeUnitoneSupportsLabels = createHigherOrderComponent(
	( BlockListBlock ) => {
		return ( props ) => {
			if (
				! props.isSelected ||
				'unitone/cluster-divided' !== props.name
			) {
				return <BlockListBlock { ...props } />;
			}

			return (
				<BlockListBlock
					{ ...props }
					attributes={ {
						...props.attributes,
						__unstableUnitoneSupports: {
							...props.attributes?.__unstableUnitoneSupports,
							padding: {
								...props.attributes?.__unstableUnitoneSupports
									?.padding,
								label: __( 'Children padding', 'unitone' ),
							},
						},
					} }
				/>
			);
		};
	},
	'changeUnitoneSupportsLabels'
);

addFilter(
	'editor.BlockListBlock',
	'unitone/cluster-divided/change-unitone-supports-labels',
	changeUnitoneSupportsLabels,
	11
);
