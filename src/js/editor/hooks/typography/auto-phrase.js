import clsx from 'clsx';

import { hasBlockSupport } from '@wordpress/blocks';
import { ToggleControl } from '@wordpress/components';
import { sprintf, __ } from '@wordpress/i18n';

import { HelpContainer } from '../components';
import { cleanEmptyObject } from '../utils';

export function hasAutoPhraseValue( { attributes: { unitone } } ) {
	return unitone?.autoPhrase !== undefined;
}

export function resetAutoPhraseFilter() {
	return {
		autoPhrase: undefined,
	};
}

export function resetAutoPhrase( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetAutoPhraseFilter() )
		),
	} );
}

export function isAutoPhraseSupportDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.autoPhrase' );
}

export function AutoPhraseEdit( {
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	return (
		<HelpContainer
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
			layout="horizontal"
		>
			<ToggleControl
				__nextHasNoMarginBottom
				label={ label }
				checked={ unitone?.autoPhrase ?? false }
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
		</HelpContainer>
	);
}

export function withAutoPhraseBlockProps( settings ) {
	const { attributes, name } = settings;

	if ( isAutoPhraseSupportDisabled( { name } ) ) {
		return settings;
	}

	const newAutoPhrase = attributes?.unitone?.autoPhrase;

	if ( null == newAutoPhrase ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				'-auto-phrase'
			),
		},
	};
}
