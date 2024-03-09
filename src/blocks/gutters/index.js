import { registerBlockType } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import icon from './icon';
import edit from './edit';
import save from './save';
import transforms from './transforms';
import deprecated from './deprecated';

import './style.scss';

registerBlockType( 'unitone/gutters', {
	icon: {
		src: icon,
	},
	edit,
	save,
	transforms,
	deprecated,
} );

const changeUnitoneSupportsLabels = createHigherOrderComponent(
	( BlockListBlock ) => {
		return ( props ) => {
			if ( 'unitone/gutters' !== props.name ) {
				return <BlockListBlock { ...props } />;
			}

			const newProps = { ...props };

			newProps.attributes = {
				...newProps.attributes,
				__unstableUnitoneSupports: {
					...newProps.attributes?.__unstableUnitoneSupports,
					padding: {
						...newProps.attributes?.__unstableUnitoneSupports
							?.padding,
						label: __( 'Top and bottom padding', 'unitone' ),
					},
				},
			};

			return <BlockListBlock { ...newProps } />;
		};
	},
	'changeUnitoneSupportsLabels'
);

addFilter(
	'editor.BlockListBlock',
	'unitone/gutters/change-unitone-supports-labels',
	changeUnitoneSupportsLabels
);
