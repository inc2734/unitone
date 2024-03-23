import classnames from 'classnames';

import { hasBlockSupport } from '@wordpress/blocks';
import { ToggleControl } from '@wordpress/components';
import { sprintf, __ } from '@wordpress/i18n';

export function hasAutoPhraseValue( props ) {
	return props.attributes?.unitone?.autoPhrase !== undefined;
}

export function resetAutoPhrase( { attributes = {}, setAttributes } ) {
	delete attributes?.unitone?.autoPhrase;
	const newUnitone = { ...attributes?.unitone };

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsAutoPhraseDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'unitone.autoPhrase' );
}

export function AutoPhraseEdit( props ) {
	const {
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

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
				if ( null == newUnitone.autoPhrase ) {
					delete newUnitone.autoPhrase;
				}

				setAttributes( {
					unitone: !! Object.keys( newUnitone ).length
						? newUnitone
						: undefined,
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

	extraProps[ 'data-unitone-layout' ] = classnames(
		extraProps[ 'data-unitone-layout' ],
		'-auto-phrase'
	);

	return extraProps;
}

export function editAutoPhraseProp( settings ) {
	if ( ! hasBlockSupport( settings, 'unitone.autoPhrase' ) ) {
		return settings;
	}

	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveAutoPhraseProp( props, settings, attributes );
	};

	return settings;
}
