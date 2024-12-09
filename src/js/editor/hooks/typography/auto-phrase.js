import clsx from 'clsx';

import { hasBlockSupport } from '@wordpress/blocks';
import { ToggleControl } from '@wordpress/components';
import { useMemo } from '@wordpress/element';
import { sprintf, __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

export function hasAutoPhraseValue( { attributes: unitone } ) {
	return unitone?.autoPhrase !== undefined;
}

export function resetAutoPhraseFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			autoPhrase: undefined,
		},
	};
}

export function resetAutoPhrase( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetAutoPhraseFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsAutoPhraseDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.autoPhrase' );
}

export function AutoPhraseEdit( {
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	return (
		<ToggleControl
			__nextHasNoMarginBottom
			label={ label }
			help={
				<span
					dangerouslySetInnerHTML={ {
						__html: sprintf(
							// translators: %1$s: <code>wbr</code>
							__(
								'Use %1$s to indicate a line break at an arbitrary position.',
								'unitone'
							),
							'<code>wbr</code>'
						),
					} }
				/>
			}
			checked={ !! unitone?.autoPhrase }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					autoPhrase: newValue || undefined,
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

function useBlockProps( extraProps, blockType, attributes ) {
	const unitoneLayout = useMemo( () => {
		if ( ! hasBlockSupport( blockType, 'unitone.autoPhrase' ) ) {
			return extraProps?.[ 'data-unitone-layout' ];
		}

		if ( null == attributes?.unitone?.autoPhrase ) {
			return extraProps?.[ 'data-unitone-layout' ];
		}

		return clsx( extraProps?.[ 'data-unitone-layout' ], '-auto-phrase' );
	}, [
		blockType,
		extraProps?.[ 'data-unitone-layout' ],
		attributes?.unitone?.autoPhrase,
	] );

	return {
		...extraProps,
		'data-unitone-layout': unitoneLayout,
	};
}

export function useAutoPhraseBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	const newAutoPhraseProp = useBlockProps( wrapperProps, name, {
		unitone: {
			autoPhrase: attributes?.unitone?.autoPhrase,
		},
	} );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...newAutoPhraseProp,
		},
	};
}
