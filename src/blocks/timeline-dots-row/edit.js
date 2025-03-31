import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	withColors,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

import { __ } from '@wordpress/i18n';

function Edit( { attributes, clientId, context, dotColor, setDotColor } ) {
	const { allowedBlocks, templateLock } = attributes;

	const blockProps = useBlockProps( {
		className: 'unitone-timeline-dots-row',
		style: {
			'--unitone--dot-color': dotColor?.slug
				? `var(--wp--preset--color--${ dotColor?.slug } )`
				: dotColor?.color,
		},
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'unitone-timeline-dots-row__columns',
		},
		{
			templateLock,
			allowedBlocks,
			renderAppender: false,
			template: [
				[
					'unitone/timeline-dots-column',
					{
						type: 'aside',
						nonentity:
							'dot-main' === context[ 'unitone/column-layout' ],
					},
				],
				[ 'unitone/timeline-dots-column', { type: 'main' } ],
			],
		}
	);

	return (
		<>
			<InspectorControls group="color">
				<ColorGradientSettingsDropdown
					__experimentalIsRenderedInSidebar
					settings={ [
						{
							label: __( 'Dot color', 'unitone' ),
							colorValue: dotColor.color,
							onColorChange: setDotColor,
							clearable: true,
						},
					] }
					panelId={ clientId }
					{ ...useMultipleOriginColorsAndGradients() }
					gradients={ [] }
					disableCustomGradients
				/>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="unitone-timeline-dots-row__dot" />
				<div { ...innerBlocksProps } />
			</div>
		</>
	);
}

export default withColors( {
	dotColor: 'background-color',
} )( Edit );
