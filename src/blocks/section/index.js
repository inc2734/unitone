import { registerBlockType } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import icon from './icon';
import edit from './edit';
import save from './save';
import transforms from './transforms';
import variations from './variations';

import './style.scss';
import './index.scss';

registerBlockType( 'unitone/section', {
	icon: {
		src: icon,
	},
	edit,
	save,
	transforms,
	variations,
} );

const changeUnitoneSupportsLabels = createHigherOrderComponent(
	( BlockListBlock ) => {
		return ( props ) => {
			if ( 'unitone/section' !== props.name ) {
				return <BlockListBlock { ...props } />;
			}

			const newProps = { ...props };

			newProps.attributes = {
				...newProps.attributes,
				__unstableUnitoneSupports: {
					...newProps.attributes?.__unstableUnitoneSupports,
					maxWidth: {
						...newProps.attributes?.__unstableUnitoneSupports
							?.maxWidth,
						label: __( 'Max width of contents', 'unitone' ),
					},
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
