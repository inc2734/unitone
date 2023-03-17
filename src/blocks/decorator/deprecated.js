import classnames from 'classnames';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';

import { cleanEmptyObject } from '../../js/editor/hooks/utils';

export default [
	{
		attributes: {
			...metadata.attributes,
		},

		supports: {
			...metadata.supports,
		},

		save( { attributes } ) {
			const { tagName, shadow, rel, href, linkTarget } = attributes;

			const isHrefSet = !! href;

			const TagName = tagName || 'div';

			const blockProps = useBlockProps.save( {
				'data-unitone-layout': classnames( 'decorator', {
					'-shadow': shadow,
					[ `-overflow:${ attributes?.unitone?.overflow }` ]:
						null != attributes?.unitone?.overflow,
					[ `-padding:${ attributes?.unitone?.padding }` ]:
						null != attributes?.unitone?.padding,
					[ `-position:${ attributes?.unitone?.position?.position }` ]:
						null != attributes?.unitone?.position?.position,
				} ),
				style: {
					'--unitone--top': attributes?.unitone?.position?.top,
					'--unitone--right': attributes?.unitone?.position?.right,
					'--unitone--bottom': attributes?.unitone?.position?.bottom,
					'--unitone--left': attributes?.unitone?.position?.left,
					'--unitone--z-index': attributes?.unitone?.position?.zIndex,
				},
			} );

			return (
				<>
					{ isHrefSet ? (
						<TagName { ...blockProps }>
							<div data-unitone-layout="decorator__inner">
								<div { ...useInnerBlocksProps.save() } />
								<a
									data-unitone-layout="decorator__link"
									href={ href }
									target={ linkTarget }
									rel={ rel }
								>
									{ __( 'Learn more', 'unitone' ) }
								</a>
							</div>
						</TagName>
					) : (
						<TagName
							{ ...useInnerBlocksProps.save( { ...blockProps } ) }
						/>
					) }
				</>
			);
		},
	},
	{
		attributes: {
			...metadata.attributes,
			position: {
				type: 'string',
			},
			top: {
				type: 'string',
			},
			right: {
				type: 'string',
			},
			bottom: {
				type: 'string',
			},
			left: {
				type: 'string',
			},
			zIndex: {
				type: 'string',
			},
		},

		migrate( attributes ) {
			const { position, top, right, bottom, left, zIndex, unitone } =
				attributes;

			const newAttributes = {
				...attributes,
				unitone: {
					...unitone,
					position: cleanEmptyObject( {
						position,
						top,
						right,
						bottom,
						left,
						zIndex,
					} ),
				},
			};

			return {
				...newAttributes,
			};
		},

		supports: {
			...metadata.supports,
		},

		save( { attributes } ) {
			const {
				tagName,
				shadow,
				position,
				top,
				right,
				bottom,
				left,
				zIndex,
				rel,
				href,
				linkTarget,
			} = attributes;

			const isHrefSet = !! href;

			const TagName = tagName || 'div';

			const blockProps = useBlockProps.save( {
				style: {
					'--unitone--top': top || undefined,
					'--unitone--right': right || undefined,
					'--unitone--bottom': bottom || undefined,
					'--unitone--left': left || undefined,
					'--unitone--z-index': zIndex || undefined,
				},
				'data-unitone-layout': classnames( 'decorator', {
					[ `-position:${ position }` ]: position,
					'-shadow': shadow,
				} ),
			} );

			return (
				<>
					{ isHrefSet ? (
						<TagName { ...blockProps }>
							<div data-unitone-layout="decorator__inner">
								<div { ...useInnerBlocksProps.save() } />
								<a
									data-unitone-layout="decorator__link"
									href={ href }
									target={ linkTarget }
									rel={ rel }
								>
									{ __( 'Learn more', 'unitone' ) }
								</a>
							</div>
						</TagName>
					) : (
						<TagName
							{ ...useInnerBlocksProps.save( {
								...blockProps,
							} ) }
						/>
					) }
				</>
			);
		},
	},
	{
		attributes: {
			...metadata.attributes,
			position: {
				type: 'string',
			},
			top: {
				type: 'string',
			},
			right: {
				type: 'string',
			},
			bottom: {
				type: 'string',
			},
			left: {
				type: 'string',
			},
			zIndex: {
				type: 'string',
			},
		},

		supports: {
			...metadata.supports,
		},

		save( { attributes } ) {
			const {
				tagName,
				shadow,
				position,
				top,
				right,
				bottom,
				left,
				zIndex,
			} = attributes;

			const TagName = tagName || 'div';

			return (
				<TagName
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							style: {
								'--top': top || undefined,
								'--right': right || undefined,
								'--bottom': bottom || undefined,
								'--left': left || undefined,
								'--z-index': zIndex || undefined,
							},
							'data-layout': classnames( 'decorator', {
								[ `-position:${ position }` ]: position,
								'-shadow': shadow,
							} ),
						} )
					) }
				/>
			);
		},
	},
];
