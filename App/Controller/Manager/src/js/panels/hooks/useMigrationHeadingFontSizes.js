import { useEffect } from '@wordpress/element';

import {
	getFontSizeByUnitoneScale,
	getFontSizePresetValue,
} from '../../../../../../../src/js/utils/font-size';

const HEADING_FONT_SIZE_SETTINGS = [
	{
		heading: 'h1',
		settingKey: 'h1-size',
	},
	{
		heading: 'h2',
		settingKey: 'h2-size',
	},
	{
		heading: 'h3',
		settingKey: 'h3-size',
	},
	{
		heading: 'h4',
		settingKey: 'h4-size',
	},
	{
		heading: 'h5',
		settingKey: 'h5-size',
	},
	{
		heading: 'h6',
		settingKey: 'h6-size',
	},
];

const setHeadingElementFontSize = ( elements = {}, heading, fontSize ) => ( {
	...elements,
	[ heading ]: {
		...elements?.[ heading ],
		typography: {
			...elements?.[ heading ]?.typography,
			fontSize,
		},
	},
} );

export function useMigrationHeadingFontSizes( settings, setSettings ) {
	const h1Size = settings?.[ 'h1-size' ];
	const h2Size = settings?.[ 'h2-size' ];
	const h3Size = settings?.[ 'h3-size' ];
	const h4Size = settings?.[ 'h4-size' ];
	const h5Size = settings?.[ 'h5-size' ];
	const h6Size = settings?.[ 'h6-size' ];

	useEffect( () => {
		const hasDeprecatedHeadingFontSize = [
			h1Size,
			h2Size,
			h3Size,
			h4Size,
			h5Size,
			h6Size,
		].some( ( fontSize ) => null != fontSize && '' !== fontSize );

		if ( ! hasDeprecatedHeadingFontSize ) {
			return;
		}

		setSettings( ( currentSettings ) => {
			let elements = currentSettings?.styles?.elements ?? {};
			const nextSettings = {
				...currentSettings,
			};

			HEADING_FONT_SIZE_SETTINGS.forEach( ( { heading, settingKey } ) => {
				const deprecatedFontSize = currentSettings?.[ settingKey ];

				nextSettings[ settingKey ] = null;

				if ( null == deprecatedFontSize || '' === deprecatedFontSize ) {
					return;
				}

				const fontSize = getFontSizeByUnitoneScale(
					currentSettings?.fontSizes,
					deprecatedFontSize
				);

				if ( ! fontSize?.slug ) {
					return;
				}

				elements = setHeadingElementFontSize(
					elements,
					heading,
					getFontSizePresetValue( fontSize )
				);
			} );

			return {
				...nextSettings,
				styles: {
					...currentSettings?.styles,
					elements,
				},
			};
		} );
	}, [ h1Size, h2Size, h3Size, h4Size, h5Size, h6Size, setSettings ] );
}
