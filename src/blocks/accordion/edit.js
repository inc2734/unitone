import {
	InnerBlocks,
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

export default function ( { attributes, setAttributes, clientId } ) {
	const { summary } = attributes;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( 'core/block-editor' ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		className: 'unitone-accordion',
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'unitone-accordion__content',
		},
		{
			templateLock: false,
			renderAppender: hasInnerBlocks
				? InnerBlocks.DefaultBlockAppender
				: InnerBlocks.ButtonBlockAppender,
		}
	);

	return (
		<details { ...blockProps }>
			<summary className="unitone-accordion__summary">
				<RichText
					value={ summary }
					onChange={ ( newAttribute ) => {
						setAttributes( { summary: newAttribute } );
					} }
					placeholder={ __( 'Enter summary here', 'unitone' ) }
				/>
				<div className="unitone-accordion__icon">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24.71 13.06"
					>
						<polyline
							points="24.35 .35 12.35 12.35 .35 .35"
							fill="none"
							stroke="currentColor"
							strokeWidth="2px"
							strokeLinecap="round"
						/>
					</svg>
				</div>
			</summary>

			<div { ...innerBlocksProps } />
		</details>
	);
}
