import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import metadata from './block.json';

export default [
	{
		attributes: {
			...metadata.attributes,
			clientId: {
				type: 'string',
				default: '',
			},
		},

		supports: {
			...metadata.supports,
		},

		save( { attributes } ) {
			const { clientId } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							className: 'unitone-responsive-switcher',
							'data-unitone-client-id': clientId || undefined,
						} )
					) }
				/>
			);
		},
	},
	{
		attributes: {
			...metadata.attributes,
			clientId: {
				type: 'string',
				default: '',
			},
		},

		supports: {
			...metadata.supports,
		},

		save( { attributes } ) {
			const { breakpoint, clientId } = attributes;

			return (
				<>
					<div
						{ ...useInnerBlocksProps.save(
							useBlockProps.save( {
								className: 'unitone-responsive-switcher',
								'data-unitone-client-id': clientId || undefined,
							} )
						) }
					/>
					<style>{ `@media (min-width: ${ breakpoint }) { [data-unitone-client-id="${ clientId }"] > .unitone-responsive-switcher-container--desktop { display: block; } [data-unitone-client-id="${ clientId }"] > .unitone-responsive-switcher-container--mobile { display: none; } }` }</style>
				</>
			);
		},
	},
];
