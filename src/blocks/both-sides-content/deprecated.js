import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

// When adding supports.unitone.flexBasis.
const attributesV1 = {
	contentWidth: {
		type: 'string',
		default: '',
	},
	contentMaxWidth: {
		type: 'string',
		default: '',
	},
};

// When adding supports.unitone.flexBasis.
const supportsV1 = {
	inserter: false,
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
					flexBasis: attributes.contentWidth || undefined,
				},
			};
		},

		save( { attributes } ) {
			const { contentWidth, contentMaxWidth } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-unitone-layout': 'both-sides__content',
							style: {
								'--unitone--content-width':
									contentWidth || undefined,
								'--unitone--content-max-width':
									contentMaxWidth || undefined,
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
			const { contentWidth, contentMaxWidth } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-layout': 'both-sides__content',
							style: {
								'--content-width': contentWidth || undefined,
								'--content-max-width':
									contentMaxWidth || undefined,
							},
						} )
					) }
				/>
			);
		},
	},
];
