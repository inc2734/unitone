import { getBlockSupport } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';

// CSS consumers determine the direction; splitting only controls the editing UI.
// uiDirection (all, vertical, horizontal) never changes stored values or CSS output.
export function getSpacingUIDirection( name, supports, spacing ) {
	return (
		supports?.[ spacing ]?.uiDirection ??
		getBlockSupport( name, `unitone.${ spacing }.uiDirection`, 'all' ) ??
		'all'
	);
}

export function withSpacingUIDirection( name, getDirections ) {
	return createHigherOrderComponent( ( BlockListBlock ) => {
		return ( props ) => {
			if ( ! props.isSelected || name !== props.name ) {
				return <BlockListBlock { ...props } />;
			}

			const supports = {
				...props.attributes?.__unstableUnitoneSupports,
			};
			for ( const [ spacing, uiDirection ] of Object.entries(
				getDirections( props )
			) ) {
				supports[ spacing ] = { ...supports[ spacing ], uiDirection };
			}

			return (
				<BlockListBlock
					{ ...props }
					attributes={ {
						...props.attributes,
						__unstableUnitoneSupports: supports,
					} }
				/>
			);
		};
	}, 'withSpacingUIDirection' );
}
