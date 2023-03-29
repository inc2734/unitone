import classnames from 'classnames';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

// When adding supports.unitone.alignSelf and more.
const attributesV1 = {
	alignSelf: {
		type: 'string',
		default: '',
	},
	justifySelf: {
		type: 'string',
		default: '',
	},
	gridColumn: {
		type: 'string',
		default: '',
	},
	gridRow: {
		type: 'string',
		default: 'auto',
	},
};

// When adding supports.unitone.alignSelf and more.
const supportsV1 = {
	className: false,
	anchor: true,
	color: {
		background: false,
		link: true,
		text: true,
	},
	typography: {
		fontSize: true,
		lineHeight: true,
		__experimentalFontFamily: true,
		__experimentalTextDecoration: true,
		__experimentalFontStyle: true,
		__experimentalFontWeight: true,
		__experimentalLetterSpacing: true,
		__experimentalTextTransform: true,
		__experimentalDefaultControls: {
			fontSize: true,
		},
	},
	unitone: {
		fluidTypography: true,
		lineHeight: true,
		maxWidth: true,
	},
};

export default [
	{
		attributes: {
			...attributesV1,
		},

		supports: {
			...supportsV1,
		},

		migrate( attributes ) {
			return {
				unitone: {
					alignSelf: attributes.alignSelf || undefined,
					justifySelf: attributes.justifySelf || undefined,
					gridColumn: attributes.gridColumn || undefined,
					gridRow: attributes.gridRow,
				},
			};
		},

		save( { attributes } ) {
			const { alignSelf, justifySelf, gridColumn, gridRow } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-unitone-layout': classnames(
								'layers__layer',
								{
									[ `-align-self:${ alignSelf }` ]:
										!! alignSelf,
									[ `-justify-self:${ justifySelf }` ]:
										!! justifySelf,
								}
							),
							style: {
								'--unitone--grid-column':
									gridColumn || undefined,
								'--unitone--grid-row': gridRow || undefined,
							},
						} )
					) }
				/>
			);
		},
	},
	{
		attributes: {
			...attributesV1,
		},

		supports: {
			...supportsV1,
		},

		save( { attributes } ) {
			const { alignSelf, justifySelf, gridColumn, gridRow } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-layout': classnames( 'layers__layer', {
								[ `-align-self:${ alignSelf }` ]: !! alignSelf,
								[ `-justify-self:${ justifySelf }` ]:
									!! justifySelf,
							} ),
							style: {
								'--grid-column': gridColumn || undefined,
								'--grid-row': gridRow || undefined,
							},
						} )
					) }
				/>
			);
		},
	},
];
