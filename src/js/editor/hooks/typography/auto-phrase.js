import clsx from 'clsx';

import { hasBlockSupport } from '@wordpress/blocks';
import { ToggleControl } from '@wordpress/components';
import { sprintf, __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

export function hasAutoPhraseValue( { unitone } ) {
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

export function resetAutoPhrase( { unitone, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetAutoPhraseFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsAutoPhraseDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.autoPhrase' );
}

export function AutoPhraseEdit( { label, unitone, setAttributes } ) {
	return (
		<ToggleControl
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

export function saveAutoPhraseProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.autoPhrase' ) ) {
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.autoPhrase ) {
		return extraProps;
	}

	extraProps[ 'data-unitone-layout' ] = clsx(
		extraProps[ 'data-unitone-layout' ],
		'-auto-phrase'
	);

	return extraProps;
}

export function useAutoPhraseBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...saveAutoPhraseProp( wrapperProps, name, attributes ),
		},
	};
}
