import { renderToStaticMarkup } from 'react-dom/server';

import {
	getPresetSlug,
	getPresetCssVar,
	getPresetCssVarFromSlug,
} from '../src/js/utils/preset';
import {
	getFontSizePresetSlugFromValue,
	getFontSizeCssVarSlug,
} from '../src/js/utils/font-size';
import { getTextureStyle } from '../src/blocks/texture/utils';
import { Arrows, Pagination } from '../src/blocks/slider/components';
import { getBorderCSSVars } from '../src/js/editor/wp-blocks/border-css-vars';
import slugs from './fixtures/preset-slugs.json';

jest.mock( '../src/js/editor/hooks/utils', () => ( {
	isObject: ( value ) => null !== value && typeof value === 'object',
} ) );

describe( 'preset references', () => {
	it.each( slugs )(
		'matches the PHP identifier for %s',
		( slug, expected ) => {
			expect( getPresetSlug( slug ) ).toBe( expected );
			for ( const type of [
				'color',
				'gradient',
				'shadow',
				'font-family',
				'font-size',
				'spacing',
			] ) {
				const reference = `var(--wp--preset--${ type }--${ expected })`;
				expect( getPresetCssVarFromSlug( type, slug ) ).toBe(
					reference
				);
				expect(
					getPresetCssVar( `var:preset|${ type }|${ slug }` )
				).toBe( reference );
			}
		}
	);

	it.each( [ false, 0, '', '#fd780f', 'var(--custom)', 'calc(1rem + 2px)' ] )(
		'preserves non-preset values: %s',
		( value ) => expect( getPresetCssVar( value ) ).toBe( value )
	);

	it( 'keeps original font slugs available for palette lookup', () => {
		expect(
			getFontSizePresetSlugFromValue( 'var:preset|font-size|BrandLarge' )
		).toBe( 'BrandLarge' );
		expect( getFontSizeCssVarSlug( 'BrandLarge' ) ).toBe( 'brand-large' );
		expect(
			getFontSizePresetSlugFromValue(
				'var(--wp--preset--font-size--brand-large)'
			)
		).toBe( 'brand-large' );
	} );

	it( 'normalizes responsive border colors without changing custom values', () => {
		expect(
			getBorderCSSVars(
				{
					border: {
						top: { color: 'var:preset|color|custom-' },
						bottom: { color: '#fff' },
					},
				},
				'post-term',
				'sm'
			)
		).toEqual( {
			'--unitone--sm-post-term--border-top-color':
				'var(--wp--preset--color--custom)',
			'--unitone--sm-post-term--border-bottom-color': '#fff',
		} );
	} );

	it( 'preserves texture serialization while fixing its editor preview', () => {
		const attributes = { type: 'dots', color: 'custom-' };
		expect(
			getTextureStyle( attributes )[ '--unitone--texture-color' ]
		).toBe( 'var(--wp--preset--color--custom-)' );
		expect(
			getTextureStyle( { ...attributes, normalizePresets: true } )[
				'--unitone--texture-color'
			]
		).toBe( 'var(--wp--preset--color--custom)' );
	} );

	it.each( [ Arrows, Pagination ] )(
		'preserves current and deprecated slider serialization',
		( Component ) => {
			const attributes = { icon: 'bullets', iconColor: 'custom-' };
			expect(
				renderToStaticMarkup( <Component { ...attributes } /> )
			).toContain( 'var(--wp--preset--color--custom-)' );
			expect(
				renderToStaticMarkup(
					<Component { ...attributes } normalizePresets />
				)
			).toContain( 'var(--wp--preset--color--custom)' );
		}
	);
} );
