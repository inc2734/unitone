import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import metadata from './block.json';

export default function ( { attributes } ) {
	const { tagName, containerAlign } = attributes;

	const newContainerAlign =
		containerAlign ?? metadata.attributes.containerAlign.default;

	const TagName = tagName;

	return (
		<TagName
			{ ...useBlockProps.save( {
				className: 'unitone-section',
			} ) }
		>
			<div data-unitone-layout="gutters">
				<div
					data-unitone-layout={ clsx(
						'container',
						'none' !== newContainerAlign &&
							`-align:${ newContainerAlign }`
					) }
				>
					<div
						{ ...useInnerBlocksProps.save( {
							'data-unitone-layout': 'stack',
						} ) }
					/>
				</div>
			</div>
		</TagName>
	);
}
