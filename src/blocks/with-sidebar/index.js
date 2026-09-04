import { registerBlockType } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import icon from './icon';
import edit from './edit';
import save from './save';
import transforms from './transforms';
import deprecated from './deprecated';
import variations from './variations';

import './style.scss';
import './index.scss';

registerBlockType( 'unitone/with-sidebar', {
	icon: {
		src: icon,
	},
	edit,
	save,
	transforms,
	variations,
	deprecated,
} );

const changeUnitoneSupportsLabels = createHigherOrderComponent(
	( BlockListBlock ) => {
		return ( props ) => {
			if ( ! props.isSelected || 'unitone/with-sidebar' !== props.name ) {
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
	'unitone/with-sidebar/change-unitone-supports-labels',
	changeUnitoneSupportsLabels,
	11
);
